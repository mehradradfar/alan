/* ---------- static catalogs ---------- */
const OCH={ // online channels (synced)
  web:{name:'وب‌سایت',icon:'globe',desc:'فروشگاه اینترنتی خودتان'},
  dk:{name:'دیجی‌کالا',icon:'bag',desc:'بازار آنلاین'},
  snapp:{name:'اسنپ‌شاپ',icon:'zap',desc:'بازار آنلاین'}
};
const EXTRA_CH={basalam:{name:'باسلام',icon:'store',desc:'بازار آنلاین محصولات ایرانی'},torob:{name:'ترب',icon:'search',desc:'به‌زودی',soon:true}};
const SCH={ // where a sale happened
  store:{name:'حضوری',icon:'store'},insta:{name:'اینستاگرام',icon:'insta'},telegram:{name:'تلگرام',icon:'send'},whatsapp:{name:'واتس‌اپ',icon:'chat'},
  web:{name:'وب‌سایت',icon:'globe'},dk:{name:'دیجی‌کالا',icon:'bag'},snapp:{name:'اسنپ‌شاپ',icon:'zap'},other:{name:'دیگر',icon:'dots'}
};
const MANUAL=['store','insta','telegram','whatsapp','other'];
const CODE={'مشکی':'BLK','سفید':'WHT','سرمه‌ای':'NVY','طوسی':'GRY','قهوه‌ای':'BRN','قرمز':'RED','آبی':'BLU','سبز':'GRN','کرم':'CRM','صورتی':'PNK','زرد':'YLW','بنفش':'PRP'};
const PLANS=[
  {id:'basic',name:'پایه',m:290000,y:2900000,feat:['۱ کانال فروش','۱۰۰ محصول','گزارش ساده']},
  {id:'pro',name:'حرفه‌ای',m:590000,y:5900000,feat:['۳ کانال فروش','محصول نامحدود','دستیار هوشمند','گزارش کامل']},
  {id:'biz',name:'تجاری',m:1190000,y:11900000,feat:['کانال نامحدود','۵ عضو تیم','پشتیبانی اختصاصی']}
];

