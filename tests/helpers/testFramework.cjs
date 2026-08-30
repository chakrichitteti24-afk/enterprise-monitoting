/**
 * GKCE E2E Test Framework — Lightweight, Zero-Dependency Test Engine
 * Provides BDD-style describe/it/expect assertions, async test runner,
 * tier statistics aggregation, and formatted terminal output.
 */

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
};

class AssertionError extends Error {
  constructor(message, actual, expected) {
    super(message);
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
  }
}

function expect(actual) {
  const matchers = {
    toBe(expected, msg = '') {
      if (actual !== expected) {
        throw new AssertionError(
          `${msg} Expected ${JSON.stringify(expected)} (type: ${typeof expected}), got ${JSON.stringify(actual)} (type: ${typeof actual})`,
          actual,
          expected
        );
      }
    },
    toEqual(expected, msg = '') {
      const actualStr = JSON.stringify(actual);
      const expectedStr = JSON.stringify(expected);
      if (actualStr !== expectedStr) {
        throw new AssertionError(
          `${msg} Expected deep equality: expected ${expectedStr}, got ${actualStr}`,
          actual,
          expected
        );
      }
    },
    toBeGreaterThan(expected, msg = '') {
      if (!(actual > expected)) {
        throw new AssertionError(
          `${msg} Expected ${actual} to be greater than ${expected}`,
          actual,
          expected
        );
      }
    },
    toBeGreaterThanOrEqual(expected, msg = '') {
      if (!(actual >= expected)) {
        throw new AssertionError(
          `${msg} Expected ${actual} to be greater than or equal to ${expected}`,
          actual,
          expected
        );
      }
    },
    toBeLessThan(expected, msg = '') {
      if (!(actual < expected)) {
        throw new AssertionError(
          `${msg} Expected ${actual} to be less than ${expected}`,
          actual,
          expected
        );
      }
    },
    toBeLessThanOrEqual(expected, msg = '') {
      if (!(actual <= expected)) {
        throw new AssertionError(
          `${msg} Expected ${actual} to be less than or equal to ${expected}`,
          actual,
          expected
        );
      }
    },
    toBeCloseTo(expected, precision = 1, msg = '') {
      const diff = Math.abs(actual - expected);
      const threshold = Math.pow(10, -precision) / 2;
      if (diff > threshold) {
        throw new AssertionError(
          `${msg} Expected ${actual} to be close to ${expected} (within precision ${precision})`,
          actual,
          expected
        );
      }
    },
    toBeTruthy(msg = '') {
      if (!actual) {
        throw new AssertionError(
          `${msg} Expected ${actual} to be truthy`,
          actual,
          true
        );
      }
    },
    toBeFalsy(msg = '') {
      if (actual) {
        throw new AssertionError(
          `${msg} Expected ${actual} to be falsy`,
          actual,
          false
        );
      }
    },
    toBeNull(msg = '') {
      if (actual !== null) {
        throw new AssertionError(
          `${msg} Expected null, got ${actual}`,
          actual,
          null
        );
      }
    },
    toBeDefined(msg = '') {
      if (actual === undefined) {
        throw new AssertionError(
          `${msg} Expected defined value, got undefined`,
          actual,
          'defined'
        );
      }
    },
    toBeUndefined(msg = '') {
      if (actual !== undefined) {
        throw new AssertionError(
          `${msg} Expected undefined, got ${actual}`,
          actual,
          undefined
        );
      }
    },
    toContain(item, msg = '') {
      if (typeof actual === 'string') {
        if (!actual.includes(item)) {
          throw new AssertionError(
            `${msg} Expected string to contain "${item}", but got "${actual}"`,
            actual,
            item
          );
        }
      } else if (Array.isArray(actual)) {
        if (!actual.includes(item)) {
          throw new AssertionError(
            `${msg} Expected array to contain ${JSON.stringify(item)}`,
            actual,
            item
          );
        }
      } else {
        throw new AssertionError(
          `${msg} toContain expected string or array, got ${typeof actual}`,
          actual,
          item
        );
      }
    },
    toThrow(expectedErrorPattern, msg = '') {
      if (typeof actual !== 'function') {
        throw new AssertionError('toThrow requires a function', actual, 'function');
      }
      let threw = false;
      let thrownError = null;
      try {
        actual();
      } catch (err) {
        threw = true;
        thrownError = err;
      }
      if (!threw) {
        throw new AssertionError(`${msg} Expected function to throw an error, but it did not`);
      }
      if (expectedErrorPattern) {
        const errorMsg = thrownError ? (thrownError.message || String(thrownError)) : '';
        if (typeof expectedErrorPattern === 'string' && !errorMsg.includes(expectedErrorPattern)) {
          throw new AssertionError(
            `${msg} Expected error message to include "${expectedErrorPattern}", got "${errorMsg}"`
          );
        } else if (expectedErrorPattern instanceof RegExp && !expectedErrorPattern.test(errorMsg)) {
          throw new AssertionError(
            `${msg} Expected error message to match ${expectedErrorPattern}, got "${errorMsg}"`
          );
        }
      }
    },
    async toReject(expectedErrorPattern, msg = '') {
      let rejected = false;
      let rejectionError = null;
      try {
        if (typeof actual === 'function') {
          await actual();
        } else {
          await actual;
        }
      } catch (err) {
        rejected = true;
        rejectionError = err;
      }
      if (!rejected) {
        throw new AssertionError(`${msg} Expected promise to reject, but it resolved`);
      }
      if (expectedErrorPattern) {
        const errorMsg = rejectionError ? (rejectionError.message || String(rejectionError)) : '';
        if (typeof expectedErrorPattern === 'string' && !errorMsg.includes(expectedErrorPattern)) {
          throw new AssertionError(
            `${msg} Expected rejection message to include "${expectedErrorPattern}", got "${errorMsg}"`
          );
        } else if (expectedErrorPattern instanceof RegExp && !expectedErrorPattern.test(errorMsg)) {
          throw new AssertionError(
            `${msg} Expected rejection message to match ${expectedErrorPattern}, got "${errorMsg}"`
          );
        }
      }
    }
  };

  matchers.not = {
    toBe(expected, msg = '') {
      if (actual === expected) {
        throw new AssertionError(`${msg} Expected value NOT to be ${JSON.stringify(expected)}`, actual, expected);
      }
    },
    toEqual(expected, msg = '') {
      if (JSON.stringify(actual) === JSON.stringify(expected)) {
        throw new AssertionError(`${msg} Expected value NOT to equal ${JSON.stringify(expected)}`, actual, expected);
      }
    },
    toThrow(expectedErrorPattern, msg = '') {
      if (typeof actual !== 'function') {
        throw new AssertionError('toThrow requires a function', actual, 'function');
      }
      let threw = false;
      let thrownError = null;
      try {
        actual();
      } catch (err) {
        threw = true;
        thrownError = err;
      }
      if (threw) {
        throw new AssertionError(`${msg} Expected function NOT to throw an error, but it threw: ${thrownError?.message}`);
      }
    },
  };

  return matchers;
}

