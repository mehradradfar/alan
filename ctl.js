/* ===== PROTOTYPE CONTROLLER (side panel next to the phone) ===== */
const CTL_SECS=[
  ['ورود',[['ob:Welcome','خوش‌آمد'],['ob:Phone','شماره موبایل'],['ob:Otp','کد تأیید'],['ob:Shop','اطلاعات فروشگاه'],['ob:Channels','اتصال کانال‌ها'],['ob:Trial','دوره رایگان']]],
  ['خانه و فروش',[['tab:home','خانه'],['SaleScreen','ثبت فروش'],['CartScreen','سبد فروش'],['SalesScreen','فهرست فروش‌ها'],['SaleDetail','جزئیات فروش'],['tab:reports','گزارش']]],
  ['محصولات',[['tab:products','محصولات'],['ProductScreen','جزئیات محصول'],['AddProduct','محصول جدید'],['StockScreen','به‌روزرسانی موجودی'],['ScanScreen','اسکن بارکد'],['LowScreen','موجودی کم'],['CatsScreen','دسته‌بندی‌ها']]],
  ['همگام‌سازی کانال‌ها',[['SendScreen','ارسال تغییرات'],['PullScreen','دریافت از کانال‌ها'],['HistoryScreen','تاریخچه تغییرات'],['ChannelsScreen','کانال‌ها'],['StratScreen','قاعده‌های قیمت']]],
  ['پروفایل',[['tab:profile','پروفایل'],['PlansScreen','اشتراک'],['TeamScreen','تیم'],['SettingsScreen','تنظیمات'],['NotifScreen','اعلان‌ها'],['AIScreen','دستیار هوشمند']]],
  ['خالی و خطا',[['e:search','جستجوی بی‌نتیجه'],['e:cart','سبد خالی'],['e:send','ارسال ناموفق'],['e:phone','شماره نادرست'],['e:otp','کد تأیید اشتباه'],['e:empty','فروشگاه خالی']]]
];
function ctlLeaveOb(){if(UI.ob){S.onboarded=true;save();clearInterval(UI._otT);const ob=$('#ob');UI.ob=null;if(ob)ob.remove();Object.values(UI.tabEls).forEach(e=>e.dataset.stale='1');}}
function ctlClear(){closeMenu();if(UI.overlay)UI.overlay.close();while(UI.stack.length)popNow();}
function ctlScr(tab,fn,prep){ctlLeaveOb();ctlClear();switchTab(tab);setTimeout(()=>{const r=prep&&prep();if(r===false)return;if(typeof fn==='function')fn();},60);}
function ctlOb(n,then){ctlClear();if(!UI.ob)showOnboarding();if(['Otp','Shop','Channels','Trial'].includes(n)&&!/^09\d{9}$/.test(UI.ob.phone))UI.ob.phone='09123456789';if(n!=='Welcome'||UI.ob.cur.fn!==OBS.Welcome)obGo(OBS[n],1);if(then)setTimeout(then,520);}
const firstInStock=()=>{const p=S.products.find(p=>totalStock(p)>0);return p?{p,v:p.variants.find(v=>v.stock>0)}:null;};
const CTL_GO={
  'tab:home':()=>ctlScr('home'),'tab:products':()=>ctlScr('products'),'tab:reports':()=>ctlScr('reports'),'tab:profile':()=>ctlScr('profile'),
  SaleScreen:()=>ctlScr('home',A.sale),
  CartScreen:()=>ctlScr('home',()=>push(CartScreen,{}),()=>{if(!S.cart.items.length){const f=firstInStock();if(f)cartAdd(f.p.id,f.v.id,1);}}),
  SalesScreen:()=>ctlScr('reports',()=>{UI.sf=0;UI.sq2='';push(SalesScreen,{});}),
  SaleDetail:()=>ctlScr('reports',()=>push(SaleDetail,{id:S.sales[0].id}),()=>{if(!S.sales.length){toast('فروشی ثبت نشده','اول یک فروش ثبت کنید','err');return false;}}),
  ProductScreen:()=>ctlScr('products',()=>push(ProductScreen,{pid:S.products[0].id}),()=>{if(!S.products.length){toast('محصولی ندارید','اول یک محصول اضافه کنید','err');return false;}}),
  AddProduct:()=>ctlScr('products',A.addProduct),StockScreen:()=>ctlScr('products',A.stock),ScanScreen:()=>ctlScr('products',A.scan),
  LowScreen:()=>ctlScr('home',A.lowStock),CatsScreen:()=>ctlScr('profile',A.cats),
  SendScreen:()=>ctlScr('home',()=>push(SendScreen,{})),PullScreen:()=>ctlScr('profile',A.pull),HistoryScreen:()=>ctlScr('profile',A.history),
  ChannelsScreen:()=>ctlScr('profile',A.channels),StratScreen:()=>ctlScr('profile',A.strategies),
  PlansScreen:()=>ctlScr('profile',A.plans),TeamScreen:()=>ctlScr('profile',A.team),SettingsScreen:()=>ctlScr('profile',A.settings),
  NotifScreen:()=>ctlScr('home',A.notifs),AIScreen:()=>ctlScr('home',A.ai),
  'e:search':()=>{UI.pq='کت چرمی';UI.pcat=-1;UI.pstock=0;UI.pch='';ctlScr('products');},
  'e:cart':()=>ctlScr('home',()=>push(CartScreen,{}),()=>{S.cart.items=[];save();}),
  'e:send':()=>ctlScr('home',()=>{push(SendScreen,{});setTimeout(()=>A.doSend(),700);},()=>{const c=S.channels.snapp;if(!OCH.snapp)return;S.channels.snapp={...c,connected:true,status:'expired'};
    const p=S.products.find(p=>p.ch.snapp&&p.ch.snapp.on)||S.products[0];if(!p){toast('محصولی ندارید','اول یک محصول اضافه کنید','err');return false;}p.ch.snapp={on:true,price:p.ch.snapp&&p.ch.snapp.price};const sn=(S.synced[p.id]||{}).snapp;if(sn)sn.price=(sn.price||0)-10000;save();}),
  'e:phone':()=>ctlOb('Phone',()=>{const i=$('#obp');if(!i)return;i.value='0912';UI.ob.phone='0912';A.obSend();}),
  'e:otp':()=>ctlOb('Otp',()=>{UI._otFill&&UI._otFill('111111');}),
  'e:empty':()=>ctlScr('home',A.fakeEmpty)
};
['Welcome','Phone','Otp','Shop','Channels','Trial'].forEach(n=>CTL_GO['ob:'+n]=()=>ctlOb(n));
A.ctl=k=>{const f=CTL_GO[k];if(f){haptic();f();}$('.proto')&&$('.proto').classList.remove('ctl-open');};
A.ctlBack=()=>{if(UI.overlay)UI.overlay.close();else if(UI.menu)closeMenu();else if(UI.stack.length)pop();};
A.ctlOpen=()=>$('.proto').classList.toggle('ctl-open');
function ctlKey(){if(UI.ob&&UI.ob.cur){const n=Object.keys(OBS).find(k=>OBS[k]===UI.ob.cur.fn);return 'ob:'+n;}const t=UI.stack[UI.stack.length-1];if(t){const n=t.fn.name;return n==='SendProgress'?'SendScreen':n==='SaleSuccess'?'SaleScreen':n==='PaySuccess'?'PlansScreen':n==='StrategyEdit'?'StratScreen':n==='ChannelScreen'?'ChannelsScreen':n==='VersionScreen'?'HistoryScreen':n==='VariantsScreen'?'ProductScreen':n;}return 'tab:'+UI.tab;}
function ctlH(){const k=ctlKey();const th=S.settings.theme;
  return `<div class="ctl-head"><div class="ctl-brand">${LOGO.replace('class="logo-big"','class="ctl-logo"')}<div class="grow"><b>الان</b><span>نمونه کاربردی؛ همه دکمه‌ها کار می‌کنند</span></div><button class="ctl-x" data-act="ctlOpen" aria-label="بستن">${ic('x')}</button></div>
    <div class="ctl-ctrls"><button class="ctl-chip" data-act="ctlBack">${ic('chevR')}بازگشت</button><button class="ctl-chip" data-act="ctl|tab:home">${ic('home')}خانه</button><button class="ctl-chip" data-act="resetDemo">${ic('refresh')}بازنشانی</button></div></div>
  <div class="ctl-list">${CTL_SECS.map(([t,items])=>`<div class="ctl-sec">${t}</div>${items.map(([key,l])=>`<button class="ctl-item ${key.startsWith('e:')?'err':''}" data-act="ctl|${key}" aria-current="${key===k}">${key.startsWith('e:')?`<i class="ctl-dot"></i>`:''}${l}</button>`).join('')}`).join('')}
    <div class="ctl-sec">وضعیت‌ها</div>
    <div class="ctl-row"><span class="grow">قطع اینترنت</span>${tg(!!UI.fakeOff,'fakeOff')}</div>
    <div class="ctl-row"><span class="grow">نزدیک پایان اشتراک</span>${tg(S.sub.left<=5,'fakeEnd')}</div>
    <div class="ctl-row"><span class="grow">تم</span><div class="ctl-seg"><button class="${th!=='dark'?'on':''}" data-act="theme|0">روشن</button><button class="${th==='dark'?'on':''}" data-act="theme|1">تیره</button></div></div>
  </div>
  <div class="ctl-foot">کد تأیید آزمایشی: <b class="num">${fa('482915')}</b><br>برای بازگشت، از لبه راست صفحه بکشید.<br>داده‌ها فقط در همین مرورگر ذخیره می‌شوند.</div>`;}
function mountCtl(){const st=$('.stage');if(!st||$('.proto'))return;const pr=document.createElement('div');pr.className='proto';st.parentNode.insertBefore(pr,st);
  const as=document.createElement('aside');as.className='ctl';as.setAttribute('aria-label','کنترل نمونه');pr.appendChild(as);pr.appendChild(st);
  const hb=document.createElement('button');hb.className='ctl-tab';hb.dataset.act='ctlOpen';hb.setAttribute('aria-label','کنترل نمونه');hb.innerHTML=ic('list');pr.appendChild(hb);
  let sig='';const upd=()=>{const s=[ctlKey(),!!UI.fakeOff,S.sub.left<=5,S.settings.theme].join('|');if(s===sig)return;sig=s;const y=($('.ctl-list',as)||{}).scrollTop||0;as.innerHTML=ctlH();const l=$('.ctl-list',as);l.scrollTop=y;
    const cur=$('.ctl-item[aria-current="true"]',as);if(cur){const r=cur.getBoundingClientRect(),lr=l.getBoundingClientRect();if(r.top<lr.top||r.bottom>lr.bottom)cur.scrollIntoView({block:'nearest'});}};
  upd();setInterval(upd,250);}