/* ---------- helpers on state ---------- */
let S=null;
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function cart(arrs){return arrs.reduce((a,b)=>a.flatMap(x=>b.map(y=>[...x,y])),[[]]);}
function skuFor(code,opts){return code+(opts.length?'-'+opts.map((o,i)=>CODE[o]||(/^[A-Za-z0-9]+$/.test(o)?o.toUpperCase():'V'+(i+1))).join('-'):'');}
function barcode(n){return '626'+String(1e9+n*7919).slice(-9)+String(n%10);}
function mkVariants(code,attrs,stocks){
  const combos=attrs.length?cart(attrs.map(a=>a.values)):[[]];
  return combos.map((opts,i)=>({id:uid(),opts,sku:skuFor(code,opts),barcode:barcode(Math.floor(Math.random()*9e5)+i),stock:stocks?(stocks[i]??5):0}));
}
const P_=id=>S.products.find(p=>p.id===id);
const V_=(p,vid)=>p.variants.find(v=>v.id===vid);
const catName=id=>(S.cats.find(c=>c.id===id)||{name:'بدون دسته'}).name;
const totalStock=p=>p.variants.reduce((a,v)=>a+v.stock,0);
const vLabel=v=>v.opts.length?v.opts.join(' · '):'تک';
const strat=id=>S.strategies.find(s=>s.id===id)||S.strategies[0];
function applyStr(base,st){let v=base*(1+st.pct/100);if(st.round)v=Math.round(v/st.round)*st.round;return Math.round(v);}
function chPrice(p,cid){const c=p.ch[cid];if(!c||!c.on)return null;if(c.price)return c.price;return applyStr(p.price,strat(S.channels[cid].strategy));}
function stratDesc(st){if(!st.pct)return 'همان قیمت پایه';return `${fa(Math.abs(st.pct))}٪ ${st.pct>0?'بالاتر':'پایین‌تر'} از قیمت پایه${st.round?'، گرد به '+short(st.round):''}`;}
/* per-variant channel settings: v.ch[cid] = {price: separate price|null, stock: sellable cap|null, off: bool} */
const vch=(v,cid)=>(v.ch&&v.ch[cid])||{};
function setVch(v,cid,patch){v.ch=v.ch||{};v.ch[cid]={...vch(v,cid),...patch};}
function vPrice(p,v,cid){const o=vch(v,cid);if(o.price)return o.price;return chPrice(p,cid);}
function vOn(p,v,cid){return !!(p.ch[cid]&&p.ch[cid].on)&&!vch(v,cid).off;}
function vStock(p,v,cid){if(!vOn(p,v,cid))return 0;const o=vch(v,cid);return o.stock!=null?Math.min(o.stock,v.stock):v.stock;}
function snapOf(p,cid){return {price:chPrice(p,cid),vp:Object.fromEntries(p.variants.map(v=>[v.id,vPrice(p,v,cid)])),stock:Object.fromEntries(p.variants.map(v=>[v.id,vStock(p,v,cid)]))};}
function connectedCh(){return Object.keys(OCH).filter(c=>S.channels[c]&&S.channels[c].connected);}
function changesFor(p){
  const out=[];
  for(const cid of connectedCh()){
    const on=p.ch[cid]&&p.ch[cid].on;const snap=(S.synced[p.id]||{})[cid];
    if(!on){if(snap)out.push({cid,kind:'remove'});continue;}
    if(!snap){out.push({cid,kind:'new'});continue;}
    const pr=chPrice(p,cid);if(pr!==snap.price)out.push({cid,kind:'price',from:snap.price,to:pr});
    else if(snap.vp&&p.variants.some(v=>snap.vp[v.id]!=null&&snap.vp[v.id]!==vPrice(p,v,cid)))out.push({cid,kind:'vprice'});
    if(p.variants.some(v=>snap.stock[v.id]!==vStock(p,v,cid))){const f=Object.values(snap.stock).reduce((a,b)=>a+b,0);out.push({cid,kind:'stock',from:f,to:p.variants.reduce((a,v)=>a+vStock(p,v,cid),0)});}
  }
  return out;
}
function pendingAll(){return S.products.map(p=>({p,ch:changesFor(p)})).filter(x=>x.ch.length);}
function pendingCount(){return pendingAll().length;}
function chStatus(p,cid){const c=p.ch[cid];if(!c||!c.on)return 'off';if(S.channels[cid].status==='expired'&&changesFor(p).some(x=>x.cid===cid))return 'fail';return changesFor(p).some(x=>x.cid===cid)?'pending':'ok';}
function changeText(c){const n=OCH[c.cid].name;if(c.kind==='new')return `افزودن به ${n}`;if(c.kind==='remove')return `حذف از ${n}`;if(c.kind==='price')return `قیمت ${n}: ${money(c.from)} ← ${money(c.to)}`;if(c.kind==='vprice')return `قیمت جدای تنوع در ${n}`;return `موجودی ${n}: ${fa(c.from)} ← ${fa(c.to)}`;}
function saleTotal(s){const sub=s.items.reduce((a,i)=>a+i.price*i.qty,0);return Math.max(0,sub-(s.discount||0)+(s.extra||0));}
function saleQty(s){return s.items.reduce((a,i)=>a+i.qty,0);}
function lowStock(){const th=S.settings.low;return S.products.flatMap(p=>p.variants.filter(v=>v.stock<=th).map(v=>({p,v}))).sort((a,b)=>a.v.stock-b.v.stock);}
function unread(){return S.notifs.filter(n=>!n.read).length;}
function notify(type,title,body){S.notifs.unshift({id:uid(),t:Date.now(),type,title,body,read:false});}

