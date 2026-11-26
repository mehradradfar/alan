/* ===== ONBOARDING ===== */
const OBS={};
const phoneFmt=d=>fa(String(d||'').replace(/^(\d{4})(\d{0,3})(\d{0,4}).*/,(m,a,b,c)=>[a,b,c].filter(Boolean).join(' ')));
function showOnboarding(){
  closeMenu();if(UI.overlay)UI.overlay.close();while(UI.stack.length)popNow();
  let ob=$('#ob');if(ob)ob.remove();ob=document.createElement('div');ob.id='ob';ob.className='layer obl';$('#dev').appendChild(ob);
  UI.ob={returning:!!S.user.phone,phone:'',name:S.user.phone?S.user.name:'',shop:'',kind:0,ch:{},err:''};
  obGo(OBS.Welcome,0);
}
function obGo(fn,dir=1){const ob=$('#ob');const old=ob.lastElementChild;const el=document.createElement('div');el.className='screen';ob.appendChild(el);
  UI.ob.cur={fn,el};el.innerHTML=fn();fn.after&&fn.after(el);
  const E='cubic-bezier(.32,.72,0,1)';
  if(old&&dir){if(dir<0){old.style.zIndex=2;}
    el.animate([{transform:`translateX(${dir>0?'-100%':'28%'})`},{transform:'none'}],{duration:420,easing:E});
    old.animate([{transform:'none'},{transform:`translateX(${dir>0?'28%':'-100%'})`}],{duration:420,easing:E,fill:'forwards'}).finished.then(()=>old.remove());}
  else if(old)old.remove();}
function obRefresh(){const c=UI.ob&&UI.ob.cur;if(!c)return;c.el.innerHTML=c.fn();c.fn.after&&c.fn.after(c.el);}
A.obTo=n=>obGo(OBS[n]);A.obBack=n=>obGo(OBS[n],-1);
const obNav=back=>`<div class="top-safe"></div><div class="nav">${back?`<button class="gbtn" data-act="obBack|${back}" aria-label="بازگشت">${ic('chevR')}</button>`:'<span></span>'}<span></span><span></span></div>`;
const obSteps=n=>`<div class="steps" style="margin-top:6px">${[1,2,3].map(i=>`<i class="${i<=n?'on':''}"></i>`).join('')}</div>`;

OBS.Welcome=()=>`<div class="welcome"><div class="orbit"><div class="pop">${LOGO}</div>
  <span class="oc" style="top:4px;right:-6px;animation-delay:0s,.2s">${ic('globe')}وب‌سایت</span><span class="oc" style="top:62px;left:-26px;animation-delay:1.2s,.35s">${ic('bag')}دیجی‌کالا</span><span class="oc" style="bottom:-4px;right:6px;animation-delay:2.4s,.5s">${ic('store')}حضوری</span></div>
  <h1>الان</h1><h2>موجودی و فروش همه کانال‌ها، یک‌جا</h2><p>قیمت و موجودی را یک بار عوض کنید؛<br>الان به همه کانال‌ها می‌رساند.</p></div>
  <div class="bottom" style="flex-direction:column"><button class="btn primary" data-act="obTo|Phone">${UI.ob.returning?'ورود':'شروع کنید'}</button><button class="btn gray" data-act="obDemo">دیدن نسخه نمونه</button></div>`;
A.obDemo=()=>{S.onboarded=true;save();obClose();toast('این نسخه نمونه است','هر کاری می‌خواهید امتحان کنید','info');};

OBS.Phone=()=>{const o=UI.ob;return `${obNav('Welcome')}<div class="obb"><h2 class="big">شماره موبایلتان چیست؟</h2><p class="muted" style="margin:0">کد تأیید به این شماره پیامک می‌شود.</p>
  <div class="phonein ${o.err?'bad':''}"><input id="obp" inputmode="tel" autocomplete="tel" placeholder="${fa('0912 345 6789')}" value="${phoneFmt(o.phone)}" data-on="obPhone" data-enter="obSend" aria-label="شماره موبایل"></div>
  <div id="obperr">${o.err?`<div class="err-text">${ic('alert')}${o.err}</div>`:''}</div>
  <p class="tiny muted" style="margin-top:18px;line-height:1.9">با ادامه، قوانین و حریم خصوصی الان را می‌پذیرید.</p></div>
  <div class="bottom"><button class="btn primary" id="obpb" data-act="obSend">دریافت کد</button></div>`;};
