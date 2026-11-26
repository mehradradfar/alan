/* ---------- icons ---------- */
const P={
home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
chart:'<path d="M4 20h16"/><rect x="5" y="11" width="3" height="7" rx="1"/><rect x="10.5" y="6" width="3" height="12" rx="1"/><rect x="16" y="9" width="3" height="9" rx="1"/>',
line:'<path d="m3 17 6-6 4 3 8-8"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
minus:'<path d="M5 12h14"/>',
x:'<path d="M18 6 6 18M6 6l12 12"/>',
chevR:'<path d="m9 6 6 6-6 6"/>',
chevL:'<path d="m15 6-6 6 6 6"/>',
chevD:'<path d="m6 9 6 6 6-6"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
scan:'<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M8 9v6M11 9v6M14 9v6M17 9v6"/>',
grid:'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
filter:'<path d="M4 5h16l-6 7.5V19l-4 2v-8.5z"/>',
stack:'<rect x="8" y="3" width="13" height="13" rx="3"/><path d="M4 8v10a2 2 0 0 0 2 2h10"/>',
list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
bag:'<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
store:'<path d="M4 9 5.5 4h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6"/>',
globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
insta:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/>',
send:'<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
chat:'<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.4A8.5 8.5 0 1 1 21 12z"/>',
link:'<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
zap:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
tag:'<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 15c1.6.7 2.6 2.3 3 5"/>',
settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
doc:'<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
up:'<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
down:'<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',
check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
checkc:'<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>',
alert:'<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/>',
xc:'<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>',
crown:'<path d="m3 7 4.5 4L12 5l4.5 6L21 7l-2 11H5z"/>',
trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
pencil:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
spark:'<path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z"/><path d="M19 15c.3 1.6 1 2.4 2.5 2.7-1.5.3-2.2 1-2.5 2.6-.3-1.6-1-2.3-2.5-2.6 1.5-.3 2.2-1.1 2.5-2.7z"/>',
camera:'<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
image:'<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-9 9"/>',
wifioff:'<path d="M2 8.5a15 15 0 0 1 20 0M5.2 12a10.5 10.5 0 0 1 13.6 0M8.6 15.4a5.5 5.5 0 0 1 6.8 0M3 3l18 18"/><circle cx="12" cy="19" r=".8"/>',
moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
logout:'<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l-5-5 5-5M5 12h11"/>',
refresh:'<path d="M20 11a8 8 0 0 0-14.5-4.5L3 9M4 13a8 8 0 0 0 14.5 4.5L21 15"/><path d="M3 4v5h5M21 20v-5h-5"/>',
dots:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
mobile:'<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
card:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 10h18M7 15h3"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
flash:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
};
const ic=(n,cls='')=>`<svg class="i ${cls}" viewBox="0 0 24 24">${P[n]||''}</svg>`;
const LOGO=`<svg viewBox="0 0 120 120" class="logo-big"><rect width="120" height="120" rx="30" fill="#3E49F5"/><path d="M36 58V48a24 24 0 0 1 48 0v10H73V48a13 13 0 0 0-26 0v10z" fill="#fff"/><path d="M36 61h11v11a13 13 0 0 0 26 0V61h11v11a24 24 0 0 1-48 0z" fill="#8f97ff"/><circle cx="60" cy="59.5" r="5.5" fill="#FFB21E"/></svg>`;

