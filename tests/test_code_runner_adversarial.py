import sys
import time
sys.path.insert(0, 'd:/gkce')
from api.app.routers.code_runner import run_code_sandbox, CodeRunRequest, TestCaseItem

def run_tests():
    print('=== Starting Backend Code Runner Adversarial Tests ===')
    passed_tests = 0
    total_tests = 0

    def assert_eq(actual, expected, name):
        nonlocal passed_tests, total_tests
        total_tests += 1
        if actual == expected:
            passed_tests += 1
            print(f'  [PASS] {name}')
        else:
            print(f'  [FAIL] {name}: Expected {expected!r}, got {actual!r}')

    def assert_in(substr, fullstr, name):
        nonlocal passed_tests, total_tests
        total_tests += 1
        if substr in fullstr:
            passed_tests += 1
            print(f'  [PASS] {name}')
        else:
            print(f'  [FAIL] {name}: Expected {substr!r} in {fullstr!r}')

    # 1. Python Valid Function
    req1 = CodeRunRequest(
        code='def solve(n):\n    return " Even\ if int(n) % 2 == 0 else \Odd\',
 language='python',
 test_cases=[
 TestCaseItem(id=1, input='4', expectedOutput='Even', isHidden=False),
 TestCaseItem(id=2, input='7', expectedOutput='Odd', isHidden=False),
 TestCaseItem(id=3, input='10', expectedOutput='Even', isHidden=True),
 ]
 )
 res1 = run_code_sandbox(req1)
 assert_eq(res1['status'], 'ACCEPTED', '1.1 Python valid function meets all public & hidden test cases')
 assert_eq(res1['passed_count'], 3, '1.1 Passed count is 3/3')

 # 2. Python Class Solution
 req2 = CodeRunRequest(
 code='class Solution:\n def solve(self, n):\n return int(n) * 2',
 language='python',
 test_cases=[
 TestCaseItem(id=1, input='5', expectedOutput='10', isHidden=False),
 TestCaseItem(id=2, input='0', expectedOutput='0', isHidden=False),
 ]
 )
 res2 = run_code_sandbox(req2)
 assert_eq(res2['status'], 'ACCEPTED', '1.2 Python class Solution structure evaluated')
 assert_eq(res2['passed_count'], 2, '1.2 Passed count 2/2')

 # 3. Python Syntax Error
 req3 = CodeRunRequest(
 code='def solve(n)\n return n * 2', # missing colon
 language='python',
 test_cases=[TestCaseItem(id=1, input='5', expectedOutput='10')]
 )
 res3 = run_code_sandbox(req3)
 assert_eq(res3['status'], 'RUNTIME_ERROR', '1.3 Python syntax error handled without crash')
 assert_eq(res3['passed_count'], 0, '1.3 Syntax error passes 0 cases')

 # 4. Python Infinite Loop / Timeout
 t0 = time.time()
 req4 = CodeRunRequest(
 code='def solve(n):\n while True:\n pass\n return n',
 language='python',
 test_cases=[TestCaseItem(id=1, input='5', expectedOutput='5')]
 )
 res4 = run_code_sandbox(req4)
 elapsed = time.time() - t0
 assert_eq(res4['status'], 'TIME_LIMIT_EXCEEDED', '1.4 Python infinite loop caught with TIME_LIMIT_EXCEEDED')
 assert_eq(res4['passed_count'], 0, '1.4 Infinite loop passes 0 cases')

 # 5. Python Runtime Exception (Division by Zero)
 req5 = CodeRunRequest(
 code='def solve(n):\n return 1 / 0',
 language='python',
 test_cases=[TestCaseItem(id=1, input='5', expectedOutput='5')]
 )
 res5 = run_code_sandbox(req5)
 assert_eq(res5['status'], 'RUNTIME_ERROR', '1.5 Python ZeroDivisionError caught')
 assert_eq(res5['passed_count'], 0, '1.5 Runtime exception passes 0 cases')

 # 6. Python Empty / Whitespace Code
 req6 = CodeRunRequest(
 code=' \n\t ',
 language='python',
 test_cases=[TestCaseItem(id=1, input='5', expectedOutput='5')]
 )
 res6 = run_code_sandbox(req6)
 assert_eq(res6['status'], 'COMPILATION_ERROR', '1.6 Empty code returns COMPILATION_ERROR')

 # 7. JavaScript Valid Function
 req7 = CodeRunRequest(
 code='function solve(n) { return Number(n) % 2 === 0 ? \Even\ : \Odd\; }',
 language='javascript',
 test_cases=[
 TestCaseItem(id=1, input='4', expectedOutput='Even'),
 TestCaseItem(id=2, input='9', expectedOutput='Odd'),
 ]
 )
 res7 = run_code_sandbox(req7)
 assert_eq(res7['status'], 'ACCEPTED', '1.7 JavaScript function executes via Node.js')
 assert_eq(res7['passed_count'], 2, '1.7 Passed count 2/2')

 # 8. JavaScript Syntax Error
 req8 = CodeRunRequest(
 code='function solve(n) { return Number(n) % 2 === 0 ? \Even\ : ; }',
 language='javascript',
 test_cases=[TestCaseItem(id=1, input='4', expectedOutput='Even')]
 )
 res8 = run_code_sandbox(req8)
 assert_eq(res8['status'], 'RUNTIME_ERROR', '1.8 JavaScript syntax error caught')

 # 9. JavaScript Infinite Loop / Timeout
 req9 = CodeRunRequest(
 code='function solve(n) { while(true) {} return n; }',
 language='javascript',
 test_cases=[TestCaseItem(id=1, input='4', expectedOutput='4')]
 )
 res9 = run_code_sandbox(req9)
 assert_eq(res9['status'], 'TIME_LIMIT_EXCEEDED', '1.9 JavaScript infinite loop caught')

 # 10. Java Valid Code
 req10 = CodeRunRequest(
 code='class Solution {\n public String solve(int n) {\n return n % 2 == 0 ? \Even\ : \Odd\;\n }\n}',
 language='java',
 test_cases=[
 TestCaseItem(id=1, input='6', expectedOutput='Even'),
 TestCaseItem(id=2, input='11', expectedOutput='Odd'),
 ]
 )
 res10 = run_code_sandbox(req10)
 assert_eq(res10['status'], 'ACCEPTED', '1.10 Java code compiled and executed with javac/java')
 assert_eq(res10['passed_count'], 2, '1.10 Java passes 2/2')

 # 11. Java Compilation Error (Syntax Error)
 req11 = CodeRunRequest(
 code='class Solution {\n public String solve(int n) {\n return n % 2 == 0 ? \Even\ : \n }\n}',
 language='java',
 test_cases=[TestCaseItem(id=1, input='6', expectedOutput='Even')]
 )
 res11 = run_code_sandbox(req11)
 assert_eq(res11['status'], 'COMPILATION_ERROR', '1.11 Java syntax error triggers COMPILATION_ERROR')

 # 12. Java Infinite Loop
 req12 = CodeRunRequest(
 code='class Solution {\n public int solve(int n) {\n while(true) {}\n }\n}',
 language='java',
 test_cases=[TestCaseItem(id=1, input='6', expectedOutput='6')]
 )
 res12 = run_code_sandbox(req12)
 assert_eq(res12['status'], 'TIME_LIMIT_EXCEEDED', '1.12 Java infinite loop triggers TIME_LIMIT_EXCEEDED')

 # 13. C++ Unmatched Braces
 req13 = CodeRunRequest(
 code='#include <iostream>\nusing namespace std;\nint main() {\n cout << 0;\n',
 language='cpp',
 test_cases=[TestCaseItem(id=1, input='4', expectedOutput='4')]
 )
 res13 = run_code_sandbox(req13)
 assert_eq(res13['status'], 'COMPILATION_ERROR', '1.13 C++ unmatched brace triggers COMPILATION_ERROR')

 print(f'=== Code Runner Adversarial Results: {passed_tests}/{total_tests} PASSED ===')
 return passed_tests == total_tests

if __name__ == '__main__':
 ok = run_tests()
 sys.exit(0 if ok else 1)