class TestSuite {
  constructor(name, tier = 1) {
    this.name = name;
    this.tier = tier;
    this.groups = [];
    this.currentGroup = null;
  }

  describe(description, fn) {
    const group = {
      description,
      tests: [],
      beforeEach: [],
      afterEach: [],
    };
    this.groups.push(group);
    this.currentGroup = group;
    fn();
    this.currentGroup = null;
  }

  beforeEach(fn) {
    if (this.currentGroup) {
      this.currentGroup.beforeEach.push(fn);
    }
  }

  afterEach(fn) {
    if (this.currentGroup) {
      this.currentGroup.afterEach.push(fn);
    }
  }

  it(description, fn) {
    if (!this.currentGroup) {
      this.describe('Default', () => {});
    }
    this.currentGroup.tests.push({
      description,
      fn,
    });
  }

  async run(verbose = true) {
    let passed = 0;
    let failed = 0;
    const failures = [];
    const startTime = Date.now();

    if (verbose) {
      console.log(`\n${ANSI.bold}${ANSI.cyan}========================================================================${ANSI.reset}`);
      console.log(`${ANSI.bold}${ANSI.cyan}▶ RUNNING SUITE: ${this.name} (Tier ${this.tier})${ANSI.reset}`);
      console.log(`${ANSI.bold}${ANSI.cyan}========================================================================${ANSI.reset}`);
    }

    for (const group of this.groups) {
      if (verbose) {
        console.log(`\n  ${ANSI.bold}${ANSI.yellow}● ${group.description}${ANSI.reset}`);
      }

      for (const test of group.tests) {
        const testStartTime = Date.now();
        try {
          for (const hook of group.beforeEach) {
            await hook();
          }

          await test.fn();

          for (const hook of group.afterEach) {
            await hook();
          }

          const duration = Date.now() - testStartTime;
          passed++;
          if (verbose) {
            console.log(`    ${ANSI.green}✓${ANSI.reset} ${ANSI.white}${test.description}${ANSI.reset} ${ANSI.gray}(${duration}ms)${ANSI.reset}`);
          }
        } catch (err) {
          const duration = Date.now() - testStartTime;
          failed++;
          failures.push({
            group: group.description,
            test: test.description,
            error: err,
            duration,
          });
          if (verbose) {
            console.log(`    ${ANSI.red}✗ ${test.description}${ANSI.reset} ${ANSI.gray}(${duration}ms)${ANSI.reset}`);
            console.log(`      ${ANSI.red}Error: ${err.message}${ANSI.reset}`);
            if (err.stack) {
              const stackLines = err.stack.split('\n').slice(1, 4).join('\n      ');
              console.log(`      ${ANSI.gray}${stackLines}${ANSI.reset}`);
            }
          }
        }
      }
    }

    const totalDuration = Date.now() - startTime;
    return {
      name: this.name,
      tier: this.tier,
      total: passed + failed,
      passed,
      failed,
      failures,
      duration: totalDuration,
    };
  }
}

module.exports = {
  expect,
  TestSuite,
  ANSI,
};
