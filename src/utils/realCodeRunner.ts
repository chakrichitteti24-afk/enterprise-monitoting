import { runCodeApi } from '../lib/api';

export interface TestCaseInput {
  id?: number;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface ExecutionResult {
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'COMPILATION_ERROR' | 'RUNTIME_ERROR' | 'TIME_LIMIT_EXCEEDED';
  passedCount: number;
  totalCount: number;
  executionTimeMs: number;
  testResults: Array<{
    id: number;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    executionTimeMs: number;
    status: string;
  }>;
  output?: string;
  logs: string;
  error?: string;
}

const LANGUAGE_MAP = {
  java: { language: 'java', version: '15.0.2', file: 'Main.java' },
  cpp: { language: 'c++', version: '10.2.0', file: 'main.cpp' },
  python: { language: 'python', version: '3.10.0', file: 'main.py' },
  javascript: { language: 'javascript', version: '18.15.0', file: 'main.js' },
};

/**
 * Real Code Execution Sandbox using Piston API
 */
export async function executeRealCode(
  code: string,
  language: 'java' | 'cpp' | 'python' | 'javascript',
  testCases: TestCaseInput[],
  entryPoint: string = 'solve'
): Promise<ExecutionResult> {
  const cleanCode = code.trim();
  const startTime = Date.now();

  if (!cleanCode || cleanCode.length < 5) {
    return {
      status: 'COMPILATION_ERROR',
      passedCount: 0,
      totalCount: testCases.length,
      executionTimeMs: 0,
      testResults: testCases.map((tc, idx) => ({
        id: idx + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: 'No code provided',
        passed: false,
        executionTimeMs: 0,
        status: 'COMPILATION_ERROR',
      })),
      logs: `[Compilation Error] Source code is empty or missing.\n\nDiagnostic: Please implement your logic before running test cases.`,
      error: 'Empty code body',
    };
  }

  try {
    const backendRes = await runCodeApi({
      code: cleanCode,
      language,
      test_cases: testCases,
      entry_point: entryPoint,
    });

    if (backendRes && Array.isArray(backendRes.test_results)) {
      const results = backendRes.test_results.map((tr: any, idx: number) => ({
        id: tr.id || idx + 1,
        input: tr.input,
        expectedOutput: tr.expected_output || tr.expectedOutput || testCases[idx]?.expectedOutput || '',
        actualOutput: tr.actual_output || tr.actualOutput || '',
        passed: !!tr.passed,
        executionTimeMs: tr.execution_time_ms || 15,
        status: tr.status || (tr.passed ? 'ACCEPTED' : 'WRONG_ANSWER'),
      }));

      const passedCount = backendRes.passed_count ?? results.filter((r: any) => r.passed).length;
      const isAccepted = passedCount === testCases.length && (backendRes.status === 'ACCEPTED' || !backendRes.status);
      const isCompError = backendRes.status === 'COMPILATION_ERROR';

      const logs = isCompError
        ? `[Compilation Error] Failed to compile Solution.${language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : 'js'}\n\nDiagnostic: ${backendRes.error || results[0]?.actualOutput || 'Compilation failed'}`
        : `> Compiling Solution.${language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : 'js'} with GKCE Cloud Execution Sandbox... [SUCCESS]\n` +
          `> Automated Test Suite Evaluation:\n\n` +
          results
            .map(
              (tr: any, i: number) =>
                `[Test Case ${i + 1}] Input: ${tr.input.replace(/\n/g, ' ')}\n` +
                `              Expected: ${tr.expectedOutput} | Actual: ${tr.actualOutput} -> ${
                  tr.passed ? 'PASSED ' : 'FAILED '
                } (${tr.executionTimeMs}ms)`
            )
            .join('\n\n') +
          `\n\n${
            isAccepted
              ? ` All ${results.length}/${results.length} Test Cases Passed! Status: ACCEPTED`
              : ` ${passedCount}/${results.length} Test Cases Passed. Status: ${backendRes.status || 'WRONG ANSWER'}`
          }`;

      return {
        status: (backendRes.status || (isAccepted ? 'ACCEPTED' : 'WRONG_ANSWER')) as 'ACCEPTED' | 'WRONG_ANSWER' | 'COMPILATION_ERROR' | 'RUNTIME_ERROR' | 'TIME_LIMIT_EXCEEDED',
        passedCount,
        totalCount: testCases.length,
        executionTimeMs: backendRes.execution_time_ms || Date.now() - startTime,
        testResults: results,
        output: backendRes.output || results[0]?.actualOutput || '',
        logs,
        error: backendRes.error,
      };
    }
  } catch (err: any) {
    console.warn('[executeRealCode] Backend runner call deferred, using local evaluation:', err);
  }

  // Check for simulated syntax error markers
  if (cleanCode.includes('SYNTAX_ERROR') || cleanCode.includes(';;;') || cleanCode.includes('###ERROR###')) {
    return {
      status: 'COMPILATION_ERROR',
      passedCount: 0,
      totalCount: testCases.length,
      executionTimeMs: 10,
      testResults: testCases.map((tc, idx) => ({
        id: tc.id || idx + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput || '',
        actualOutput: 'SyntaxError: Unexpected token / syntax error in source',
        passed: false,
        executionTimeMs: 10,
        status: 'COMPILATION_ERROR',
      })),
      logs: `[Compilation Error] Syntax error detected in source code.\n\nDiagnostic: Please review syntax, brackets, and semicolons.`,
      error: 'SyntaxError: Parsing failed',
    };
  }

  // Fallback local evaluation if backend runner is unreachable
  const isUntouched =
    cleanCode.includes('TODO: Implement') ||
    (cleanCode.includes('TODO: Read input from sc') && (cleanCode.includes('System.out.println(0);') || !cleanCode.includes('sc.next'))) ||
    (cleanCode.includes('TODO: Read input from cin') && (cleanCode.includes('cout << 0 << endl;') || !cleanCode.includes('cin >>'))) ||
    (cleanCode.includes('TODO: Read input from sys.stdin') && cleanCode.includes('print(0)') && (cleanCode.match(/print\s*\(/g) || []).length <= 1);

  if (isUntouched) {
    return {
      status: 'WRONG_ANSWER',
      passedCount: 0,
      totalCount: testCases.length,
      executionTimeMs: 10,
      testResults: testCases.map((tc, idx) => ({
        id: tc.id || idx + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput || '',
        actualOutput: 'Untouched starter template',
        passed: false,
        executionTimeMs: 10,
        status: 'WRONG_ANSWER',
      })),
      logs: `[Evaluation Incomplete] Untouched starter template.\n\nDiagnostic: Please implement your algorithm logic before submitting.`,
      error: 'Untouched starter template',
    };
  }

  // Real JS Execution fallback
  if (language === 'javascript') {
    try {
      const results = testCases.map((tc, idx) => {
        let output = '';
        const originalLog = console.log;
        try {
          console.log = (...args: any[]) => {
            output += args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ') + '\n';
          };
          const runner = new Function(
            'input',
            `
            const fs = {
              readFileSync: function() { return input; },
              readFileSyncUtf8: function() { return input; }
            };
            const require = function(m) {
              if (m === 'fs') return fs;
              return {};
            };
            ${cleanCode}
            if (typeof solve === 'function') {
              const res = solve(input);
              if (res !== undefined) return res;
            } else if (typeof main === 'function') {
              const res = main(input);
              if (res !== undefined) return res;
            }
          `
          );
          const ret = runner(tc.input);
          if (ret !== undefined && !output) {
            output = typeof ret === 'object' ? JSON.stringify(ret) : String(ret);
          }
        } finally {
          console.log = originalLog;
        }
        const actualClean = output.trim();
        const expectedClean = tc.expectedOutput.trim();
        const passed =
          actualClean === expectedClean ||
          (!isNaN(Number(actualClean)) &&
            !isNaN(Number(expectedClean)) &&
            Math.abs(Number(actualClean) - Number(expectedClean)) < 1e-5) ||
          actualClean.toLowerCase() === expectedClean.toLowerCase();
        return {
          id: tc.id || idx + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: actualClean || '(no output)',
          passed,
          executionTimeMs: 10,
          status: passed ? 'ACCEPTED' : 'WRONG_ANSWER',
        };
      });
      const passedCount = results.filter(r => r.passed).length;
      const isAccepted = passedCount === testCases.length;
      return {
        status: isAccepted ? 'ACCEPTED' : 'WRONG_ANSWER',
        passedCount,
        totalCount: testCases.length,
        executionTimeMs: Date.now() - startTime,
        testResults: results,
        logs: `> Execution evaluated with JS precision runner (${passedCount}/${testCases.length} Test Cases Passed)`,
      };
    } catch (err: any) {
      return {
        status: 'COMPILATION_ERROR',
        passedCount: 0,
        totalCount: testCases.length,
        executionTimeMs: 10,
        testResults: testCases.map((tc, idx) => ({
          id: tc.id || idx + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: String(err?.message || err),
          passed: false,
          executionTimeMs: 10,
          status: 'COMPILATION_ERROR',
        })),
        logs: `[Compilation Error] ${err?.message || err}`,
        error: String(err?.message || err),
      };
    }
  }

  // Bug #4 fix: Never fake-pass submissions when the backend is unreachable.
  // Return a clear error so students know execution failed rather than
  // silently awarding ACCEPTED for wrong/unexecuted code.
  return {
    status: 'RUNTIME_ERROR',
    passedCount: 0,
    totalCount: testCases.length,
    executionTimeMs: Date.now() - startTime,
    testResults: testCases.map((tc, idx) => ({
      id: tc.id || idx + 1,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: 'Execution backend unavailable. Please try again in a moment.',
      passed: false,
      executionTimeMs: 0,
      status: 'RUNTIME_ERROR',
    })),
    logs:
      `[Execution Backend Unavailable]\n\n` +
      `The GKCE Cloud Execution Sandbox could not be reached.\n` +
      `This usually happens during a cold start (Render spins down after inactivity).\n\n` +
      `Please wait 20–30 seconds and click Run / Submit again.\n` +
      `If the problem persists, contact the system administrator.`,
    error: 'Execution backend unavailable',
  };
}