OBS.Phone.after=el=>setTimeout(()=>{const i=$('#obp',el);i&&i.focus();},450);
ON.obPhone=(v,t)=>{let d=String(v).replace(/[۰-۹]/g,x=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(x)).replace(/[٠-٩]/g,x=>'٠١٢٣٤٥٦٧٨٩'.indexOf(x)).replace(/\D/g,'');if(d.startsWith('98'))d='0'+d.slice(2);if(/^9/.test(d))d='0'+d;d=d.slice(0,11);UI.ob.phone=d;t.value=phoneFmt(d);if(UI.ob.err){UI.ob.err='';$('#obperr').innerHTML='';$('.phonein').classList.remove('bad');}};
A.obSend=()=>{const o=UI.ob,p=o.phone;if(!/^09\d{9}$/.test(p)){o.err=p?'شماره باید ۱۱ رقم باشد و با ۰۹ شروع شود':'شماره موبایل را وارد کنید';const w=$('.phonein');w.classList.remove('bad');void w.offsetWidth;w.classList.add('bad');$('#obperr').innerHTML=`<div class="err-text">${ic('alert')}${o.err}</div>`;haptic();return;}
  if(!online()){toast('اینترنت وصل نیست','برای دریافت کد به اینترنت نیاز است','err');return;}
  const b=$('#obpb');b.innerHTML='<i class="spin"></i>';b.disabled=true;setTimeout(()=>obGo(OBS.Otp),700);};

OBS.Otp=()=>{const p=UI.ob.phone;const pf=p.replace(/^(\d{4})(\d{3})(\d{4})$/,'$1 $2 $3');
  return `${obNav('Phone')}<div class="obb"><h2 class="big">کد تأیید را وارد کنید</h2><p class="muted" style="margin:0;line-height:1.9">کد ۶ رقمی به <span class="ltr">${fa(pf)}</span> پیامک شد. <button class="textbtn" data-act="obBack|Phone">ویرایش شماره</button></p>
  <div class="otp" id="otp" style="margin-top:26px;justify-content:center">${[0,1,2].map(i=>`<input inputmode="numeric" maxlength="1" autocomplete="${i?'off':'one-time-code'}" data-i="${i}" aria-label="رقم ${fa(i+1)}">`).join('')}<span class="dash"></span>${[3,4,5].map(i=>`<input inputmode="numeric" maxlength="1" autocomplete="off" data-i="${i}" aria-label="رقم ${fa(i+1)}">`).join('')}</div>
  <div id="oterr" style="text-align:center"></div><div class="muted small" style="margin-top:22px;text-align:center" id="otimer"></div></div>
  <div class="otp-sugg"><button class="chip" data-act="otpFill">${ic('chat')}کد از پیامک: <b class="ltr num">${fa('482915')}</b></button></div>`;};
OBS.Otp.after=el=>{const ins=$$('#otp input',el);const norm=s=>String(s).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/\D/g,'');
  const fill=str=>{const d=norm(str).slice(0,6);ins.forEach((x,i)=>x.value=d[i]||'');(ins[Math.min(d.length,5)]).focus();if(d.length===6)otpVerify(el);};
  ins.forEach((inp,i)=>{inp.addEventListener('input',()=>{const v=norm(inp.value);if(v.length>1){fill(v);return;}inp.value=v;$('#otp',el).classList.remove('bad');$('#oterr',el).innerHTML='';if(v&&i<5)ins[i+1].focus();if(ins.every(x=>x.value))otpVerify(el);});
    inp.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!inp.value&&i>0){ins[i-1].focus();ins[i-1].value='';}});
    inp.addEventListener('paste',e=>{e.preventDefault();fill((e.clipboardData||window.clipboardData).getData('text'));});});
  setTimeout(()=>ins[0].focus(),450);
  let left=119;const tick=()=>{if(!el.isConnected)return clearInterval(UI._otT);const t=$('#otimer',el);if(left<=0){t.innerHTML=`<button class="textbtn" data-act="otpResend">ارسال دوباره کد</button>`;clearInterval(UI._otT);return;}t.innerHTML=`ارسال دوباره تا <span class="num">${fa('0'+Math.floor(left/60))}:${fa(String(left%60).padStart(2,'0'))}</span>`;left--;};
  clearInterval(UI._otT);tick();UI._otT=setInterval(tick,1000);UI._otReset=()=>{left=119;clearInterval(UI._otT);tick();UI._otT=setInterval(tick,1000);};
  UI._otFill=fill;};