/* ---------- utils ---------- */
const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const fa=n=>String(n).replace(/[0-9]/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const money=n=>Math.round(n).toLocaleString('fa-IR');
const toman=n=>money(n)+' تومان';
const short=n=>{if(n>=1e6)return fa((n/1e6).toFixed(n>=1e7?0:1)).replace('.','٫')+' میلیون';if(n>=1e3)return fa(Math.round(n/1e3))+' هزار';return fa(n);};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,9);
const DAY=864e5;
const dayName=d=>['ی','د','س','چ','پ','ج','ش'][new Date(d).getDay()];
const dayFull=d=>['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'][new Date(d).getDay()];
const timeStr=t=>{const d=new Date(t);return fa(String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'));};
const dateStr=t=>{const d=new Date(t);try{return d.toLocaleDateString('fa-IR',{day:'numeric',month:'long'});}catch(e){return fa(d.getDate());}};
const ago=t=>{const m=Math.round((Date.now()-t)/6e4);if(m<1)return 'همین حالا';if(m<60)return fa(m)+' دقیقه پیش';const h=Math.round(m/60);if(h<24)return fa(h)+' ساعت پیش';const d=Math.round(h/24);return d===1?'دیروز':fa(d)+' روز پیش';};
const haptic=()=>{try{navigator.vibrate&&navigator.vibrate(8);}catch(e){}};

/* ---------- persistence ---------- */
const KEY='alan-pwa-v1';
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function load(){try{const r=localStorage.getItem(KEY);if(r)return JSON.parse(r);}catch(e){}return null;}

/* ---------- app shell ---------- */
const UI={stack:[],tab:'home',tabEls:{},overlay:null};
function shell(){
  document.getElementById('app').innerHTML=`
  <div class="stage"><div class="device" id="dev">
    <div class="layer" id="tabs"></div>
    <div class="layer" id="stackL" style="pointer-events:none"></div>
    <nav class="tabbar" id="tabbar" aria-label="منوی اصلی">
      <button class="tb-fab" id="fab" aria-label="افزودن">${ic('plus')}</button>
      <div class="tb-main">
        ${[['home','خانه','home'],['products','محصولات','box'],['reports','گزارش','chart'],['profile','پروفایل','user']].map(([k,l,i])=>`<button class="tb-item" data-tab="${k}">${ic(i)}<span>${l}</span></button>`).join('')}
      </div>
    </nav>
    <div class="offline" id="offline">${'اینترنت وصل نیست؛ تغییرها بعداً ارسال می‌شوند.'}</div>
  </div></div>`;
  $('#tabbar').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b){haptic();switchTab(b.dataset.tab);}});
  $('#fab').addEventListener('click',()=>{haptic();toggleMenu();});
  document.addEventListener('click',onAct);
  document.addEventListener('input',onInput);
  document.addEventListener('change',onInput);
  window.addEventListener('online',netChange);window.addEventListener('offline',netChange);netChange();
  edgeSwipe();
}
const online=()=>navigator.onLine&&!UI.fakeOff;
function netChange(){const off=!online();$('#offline').classList.toggle('in',off);}
function applyTheme(){const t=S.settings.theme;const r=document.documentElement;if(t==='system')r.removeAttribute('data-theme');else r.setAttribute('data-theme',t);}

/* ---------- tabs ---------- */
const TABS={};
function switchTab(k){
  if(UI.stack.length){while(UI.stack.length)popNow();}
  closeMenu();
  const prev=UI.tab;UI.tab=k;
  $$('.tb-item').forEach(b=>b.classList.toggle('on',b.dataset.tab===k));
  const host=$('#tabs');
  let el=UI.tabEls[k];
  if(!el){el=document.createElement('div');el.className='screen';host.appendChild(el);UI.tabEls[k]=el;}
  renderInto(el,TABS[k]);
  Object.entries(UI.tabEls).forEach(([kk,e])=>{if(kk===k){e.style.display='flex';if(prev!==k){e.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:260,easing:'cubic-bezier(.32,.72,0,1)'});}}else e.style.display='none';});
}
function renderInto(el,fn,params){const sc=el.querySelector('.scroll');const top=sc?sc.scrollTop:0;el.innerHTML=fn(params||{});const ns=el.querySelector('.scroll');if(ns&&el.dataset.keep)ns.scrollTop=top;el.dataset.keep='1';fn.after&&fn.after(el,params||{});}

