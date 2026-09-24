import sys
import subprocess
import tempfile
import os
import shutil
import json
import time
import math
from typing import List, Dict, Any, Optional, Tuple
from fastapi import APIRouter, status
from pydantic import BaseModel

router = APIRouter(prefix="/code", tags=["Code Execution Sandbox"])


def compare_outputs(actual_raw: Any, expected_raw: Any) -> bool:
    """
    High-precision judge comparison for test case evaluations:
    - Normalizes line endings (\\r\\n -> \\n)
    - Strips leading/trailing whitespace
    - Compares exact string matches
    - Compares line-by-line with per-line trailing whitespace removed
    - Compares token-by-token across whitespace boundaries
    - Performs numeric float tolerance comparison (math.isclose / 1e-5)
    - Supports JSON structured data comparison (lists, dicts, primitives)
    - Supports boolean case-insensitivity ('true' vs 'True')
    - PREVENTS false positive token merges (e.g. '1 2 3' will NEVER match '123')
    """
    if actual_raw is None or expected_raw is None:
        return False

    actual = str(actual_raw).replace("\r\n", "\n").strip()
    expected = str(expected_raw).replace("\r\n", "\n").strip()

    # 1. Exact string match
    if actual == expected:
        return True

    # 2. Case-insensitive match for booleans or status words
    if actual.lower() == expected.lower() and actual.lower() in ("true", "false", "yes", "no", "even", "odd"):
        return True

    # 3. Numeric comparison (single number or float)
    try:
        a_f = float(actual)
        e_f = float(expected)
        a_lz = len(actual) > 1 and actual.startswith("0") and actual[1].isdigit()
        e_lz = len(expected) > 1 and expected.startswith("0") and expected[1].isdigit()
        if a_lz != e_lz:
            pass
        elif math.isclose(a_f, e_f, rel_tol=1e-5, abs_tol=1e-5):
            return True
    except (ValueError, TypeError):
        pass

    # 4. JSON / structure comparison
    try:
        a_json = json.loads(actual)
        e_json = json.loads(expected)
        if a_json == e_json:
            return True
    except Exception:
        pass

    # 5. Line-by-line comparison
    a_lines = [l.rstrip() for l in actual.split("\n")]
    e_lines = [l.rstrip() for l in expected.split("\n")]
    while a_lines and not a_lines[-1]:
        a_lines.pop()
    while e_lines and not e_lines[-1]:
        e_lines.pop()

    if a_lines == e_lines:
        return True

    # 6. Token-by-token comparison (preserves token boundaries)
    if len(a_lines) == len(e_lines):
        all_lines_match = True
        for a_line, e_line in zip(a_lines, e_lines):
            a_toks = a_line.split()
            e_toks = e_line.split()
            if len(a_toks) != len(e_toks):
                all_lines_match = False
                break
            for a_tok, e_tok in zip(a_toks, e_toks):
                if a_tok == e_tok:
                    continue
                if a_tok.lower() == e_tok.lower() and a_tok.lower() in ("true", "false"):
                    continue
                try:
                    a_tf = float(a_tok)
                    e_tf = float(e_tok)
                    a_tlz = len(a_tok) > 1 and a_tok.startswith("0") and a_tok[1].isdigit()
                    e_tlz = len(e_tok) > 1 and e_tok.startswith("0") and e_tok[1].isdigit()
                    if a_tlz == e_tlz and math.isclose(a_tf, e_tf, rel_tol=1e-5, abs_tol=1e-5):
                        continue
                except (ValueError, TypeError):
                    pass
                all_lines_match = False
                break
        if all_lines_match:
            return True

    # 7. Token sequence comparison across all whitespace boundaries
    a_tokens = actual.split()
    e_tokens = expected.split()
    if a_tokens and len(a_tokens) == len(e_tokens):
        all_tokens_match = True
        for a_tok, e_tok in zip(a_tokens, e_tokens):
            if a_tok == e_tok:
                continue
            if a_tok.lower() == e_tok.lower() and a_tok.lower() in ("true", "false", "yes", "no"):
                continue
            try:
                a_tf = float(a_tok)
                e_tf = float(e_tok)
                a_tlz = len(a_tok) > 1 and a_tok.startswith("0") and a_tok[1].isdigit()
                e_tlz = len(e_tok) > 1 and e_tok.startswith("0") and e_tok[1].isdigit()
                if a_tlz == e_tlz and math.isclose(a_tf, e_tf, rel_tol=1e-5, abs_tol=1e-5):
                    continue
            except (ValueError, TypeError):
                pass
            all_tokens_match = False
            break
        if all_tokens_match:
            return True

    return False


