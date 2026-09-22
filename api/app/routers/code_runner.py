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
        if math.isclose(a_f, e_f, rel_tol=1e-5, abs_tol=1e-5):
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
                    if math.isclose(float(a_tok), float(e_tok), rel_tol=1e-5, abs_tol=1e-5):
                        continue
                except (ValueError, TypeError):
                    pass
                all_lines_match = False
                break
        if all_lines_match:
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
__name__ = '__student_module__'

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
        if printed_already:
            sys.stdout = _orig_stdout
            print(json.dumps({{"actual": printed_already}}))
            return

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
        else:
            sys.stdout = _orig_stdout
            printed = _stdout_buffer.getvalue().strip()
            if printed:
                print(json.dumps({{"actual": printed}}))
            else:
                print(json.dumps({{"error": "Function 'solve' or 'Solution' class or output print not found"}}))
    except Exception as e:
        sys.stdout = _orig_stdout
        print(json.dumps({{"error": str(e)}}))

__run_test()
"""
            rc, stdout, stderr, timed_out = _run_process_safe(
                [sys.executable, "-I", "-c", runner_script],
                input_str=tc_input,
                timeout=3.0,
                preexec_fn=_set_limits if sys.platform != "win32" else None,
            )

            if timed_out:
                actual_out = "Time Limit Exceeded ( > 3.0s )"
                is_passed = False
                status_str = "TIME_LIMIT_EXCEEDED"
            elif rc != 0 or stderr:
                actual_out = stderr.splitlines()[-1] if stderr else f"Runtime Error (code {rc})"
                is_passed = False
                status_str = "RUNTIME_ERROR"
                error_message = stderr
            else:
                try:
                    parsed = json.loads(stdout.strip())
                    if "error" in parsed:
                        actual_out = parsed["error"]
                        is_passed = False
                        status_str = "RUNTIME_ERROR"
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
                "execution_time_ms": int((time.time() - start_time) * 1000) + 10,
                "status": status_str,
            })

    # -------------------------------------------------------------
    # 2. JavaScript Execution via Node.js
    # -------------------------------------------------------------
    elif lang in ("javascript", "js"):
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
    if (_printed.length > 0) {{
        _origLog(JSON.stringify({{actual: _printed.join('\\n').trim()}}));
        return;
    }}

    const rawInput = {json.dumps(tc_input)};
    let args = [];
    try {{
        if (rawInput.startsWith('[') || rawInput.startsWith('{{')) {{
            args = [JSON.parse(rawInput)];
        }} else if (rawInput.includes(' ')) {{
            args = rawInput.split(' ').map(x => isNaN(x) ? x : Number(x));
        }} else {{
            args = [isNaN(rawInput) ? rawInput : Number(rawInput)];
        }}
    }} catch (e) {{
        args = [rawInput];
    }}

    try {{
        let fn = null;
        if (typeof {req.entry_point} === 'function') fn = {req.entry_point};
        else if (typeof solve === 'function') fn = solve;
        else if (typeof main === 'function') fn = main;
        else if (typeof Solution !== 'undefined') {{
            const s = new Solution();
            if (typeof s.{req.entry_point} === 'function') fn = s.{req.entry_point}.bind(s);
            else if (typeof s.solve === 'function') fn = s.solve.bind(s);
        }}

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

                rc, stdout, stderr, timed_out = _run_process_safe(["node", tmp_js.name], input_str=tc_input, timeout=3.0)

                if timed_out:
                    actual_out = "Time Limit Exceeded ( > 3.0s )"
                    is_passed = False
                    status_str = "TIME_LIMIT_EXCEEDED"
                elif rc != 0 or stderr:
                    actual_out = stderr.splitlines()[-1] if stderr else f"Runtime Error (code {rc})"
                    is_passed = False
                    status_str = "RUNTIME_ERROR"
                    error_message = stderr
                else:
                    try:
                        parsed = json.loads(stdout.strip())
                        if "error" in parsed:
                            actual_out = parsed["error"]
                            is_passed = False
                            status_str = "RUNTIME_ERROR"
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
                "execution_time_ms": int((time.time() - start_time) * 1000) + 10,
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

        has_main_class = "class Main" in code or "class Main " in code
        if has_main_class:
            java_source = code
            if "public class Main" not in java_source and "class Main" in java_source:
                java_source = java_source.replace("class Main", "public class Main", 1)
        else:
            java_source = f"""import java.util.*;
import java.io.*;

{code}

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
            if (paramTypes.length > 0) {{
                Class<?> pType = paramTypes[0];
                if (pType == int.class) {{
                    invokeArgs[0] = Integer.parseInt(rawInput.split("\\\\s+")[0]);
                }} else if (pType == long.class) {{
                    invokeArgs[0] = Long.parseLong(rawInput.split("\\\\s+")[0]);
                }} else if (pType == double.class) {{
                    invokeArgs[0] = Double.parseDouble(rawInput.split("\\\\s+")[0]);
                }} else if (pType == String.class) {{
                    invokeArgs[0] = rawInput;
                }} else if (pType == int[].class) {{
                    String[] parts = rawInput.split("\\\\s+");
                    int[] arr = new int[parts.length];
                    for (int i = 0; i < parts.length; i++) {{
                        try {{ arr[i] = Integer.parseInt(parts[i]); }} catch(Exception ignored) {{}}
                    }}
                    invokeArgs[0] = arr;
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

                rc, run_out, run_err, timed_out = _run_process_safe(
                    [java_cmd, "-cp", tmpdir, "Main"], input_str=tc_input, timeout=3.0, cwd=tmpdir
                )

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
                    "execution_time_ms": int((time.time() - start_time) * 1000) + 10,
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

        needs_main = "int main(" not in code and "int main (" not in code
        if needs_main:
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

{code}

int main() {{
    solve();
    return 0;
}}
"""
        else:
            cpp_source = code

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

                rc, run_out, run_err, timed_out = _run_process_safe(
                    [bin_file], input_str=tc_input, timeout=3.0, cwd=tmpdir
                )

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
                    "execution_time_ms": int((time.time() - start_time) * 1000) + 10,
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