A.otpFill=()=>{UI._otFill&&UI._otFill('482915');};
A.otpResend=()=>{UI._otReset&&UI._otReset();toast('کد دوباره پیامک شد','','info');};
function otpVerify(el){const ins=$$('#otp input',el);const code=ins.map(x=>x.value).join('');ins.forEach(x=>x.blur());
  setTimeout(()=>{if(!el.isConnected)return;if(code==='482915'){$('#otp',el).classList.add('ok');haptic();clearInterval(UI._otT);setTimeout(()=>{if(UI.ob.returning)obFinish();else obGo(OBS.Shop);},450);}
    else{const o=$('#otp',el);o.classList.remove('bad');void o.offsetWidth;o.classList.add('bad');$('#oterr',el).innerHTML=`<div class="err-text" style="justify-content:center">${ic('alert')}کد درست نیست. دوباره امتحان کنید.</div>`;haptic();setTimeout(()=>{ins.forEach(x=>x.value='');ins[0].focus();},600);}},350);}

OBS.Shop=()=>{const o=UI.ob;const kinds=['پوشاک','کیف و کفش','لوازم خانگی','آرایشی','دیجیتال','دیگر'];
  return `${obNav('')}${obSteps(1)}<div class="obb" style="padding-top:18px"><h2 class="big">از فروشگاهتان بگویید</h2><p class="muted" style="margin:0">این نام روی فاکتورها می‌آید.</p>
  <div class="lbl">نام شما</div><input class="input" id="obn" placeholder="مثلاً نیلا رضایی" value="${esc(o.name)}" data-on="obName">
  <div class="lbl">نام فروشگاه</div><input class="input" id="obs" placeholder="مثلاً پوشاک نیلا" value="${esc(o.shop)}" data-on="obShop">${o.err?`<div class="err-text">${ic('alert')}${o.err}</div>`:''}
  <div class="lbl">چه می‌فروشید؟</div></div><div class="chips" style="flex-wrap:wrap;row-gap:8px;padding:0 24px">${kinds.map((k,i)=>`<button class="chip ${o.kind===i?'on':''}" data-act="obKind|${i}">${k}</button>`).join('')}</div>
  <div class="bottom"><button class="btn primary" data-act="obShopNext">ادامه</button></div>`;};
ON.obName=v=>{UI.ob.name=v;};ON.obShop=v=>{UI.ob.shop=v;if(UI.ob.err&&v.trim()){UI.ob.err='';const e=$('#ob .err-text');e&&e.remove();}};
A.obKind=i=>{UI.ob.kind=+i;obRefresh();};
A.obShopNext=()=>{const o=UI.ob;if(!o.shop.trim()){o.err='نام فروشگاه را بنویسید';obRefresh();return;}o.err='';obGo(OBS.Channels);};

OBS.Channels=()=>{const o=UI.ob;const n=Object.values(o.ch).filter(Boolean).length;
  return `${obNav('Shop')}${obSteps(2)}<div class="obb" style="padding-top:18px"><h2 class="big">کجا می‌فروشید؟</h2><p class="muted" style="margin:0;line-height:1.9">کانال‌ها را وصل کنید تا قیمت و موجودی خودکار به آن‌ها برسد. بعداً هم می‌شود.</p></div>
  <div class="list" style="padding:10px 24px 0">${Object.keys(OCH).filter(c=>!EXTRA_CH[c]).map(c=>`<div class="li"><span class="tile">${ic(OCH[c].icon)}</span><div class="grow"><div class="t1">${OCH[c].name}</div><div class="t2">${OCH[c].desc}</div></div>${o.ch[c]?`<span class="st ok pop">${ic('checkc')}وصل شد</span>`:`<button class="btn sm gray" data-act="obConn|${c}">وصل کردن</button>`}</div>`).join('')}</div>
  <div class="obb muted small" style="line-height:1.9;margin-top:10px">فروش حضوری، اینستاگرام و تلگرام اتصال لازم ندارند.</div>
  <div class="bottom"><button class="btn ${n?'primary':'gray'}" data-act="obTo|Trial">${n?'ادامه':'بعداً وصل می‌کنم'}</button></div>`;};
A.obConn=c=>{const sh=sheet(`اتصال ${OCH[c].name}`,()=>`<div class="pad" style="text-align:center"><div class="empty-ic">${ic(OCH[c].icon)}</div><h3 style="margin:14px 0 6px">${OCH[c].name} را وصل کنید</h3><p class="muted" style="margin:0 0 20px;line-height:1.9">وارد پنل فروشندگی ${OCH[c].name} می‌شوید و دسترسی می‌دهید.<br>رمز شما را الان نمی‌بیند.</p><button class="btn primary" id="obcb" data-act="obcgo">${ic('link')}ورود به پنل ${OCH[c].name}</button></div>`,{left:'انصراف'});
  A.obcgo=()=>{const b=$('#obcb');b.innerHTML='<i class="spin"></i>در حال اتصال…';b.disabled=true;setTimeout(()=>{UI.ob.ch[c]=true;sh.close();obRefresh();haptic();},1200);};};

