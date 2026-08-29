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

  const results = [];
  let passedCount = 0;
  let hasCompilationError = false;
  let compilationLogs = '';

  const langConfig = LANGUAGE_MAP[language];

  // Execute test cases sequentially using Piston API
  for (let idx = 0; idx < testCases.length; idx++) {
    const tc = testCases[idx];
    const rawInput = tc.input.trim();
    const expected = tc.expectedOutput.trim();
    
    let actual = '';
    let passed = false;
    let tcStatus = 'WRONG_ANSWER';
    const tcStartTime = Date.now();

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: langConfig.language,
          version: langConfig.version,
          files: [{ name: langConfig.file, content: cleanCode }],
          stdin: rawInput,
          compile_timeout: 10000,
          run_timeout: 3000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.compile && data.compile.code !== 0) {
        hasCompilationError = true;
        compilationLogs = data.compile.output;
        break;
      }

      if (data.run.code !== 0) {
        actual = data.run.output || data.run.stderr || 'Runtime Error';
        tcStatus = 'RUNTIME_ERROR';
      } else {
        actual = (data.run.stdout || data.run.output || '').trim();
        passed = actual === expected;
        tcStatus = passed ? 'ACCEPTED' : 'WRONG_ANSWER';
        if (passed) passedCount++;
      }
    } catch (err: any) {
      actual = `Execution Engine Error: ${err.message}`;
      tcStatus = 'RUNTIME_ERROR';
    }

    results.push({
      id: idx + 1,
      input: rawInput,
      expectedOutput: expected,
      actualOutput: actual,
      passed,
      executionTimeMs: Date.now() - tcStartTime,
      status: tcStatus,
    });
  }

  const totalDuration = Date.now() - startTime;

  if (hasCompilationError) {
    return {
      status: 'COMPILATION_ERROR',
      passedCount: 0,
      totalCount: testCases.length,
      executionTimeMs: totalDuration,
      testResults: testCases.map((tc, idx) => ({
        id: idx + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: 'Compilation Failed',
        passed: false,
        executionTimeMs: 0,
        status: 'COMPILATION_ERROR',
      })),
      logs: `> Compiling Solution.${language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : 'js'} with Cloud Execution Sandbox... [FAILED]\n\n${compilationLogs}`,
      error: compilationLogs,
    };
  }

  const isAccepted = passedCount === testCases.length;

  const logs =
    `> Compiling Solution.${language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : 'js'} with Cloud Execution Sandbox... [SUCCESS]\n` +
    `> Automated Test Suite Evaluation:\n\n` +
    results
      .map(
        (tr, i) =>
          `[Test Case ${i + 1}] Input: ${tr.input.replace(/\\n/g, ' ')}\n` +
          `              Expected: ${tr.expectedOutput} | Actual: ${tr.actualOutput} -> ${
            tr.passed ? 'PASSED ' : 'FAILED '
          } (${tr.executionTimeMs}ms)`
      )
      .join('\n\n') +
    `\n\n${
      isAccepted
        ? ` All ${results.length}/${results.length} Test Cases Passed! Status: ACCEPTED`
        : ` ${passedCount}/${results.length} Test Cases Passed. Status: ${results[0]?.status || 'WRONG ANSWER'}`
    }`;

  return {
    status: isAccepted ? 'ACCEPTED' : (results.find(r => r.status === 'RUNTIME_ERROR') ? 'RUNTIME_ERROR' : 'WRONG_ANSWER'),
    passedCount,
    totalCount: testCases.length,
    executionTimeMs: totalDuration,
    testResults: results,
    logs,
  };
}