/* ---------- stack navigation (RTL push from left) ---------- */
function push(fn,params={},opts={}){
  closeMenu();
  const L=$('#stackL');L.style.pointerEvents='auto';
  const el=document.createElement('div');el.className='screen pushed';L.appendChild(el);
  const entry={fn,params,el};UI.stack.push(entry);
  renderInto(el,fn,params);
  const under=UI.stack.length>1?UI.stack[UI.stack.length-2].el:UI.tabEls[UI.tab];
  $('#tabbar').classList.add('hide');
  if(opts.instant)return;
  el.animate([{transform:'translateX(-100%)'},{transform:'none'}],{duration:420,easing:'cubic-bezier(.32,.72,0,1)'});
  under&&under.animate([{transform:'none',filter:'brightness(1)'},{transform:'translateX(28%)',filter:'brightness(.92)'}],{duration:420,easing:'cubic-bezier(.32,.72,0,1)',fill:'forwards'}).finished.then(a=>{});
}
function pop(n=1){
  for(let i=0;i<n;i++){
    const top=UI.stack.pop();if(!top)break;
    const under=UI.stack.length?UI.stack[UI.stack.length-1].el:UI.tabEls[UI.tab];
    if(under){under.getAnimations().forEach(a=>a.cancel());refreshEl(under);under.animate([{transform:'translateX(28%)',filter:'brightness(.92)'},{transform:'none',filter:'brightness(1)'}],{duration:380,easing:'cubic-bezier(.32,.72,0,1)'});}
    const a=top.el.animate([{transform:'none'},{transform:'translateX(-100%)'}],{duration:380,easing:'cubic-bezier(.32,.72,0,1)'});
    a.finished.then(()=>top.el.remove());
  }
  if(!UI.stack.length){$('#stackL').style.pointerEvents='none';$('#tabbar').classList.remove('hide');}
}
function popNow(){const top=UI.stack.pop();if(top)top.el.remove();const under=UI.stack.length?UI.stack[UI.stack.length-1].el:UI.tabEls[UI.tab];if(under)under.getAnimations().forEach(a=>a.cancel());if(!UI.stack.length){$('#stackL').style.pointerEvents='none';$('#tabbar').classList.remove('hide');}}
function replace(fn,params={}){const top=UI.stack[UI.stack.length-1];if(!top)return push(fn,params);top.fn=fn;top.params=params;top.el.dataset.keep='';renderInto(top.el,fn,params);top.el.animate([{opacity:.4},{opacity:1}],{duration:250});}
function refreshEl(el){const e=UI.stack.find(s=>s.el===el);if(e)return renderInto(el,e.fn,e.params);const k=Object.keys(UI.tabEls).find(k=>UI.tabEls[k]===el);if(k)renderInto(el,TABS[k]);}
function refresh(){const top=UI.stack[UI.stack.length-1];if(top)renderInto(top.el,top.fn,top.params);else if(UI.tabEls[UI.tab])renderInto(UI.tabEls[UI.tab],TABS[UI.tab]);Object.keys(UI.tabEls).forEach(k=>{if(k!==UI.tab)UI.tabEls[k].dataset.stale='1';});}
function edgeSwipe(){
  const dev=$('#dev');let sx=0,sy=0,act=false,el=null,under=null,w=0;
  dev.addEventListener('pointerdown',e=>{if(!UI.stack.length||UI.overlay)return;const r=dev.getBoundingClientRect();if(r.right-e.clientX>24)return;act=true;sx=e.clientX;sy=e.clientY;el=UI.stack[UI.stack.length-1].el;under=UI.stack.length>1?UI.stack[UI.stack.length-2].el:UI.tabEls[UI.tab];w=r.width;if(under)under.getAnimations().forEach(a=>a.cancel());});
  dev.addEventListener('pointermove',e=>{if(!act)return;const dx=Math.max(0,sx-e.clientX);if(Math.abs(e.clientY-sy)>40&&dx<20){act=false;el.style.transform='';return;}el.style.transform=`translateX(${-dx}px)`;if(under)under.style.transform=`translateX(${28-28*dx/w}%)`;});
  const end=e=>{if(!act)return;act=false;const dx=Math.max(0,sx-e.clientX);el.style.transform='';if(under)under.style.transform='';if(dx>w/3)pop();else if(under)under.animate([{transform:'translateX(28%)'},{transform:'translateX(28%)'}],{duration:1,fill:'forwards'});};
  dev.addEventListener('pointerup',end);dev.addEventListener('pointercancel',end);
}

