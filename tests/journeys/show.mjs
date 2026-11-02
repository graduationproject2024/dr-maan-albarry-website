// Print a journey log summary: node tests/journeys/show.mjs persona-a [persona-b ...]
import fs from 'node:fs';
for (const id of process.argv.slice(2)) {
  const f = `test-results/journeys/${id}.json`;
  if (!fs.existsSync(f)) { console.log(id, 'NO LOG'); continue; }
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  console.log(`== ${id} ${j.verdict} ${JSON.stringify(j.totals)}`);
  for (const s of j.steps) if (s.status !== 'PASS' || process.env.ALL) console.log(`  ${s.step} ${s.status} [${s.ms}ms] ${s.action.slice(0, 60)} :: ${s.actual}`);
  if (j.consoleErrors.length) console.log('  console:', j.consoleErrors.slice(0, 5));
  if (j.consoleWarnings.length) console.log('  warnings:', j.consoleWarnings.slice(0, 5));
  if (j.failedRequests.length) console.log('  failed:', j.failedRequests.slice(0, 5));
}