/* ---------- seed ---------- */
function seed(){
  const r=rng(11);const now=Date.now();
  const defs=[
    {id:'p1',name:'تی‌شرت نخی بیسیک',cat:'c1',img:'img/tshirt.webp',price:450000,code:'TS',specs:[['جنس','نخ پنبه'],['یقه','گرد']],attrs:[{name:'رنگ',values:['مشکی','سفید','سرمه‌ای']},{name:'سایز',values:['M','L','XL']}],stocks:[12,8,3,15,10,0,6,4,2],snapp:true},
    {id:'p2',name:'هودی کلاه‌دار',cat:'c2',img:'img/hoodie.webp',price:1250000,code:'HD',specs:[['جنس','دورس پنبه'],['آستر','کرکی']],attrs:[{name:'رنگ',values:['طوسی','مشکی']},{name:'سایز',values:['M','L','XL']}],stocks:[7,9,4,5,3,1],snapp:true},
    {id:'p3',name:'شلوار جین راسته',cat:'c3',img:'img/jeans.webp',price:1480000,code:'JN',specs:[['جنس','جین کتان'],['فیت','راسته']],attrs:[{name:'سایز',values:['30','32','34','36']}],stocks:[6,11,8,2],snapp:true},
    {id:'p4',name:'کتانی سفید روزمره',cat:'c4',img:'img/sneakers.webp',price:2350000,code:'SN',specs:[['رویه','چرم مصنوعی'],['زیره','لاستیک']],attrs:[{name:'سایز',values:['40','41','42','43','44']}],stocks:[3,5,7,4,2],snapp:false},
    {id:'p5',name:'کیف دوشی چرم',cat:'c5',img:'img/bag.webp',price:1890000,code:'BG',specs:[['جنس','چرم طبیعی']],attrs:[{name:'رنگ',values:['قهوه‌ای','مشکی']}],stocks:[9,6],snapp:false},
    {id:'p6',name:'جوراب ساق‌بلند (۳ جفت)',cat:'c1',img:'',price:180000,code:'SK',specs:[],attrs:[],stocks:[0],snapp:false},
    {id:'p7',name:'کلاه بیسبال',cat:'c5',img:'',price:390000,code:'CP',specs:[],attrs:[{name:'رنگ',values:['مشکی','کرم']}],stocks:[3,2],snapp:false}
  ];
  const products=defs.map((d,i)=>({id:d.id,name:d.name,cat:d.cat,img:d.img,price:d.price,cost:Math.round(d.price*.6/1000)*1000,code:d.code,specs:d.specs,desc:'',attrs:d.attrs,variants:mkVariants(d.code,d.attrs,d.stocks),
    ch:{web:{on:true,price:null},dk:{on:i!==5,price:null},snapp:{on:d.snapp,price:null}},created:now-(10-i)*DAY*3}));
  S={v:2,onboarded:false,user:{phone:'',name:'نیلا رضایی',shop:'پوشاک نیلا'},
    settings:{theme:'light',notif:true,low:3,autoStock:true},
    channels:{web:{connected:true,status:'ok',strategy:'s_base',last:now-36e5*2},dk:{connected:true,status:'ok',strategy:'s_dk',last:now-36e5*2},snapp:{connected:true,status:'expired',strategy:'s_mk',last:now-DAY*3}},
    strategies:[{id:'s_base',name:'قیمت پایه',pct:0,round:0},{id:'s_dk',name:'دیجی‌کالا ۶٪ بالاتر',pct:6,round:1000},{id:'s_mk',name:'مارکت‌پلیس ۴٪ بالاتر',pct:4,round:1000}],
    cats:[{id:'c1',name:'تی‌شرت'},{id:'c2',name:'هودی'},{id:'c3',name:'شلوار'},{id:'c4',name:'کفش'},{id:'c5',name:'اکسسوری'}],
    products,synced:{},sales:[],notifs:[],versions:[],
    sub:{plan:'pro',left:24,total:30,cycle:'m'},
    team:[{id:'t1',name:'نیلا رضایی',role:'مالک',phone:'۰۹۱۲ ۳۴۵ ۶۷۸۹',me:true},{id:'t2',name:'سارا محمدی',role:'فروشنده',phone:'۰۹۳۵ ۱۱۲ ۲۲۳۳'}],
    cart:{items:[],channel:'store',buyer:'',discount:0,extra:0},seq:1000,lastPull:0};
  // synced snapshot = current: nothing is pending until the user changes something
  products.forEach(p=>{S.synced[p.id]={};connectedCh().forEach(c=>{if(p.ch[c].on)S.synced[p.id][c]=snapOf(p,c);});});
  // 30 days of sales
  const chW=[['store',30],['insta',22],['dk',18],['web',14],['telegram',8],['snapp',5],['whatsapp',3]];
  const pickCh=()=>{let x=r()*100;for(const [c,w] of chW){if((x-=w)<0)return c;}return 'store';};
  const sales=[];
  for(let d=29;d>=0;d--){
    const n=2+Math.floor(r()*5)+(d%7===2?3:0);
    for(let k=0;k<n;k++){
      const t=now-d*DAY-Math.floor(r()*10*36e5)-(d===0?0:36e5);
      if(t>now)continue;
      const items=[];const ni=1+(r()<.3?1:0);
      for(let j=0;j<ni;j++){const p=products[Math.floor(r()*5)];const v=p.variants[Math.floor(r()*p.variants.length)];const c=pickCh();items.push({pid:p.id,vid:v.id,qty:r()<.2?2:1,price:p.price,_c:c});}
      const channel=items[0]._c;items.forEach(i=>{delete i._c;if(OCH[channel])i.price=chPrice(P_(i.pid),channel)||i.price;});
      sales.push({id:uid(),t,channel,items,discount:r()<.15?50000:0,extra:0,buyer:'',status:'done'});
    }
  }
  sales.sort((a,b)=>a.t-b.t).forEach(s=>s.no=++S.seq);
  sales[sales.length-9].status='cancelled';
  S.sales=sales.reverse();
  S.genAt=now;
  S.notifs=[
    {id:uid(),t:now-18e5,type:'err',title:'ارسال به اسنپ‌شاپ انجام نشد',body:'اتصال منقضی شده. یک بار دوباره وصل شوید.',read:false,act:'channel|snapp'},
    {id:uid(),t:now-36e5*3,type:'warn',title:'موجودی تی‌شرت سفید XL تمام شد',body:'برای فروش دوباره، موجودی را به‌روز کنید.',read:false,act:'product|p1'},
    {id:uid(),t:now-36e5*20,type:'ok',title:'۳ سفارش جدید از دیجی‌کالا',body:'موجودی خودکار کم شد.',read:true,act:'tab|reports'},
    {id:uid(),t:now-DAY*2,type:'info',title:'۶ روز از اشتراک باقی مانده',body:'برای قطع‌نشدن همگام‌سازی، تمدید کنید.',read:true,act:'plans'}
  ];
  S.versions=[
    {id:uid(),t:now-36e5*2,title:'قیمت هودی‌ها',items:[{pid:'p2',lines:['قیمت دیجی‌کالا']}],res:{web:'ok',dk:'ok'},prices:{}},
    {id:uid(),t:now-DAY,title:'موجودی بعد از فروش حضوری',items:[{pid:'p1',lines:['موجودی']},{pid:'p3',lines:['موجودی']}],res:{web:'ok',dk:'ok',snapp:'fail'},prices:{}},
    {id:uid(),t:now-DAY*4,title:'افزودن کیف دوشی چرم',items:[{pid:'p5',lines:['محصول جدید']}],res:{web:'ok',dk:'ok'},prices:{}}
  ];
  S.versions.forEach(v=>v.prices=Object.fromEntries(S.products.map(p=>[p.id,p.price])));
  return S;
}

