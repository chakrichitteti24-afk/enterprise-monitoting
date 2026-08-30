/**
 * Mock API, Storage, and State Engine for E2E Testing Track
 * Provides full simulation of REST API endpoints, localStorage persistence,
 * real code runner evaluation sandbox, and multi-role operations.
 */

class MockLocalStorage {
  constructor(shouldThrow = false) {
    this.store = new Map();
    this.shouldThrow = shouldThrow;
  }

  getItem(key) {
    if (this.shouldThrow) throw new Error('SecurityError: localStorage is not accessible');
    return this.store.has(key) ? this.store.get(key) : null;
  }

  setItem(key, value) {
    if (this.shouldThrow) throw new Error('QuotaExceededError: storage limit reached');
    this.store.set(key, String(value));
  }

  removeItem(key) {
    if (this.shouldThrow) throw new Error('SecurityError: cannot remove item');
    this.store.delete(key);
  }

  clear() {
    if (this.shouldThrow) throw new Error('SecurityError: cannot clear storage');
    this.store.clear();
  }

  get length() {
    return this.store.size;
  }
}

class MockApiClient {
  constructor(options = {}) {
    this.storage = options.storage || new MockLocalStorage();
    this.tokenKey = 'gkce_access_token';
    this.isOnline = options.isOnline !== undefined ? options.isOnline : true;
    this.routes = new Map();
    this.requestLog = [];
    this.setupDefaultRoutes();
  }

  getStoredToken() {
    try {
      return this.storage.getItem(this.tokenKey);
    } catch {
      return null;
    }
  }

  setStoredToken(token) {
    try {
      this.storage.setItem(this.tokenKey, token);
    } catch (err) {
      console.warn('Failed to save access token in localStorage', err);
    }
  }

  clearStoredToken() {
    try {
      this.storage.removeItem(this.tokenKey);
    } catch (err) {
      console.warn('Failed to clear access token from localStorage', err);
    }
  }

  registerRoute(method, path, handler) {
    const key = `${method.toUpperCase()} ${path}`;
    this.routes.set(key, handler);
  }

  async request(endpoint, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const token = this.getStoredToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    this.requestLog.push({
      endpoint,
      method,
      headers,
      body: options.body ? JSON.parse(options.body) : null,
      timestamp: Date.now(),
    });

    if (!this.isOnline) {
      throw new Error('NetworkError: Failed to fetch (Server Offline)');
    }

    // Match registered route or dynamic path
    let handler = null;
    for (const [routeKey, routeHandler] of this.routes.entries()) {
      const [rMethod, rPath] = routeKey.split(' ');
      if (rMethod === method) {
        if (rPath === endpoint) {
          handler = routeHandler;
          break;
        }
        // Check parameterized routes (e.g. /dean/teams/:id, /student/exams/:id/submit)
        const regex = new RegExp('^' + rPath.replace(/:[a-zA-Z0-9_]+/g, '([^/]+)') + '$');
        const match = endpoint.match(regex);
        if (match) {
          handler = (body, params, reqHeaders) => routeHandler(body, match.slice(1), reqHeaders);
          break;
        }
      }
    }

    if (!handler) {
      // Default fallback
      return { status: 200, data: { ok: true } };
    }

    const parsedBody = options.body ? JSON.parse(options.body) : {};
    const res = await handler(parsedBody, [], headers);

    if (res.status === 401 && endpoint !== '/auth/login') {
      this.clearStoredToken();
    }

    if (res.status >= 400) {
      const errorMsg = res.data?.detail || `Request failed with status ${res.status}`;
      const err = new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      err.status = res.status;
      throw err;
    }

    return res.data;
  }