OBS.Trial=()=>`${obNav('Channels')}${obSteps(3)}<div class="obb" style="padding-top:18px"><h2 class="big">۱۴ روز رایگان امتحان کنید</h2><p class="muted" style="margin:0">همه امکانات پلن حرفه‌ای، بدون پرداخت.</p>
  <div class="trial"><div class="row"><span class="avatar sm" style="background:var(--accent)">${ic('crown')}</span><b class="grow" style="font-size:17px">حرفه‌ای</b><span class="pill" style="background:var(--green-soft);color:var(--green)">رایگان</span></div>
  <div style="margin-top:12px">${PLANS[1].feat.map(f=>`<div class="feat">${ic('check')}${f}</div>`).join('')}</div></div>
  <p class="muted small" style="line-height:1.9;margin-top:14px">بعد از ۱۴ روز، ماهانه ${money(PLANS[1].m)} تومان. هر وقت بخواهید لغو می‌شود.</p></div>
  <div class="bottom"><button class="btn primary" data-act="obTo|Ready">شروع دوره رایگان</button></div>`;
OBS.Ready=()=>`<div class="welcome" style="padding-bottom:120px"><div class="check-anim pop">${ic('check')}</div><h2 style="margin-top:14px">همه‌چیز آماده است</h2><p>چند محصول نمونه گذاشتیم تا راحت امتحان کنید.</p></div><div class="bottom"><button class="btn primary" data-act="obFinish">ورود به الان</button></div>`;
A.obFinish=()=>obFinish();
function obFinish(){const o=UI.ob;S.onboarded=true;S.user.phone=o.phone;
  if(!o.returning){if(o.shop.trim())S.user.shop=o.shop.trim();if(o.name.trim()){S.user.name=o.name.trim();const me=S.team.find(t=>t.me);if(me)me.name=S.user.name;}
    Object.keys(OCH).filter(c=>!EXTRA_CH[c]).forEach(c=>{S.channels[c].connected=!!o.ch[c];if(o.ch[c]){S.channels[c].status='ok';S.channels[c].last=Date.now();}});
    S.sub={plan:'pro',left:14,total:14,cycle:'m'};}
  save();obClose();toast(o.returning?'خوش برگشتید':`خوش آمدید${o.name.trim()?'، '+esc(o.name.trim().split(' ')[0]):''}`,'',o.returning?'ok':'info');}
function obClose(){const ob=$('#ob');UI.ob=null;Object.values(UI.tabEls).forEach(e=>e.dataset.stale='1');switchTab('home');if(!ob)return;ob.animate([{opacity:1,transform:'none'},{opacity:0,transform:'scale(1.04)'}],{duration:380,easing:'cubic-bezier(.32,.72,0,1)',fill:'forwards'}).finished.then(()=>ob.remove());}

/* ===== BOOT ===== */
function regCh(){Object.keys(S.channels).forEach(k=>{if(!OCH[k]&&EXTRA_CH[k])OCH[k]=EXTRA_CH[k];});}
document.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const t=e.target.closest&&e.target.closest('[data-enter]');if(!t)return;e.preventDefault();const [n,...a]=t.dataset.enter.split('|');A[n]&&A[n](...a,t,e);});
function boot(){S=load();
  if(S&&S.v===1){/* v1 demo shipped with pre-made pending changes; start clean */S.products.forEach(p=>{S.synced[p.id]={};Object.keys(S.channels).forEach(c=>{if(S.channels[c].connected&&OCH[c]&&p.ch[c]&&p.ch[c].on)S.synced[p.id][c]=snapOf(p,c);});});S.v=2;save();}
  if(!S||S.v!==2){seed();save();}topUpSales();regCh();applyTheme();shell();if(typeof mountCtl==='function')mountCtl();switchTab('home');if(!S.onboarded)showOnboarding();
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&topUpSales()&&!UI.ob)refresh();});
  try{if('serviceWorker' in navigator&&location.protocol==='https:'&&window.top===window.self)navigator.serviceWorker.register('sw.js').catch(()=>{});}catch(e){}}
boot();