/* ---------- keep demo sales flowing ----------
   The seed covers the 30 days before it was created. When the demo is opened
   on later days (or later the same day) we add random sales for the time that
   has passed, so today and yesterday are never empty. Stock is not touched, so
   nothing becomes "pending" without the user changing it. */
const DEMO_CH=[['store',30],['insta',22],['dk',18],['web',14],['telegram',8],['snapp',5],['whatsapp',3]];
function topUpSales(){
  if(!S||!S.products.length)return 0;
  const now=Date.now();
  if(!S.genAt){const last=S.sales.reduce((m,s)=>Math.max(m,s.t),0);S.genAt=last||now;}
  let from=Math.max(S.genAt,now-35*DAY);if(from>=now)return 0;
  const pick=()=>{let x=Math.random()*100;for(const [c,w] of DEMO_CH){if((x-=w)<0)return c;}return 'store';};
  const withImg=S.products.filter(p=>p.variants.length);const added=[];
  // walk hour by hour through opening hours (9:00–22:00); each hour has a chance of a sale
  let h=new Date(from);h.setMinutes(0,0,0);
  for(let t=h.getTime();t<now;t+=36e5){
    const hr=new Date(t).getHours();if(hr<9||hr>=22)continue;
    const busy=hr>=17&&hr<21?0.65:0.42;
    const n=Math.random()<busy?(Math.random()<0.18?2:1):0;
    for(let k=0;k<n;k++){
      const st=t+Math.floor(Math.random()*36e5);if(st<=from||st>now)continue;
      const ch=pick();const items=[];const ni=Math.random()<0.28?2:1;
      for(let j=0;j<ni;j++){const p=withImg[Math.floor(Math.random()*withImg.length)];const v=p.variants[Math.floor(Math.random()*p.variants.length)];
        const price=OCH[ch]&&S.channels[ch]&&S.channels[ch].connected?(vPrice(p,v,ch)||p.price):p.price;
        items.push({pid:p.id,vid:v.id,qty:Math.random()<0.2?2:1,price});}
      added.push({id:uid(),t:st,channel:ch,items,discount:Math.random()<0.12?50000:0,extra:0,buyer:'',status:'done',demo:true});
    }
  }
  // never leave a day in the range empty (testing wants today and yesterday to have data)
  for(let ds=sod(from);ds<=now;ds+=DAY){const de=ds+DAY;const lo=Math.max(from,ds),hi=Math.min(now,de);if(hi-lo<6e4)continue;
    const has=S.sales.some(s=>s.t>=ds&&s.t<de)||added.some(s=>s.t>=ds&&s.t<de);if(has)continue;
    const n=2+Math.floor(Math.random()*3);for(let k=0;k<n;k++){const st=lo+Math.floor(Math.random()*(hi-lo));const p=withImg[Math.floor(Math.random()*withImg.length)];const v=p.variants[Math.floor(Math.random()*p.variants.length)];const ch=pick();
      added.push({id:uid(),t:st,channel:ch,items:[{pid:p.id,vid:v.id,qty:1,price:OCH[ch]&&S.channels[ch]&&S.channels[ch].connected?(vPrice(p,v,ch)||p.price):p.price}],discount:0,extra:0,buyer:'',status:'done',demo:true});}}
  added.sort((a,b)=>a.t-b.t).forEach(s=>s.no=++S.seq);
  if(added.length){S.sales=S.sales.concat(added).sort((a,b)=>b.t-a.t);}
  S.genAt=now;save();return added.length;
}