  setupDefaultRoutes() {
    // Auth Login
    this.registerRoute('POST', '/auth/login', (body) => {
      const { email, password } = body;
      if (email === 'dean@gkce.edu.in' && password === 'Dean@2026') {
        const token = 'gkce_jwt_dean_valid_token_2026';
        this.setStoredToken(token);
        return {
          status: 200,
          data: {
            access_token: token,
            token_type: 'bearer',
            user: { id: 1, name: 'Dr. K. Dean', email, role: 'DEAN' },
          },
        };
      }
      if (email === 'ksgayathri@gkce.edu.in' && password === 'Mentor@2026') {
        const token = 'gkce_jwt_mentor_valid_token_2026';
        this.setStoredToken(token);
        return {
          status: 200,
          data: {
            access_token: token,
            token_type: 'bearer',
            user: { id: 2, name: 'K.S.GAYATHRI', email, role: 'MENTOR', mentor_id: 1, team_id: 1, team_number: 'Team 01' },
          },
        };
      }
      if (email === 'student1@gkce.edu.in' && password === 'Student@2026') {
        const token = 'gkce_jwt_student_valid_token_2026';
        this.setStoredToken(token);
        return {
          status: 200,
          data: {
            access_token: token,
            token_type: 'bearer',
            user: { id: 101, name: 'A. Surya', email, role: 'STUDENT', student_id: 1, team_id: 1, team_number: 'Team 01', roll_number: '21GK1A0501' },
          },
        };
      }
      return {
        status: 401,
        data: { detail: 'Invalid email or password' },
      };
    });

    // Auth Me
    this.registerRoute('GET', '/auth/me', (_, __, headers) => {
      const authHeader = headers['Authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { status: 401, data: { detail: 'Not authenticated' } };
      }
      const token = authHeader.replace('Bearer ', '');
      if (token === 'gkce_jwt_dean_valid_token_2026') {
        return { status: 200, data: { id: 1, name: 'Dr. K. Dean', email: 'dean@gkce.edu.in', role: 'DEAN' } };
      }
      if (token === 'gkce_jwt_mentor_valid_token_2026') {
        return { status: 200, data: { id: 2, name: 'K.S.GAYATHRI', email: 'ksgayathri@gkce.edu.in', role: 'MENTOR', mentor_id: 1, team_id: 1 } };
      }
      if (token === 'gkce_jwt_student_valid_token_2026') {
        return { status: 200, data: { id: 101, name: 'A. Surya', email: 'student1@gkce.edu.in', role: 'STUDENT', student_id: 1, team_id: 1 } };
      }
      return { status: 401, data: { detail: 'Token expired or invalid' } };
    });

    // Dean Team Create
    this.registerRoute('POST', '/dean/teams', (body) => {
      if (!body.team_number || !body.name) {
        return { status: 400, data: { detail: 'team_number and name required' } };
      }
      return {
        status: 200,
        data: {
          id: Math.floor(Math.random() * 900) + 100,
          team_number: body.team_number,
          name: body.name,
          mentor_id: body.mentor_id || 1,
          mentor_name: body.mentor_name || 'Faculty Mentor',
        },
      };
    });

    // Dean Student Create
    this.registerRoute('POST', '/dean/students', (body) => {
      if (!body.name || !body.roll_number || !body.email) {
        return { status: 400, data: { detail: 'name, roll_number and email required' } };
      }
      return {
        status: 200,
        data: {
          id: Math.floor(Math.random() * 900) + 100,
          name: body.name,
          roll_number: body.roll_number,
          email: body.email,
          team_id: body.team_id || 1,
          team_number: body.team_number || 'Team 01',
          dsa_level: body.dsa_level || 'BEGINNER',
          status: body.status || 'ACTIVE',
        },
      };
    });

    // Code Runner
    this.registerRoute('POST', '/code/run', (body) => {
      const { code, language, test_cases } = body;
      const cleanCode = (code || '').trim();
      if (!cleanCode || cleanCode.length < 5) {
        return {
          status: 200,
          data: {
            status: 'COMPILATION_ERROR',
            passed_count: 0,
            total_count: test_cases.length,
            execution_time_ms: 0,
            test_results: test_cases.map((tc, idx) => ({
              id: tc.id || idx + 1,
              input: tc.input,
              expected_output: tc.expectedOutput || tc.output || '',
              actual_output: 'No code provided',
              passed: false,
              execution_time_ms: 0,
              status: 'COMPILATION_ERROR',
            })),
            error: 'Empty code body',
          },
        };
      }

      // Check for syntax errors simulation
      if (cleanCode.includes('SYNTAX_ERROR') || cleanCode.includes(';;;') || cleanCode.includes('###ERROR###')) {
        return {
          status: 200,
          data: {
            status: 'COMPILATION_ERROR',
            passed_count: 0,
            total_count: test_cases.length,
            execution_time_ms: 10,
            test_results: test_cases.map((tc, idx) => ({
              id: tc.id || idx + 1,
              input: tc.input,
              expected_output: tc.expectedOutput || tc.output || '',
              actual_output: 'SyntaxError: Unexpected token',
              passed: false,
              execution_time_ms: 10,
              status: 'COMPILATION_ERROR',
            })),
            error: 'SyntaxError: Parsing failed',
          },
        };
      }

      // Evaluation for partial/buggy code
      if (cleanCode === 'def solve(n): return "Even"' || cleanCode.includes('PARTIAL_FAIL')) {
        const testResults = test_cases.map((tc, idx) => {
          const expected = tc.expectedOutput || tc.output || '';
          const actual = 'Even';
          const passed = actual === expected;
          return {
            id: tc.id || idx + 1,
            input: tc.input,
            expected_output: expected,
            actual_output: actual,
            passed,
            execution_time_ms: 15,
            status: passed ? 'ACCEPTED' : 'WRONG_ANSWER',
          };
        });
        const passedCount = testResults.filter((r) => r.passed).length;
        return {
          status: 200,
          data: {
            status: passedCount === test_cases.length ? 'ACCEPTED' : 'WRONG_ANSWER',
            passed_count: passedCount,
            total_count: test_cases.length,
            execution_time_ms: 30,
            test_results: testResults,
          },
        };
      }

      // Full evaluation
      const isAccepted = cleanCode.includes('return') || cleanCode.includes('print') || cleanCode.includes('System.out') || cleanCode.includes('cout');
      const testResults = test_cases.map((tc, idx) => {
        const expected = tc.expectedOutput || tc.output || '';
        return {
          id: tc.id || idx + 1,
          input: tc.input,
          expected_output: expected,
          actual_output: isAccepted ? expected : 'No output',
          passed: isAccepted,
          execution_time_ms: 15 + idx * 2,
          status: isAccepted ? 'ACCEPTED' : 'WRONG_ANSWER',
        };
      });

      return {
        status: 200,
        data: {
          status: isAccepted ? 'ACCEPTED' : 'WRONG_ANSWER',
          passed_count: isAccepted ? test_cases.length : 0,
          total_count: test_cases.length,
          execution_time_ms: 45,
          test_results: testResults,
        },
      };
    });
  }
}

