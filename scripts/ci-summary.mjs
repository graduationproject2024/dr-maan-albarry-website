// Writes the test counts of a Playwright run (test-results/results.json) to the GitHub job summary and the console:
// passed / failed / flaky (failed once, passed on the single retry) / skipped, each failed and flaky test by name,
// and every skipped test with its reason. Exit code 1 when a test failed, or when a flaky test is present and
// --strict-flaky is given (the pre-release run), so an intermittent defect is reported instead of hidden by the retry.
import fs from 'node:fs';
const file = 'test-results/results.json';
if (!fs.existsSync(file)) { console.log('No test-results/results.json: the tests did not run.'); process.exit(1); }
const r = JSON.parse(fs.readFileSync(file, 'utf8'));
const rows = { passed: [], failed: [], flaky: [], skipped: [] };
const walk = (suite, trail) => {
  for (const s of suite.suites || []) walk(s, [...trail, s.title]);
  for (const spec of suite.specs || []) {
    for (const t of spec.tests) {
      const name = [...trail, spec.title].filter(Boolean).join(' › ');
      const reason = (t.annotations || []).filter((a) => a.type === 'skip' || a.type === 'fixme').map((a) => a.description).filter(Boolean).join('; ');
      if (t.status === 'skipped') rows.skipped.push(`${name}${reason ? ` — ${reason}` : ''}`);
      else if (t.status === 'flaky') rows.flaky.push(name);
      else if (t.status === 'unexpected') rows.failed.push(`${name} — ${String(t.results.at(-1)?.error?.message || '').replace(/\u001b\[[0-9;]*m/g, '').split('\n')[0].slice(0, 200)}`);
      else rows.passed.push(name);
    }
  }
};
walk(r, []);
const sha = process.env.GITHUB_SHA || 'local';
const out = [
  `## Tests — ${process.argv.find((a) => a.startsWith('--title='))?.slice(8) || 'Playwright'}`,
  '',
  `Commit \`${sha.slice(0, 7)}\` · ${rows.passed.length} passed · ${rows.failed.length} failed · ${rows.flaky.length} flaky · ${rows.skipped.length} skipped · ${Math.round((r.stats?.duration || 0) / 1000)} s`,
  '',
  ...(rows.failed.length ? ['### Failed', '', ...rows.failed.map((x) => `- ${x}`), ''] : []),
  ...(rows.flaky.length ? ['### Flaky (failed, then passed on the one retry) — investigate, do not ignore', '', ...rows.flaky.map((x) => `- ${x}`), ''] : []),
  ...(rows.skipped.length ? ['### Skipped, with reasons', '', ...rows.skipped.map((x) => `- ${x}`), ''] : []),
].join('\n');
console.log(out);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${out}\n`);
process.exit(rows.failed.length || (rows.flaky.length && process.argv.includes('--strict-flaky')) ? 1 : 0);
