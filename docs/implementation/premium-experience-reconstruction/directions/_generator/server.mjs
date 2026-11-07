import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = 'C:/Users/sam20/dr-maan-albarry-website';
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json'};
http.createServer((req,res)=>{
  let p = decodeURIComponent(new URL(req.url,'http://x').pathname);
  let f = path.join(root, p); if (!f.startsWith(path.normalize(root))) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f,'index.html');
  fs.readFile(f,(e,d)=>{ if(e){res.writeHead(404);return res.end('404 '+p);} res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream','cache-control':'no-store'}); res.end(d); });
}).listen(4520,()=>console.log('serving on 4520'));
