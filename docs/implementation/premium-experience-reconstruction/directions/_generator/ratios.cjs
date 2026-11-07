const { chromium } = require('C:/Users/sam20/dr-maan-albarry-website/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
for(const d of ['a','b','c']){await p.goto(`http://localhost:4520/docs/implementation/premium-experience-reconstruction/directions/${d}/colours.html`);await p.waitForTimeout(300);
const r=await p.evaluate(()=>[...document.querySelectorAll('.sw-sec')].map(s=>s.querySelector('h2').textContent+': '+[...s.querySelectorAll('.pair')].map(x=>x.querySelector('.pair-n').textContent+' '+x.dataset.fg+'/'+x.dataset.bg+' '+x.dataset.ratio).join('; ')));
console.log(d.toUpperCase());r.forEach(x=>console.log('  '+x));}
// measured type metrics on home pages
for(const d of ['a','b','c']){await p.setViewportSize({width:1440,height:900});await p.goto(`http://localhost:4520/docs/implementation/premium-experience-reconstruction/directions/${d}/home-ar.html`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
const m=await p.evaluate(()=>{const g=s=>{const e=document.querySelector(s);if(!e)return null;const c=getComputedStyle(e);return `${s}: ${c.fontFamily.split(',')[0]} ${c.fontWeight} ${c.fontSize}/${(parseFloat(c.lineHeight)/parseFloat(c.fontSize)).toFixed(2)}`};return [g('h1'),g('.hero-title'),g('.hero-intro'),g('#procedures h2'),g('#procedures h3'),g('#procedures p:not(.kick):not(.eyebrow):not(.chap-k)')].join(' | ')});
console.log(d,m);}
await b.close();})();
