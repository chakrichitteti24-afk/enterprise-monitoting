# E2E Test Infra: GKCE Dynamic Monitoring & Curriculum System

## Test Philosophy
- Requirement-driven, opaque-box testing derived from `ORIGINAL_REQUEST.md`.
- Verifies system resilience under both online (database connected) and offline (network fallback) conditions.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial + Real-World Workload Testing.

## Feature Inventory
| # | Feature | Source (Requirement) | Tier 1 (Feature) | Tier 2 (Boundary) | Tier 3 (Pairwise) | Tier 4 (Scenario) |
|---|---------|----------------------|:----------------:|:-----------------:|:-----------------:|:-----------------:|
| 1 | API Client & Offline Fallback | R1 (Database Sync) | 5 | 5 | ✓ | ✓ |
| 2 | Silent Re-Auth & Session Restore | R1 (Auth & Hydration) | 5 | 5 | ✓ | ✓ |
| 3 | Dynamic Pending & Precision Metrics | R1 & R3 (Curriculum) | 5 | 5 | ✓ | ✓ |
| 4 | Dean Management Views & Workflows | R2 (Dean Views) | 5 | 5 | ✓ | ✓ |
| 5 | Mentor Verification Matrix (20×5) | R2 (Mentor Views) | 5 | 5 | ✓ | ✓ |
| 6 | Mentor Multi-Cohort & Exam Review | R2 (Mentor Views) | 5 | 5 | ✓ | ✓ |
| 7 | Student Forge IDE & Test Runner | R2 & R3 (IDE / Runner) | 5 | 5 | ✓ | ✓ |
| 8 | Student Exam Taking & Shuffled Papers | R2 (Student Views) | 5 | 5 | ✓ | ✓ |
| 9 | 100 DSA Problems & 11 Domains | R3 (100 DSA Problems) | 5 | 5 | ✓ | ✓ |
| 10 | Mock Artifacts & Prefix Consistency | R3 (Data Consistency) | 5 | 5 | ✓ | ✓ |

## Test Architecture
- **Test Runner**: Node/TS runner script (`tests/run_e2e_tests.cjs` / `npm test`) executing all tiers deterministically.
- **Pass/Fail Semantics**: All test suites must complete with exit code 0, 0 unhandled rejections, 100% assertions passing.
- **Coverage Tiers**:
  - **Tier 1 (Feature Coverage)**: 50+ unit/functional test cases covering each feature in isolation.
  - **Tier 2 (Boundary & Corner Cases)**: 50+ boundary tests covering 0 solved, 100 solved, negative values, empty arrays, offline network timeouts, invalid passwords, malformed code payloads.
  - **Tier 3 (Cross-Feature Combinations)**: 15+ pairwise integration tests verifying interactions (e.g. Student solves problem -> Mentor batch verifies -> Dean analytics reflect new metrics; Exam creation -> student take with shuffled paper -> mentor score review).
  - **Tier 4 (Real-World Application Scenarios)**: 8+ comprehensive end-to-end multi-role workflows simulating complete academic sessions.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Full Student Enrollment & Onboarding | Dean creates student -> Mentor views roster -> Student logs in & solves Day 1 | High |
| 2 | Mentor Daily 5 Batch Verification Flow | Student submits solutions -> Mentor uses batch "Verify 5" -> Student metrics update | High |
| 3 | Weekly Exam Creation, Anti-Cheating Taking, and Review | Dean creates exam -> Student takes with shuffled set -> Mentor reviews scorecards | High |
| 4 | Offline to Online Network Disconnection & Hydration | App disconnects -> optimistic updates succeed -> reconnects -> silent auth & rehydration | High |
| 5 | Curriculum 100 Completion & 1-Decimal Metric Precision | Student solves all 100 problems -> verifies 0 pending, 100.0% completion, all domains 100% | Medium |
| 6 | Forge IDE Multi-Language Execution & Grading | Python, JS, Java, C++ code execution against test cases with error capture | High |
| 7 | Multi-Cohort Dean Team Reassignment & Analytics | Dean reassigns team -> Mentor switches cohorts -> Analytics update with 1-decimal precision | High |
| 8 | GitHub Repository Submission & Profile Synchronization | Student updates GitHub link -> persistence verified -> Dean directory reflects URL | Medium |

## Coverage Thresholds
- Tier 1: ≥50 test cases (≥5 per feature)
- Tier 2: ≥50 test cases (boundary and error states)
- Tier 3: ≥15 cross-feature integration cases
- Tier 4: ≥8 end-to-end realistic application scenarios
- **Total Suite: ≥123 test cases**