def _run_process_safe(
    cmd: List[str],
    input_str: str = "",
    timeout: float = 3.0,
    cwd: Optional[str] = None,
    preexec_fn: Any = None,
) -> Tuple[int, str, str, bool]:
    """
    Executes a subprocess safely with strict timeout enforcement and
    process tree termination to prevent hangs or orphaned processes.
    Returns: (returncode, stdout, stderr, timed_out)
    """
    try:
        proc = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            cwd=cwd,
            preexec_fn=preexec_fn if sys.platform != "win32" else None,
        )
    except OSError as err:
        if sys.platform == "win32":
            time.sleep(0.25)
            try:
                proc = subprocess.Popen(
                    cmd,
                    stdin=subprocess.PIPE,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    cwd=cwd,
                )
            except Exception as retry_err:
                return -1, "", str(retry_err), False
        else:
            return -1, "", str(err), False
    try:
        stdout, stderr = proc.communicate(input=input_str, timeout=timeout)
        return proc.returncode, stdout, stderr, False
    except subprocess.TimeoutExpired:
        if sys.platform == "win32":
            subprocess.run(["taskkill", "/F", "/T", "/PID", str(proc.pid)], capture_output=True)
        else:
            proc.kill()
        try:
            stdout, stderr = proc.communicate(timeout=0.5)
        except Exception:
            stdout, stderr = "", ""
        return -1, stdout, stderr, True


def _find_cpp_compiler() -> Optional[str]:
    """Resolves g++ or clang++ on the host machine and ensures its bin dir is in PATH."""
    comp = shutil.which("g++") or shutil.which("clang++")
    if comp:
        bin_dir = os.path.dirname(os.path.abspath(comp))
        if bin_dir not in os.environ.get("PATH", ""):
            os.environ["PATH"] = bin_dir + os.pathsep + os.environ.get("PATH", "")
        return comp

    user_appdata = os.environ.get("LOCALAPPDATA", "")
    known_paths = [
        os.path.join(
            user_appdata,
            r"Microsoft\WinGet\Packages\MartinStorsjo.LLVM-MinGW.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe\llvm-mingw-20260616-ucrt-x86_64\bin\g++.exe",
        ),
        os.path.join(
            user_appdata,
            r"Microsoft\WinGet\Packages\MartinStorsjo.LLVM-MinGW.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe\llvm-mingw-20260616-ucrt-x86_64\bin\clang++.exe",
        ),
        r"C:\MinGW\bin\g++.exe",
        r"C:\msys64\ucrt64\bin\g++.exe",
        r"C:\msys64\mingw64\bin\g++.exe",
    ]
    for p in known_paths:
        if os.path.exists(p):
            bin_dir = os.path.dirname(os.path.abspath(p))
            if bin_dir not in os.environ.get("PATH", ""):
                os.environ["PATH"] = bin_dir + os.pathsep + os.environ.get("PATH", "")
            return p
    return None


def _find_javac() -> Optional[str]:
    comp = shutil.which("javac")
    if comp:
        return comp
    known = [
        r"C:\Program Files\Common Files\Oracle\Java\javapath\javac.exe",
    ]
    for p in known:
        if os.path.exists(p):
            return p
    return None


def _find_java() -> Optional[str]:
    comp = shutil.which("java")
    if comp:
        return comp
    known = [
        r"C:\Program Files\Common Files\Oracle\Java\javapath\java.exe",
    ]
    for p in known:
        if os.path.exists(p):
            return p
    return None


class TestCaseItem(BaseModel):
    id: Optional[int] = None
    input: str
    expectedOutput: str
    isHidden: Optional[bool] = False


class CodeRunRequest(BaseModel):
    code: str
    language: str  # python, javascript, java, cpp
    test_cases: List[TestCaseItem]
    entry_point: Optional[str] = "solve"


class TestCaseResult(BaseModel):
    id: int
    input: str
    expected_output: str
    actual_output: str
    passed: bool = False
    execution_time_ms: int = 0
    stdout: Optional[str] = ""
    error: Optional[str] = None