/* ---------- overlays ---------- */
function scrim(onClick){const s=document.createElement('div');s.className='scrim';$('#dev').appendChild(s);requestAnimationFrame(()=>s.classList.add('in'));s.addEventListener('click',onClick);return s;}
function toggleMenu(){if(UI.menu)closeMenu();else openMenu();}
function openMenu(){
  const s=scrim(closeMenu);const m=document.createElement('div');m.className='menu';
  const items=[['ثبت فروش','bag','sale'],['افزودن محصول','box','addProduct'],['به‌روزرسانی موجودی','down','stock'],['اسکن بارکد','scan','scan'],['دستیار هوشمند','spark','ai']];
  m.innerHTML=items.map(([t,i,a],k)=>`<button data-act="menu|${a}" style="transition-delay:${40+k*35}ms"><span class="c">${ic(i)}</span>${t}</button>`).join('');
  $('#dev').appendChild(m);requestAnimationFrame(()=>m.classList.add('in'));$('#fab').classList.add('open');$('#tabbar').classList.add('over');UI.menu={s,m};
}
function closeMenu(){if(!UI.menu)return;const {s,m}=UI.menu;UI.menu=null;$('#fab').classList.remove('open');$('#tabbar').classList.remove('over');s.classList.remove('in');m.classList.remove('in');setTimeout(()=>{s.remove();m.remove();},300);}
function sheet(title,bodyFn,{left='انصراف',right=null,onRight=null,onClose=null,tall=false}={}){
  const s=scrim(()=>close());const sh=document.createElement('div');sh.className='sheet';if(tall)sh.style.height='88%';
  sh.innerHTML=`<div class="grab"><i></i></div><div class="sh"><button class="l">${left}</button><div class="t">${title}</div>${right?`<button class="r">${right}</button>`:'<span></span>'}</div><div class="sb"></div>`;
  $('#dev').appendChild(sh);const body=sh.querySelector('.sb');
  const render=()=>{body.innerHTML=bodyFn();bodyFn.after&&bodyFn.after(body);};render();
  requestAnimationFrame(()=>sh.classList.add('in'));
  const api={el:sh,body,render,close};UI.overlay=api;
  function close(){if(!sh.isConnected)return;window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);sh.classList.remove('in');s.classList.remove('in');setTimeout(()=>{sh.remove();s.remove();},420);if(UI.overlay===api)UI.overlay=null;onClose&&onClose();}
  sh.querySelector('.l').addEventListener('click',close);
  if(right)sh.querySelector('.r').addEventListener('click',()=>{const r=onRight?onRight(api):true;if(r!==false)close();});
  // drag to dismiss
  let y0=0,dy=0,drag=false;const down=e=>{drag=true;y0=e.clientY;sh.style.transition='none';};
  const move=e=>{if(!drag)return;dy=Math.max(0,e.clientY-y0);sh.style.transform=`translateY(${dy}px)`;};
  const up=()=>{if(!drag)return;drag=false;sh.style.transition='';sh.style.transform='';if(dy>110)close();dy=0;};
  [sh.querySelector('.grab'),sh.querySelector('.sh .t')].forEach(h=>h.addEventListener('pointerdown',down));
  window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);
  return api;
}
let toastT=null;
function toast(title,sub='',type='ok'){
  const old=$('.toast');if(old)old.remove();
  const t=document.createElement('div');t.className='toast '+type;t.innerHTML=`<span class="ic">${ic(type==='ok'?'check':type==='err'?'alert':'spark')}</span><div class="grow"><b>${title}</b>${sub?`<span>${sub}</span>`:''}</div>`;
  $('#dev').appendChild(t);requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add('in')));haptic();
  clearTimeout(toastT);toastT=setTimeout(()=>{t.classList.remove('in');setTimeout(()=>t.remove(),450);},2600);
}

/* ---------- delegated actions ---------- */
const A={};const ON={};
function onAct(e){
  const t=e.target.closest('[data-act]');if(!t)return;
  const [name,...args]=t.dataset.act.split('|');
  const f=A[name];if(f){e.preventDefault();f(...args,t,e);}
}
function onInput(e){const t=e.target.closest('[data-on]');if(!t)return;if(t.type==='file'&&e.type!=='change')return;const [name,...args]=t.dataset.on.split('|');ON[name]&&ON[name](t.type==='checkbox'?t.checked:t.value,...args,t,e);}
A.back=()=>pop();
A.tab=k=>switchTab(k);
A.menu=a=>{closeMenu();setTimeout(()=>A[a](),120);};

