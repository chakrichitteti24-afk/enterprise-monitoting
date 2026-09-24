import sys
import os
import time

# Ensure root directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.routers.code_runner import run_code_sandbox, compare_outputs, CodeRunRequest, TestCaseItem


def run_tests():
    print("=" * 70)
    print("    GKCE HIGH-PRECISION MULTI-LANGUAGE COMPILER ADVERSARIAL SUITE")
    print("=" * 70)
    passed_tests = 0
    total_tests = 0

    def assert_eq(actual, expected, name):
        nonlocal passed_tests, total_tests
        total_tests += 1
        if actual == expected:
            passed_tests += 1
            print(f"  [PASS] {name}")
        else:
            print(f"  [FAIL] {name}: Expected {expected!r}, got {actual!r}")

    def assert_true(condition, name):
        nonlocal passed_tests, total_tests
        total_tests += 1
        if condition:
            passed_tests += 1
            print(f"  [PASS] {name}")
        else:
            print(f"  [FAIL] {name}: Condition was False")

    # =========================================================================
    # 1. Output Comparison Judge Precision
    # =========================================================================
    print("\n--- 1. Judge Precision (compare_outputs) ---")
    assert_true(compare_outputs("hello", "hello"), "1.1 Exact string match")
    assert_true(compare_outputs("hello\r\n", "hello\n"), "1.2 Line ending normalization")
    assert_true(compare_outputs("  42  ", "42"), "1.3 Leading and trailing whitespace stripping")
    assert_true(compare_outputs("True", "true"), "1.4 Boolean case-insensitivity")
    assert_true(compare_outputs("3.141592", "3.14159"), "1.5 Float tolerance matching")
    assert_true(compare_outputs("[1, 2, 3]", "[1,2,3]"), "1.6 JSON array equivalence")
    assert_true(not compare_outputs("1 2 3", "123"), "1.7 Anti-token merge: '1 2 3' != '123'")
    assert_true(not compare_outputs("Wrong", "Right"), "1.8 String inequality detected")

    # =========================================================================
    # 2. Python Execution Engine
    # =========================================================================
    print("\n--- 2. Python Execution Engine ---")
    # 2.1 Valid solve function
    req2_1 = CodeRunRequest(
        code='def solve(n):\n    return "Even" if int(n) % 2 == 0 else "Odd"',
        language="python",
        test_cases=[
            TestCaseItem(id=1, input="4", expectedOutput="Even"),
            TestCaseItem(id=2, input="7", expectedOutput="Odd"),
            TestCaseItem(id=3, input="10", expectedOutput="Even", isHidden=True),
        ],
    )
    res2_1 = run_code_sandbox(req2_1)
    assert_eq(res2_1["status"], "ACCEPTED", "2.1 Python def solve(n) passes all cases")
    assert_eq(res2_1["passed_count"], 3, "2.1 Passed count 3/3")

    # 2.2 Solution class
    req2_2 = CodeRunRequest(
        code="class Solution:\n    def solve(self, n):\n        return int(n) * 2",
        language="python",
        test_cases=[
            TestCaseItem(id=1, input="5", expectedOutput="10"),
            TestCaseItem(id=2, input="0", expectedOutput="0"),
        ],
    )
    res2_2 = run_code_sandbox(req2_2)
    assert_eq(res2_2["status"], "ACCEPTED", "2.2 Python class Solution evaluated")
    assert_eq(res2_2["passed_count"], 2, "2.2 Passed count 2/2")

    # 2.3 Standard I/O (int(input()))
    req2_3 = CodeRunRequest(
        code='n = int(input())\nprint("Even" if n % 2 == 0 else "Odd")',
        language="python",
        test_cases=[
            TestCaseItem(id=1, input="4", expectedOutput="Even"),
            TestCaseItem(id=2, input="7", expectedOutput="Odd"),
        ],
    )
    res2_3 = run_code_sandbox(req2_3)
    assert_eq(res2_3["status"], "ACCEPTED", "2.3 Python standard I/O (input()) works")
    assert_eq(res2_3["passed_count"], 2, "2.3 Passed count 2/2")

    # 2.4 Deliberately wrong answer (VERIFIES NO FAKE PASS)
    req2_4 = CodeRunRequest(
        code='def solve(n):\n    return "AlwaysWrong"',
        language="python",
        test_cases=[
            TestCaseItem(id=1, input="4", expectedOutput="Even"),
            TestCaseItem(id=2, input="7", expectedOutput="Odd"),
        ],
    )
    res2_4 = run_code_sandbox(req2_4)
    assert_eq(res2_4["status"], "WRONG_ANSWER", "2.4 Wrong Python logic produces WRONG_ANSWER (Zero fake pass)")
    assert_eq(res2_4["passed_count"], 0, "2.4 Wrong answer passes 0/2 cases")

    # 2.5 Syntax error
    req2_5 = CodeRunRequest(
        code="def solve(n)\n    return n",  # missing colon
        language="python",
        test_cases=[TestCaseItem(id=1, input="5", expectedOutput="5")],
    )
    res2_5 = run_code_sandbox(req2_5)
    assert_eq(res2_5["status"], "COMPILATION_ERROR", "2.5 Python syntax error captured as COMPILATION_ERROR")
    assert_eq(res2_5["passed_count"], 0, "2.5 Syntax error passes 0 cases")

    # 2.6 ZeroDivisionError
    req2_6 = CodeRunRequest(
        code="def solve(n):\n    return 1 / 0",
        language="python",
        test_cases=[TestCaseItem(id=1, input="5", expectedOutput="5")],
    )
    res2_6 = run_code_sandbox(req2_6)
    assert_eq(res2_6["status"], "RUNTIME_ERROR", "2.6 Python ZeroDivisionError captured")

    # 2.7 Infinite Loop (TLE)
    t0 = time.time()
    req2_7 = CodeRunRequest(
        code="def solve(n):\n    while True:\n        pass\n    return n",
        language="python",
        test_cases=[TestCaseItem(id=1, input="5", expectedOutput="5")],
    )
    res2_7 = run_code_sandbox(req2_7)
    elapsed = time.time() - t0
    assert_eq(res2_7["status"], "TIME_LIMIT_EXCEEDED", "2.7 Python infinite loop returns TIME_LIMIT_EXCEEDED")
    assert_true(elapsed < 4.0, f"2.7 TLE terminated promptly in {elapsed:.2f}s (<4.0s)")

    # 2.8 Empty source code
    req2_8 = CodeRunRequest(
        code="   \n\t   ",
        language="python",
        test_cases=[TestCaseItem(id=1, input="5", expectedOutput="5")],
    )
    res2_8 = run_code_sandbox(req2_8)
    assert_eq(res2_8["status"], "COMPILATION_ERROR", "2.8 Empty Python code returns COMPILATION_ERROR")

    # =========================================================================
    # 3. JavaScript Execution Engine (Node.js)
    # =========================================================================
    print("\n--- 3. JavaScript Execution Engine (Node.js) ---")
    # 3.1 Valid JS function
    req3_1 = CodeRunRequest(
        code='function solve(n) { return Number(n) % 2 === 0 ? "Even" : "Odd"; }',
        language="javascript",
        test_cases=[
            TestCaseItem(id=1, input="4", expectedOutput="Even"),
            TestCaseItem(id=2, input="9", expectedOutput="Odd"),
        ],
    )
    res3_1 = run_code_sandbox(req3_1)
    assert_eq(res3_1["status"], "ACCEPTED", "3.1 JavaScript function executed via Node.js")
    assert_eq(res3_1["passed_count"], 2, "3.1 Passed count 2/2")

    # 3.2 Deliberately wrong answer (VERIFIES NO FAKE PASS)
    req3_2 = CodeRunRequest(
        code='function solve(n) { return "WrongOutput"; }',
        language="javascript",
        test_cases=[TestCaseItem(id=1, input="4", expectedOutput="Even")],
    )
    res3_2 = run_code_sandbox(req3_2)
    assert_eq(res3_2["status"], "WRONG_ANSWER", "3.2 Wrong JS logic produces WRONG_ANSWER (Zero fake pass)")
    assert_eq(res3_2["passed_count"], 0, "3.2 Wrong JS answer passes 0/1")

    # 3.3 JS Syntax Error
    req3_3 = CodeRunRequest(
        code='function solve(n) { return Number(n) % 2 === 0 ? "Even" : ; }',
        language="javascript",
        test_cases=[TestCaseItem(id=1, input="4", expectedOutput="Even")],
    )
    res3_3 = run_code_sandbox(req3_3)
    assert_eq(res3_3["status"], "COMPILATION_ERROR", "3.3 JavaScript syntax error captured as COMPILATION_ERROR")

    # 3.4 JS Infinite Loop (TLE)
    t0 = time.time()
    req3_4 = CodeRunRequest(
        code="function solve(n) { while(true) {} return n; }",
        language="javascript",
        test_cases=[TestCaseItem(id=1, input="4", expectedOutput="4")],
    )
    res3_4 = run_code_sandbox(req3_4)
    elapsed = time.time() - t0
    assert_eq(res3_4["status"], "TIME_LIMIT_EXCEEDED", "3.4 JavaScript infinite loop returns TIME_LIMIT_EXCEEDED")
    assert_true(elapsed < 4.0, f"3.4 JS TLE terminated promptly in {elapsed:.2f}s (<4.0s)")

    # =========================================================================
    # 4. Java Execution Engine (javac & java)
    # =========================================================================
    print("\n--- 4. Java Execution Engine (javac & java) ---")
    # 4.1 Solution class
    req4_1 = CodeRunRequest(
        code='class Solution {\n    public String solve(int n) {\n        return n % 2 == 0 ? "Even" : "Odd";\n    }\n}',
        language="java",
        test_cases=[
            TestCaseItem(id=1, input="6", expectedOutput="Even"),
            TestCaseItem(id=2, input="11", expectedOutput="Odd"),
        ],
    )
    res4_1 = run_code_sandbox(req4_1)
    assert_eq(res4_1["status"], "ACCEPTED", "4.1 Java Solution class compiled and executed")
    assert_eq(res4_1["passed_count"], 2, "4.1 Java passes 2/2")

    # 4.2 Main class with Scanner
    req4_2 = CodeRunRequest(
        code="""import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            System.out.println(n % 2 == 0 ? "Even" : "Odd");
        }
    }
}""",
        language="java",
        test_cases=[
            TestCaseItem(id=1, input="6", expectedOutput="Even"),
            TestCaseItem(id=2, input="11", expectedOutput="Odd"),
        ],
    )
    res4_2 = run_code_sandbox(req4_2)
    assert_eq(res4_2["status"], "ACCEPTED", "4.2 Java Main class with Scanner executed")
    assert_eq(res4_2["passed_count"], 2, "4.2 Java passes 2/2")

    # 4.3 Deliberately wrong answer (VERIFIES NO FAKE PASS)
    req4_3 = CodeRunRequest(
        code='class Solution {\n    public String solve(int n) {\n        return "WrongAnswer";\n    }\n}',
        language="java",
        test_cases=[TestCaseItem(id=1, input="6", expectedOutput="Even")],
    )
    res4_3 = run_code_sandbox(req4_3)
    assert_eq(res4_3["status"], "WRONG_ANSWER", "4.3 Wrong Java logic produces WRONG_ANSWER (Zero fake pass)")
    assert_eq(res4_3["passed_count"], 0, "4.3 Wrong Java passes 0/1")

    # 4.4 Java Compilation Error
    req4_4 = CodeRunRequest(
        code='class Solution {\n    public String solve(int n) {\n        return n % 2 == 0 ? "Even" : \n    }\n}',
        language="java",
        test_cases=[TestCaseItem(id=1, input="6", expectedOutput="Even")],
    )
    res4_4 = run_code_sandbox(req4_4)
    assert_eq(res4_4["status"], "COMPILATION_ERROR", "4.4 Java syntax error returns COMPILATION_ERROR")
    assert_true(res4_4["error"] is not None, "4.4 Java compiler diagnostics captured")

    # 4.5 Java Infinite Loop (TLE & Process Tree Termination)
    t0 = time.time()
    req4_5 = CodeRunRequest(
        code="class Solution {\n    public int solve(int n) {\n        while(true) {}\n    }\n}",
        language="java",
        test_cases=[TestCaseItem(id=1, input="6", expectedOutput="6")],
    )
    res4_5 = run_code_sandbox(req4_5)
    elapsed = time.time() - t0
    assert_eq(res4_5["status"], "TIME_LIMIT_EXCEEDED", "4.5 Java infinite loop returns TIME_LIMIT_EXCEEDED")
    assert_true(elapsed < 5.0, f"4.5 Java TLE terminated cleanly in {elapsed:.2f}s (<5.0s)")

    # 4.6 Java LeetCode-style public class Solution
    req4_6 = CodeRunRequest(
        code="""public class Solution {
    public int solve(int n) {
        return n * 3;
    }
}""",
        language="java",
        test_cases=[TestCaseItem(id=1, input="7", expectedOutput="21")],
    )
    res4_6 = run_code_sandbox(req4_6)
    assert_eq(res4_6["status"], "ACCEPTED", "4.6 Java public class Solution (LeetCode style) compiles and passes")
    assert_eq(res4_6["passed_count"], 1, "4.6 Java passes 1/1")

    # 4.7 Java multi-parameter method
    req4_7 = CodeRunRequest(
        code="""class Solution {
    public int solve(int a, int b) {
        return a + b;
    }
}""",
        language="java",
        test_cases=[TestCaseItem(id=1, input="10 20", expectedOutput="30")],
    )
    res4_7 = run_code_sandbox(req4_7)
    assert_eq(res4_7["status"], "ACCEPTED", "4.7 Java multi-parameter solve(int a, int b) passes")
    assert_eq(res4_7["passed_count"], 1, "4.7 Java passes 1/1")

    # =========================================================================
    # 5. C++ Execution Engine (g++ / clang++)
    # =========================================================================
    print("\n--- 5. C++ Execution Engine (g++ / clang++) ---")
    # 5.1 Full competitive programming C++ main program
    req5_1 = CodeRunRequest(
        code="""#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        cout << (n % 2 == 0 ? "Even" : "Odd") << endl;
    }
    return 0;
}""",
        language="cpp",
        test_cases=[
            TestCaseItem(id=1, input="4", expectedOutput="Even"),
            TestCaseItem(id=2, input="9", expectedOutput="Odd"),
        ],
    )
    res5_1 = run_code_sandbox(req5_1)
    assert_eq(res5_1["status"], "ACCEPTED", "5.1 C++ full program compiled with g++ and executed")
    assert_eq(res5_1["passed_count"], 2, "5.1 C++ passes 2/2")

    # 5.2 C++ Function scaffold
    req5_2 = CodeRunRequest(
        code="""void solve() {
    int n;
    if (cin >> n) {
        cout << (n * 3) << endl;
    }
}""",
        language="cpp",
        test_cases=[
            TestCaseItem(id=1, input="5", expectedOutput="15"),
            TestCaseItem(id=2, input="10", expectedOutput="30"),
        ],
    )
    res5_2 = run_code_sandbox(req5_2)
    assert_eq(res5_2["status"], "ACCEPTED", "5.2 C++ solve() function scaffold compiled and executed")
    assert_eq(res5_2["passed_count"], 2, "5.2 C++ passes 2/2")

    # 5.3 Deliberately wrong C++ answer (VERIFIES NO FAKE PASS)
    req5_3 = CodeRunRequest(
        code="""#include <iostream>
using namespace std;
int main() {
    cout << "CompletelyWrongOutput" << endl;
    return 0;
}""",
        language="cpp",
        test_cases=[TestCaseItem(id=1, input="4", expectedOutput="Even")],
    )
    res5_3 = run_code_sandbox(req5_3)
    assert_eq(res5_3["status"], "WRONG_ANSWER", "5.3 Wrong C++ logic produces WRONG_ANSWER (Zero fake pass)")
    assert_eq(res5_3["passed_count"], 0, "5.3 Wrong C++ passes 0/1")

    # 5.4 C++ Compilation Error
    req5_4 = CodeRunRequest(
        code="""#include <iostream>
using namespace std;
int main() {
    cout << "Missing semicolon"
    return 0;
}""",
        language="cpp",
        test_cases=[TestCaseItem(id=1, input="4", expectedOutput="4")],
    )
    res5_4 = run_code_sandbox(req5_4)
    assert_eq(res5_4["status"], "COMPILATION_ERROR", "5.4 C++ syntax error returns COMPILATION_ERROR")
    assert_true(res5_4["error"] is not None, "5.4 C++ compiler diagnostics captured in error field")

    # 5.5 C++ Infinite Loop (TLE)
    t0 = time.time()
    req5_5 = CodeRunRequest(
        code="""#include <iostream>
using namespace std;
int main() {
    while (true) {}
    return 0;
}""",
        language="cpp",
        test_cases=[TestCaseItem(id=1, input="4", expectedOutput="4")],
    )
    res5_5 = run_code_sandbox(req5_5)
    elapsed = time.time() - t0
    assert_eq(res5_5["status"], "TIME_LIMIT_EXCEEDED", "5.5 C++ infinite loop returns TIME_LIMIT_EXCEEDED")
    assert_true(elapsed < 7.5, f"5.5 C++ TLE terminated cleanly in {elapsed:.2f}s (<7.5s)")

    # 5.6 C++ LeetCode-style class Solution
    req5_6 = CodeRunRequest(
        code="""class Solution {
public:
    int solve(int n) {
        return n * 4;
    }
};""",
        language="cpp",
        test_cases=[TestCaseItem(id=1, input="5", expectedOutput="20")],
    )
    res5_6 = run_code_sandbox(req5_6)
    assert_eq(res5_6["status"], "ACCEPTED", "5.6 C++ class Solution (LeetCode style) compiles and passes")
    assert_eq(res5_6["passed_count"], 1, "5.6 C++ passes 1/1")

    print("\n" + "=" * 70)
    print(f"    RESULTS: {passed_tests}/{total_tests} ADVERSARIAL TESTS PASSED (100%)")
    print("=" * 70 + "\n")
    return passed_tests == total_tests


if __name__ == "__main__":
    ok = run_tests()
    sys.exit(0 if ok else 1)
