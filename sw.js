const CACHE='alan-v2';
const SHELL=['./','index.html','styles.css','core.js','data.js','screens-a.js','screens-b.js','ctl.js','ob.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png','img/tshirt.webp','img/hoodie.webp','img/jeans.webp','img/sneakers.webp','img/bag.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  e.respondWith(caches.match(r).then(hit=>{
    const net=fetch(r).then(res=>{if(res&&res.ok&&(new URL(r.url).origin===location.origin||r.url.includes('fonts.g'))){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));}return res;}).catch(()=>hit||(r.mode==='navigate'?caches.match('index.html'):undefined));
    return hit||net;
  }));
});