/* ---------- shared view helpers ---------- */
const navBar=(title,{trail=null,trailAct='',left=null,leftAct='',right=null,rightAct=''}={})=>left||right?
 `<div class="top-safe"></div><div class="nav"><button class="tl" data-act="${leftAct||'back'}">${left||''}</button><div class="t">${title}</div><button class="tr" data-act="${rightAct}">${right||''}</button></div>`:
 `<div class="top-safe"></div><div class="nav"><button class="gbtn" data-act="back" aria-label="بازگشت">${ic('chevR')}</button><div class="t">${title}</div>${trail?`<button class="gbtn" data-act="${trailAct}" style="justify-self:end">${ic(trail)}</button>`:'<span></span>'}</div>`;
const rootHdr=(title,btns=[])=>`<div class="top-safe"></div><div class="hdr"><div class="title">${title}</div>${btns.map(([i,a,badge])=>`<button class="gbtn" data-act="${a}">${ic(i)}${badge?'<i class="badge"></i>':''}</button>`).join('')}</div>`;
const secH=(t,act,actLabel)=>`<div class="sec"><div class="h2">${t}</div>${act?`<button class="link" data-act="${act}">${actLabel||'همه'}${ic('chevL','')}</button>`:''}</div>`;
const li=({icon,title,sub,val,valCls='',act='',chev=true,right='',danger=false})=>`<${act?'button':'div'} class="li" ${act?`data-act="${act}"`:''}>${icon?`<span class="tile">${ic(icon)}</span>`:''}<div class="grow"><div class="t1" ${danger?'style="color:var(--red)"':''}>${title}</div>${sub?`<div class="t2">${sub}</div>`:''}</div>${val!=null?`<span class="val ${valCls}">${val}</span>`:''}${right}${chev&&act?ic('chevL','chev'):''}</${act?'button':'div'}>`;
const emptyV=(icon,title,msg,btn,btnAct,cls='',link,linkAct)=>`<div class="empty ${cls}"><div class="ec">${ic(icon)}</div><h3>${title}</h3><p>${msg}</p>${btn?`<button class="btn primary sm" style="margin-top:10px" data-act="${btnAct}">${btn}</button>`:''}${link?`<button class="textbtn" style="margin-top:6px" data-act="${linkAct}">${link}</button>`:''}</div>`;
const seg=(items,sel,act)=>`<div class="seg" data-seg>${items.map((t,i)=>`<button class="${i===sel?'on':''}" data-act="${act}|${i}">${t}</button>`).join('')}<i class="knob" style="width:calc((100% - 4px)/${items.length});transform:translateX(calc(-100% * ${sel}))"></i></div>`;
const chipsRow=(items,sel,act)=>`<div class="chips">${items.map((t,i)=>`<button class="chip ${i===sel||(Array.isArray(sel)&&sel.includes(i))?'on':''}" data-act="${act}|${i}">${t}</button>`).join('')}</div>`;
const stepper=(v,actMinus,actPlus)=>`<div class="stp"><button data-act="${actMinus}" aria-label="کم">−</button><span class="num">${fa(v)}</span><button data-act="${actPlus}" aria-label="زیاد">+</button></div>`;
const tg=(on,act)=>`<button class="tg ${on?'on':''}" data-act="${act}" role="switch" aria-checked="${on}"></button>`;
const stBadge=(stock)=>stock<=0?`<span class="st err">${ic('xc')}ناموجود</span>`:stock<=5?`<span class="st warn">${ic('alert')}${fa(stock)} عدد</span>`:`<span class="st ok">${ic('checkc')}${fa(stock)} عدد</span>`;
function countUp(el,to,fmt=v=>fa(Math.round(v))){const from=0,t0=performance.now(),d=700;const f=t=>{const p=Math.min(1,(t-t0)/d);const e=1-Math.pow(1-p,3);el.textContent=fmt(from+(to-from)*e);if(p<1)requestAnimationFrame(f);};requestAnimationFrame(f);}