@router.post("/run", summary="Execute code against test cases in sandbox")
def run_code_sandbox(req: CodeRunRequest):
    code = req.code.strip()
    lang = req.language.lower().strip()
    test_cases = req.test_cases

    if not code:
        return {
            "status": "COMPILATION_ERROR",
            "passed_count": 0,
            "total_count": len(test_cases),
            "execution_time_ms": 0,
            "error": "Code body is empty.",
            "test_results": [],
            "logs": "[Error] No source code submitted for execution.",
        }

    start_time = time.time()
    results = []
    passed_count = 0
    overall_status = "ACCEPTED"
    error_message = None

    # -------------------------------------------------------------
    # 1. Python Execution Strategy
    # -------------------------------------------------------------
    if lang in ("python", "py"):
        import ast
        try:
            ast.parse(code)
        except SyntaxError as syn_err:
            err_line = f"SyntaxError: {syn_err.msg} (line {syn_err.lineno})"
            diag = f"File \"solution.py\", line {syn_err.lineno}\n    {syn_err.text.strip() if syn_err.text else ''}\nSyntaxError: {syn_err.msg}"
            for idx, tc in enumerate(test_cases):
                results.append({
                    "id": idx + 1,
                    "input": tc.input.strip(),
                    "expected_output": tc.expectedOutput.strip(),
                    "actual_output": err_line,
                    "passed": False,
                    "execution_time_ms": 10,
                    "status": "COMPILATION_ERROR",
                })
            return {
                "status": "COMPILATION_ERROR",
                "passed_count": 0,
                "total_count": len(test_cases),
                "execution_time_ms": 10,
                "test_results": results,
                "error": diag,
            }

        def _set_limits():
            try:
                import resource
                resource.setrlimit(resource.RLIMIT_AS, (256 * 1024 * 1024, 256 * 1024 * 1024))
                resource.setrlimit(resource.RLIMIT_CPU, (5, 5))
            except Exception:
                pass

        for idx, tc in enumerate(test_cases):
            tc_input = tc.input.strip()
            expected = tc.expectedOutput.strip()

            indented_code = chr(10).join('    ' + line for line in code.splitlines())
            runner_script = f"""import sys, json, math, ast, io

_stdout_buffer = io.StringIO()
_orig_stdout = sys.stdout
sys.stdout = _stdout_buffer
__name__ = '__main__'

try:
{indented_code}
except Exception as _e:
    sys.stdout = _orig_stdout
    print(json.dumps({{"error": str(_e)}}))
    sys.exit(0)

def __run_test():
    raw_input = {repr(tc_input)}
    try:
        printed_already = _stdout_buffer.getvalue().strip()

        target_fn = None
        if 'Solution' in globals() and hasattr(Solution, '{req.entry_point}'):
            sol = Solution()
            target_fn = getattr(sol, '{req.entry_point}')
        elif '{req.entry_point}' in globals():
            target_fn = globals()['{req.entry_point}']
        elif 'solve' in globals():
            target_fn = globals()['solve']
        elif 'Solution' in globals():
            sol = Solution()
            methods = [m for m in dir(sol) if not m.startswith('_')]
            if methods:
                target_fn = getattr(sol, methods[0])
        elif 'main' in globals():
            target_fn = globals()['main']

        if target_fn is not None:
            # Clear pre-execution stdout buffer to avoid debug log pollution
            _stdout_buffer.seek(0)
            _stdout_buffer.truncate(0)
            import inspect
            sig = inspect.signature(target_fn)
            num_params = len(sig.parameters)
            if num_params == 0:
                res = target_fn()
            else:
                args = []
                if raw_input:
                    lines = [l.strip() for l in raw_input.splitlines() if l.strip()]

                    def _parse_token(tok):
                        try:
                            return ast.literal_eval(tok)
                        except Exception:
                            return tok

                    def _parse_line(line):
                        try:
                            return ast.literal_eval(line)
                        except Exception:
                            pass
                        parts = line.split()
                        if len(parts) > 1:
                            return [_parse_token(p) for p in parts]
                        return _parse_token(parts[0]) if parts else line

                    if len(lines) == 1:
                        val = _parse_line(lines[0])
                        if isinstance(val, list) and num_params > 1:
                            args = val
                        else:
                            args = [val]
                    else:
                        args = [_parse_line(l) for l in lines]

                if len(args) > num_params and num_params == 1:
                    res = target_fn(args)
                elif len(args) < num_params:
                    res = target_fn(*args, *([None] * (num_params - len(args))))
                else:
                    res = target_fn(*args[:num_params])

            sys.stdout = _orig_stdout
            printed = _stdout_buffer.getvalue().strip()
            if res is not None:
                out_str = str(res).lower() if isinstance(res, bool) else json.dumps(res) if isinstance(res, (list, dict, tuple)) else str(res)
                print(json.dumps({{"actual": out_str}}))
            elif printed:
                print(json.dumps({{"actual": printed}}))
            else:
                print(json.dumps({{"actual": ""}}))
        elif printed_already:
            sys.stdout = _orig_stdout
            print(json.dumps({{"actual": printed_already}}))
        else:
            sys.stdout = _orig_stdout
            print(json.dumps({{"error": "Function 'solve' or 'Solution' class or output print not found"}}))
    except Exception as e:
        sys.stdout = _orig_stdout
        print(json.dumps({{"error": str(e)}}))

__run_test()
"""
            tmp_py = tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8')
            try:
                tmp_py.write(runner_script)
                tmp_py.close()
                tc_t0 = time.time()
                rc, stdout, stderr, timed_out = _run_process_safe(
                    [sys.executable, "-I", tmp_py.name],
                    input_str=tc_input,
                    timeout=3.0,
                    preexec_fn=_set_limits if sys.platform != "win32" else None,
                )
                tc_time_ms = max(1, int((time.time() - tc_t0) * 1000))
            finally:
                if os.path.exists(tmp_py.name):
                    try:
                        os.remove(tmp_py.name)
                    except Exception:
                        pass

            if timed_out:
                actual_out = "Time Limit Exceeded ( > 3.0s )"
                is_passed = False
                status_str = "TIME_LIMIT_EXCEEDED"
            elif rc != 0 or stderr:
                actual_out = stderr.splitlines()[-1] if stderr else f"Runtime Error (code {rc})"
                is_passed = False
                status_str = "COMPILATION_ERROR" if "SyntaxError" in (stderr or "") or "IndentationError" in (stderr or "") else "RUNTIME_ERROR"
                error_message = stderr
            else:
                try:
                    parsed = json.loads(stdout.strip())
                    if "error" in parsed:
                        actual_out = parsed["error"]
                        is_passed = False
                        status_str = "COMPILATION_ERROR" if "SyntaxError" in actual_out or "IndentationError" in actual_out else "RUNTIME_ERROR"
                        error_message = parsed["error"]
                    else:
                        actual_out = str(parsed.get("actual", ""))
                        is_passed = compare_outputs(actual_out, expected)
                        status_str = "ACCEPTED" if is_passed else "WRONG_ANSWER"
                except Exception:
                    actual_out = stdout.strip() or "No output"
                    is_passed = compare_outputs(actual_out, expected)
                    status_str = "ACCEPTED" if is_passed else "WRONG_ANSWER"

            if is_passed:
                passed_count += 1
            elif overall_status == "ACCEPTED":
                overall_status = status_str

            results.append({
                "id": idx + 1,
                "input": tc_input,
                "expected_output": expected,
                "actual_output": actual_out,
                "passed": is_passed,
                "execution_time_ms": tc_time_ms,
                "status": status_str,
            })

    # -------------------------------------------------------------
    # 2. JavaScript Execution via Node.js
    # -------------------------------------------------------------
    elif lang in ("javascript", "js"):
        # Pre-check JavaScript syntax using node -c
        tmp_check = tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False, encoding='utf-8')
        try:
            tmp_check.write(code)
            tmp_check.close()
            chk_rc, chk_out, chk_err, _ = _run_process_safe(["node", "-c", tmp_check.name], timeout=3.0)
            if chk_rc != 0:
                diag = chk_err.strip() or chk_out.strip() or "SyntaxError in JavaScript source"
                for idx, tc in enumerate(test_cases):
                    results.append({
                        "id": idx + 1,
                        "input": tc.input.strip(),
                        "expected_output": tc.expectedOutput.strip(),
                        "actual_output": diag.splitlines()[-1] if diag else "SyntaxError",
                        "passed": False,
                        "execution_time_ms": 10,
                        "status": "COMPILATION_ERROR",
                    })
                return {
                    "status": "COMPILATION_ERROR",
                    "passed_count": 0,
                    "total_count": len(test_cases),
                    "execution_time_ms": 10,
                    "test_results": results,
                    "error": diag,
                }
        finally:
            if os.path.exists(tmp_check.name):
                try:
                    os.remove(tmp_check.name)
                except Exception:
                    pass

        for idx, tc in enumerate(test_cases):
            tc_input = tc.input.strip()
            expected = tc.expectedOutput.strip()

            js_script = f"""
const _printed = [];
const _origLog = console.log;
console.log = function(...args) {{
    _printed.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
}};

try {{
{code}
}} catch (e) {{
    _origLog(JSON.stringify({{error: e.message}}));
    process.exit(0);
}}

function __run_test() {{
    let fn = null;
    try {{
        if (typeof {req.entry_point} === 'function') fn = {req.entry_point};
        else if (typeof solve === 'function') fn = solve;
        else if (typeof main === 'function') fn = main;
        else if (typeof Solution !== 'undefined') {{
            const s = new Solution();
            if (typeof s.{req.entry_point} === 'function') fn = s.{req.entry_point}.bind(s);
            else if (typeof s.solve === 'function') fn = s.solve.bind(s);
        }}
    }} catch (ignored) {{}}

    if (!fn && _printed.length > 0) {{
        _origLog(JSON.stringify({{actual: _printed.join('\\n').trim()}}));
        return;
    }}

    const rawInput = {json.dumps(tc_input)};
    let args = [];
    try {{
        if (rawInput.startsWith('[') || rawInput.startsWith('{{')) {{
            args = [JSON.parse(rawInput)];
        }} else {{
            const tokens = rawInput.trim().split(/\\s+/).filter(Boolean);
            if (tokens.length > 1) {{
                args = tokens.map(x => (x !== '' && !isNaN(Number(x))) ? Number(x) : x);
            }} else if (tokens.length === 1) {{
                args = [(tokens[0] !== '' && !isNaN(Number(tokens[0]))) ? Number(tokens[0]) : tokens[0]];
            }} else {{
                args = [];
            }}
        }}
    }} catch (e) {{
        args = [rawInput];
    }}

    try {{
        if (!fn) {{
            if (_printed.length > 0) {{
                _origLog(JSON.stringify({{actual: _printed.join('\\n').trim()}}));
                return;
            }}
            throw new Error("Function 'solve' or 'Solution' or output print not found");
        }}
        const res = fn(...args);

        if (res !== undefined) {{
            let out_str;
            if (typeof res === 'boolean') out_str = String(res).toLowerCase();
            else if (typeof res === 'object') out_str = JSON.stringify(res);
            else out_str = String(res ?? '');
            _origLog(JSON.stringify({{actual: out_str}}));
        }} else if (_printed.length > 0) {{
            _origLog(JSON.stringify({{actual: _printed.join('\\n').trim()}}));
        }} else {{
            _origLog(JSON.stringify({{actual: ''}}));
        }}
    }} catch (err) {{
        _origLog(JSON.stringify({{error: err.message}}));
    }}
}}
__run_test();
"""
            tmp_js = tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False, encoding='utf-8')
            try:
                tmp_js.write(js_script)
                tmp_js.close()

                tc_t0 = time.time()
                rc, stdout, stderr, timed_out = _run_process_safe(["node", tmp_js.name], input_str=tc_input, timeout=3.0)
                tc_time_ms = max(1, int((time.time() - tc_t0) * 1000))

                if timed_out:
                    actual_out = "Time Limit Exceeded ( > 3.0s )"
                    is_passed = False
                    status_str = "TIME_LIMIT_EXCEEDED"
                elif rc != 0 or stderr:
                    actual_out = stderr.splitlines()[-1] if stderr else f"Runtime Error (code {rc})"
                    is_passed = False
                    status_str = "COMPILATION_ERROR" if "SyntaxError" in (stderr or "") else "RUNTIME_ERROR"
                    error_message = stderr
                else:
                    try:
                        parsed = json.loads(stdout.strip())
                        if "error" in parsed:
                            actual_out = parsed["error"]
                            is_passed = False
                            status_str = "COMPILATION_ERROR" if "SyntaxError" in actual_out else "RUNTIME_ERROR"
                            error_message = parsed["error"]
                        else:
                            actual_out = str(parsed.get("actual", ""))
                            is_passed = compare_outputs(actual_out, expected)
                            status_str = "ACCEPTED" if is_passed else "WRONG_ANSWER"
                    except Exception:
                        actual_out = stdout.strip() or "No output"
                        is_passed = compare_outputs(actual_out, expected)
                        status_str = "ACCEPTED" if is_passed else "WRONG_ANSWER"
            finally:
                if os.path.exists(tmp_js.name):
                    try:
                        os.remove(tmp_js.name)
                    except Exception:
                        pass

            if is_passed:
                passed_count += 1
            elif overall_status == "ACCEPTED":
                overall_status = status_str

            results.append({
                "id": idx + 1,
                "input": tc_input,
                "expected_output": expected,
                "actual_output": actual_out,
                "passed": is_passed,
                "execution_time_ms": tc_time_ms,
                "status": status_str,
            })

    # -------------------------------------------------------------
    # 3. Java Execution via Javac & Java
    # -------------------------------------------------------------
    elif lang == "java":
        javac_cmd = _find_javac()
        java_cmd = _find_java()

        if not javac_cmd or not java_cmd:
            for idx, tc in enumerate(test_cases):
                results.append({
                    "id": idx + 1,
                    "input": tc.input.strip(),
                    "expected_output": tc.expectedOutput.strip(),
                    "actual_output": "Java compiler (javac/java) not found on this server.",
                    "passed": False,
                    "execution_time_ms": 10,
                    "status": "RUNTIME_ERROR",
                })
            return {
                "status": "RUNTIME_ERROR",
                "passed_count": 0,
                "total_count": len(test_cases),
                "execution_time_ms": 10,
                "test_results": results,
                "error": "Java compiler not found.",
            }

        import re
        # Strip 'public' from any non-Main classes so javac Main.java accepts Solution or other helper classes
        cleaned_code = re.sub(r'\bpublic\s+class\s+(?!Main\b)(\w+)', r'class \1', code)

        has_main_class = bool(re.search(r'\bclass\s+Main\b', cleaned_code))
        if has_main_class:
            java_source = cleaned_code
            if "public class Main" not in java_source:
                java_source = re.sub(r'\bclass\s+Main\b', 'public class Main', java_source, count=1)
        else:
            java_source = f"""import java.util.*;
import java.io.*;

{cleaned_code}

public class Main {{
    public static void main(String[] args) {{
        try {{
            Scanner sc = new Scanner(System.in);
            StringBuilder sb = new StringBuilder();
            while (sc.hasNextLine()) {{
                sb.append(sc.nextLine()).append("\\n");
            }}
            String rawInput = sb.toString().trim();
            Solution sol = new Solution();

            java.lang.reflect.Method[] methods = Solution.class.getDeclaredMethods();
            java.lang.reflect.Method target = null;
            for (java.lang.reflect.Method m : methods) {{
                if (m.getName().equals("{req.entry_point}") || m.getName().equals("solve") || methods.length == 1) {{
                    target = m;
                    break;
                }}
            }}
            if (target == null) throw new Exception("Entry method not found in Solution class");

            Class<?>[] paramTypes = target.getParameterTypes();
            Object[] invokeArgs = new Object[paramTypes.length];
            String[] tokens = rawInput.isEmpty() ? new String[0] : rawInput.split("\\\\s+");
            int tokIdx = 0;
            for (int i = 0; i < paramTypes.length; i++) {{
                Class<?> pType = paramTypes[i];
                if (pType == int.class || pType == Integer.class) {{
                    invokeArgs[i] = (tokIdx < tokens.length) ? Integer.parseInt(tokens[tokIdx++]) : 0;
                }} else if (pType == long.class || pType == Long.class) {{
                    invokeArgs[i] = (tokIdx < tokens.length) ? Long.parseLong(tokens[tokIdx++]) : 0L;
                }} else if (pType == double.class || pType == Double.class) {{
                    invokeArgs[i] = (tokIdx < tokens.length) ? Double.parseDouble(tokens[tokIdx++]) : 0.0;
                }} else if (pType == boolean.class || pType == Boolean.class) {{
                    invokeArgs[i] = (tokIdx < tokens.length) ? Boolean.parseBoolean(tokens[tokIdx++]) : false;
                }} else if (pType == String.class) {{
                    if (paramTypes.length == 1) {{
                        invokeArgs[i] = rawInput;
                    }} else {{
                        invokeArgs[i] = (tokIdx < tokens.length) ? tokens[tokIdx++] : "";
                    }}
                }} else if (pType == int[].class) {{
                    int remaining = tokens.length - tokIdx;
                    int[] arr = new int[remaining > 0 ? remaining : 0];
                    for (int j = 0; j < arr.length; j++) {{
                        try {{ arr[j] = Integer.parseInt(tokens[tokIdx++]); }} catch(Exception ignored) {{}}
                    }}
                    invokeArgs[i] = arr;
                }} else {{
                    invokeArgs[i] = null;
                }}
            }}

            Object res = target.invoke(sol, invokeArgs);
            if (res != null) {{
                if (res instanceof Boolean) {{
                    System.out.println(String.valueOf(res).toLowerCase());
                }} else if (res instanceof int[]) {{
                    System.out.println(Arrays.toString((int[]) res));
                }} else {{
                    System.out.println(String.valueOf(res));
                }}
            }}
        }} catch (Exception e) {{
            System.err.println(e.getMessage() != null ? e.getMessage() : e.toString());
            System.exit(1);
        }}
    }}
}}
"""

        tmpdir = tempfile.mkdtemp(prefix="java_run_")
        try:
            java_file = os.path.join(tmpdir, "Main.java")
            with open(java_file, "w", encoding="utf-8") as f:
                f.write(java_source)

            comp_rc, comp_out, comp_err, comp_timed_out = _run_process_safe(
                [javac_cmd, java_file], timeout=8.0, cwd=tmpdir
            )

            if comp_rc != 0 or comp_timed_out:
                diag = comp_err.strip() or comp_out.strip() or "Compilation Error"
                err_lines = diag.splitlines()
                summary_diag = err_lines[-1] if err_lines else "Compilation Error"
                for idx, tc in enumerate(test_cases):
                    results.append({
                        "id": idx + 1,
                        "input": tc.input.strip(),
                        "expected_output": tc.expectedOutput.strip(),
                        "actual_output": summary_diag,
                        "passed": False,
                        "execution_time_ms": int((time.time() - start_time) * 1000) + 10,
                        "status": "COMPILATION_ERROR",
                    })
                return {
                    "status": "COMPILATION_ERROR",
                    "passed_count": 0,
                    "total_count": len(test_cases),
                    "execution_time_ms": int((time.time() - start_time) * 1000) + 10,
                    "test_results": results,
                    "error": diag,
                }

            for idx, tc in enumerate(test_cases):
                tc_input = tc.input.strip()
                expected = tc.expectedOutput.strip()

                tc_t0 = time.time()
                rc, run_out, run_err, timed_out = _run_process_safe(
                    [java_cmd, "-cp", tmpdir, "Main"], input_str=tc_input, timeout=3.0, cwd=tmpdir
                )
                tc_time_ms = max(1, int((time.time() - tc_t0) * 1000))

                if timed_out:
                    actual_out = "Time Limit Exceeded ( > 3.0s )"
                    is_passed = False
                    status_str = "TIME_LIMIT_EXCEEDED"
                elif rc != 0 or run_err:
                    err_line = run_err.strip().splitlines()[-1] if run_err.strip() else f"Runtime Error (code {rc})"
                    actual_out = err_line
                    is_passed = False
                    status_str = "RUNTIME_ERROR"
                    error_message = run_err
                else:
                    actual_out = run_out.strip()
                    is_passed = compare_outputs(actual_out, expected)
                    status_str = "ACCEPTED" if is_passed else "WRONG_ANSWER"

                if is_passed:
                    passed_count += 1
                elif overall_status == "ACCEPTED":
                    overall_status = status_str

                results.append({
                    "id": idx + 1,
                    "input": tc_input,
                    "expected_output": expected,
                    "actual_output": actual_out,
                    "passed": is_passed,
                    "execution_time_ms": tc_time_ms,
                    "status": status_str,
                })
        finally:
            shutil.rmtree(tmpdir, ignore_errors=True)

    # -------------------------------------------------------------
    # 4. C++ Execution via g++ / clang++ (Authentic Native Sandbox)
    # -------------------------------------------------------------
    elif lang in ("cpp", "c++", "c"):
        cpp_compiler = _find_cpp_compiler()
        if not cpp_compiler:
            for idx, tc in enumerate(test_cases):
                results.append({
                    "id": idx + 1,
                    "input": tc.input.strip(),
                    "expected_output": tc.expectedOutput.strip(),
                    "actual_output": "g++ compiler not found on this server. Please contact the administrator.",
                    "passed": False,
                    "execution_time_ms": 10,
                    "status": "RUNTIME_ERROR",
                })
            return {
                "status": "RUNTIME_ERROR",
                "passed_count": 0,
                "total_count": len(test_cases),
                "execution_time_ms": 10,
                "test_results": results,
                "error": "g++ compiler not found on this server.",
            }

        import re
        has_main = bool(re.search(r'\bint\s+main\s*\(', code))
        if has_main:
            cpp_source = code
        else:
            entry = req.entry_point if req.entry_point else "solve"
            has_sol_class = bool(re.search(r'\bclass\s+Solution\b', code))

            if has_sol_class:
                m_match = re.search(r'([\w:<>, ]+[\*&]?)\s+' + re.escape(entry) + r'\s*\((.*?)\)', code)
                if not m_match:
                    m_match = re.search(r'([\w:<>, ]+[\*&]?)\s+(\w+)\s*\((.*?)\)', code)
                    if m_match:
                        entry = m_match.group(2)
                        params = m_match.group(3).strip()
                    else:
                        params = ""
                else:
                    params = m_match.group(2).strip()

                main_body = "    Solution sol;\n"
                if not params or params == "void":
                    main_body += f"    auto res = sol.{entry}();\n    cout << boolalpha << res << endl;\n"
                elif "vector" in params:
                    main_body += f"    vector<int> v; int _x;\n    while (cin >> _x) v.push_back(_x);\n    auto res = sol.{entry}(v);\n    cout << boolalpha << res << endl;\n"
                elif "string" in params:
                    main_body += f"    string s;\n    if (cin >> s) {{\n        auto res = sol.{entry}(s);\n        cout << boolalpha << res << endl;\n    }}\n"
                elif "," in params:
                    main_body += f"    int a = 0, b = 0;\n    if (cin >> a >> b) {{\n        auto res = sol.{entry}(a, b);\n        cout << boolalpha << res << endl;\n    }}\n"
                else:
                    main_body += f"    int n = 0;\n    if (cin >> n) {{\n        auto res = sol.{entry}(n);\n        cout << boolalpha << res << endl;\n    }}\n"
            else:
                f_match = re.search(r'([\w:<>, ]+[\*&]?)\s+' + re.escape(entry) + r'\s*\((.*?)\)', code)
                if not f_match:
                    f_match = re.search(r'([\w:<>, ]+[\*&]?)\s+(\w+)\s*\((.*?)\)', code)
                    if f_match:
                        entry = f_match.group(2)
                        params = f_match.group(3).strip()
                    else:
                        params = ""
                else:
                    params = f_match.group(2).strip()

                if not params or params == "void":
                    main_body = f"    {entry}();\n"
                elif "vector" in params:
                    main_body = f"    vector<int> v; int _x;\n    while (cin >> _x) v.push_back(_x);\n    cout << boolalpha << {entry}(v) << endl;\n"
                elif "string" in params:
                    main_body = f"    string s;\n    if (cin >> s) cout << boolalpha << {entry}(s) << endl;\n"
                elif "," in params:
                    main_body = f"    int a = 0, b = 0;\n    if (cin >> a >> b) cout << boolalpha << {entry}(a, b) << endl;\n"
                else:
                    main_body = f"    int n = 0;\n    if (cin >> n) cout << boolalpha << {entry}(n) << endl;\n"

            cpp_source = f"""#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <cmath>
#include <map>
#include <set>
#include <queue>
#include <stack>
#include <deque>
#include <numeric>
#include <sstream>
using namespace std;

template <typename T>
ostream& operator<<(ostream& os, const vector<T>& v) {{
    for (size_t i = 0; i < v.size(); ++i) {{
        if (i > 0) os << " ";
        os << v[i];
    }}
    return os;
}}

{code}

int main() {{
{main_body}    return 0;
}}
"""

        tmpdir = tempfile.mkdtemp(prefix="cpp_run_")
        try:
            src_file = os.path.join(tmpdir, "solution.cpp")
            bin_file = os.path.join(tmpdir, "solution.exe" if sys.platform == "win32" else "solution")
            with open(src_file, "w", encoding="utf-8") as f:
                f.write(cpp_source)

            compile_cmd = [cpp_compiler, "-O2", "-std=c++17", "-o", bin_file, src_file]
            comp_rc, comp_out, comp_err, comp_timed_out = _run_process_safe(
                compile_cmd, timeout=10.0, cwd=tmpdir
            )

            if comp_rc != 0 or comp_timed_out:
                diag = comp_err.strip() or comp_out.strip() or "Compilation Error"
                err_lines = diag.splitlines()
                summary_diag = err_lines[-1] if err_lines else "Compilation Error"
                for idx, tc in enumerate(test_cases):
                    results.append({
                        "id": idx + 1,
                        "input": tc.input.strip(),
                        "expected_output": tc.expectedOutput.strip(),
                        "actual_output": summary_diag,
                        "passed": False,
                        "execution_time_ms": int((time.time() - start_time) * 1000) + 10,
                        "status": "COMPILATION_ERROR",
                    })
                return {
                    "status": "COMPILATION_ERROR",
                    "passed_count": 0,
                    "total_count": len(test_cases),
                    "execution_time_ms": int((time.time() - start_time) * 1000) + 10,
                    "test_results": results,
                    "error": diag,
                }

            for idx, tc in enumerate(test_cases):
                tc_input = tc.input.strip()
                expected = tc.expectedOutput.strip()

                tc_t0 = time.time()
                rc, run_out, run_err, timed_out = _run_process_safe(
                    [bin_file], input_str=tc_input, timeout=3.0, cwd=tmpdir
                )
                tc_time_ms = max(1, int((time.time() - tc_t0) * 1000))

                if timed_out:
                    actual_out = "Time Limit Exceeded ( > 3.0s )"
                    is_passed = False
                    status_str = "TIME_LIMIT_EXCEEDED"
                elif rc != 0 or run_err:
                    err_line = run_err.strip().splitlines()[-1] if run_err.strip() else f"Runtime Error (code {rc})"
                    actual_out = err_line
                    is_passed = False
                    status_str = "RUNTIME_ERROR"
                    error_message = run_err
                else:
                    actual_out = run_out.strip()
                    is_passed = compare_outputs(actual_out, expected)
                    status_str = "ACCEPTED" if is_passed else "WRONG_ANSWER"

                if is_passed:
                    passed_count += 1
                elif overall_status == "ACCEPTED":
                    overall_status = status_str

                results.append({
                    "id": idx + 1,
                    "input": tc_input,
                    "expected_output": expected,
                    "actual_output": actual_out,
                    "passed": is_passed,
                    "execution_time_ms": tc_time_ms,
                    "status": status_str,
                })
        finally:
            shutil.rmtree(tmpdir, ignore_errors=True)

    # -------------------------------------------------------------
    # 5. Unsupported Language Fallback
    # -------------------------------------------------------------
    else:
        for idx, tc in enumerate(test_cases):
            results.append({
                "id": idx + 1,
                "input": tc.input.strip(),
                "expected_output": tc.expectedOutput.strip(),
                "actual_output": f"Language '{lang}' is not supported by this sandbox.",
                "passed": False,
                "execution_time_ms": 5,
                "status": "RUNTIME_ERROR",
            })
        overall_status = "RUNTIME_ERROR"

    total_time_ms = int((time.time() - start_time) * 1000) + 10
    final_status = "ACCEPTED" if (passed_count == len(test_cases) and len(test_cases) > 0) else overall_status

    return {
        "status": final_status,
        "passed_count": passed_count,
        "total_count": len(test_cases),
        "execution_time_ms": total_time_ms,
        "test_results": results,
        "error": error_message,
    }
