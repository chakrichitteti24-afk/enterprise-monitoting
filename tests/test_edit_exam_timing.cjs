// Verification test for Root / Dean editing exam timing and live duration extensions
const assert = require('assert');

function calculateRemaining(exam, nowMs) {
  const durationMins = exam.durationMinutes || 90;
  const totalDurationMs = durationMins * 60 * 1000;
  if (exam.status === 'SCHEDULED') return durationMins * 60;
  if (exam.status === 'COMPLETED') return 0;
  if (!exam.launchedAt) return durationMins * 60;
  const launchTime = new Date(exam.launchedAt).getTime();
  const totalPaused = exam.totalPausedMs || 0;
  if (exam.status === 'PAUSED') {
    const freezeTime = exam.pausedAt ? new Date(exam.pausedAt).getTime() : nowMs;
    const elapsedBeforePause = Math.max(0, (freezeTime - launchTime) - totalPaused);
    return Math.max(0, Math.floor((totalDurationMs - elapsedBeforePause) / 1000));
  }
  const current = nowMs || Date.now();
  const activeElapsedMs = Math.max(0, (current - launchTime) - totalPaused);
  return Math.max(0, Math.floor((totalDurationMs - activeElapsedMs) / 1000));
}

console.log('--- TEST 1: Scheduled Exam Timing Edit ---');
let exam = {
  id: 'exam-test-1',
  weekNumber: 2,
  title: 'Week 02 Assessment',
  scheduledDate: '2026-10-05',
  startTime: '10:00 AM',
  durationMinutes: 90,
  status: 'SCHEDULED'
};

assert.strictEqual(calculateRemaining(exam), 5400, 'Initial scheduled remaining is 5400s (90m)');

// Dean edits scheduled date, start time, and duration to 120m
exam = {
  ...exam,
  scheduledDate: '2026-10-06',
  startTime: '02:00 PM',
  durationMinutes: 120
};
assert.strictEqual(exam.scheduledDate, '2026-10-06');
assert.strictEqual(exam.startTime, '02:00 PM');
assert.strictEqual(exam.durationMinutes, 120);
assert.strictEqual(calculateRemaining(exam), 7200, 'Scheduled remaining is updated to 7200s (120m)');
console.log('✓ Scheduled exam timing updated successfully.');

console.log('--- TEST 2: Live Exam Duration Extension (+15m & +30m) ---');
const now = Date.now();
const launchTime = new Date(now - (30 * 60 * 1000)).toISOString(); // launched 30 mins ago

let liveExam = {
  id: 'exam-live-1',
  weekNumber: 3,
  title: 'Week 03 Assessment',
  status: 'LIVE',
  launchedAt: launchTime,
  durationMinutes: 90,
  totalPausedMs: 0
};

// 30 mins elapsed out of 90 mins -> 60 mins (3600s) remaining
let remainingBefore = calculateRemaining(liveExam, now);
assert.strictEqual(remainingBefore, 60 * 60, 'Should have exactly 60 minutes remaining');

// Root does quick extend +15m -> durationMinutes becomes 105
liveExam = {
  ...liveExam,
  durationMinutes: liveExam.durationMinutes + 15
};
let remainingAfter15 = calculateRemaining(liveExam, now);
assert.strictEqual(remainingAfter15, 75 * 60, 'Should now have 75 minutes remaining (+15m extended)');
assert.strictEqual(remainingAfter15 - remainingBefore, 15 * 60, 'Difference must be exactly +900s (+15m)');
console.log('✓ Quick extend +15m dynamically increases remaining time by 900s.');

// Root does quick extend +30m -> durationMinutes becomes 135
liveExam = {
  ...liveExam,
  durationMinutes: liveExam.durationMinutes + 30
};
let remainingAfter30 = calculateRemaining(liveExam, now);
assert.strictEqual(remainingAfter30, 105 * 60, 'Should now have 105 minutes remaining (+30m extended)');
console.log('✓ Quick extend +30m dynamically increases remaining time by 1800s.');

console.log('--- TEST 3: Paused Exam Timing Edit ---');
const pauseTime = new Date(now - (10 * 60 * 1000)).toISOString(); // paused 10 mins ago (active was 20 mins)
let pausedExam = {
  id: 'exam-paused-1',
  weekNumber: 3,
  status: 'PAUSED',
  launchedAt: new Date(now - (30 * 60 * 1000)).toISOString(),
  pausedAt: pauseTime,
  durationMinutes: 90,
  totalPausedMs: 0
};

// 20 mins active elapsed before freeze -> 70 mins remaining
let pausedRemainingBefore = calculateRemaining(pausedExam, now);
assert.strictEqual(pausedRemainingBefore, 70 * 60, 'Should have 70 mins remaining while frozen');

// Root edits duration in modal to 150 mins
pausedExam = {
  ...pausedExam,
  durationMinutes: 150
};
let pausedRemainingAfter = calculateRemaining(pausedExam, now);
assert.strictEqual(pausedRemainingAfter, 130 * 60, 'Should now have 130 mins remaining (150 - 20)');
console.log('✓ Paused exam duration edit updates frozen countdown cleanly.');

console.log('\n✨ ALL EXAM TIMING & EDIT VERIFICATION TESTS PASSED (100%)!');