/**
 * Real Code Runner Execution Function matching src/utils/realCodeRunner.ts
 */
async function executeRealCode(code, language, testCases, entryPoint = 'solve', apiClient = null) {
  const cleanCode = (code || '').trim();
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
        expectedOutput: tc.expectedOutput || tc.output || '',
        actualOutput: 'No code provided',
        passed: false,
        executionTimeMs: 0,
        status: 'COMPILATION_ERROR',
      })),
      logs: `[Compilation Error] Source code is empty or missing.\n\nDiagnostic: Please implement your logic before running test cases.`,
      error: 'Empty code body',
    };
  }

  if (apiClient) {
    try {
      const backendRes = await apiClient.request('/code/run', {
        method: 'POST',
        body: JSON.stringify({
          code: cleanCode,
          language,
          test_cases: testCases,
          entry_point: entryPoint,
        }),
      });

      if (backendRes && Array.isArray(backendRes.test_results)) {
        const results = backendRes.test_results.map((tr, idx) => ({
          id: tr.id || idx + 1,
          input: tr.input,
          expectedOutput: tr.expected_output || tr.expectedOutput || testCases[idx]?.expectedOutput || '',
          actualOutput: tr.actual_output || tr.actualOutput || '',
          passed: !!tr.passed,
          executionTimeMs: tr.execution_time_ms || 15,
          status: tr.status || (tr.passed ? 'ACCEPTED' : 'WRONG_ANSWER'),
        }));

        const passedCount = backendRes.passed_count ?? results.filter((r) => r.passed).length;
        const isAccepted = passedCount === testCases.length;

        return {
          status: backendRes.status || (isAccepted ? 'ACCEPTED' : 'WRONG_ANSWER'),
          passedCount,
          totalCount: testCases.length,
          executionTimeMs: backendRes.execution_time_ms || Date.now() - startTime,
          testResults: results,
          logs: `> Evaluation completed: ${passedCount}/${testCases.length} Test Cases Passed`,
          error: backendRes.error,
        };
      }
    } catch (err) {
      // Fallback
    }
  }

  // Fallback local evaluator
  const isAccepted = cleanCode.length > 20 && (cleanCode.includes('return') || cleanCode.includes('print') || cleanCode.includes('System.out'));
  const results = testCases.map((tc, idx) => {
    const rawInput = (tc.input || '').trim();
    const expected = (tc.expectedOutput || tc.output || '').trim();
    return {
      id: idx + 1,
      input: rawInput,
      expectedOutput: expected,
      actualOutput: isAccepted ? expected : 'No output produced',
      passed: isAccepted,
      executionTimeMs: 12 + idx * 4,
      status: isAccepted ? 'ACCEPTED' : 'WRONG_ANSWER',
    };
  });

  const passedCount = results.filter((r) => r.passed).length;
  const isAcceptedOverall = passedCount === testCases.length;

  return {
    status: isAcceptedOverall ? 'ACCEPTED' : 'WRONG_ANSWER',
    passedCount,
    totalCount: testCases.length,
    executionTimeMs: Date.now() - startTime,
    testResults: results,
    logs: `> Execution evaluated with GKCE fallback runner (${passedCount}/${testCases.length} Test Cases Passed)`,
  };
}

module.exports = {
  MockLocalStorage,
  MockApiClient,
  executeRealCode,
};
