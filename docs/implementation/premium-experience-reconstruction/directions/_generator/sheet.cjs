const { chromium } = require('C:/Users/sam20/dr-maan-albarry-website/node_modules/playwright');
const OUT='C:/Users/sam20/dr-maan-albarry-website/docs/implementation/premium-experience-reconstruction/directions/';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:2032,height:1000}});
await p.goto('http://localhost:4520/docs/implementation/premium-experience-reconstruction/directions/comparison.html',{waitUntil:'networkidle'});
await p.locator('#hero').screenshot({path:OUT+'comparison-hero.jpg',type:'jpeg',quality:84});
await p.locator('#gallery').screenshot({path:OUT+'comparison-gallery.jpg',type:'jpeg',quality:84});
await b.close();})();
