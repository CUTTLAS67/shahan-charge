const CACHE_NAME='shahan-charge-v8';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./shahan-logo.png','./service-worker.js','./report.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));self.clients.claim()});
async function appResponse(request){
 let response=await caches.match(request);
 if(!response){try{response=await fetch(request)}catch{return caches.match('./index.html')}}
 if(request.mode==='navigate' || new URL(request.url).pathname.endsWith('/index.html')){
  try{let html=await response.text();if(!html.includes('report.js')){html=html.replace('</body>','<script src="./report.js"></script></body>');return new Response(html,{status:response.status,statusText:response.statusText,headers:{'Content-Type':'text/html; charset=utf-8'}})}}catch{}
 }
 return response;
}
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(appResponse(event.request))});
