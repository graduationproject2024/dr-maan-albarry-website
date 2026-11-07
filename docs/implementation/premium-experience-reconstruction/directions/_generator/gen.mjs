const which = process.argv.slice(2);
for (const k of (which.length ? which : ['a','b','c'])) {
  const m = await import(`./gen${k.toUpperCase()}.mjs?${Date.now()}`);
  m.build(); console.log('built', k);
}
