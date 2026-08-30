/**
 * Master E2E Test Runner for GKCE Dynamic Monitoring & Curriculum System
 *
 * Executes all 4 Test Tiers:
 * - Tier 1: Feature Coverage (≥50 test cases)
 * - Tier 2: Boundary & Corner Cases (≥50 test cases)
 * - Tier 3: Cross-Feature Combinations (≥15 test cases)
 * - Tier 4: Real-World Application Scenarios (≥8 workflows)
 *
 * Usage: node tests/run_e2e_tests.cjs
 */

const { ANSI } = require('./helpers/testFramework.cjs');
const tier1Suite = require('./tier1_feature_coverage.test.cjs');
const tier2Suite = require('./tier2_boundary_cases.test.cjs');
const tier3Suite = require('./tier3_cross_feature.test.cjs');
const tier4Suite = require('./tier4_real_world_scenarios.test.cjs');
const tier5Suite = require('./adversarial_stress_harness.cjs');

const THRESHOLDS = {
  tier1: 50,
  tier2: 50,
  tier3: 15,
  tier4: 8,
  tier5: 20,
  total: 143,
};

async function main() {
  const overallStartTime = Date.now();

  console.log(`\n${ANSI.bold}${ANSI.magenta}╔══════════════════════════════════════════════════════════════════════════╗${ANSI.reset}`);
  console.log(`${ANSI.bold}${ANSI.magenta}║        GKCE ENTERPRISE MONITORING SYSTEM — AUTOMATED E2E TEST RUNNER     ║${ANSI.reset}`);
  console.log(`${ANSI.bold}${ANSI.magenta}╚══════════════════════════════════════════════════════════════════════════╝${ANSI.reset}\n`);

  const results = [];

  // Run Tier 1
  const t1Res = await tier1Suite.run(true);
  results.push(t1Res);

  // Run Tier 2
  const t2Res = await tier2Suite.run(true);
  results.push(t2Res);

  // Run Tier 3
  const t3Res = await tier3Suite.run(true);
  results.push(t3Res);

  // Run Tier 4
  const t4Res = await tier4Suite.run(true);
  results.push(t4Res);

  // Run Tier 5 (Adversarial Hardening)
  const t5Res = await tier5Suite.run(true);
  results.push(t5Res);

  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);
  const totalTests = results.reduce((sum, r) => sum + r.total, 0);
  const overallDuration = Date.now() - overallStartTime;

  console.log(`\n\n${ANSI.bold}${ANSI.cyan}══════════════════════════════════════════════════════════════════════════${ANSI.reset}`);
  console.log(`${ANSI.bold}${ANSI.cyan}                      E2E TEST EXECUTION SUMMARY                          ${ANSI.reset}`);
  console.log(`${ANSI.bold}${ANSI.cyan}══════════════════════════════════════════════════════════════════════════${ANSI.reset}\n`);

  console.log(`${ANSI.bold}┌──────────────────────────────────────────────────────────┬──────────┬──────────┬────────┬──────────┐${ANSI.reset}`);
  console.log(`${ANSI.bold}│ Test Tier Name                                           │ Required │ Executed │ Passed │ Status   │${ANSI.reset}`);
  console.log(`${ANSI.bold}├──────────────────────────────────────────────────────────┼──────────┼──────────┼────────┼──────────┤${ANSI.reset}`);

  const tierRequirements = [
    { key: 'tier1', label: 'Tier 1: Feature Coverage', res: t1Res, req: THRESHOLDS.tier1 },
    { key: 'tier2', label: 'Tier 2: Boundary & Corner Cases', res: t2Res, req: THRESHOLDS.tier2 },
    { key: 'tier3', label: 'Tier 3: Cross-Feature Combinations', res: t3Res, req: THRESHOLDS.tier3 },
    { key: 'tier4', label: 'Tier 4: Real-World Scenarios', res: t4Res, req: THRESHOLDS.tier4 },
    { key: 'tier5', label: 'Tier 5: Adversarial Stress Hardening', res: t5Res, req: THRESHOLDS.tier5 },
  ];

  let allThresholdsMet = true;

  for (const tier of tierRequirements) {
    const passedCount = tier.res.passed;
    const totalCount = tier.res.total;
    const isPassing = tier.res.failed === 0 && totalCount >= tier.req;
    if (!isPassing) allThresholdsMet = false;

    const statusBadge = isPassing
      ? `${ANSI.green}✓ PASS${ANSI.reset}  `
      : `${ANSI.red}✗ FAIL${ANSI.reset}  `;

    const labelPadded = tier.label.padEnd(56);
    const reqPadded = `≥${tier.req}`.padStart(8);
    const execPadded = `${totalCount}`.padStart(8);
    const passedPadded = `${passedCount}`.padStart(6);

    console.log(`│ ${labelPadded} │ ${reqPadded} │ ${execPadded} │ ${passedPadded} │ ${statusBadge} │`);
  }

  console.log(`${ANSI.bold}├──────────────────────────────────────────────────────────┼──────────┼──────────┼────────┼──────────┤${ANSI.reset}`);

  const totalStatus = totalFailed === 0 && totalTests >= THRESHOLDS.total && allThresholdsMet
    ? `${ANSI.green}${ANSI.bold}✓ ALL PASS${ANSI.reset}`
    : `${ANSI.red}${ANSI.bold}✗ FAILED  ${ANSI.reset}`;

  const totalLabel = 'TOTAL TEST SUITE'.padEnd(56);
  const totalReq = `≥${THRESHOLDS.total}`.padStart(8);
  const totalExec = `${totalTests}`.padStart(8);
  const totalPass = `${totalPassed}`.padStart(6);

  console.log(`│ ${ANSI.bold}${totalLabel}${ANSI.reset} │ ${totalReq} │ ${totalExec} │ ${totalPass} │ ${totalStatus} │`);
  console.log(`${ANSI.bold}└──────────────────────────────────────────────────────────┴──────────┴──────────┴────────┴──────────┘${ANSI.reset}\n`);

  console.log(`${ANSI.bold}Execution Time:${ANSI.reset} ${overallDuration}ms`);
  console.log(`${ANSI.bold}Pass Rate:${ANSI.reset} ${((totalPassed / Math.max(1, totalTests)) * 100).toFixed(1)}%`);

  if (totalFailed > 0) {
    console.log(`\n${ANSI.bold}${ANSI.red}FAILURE DETAILS (${totalFailed} failures):${ANSI.reset}`);
    for (const r of results) {
      for (const f of r.failures) {
        console.log(`  ${ANSI.red}● [Tier ${r.tier}] ${f.group} -> ${f.test}${ANSI.reset}`);
        console.log(`    Error: ${f.error.message}`);
      }
    }
    process.exit(1);
  }

  if (!allThresholdsMet) {
    console.log(`\n${ANSI.bold}${ANSI.red}ERROR: One or more test count thresholds not met.${ANSI.reset}`);
    process.exit(1);
  }

  console.log(`\n${ANSI.bold}${ANSI.green}✨ SUCCESS: All 5 Tiers Passed (100% Pass Rate). System is FULLY ADVERSARIALLY HARDENED & TEST_READY.${ANSI.reset}\n`);
  process.exit(0);
}

main().catch((err) => {
  console.error('\nFatal error running E2E test suite:', err);
  process.exit(1);
});
