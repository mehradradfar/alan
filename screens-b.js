/* ===== REPORTS ===== */
Object.assign(UI,{rp:1,rt:'bar',rm:'rev'});
TABS.reports=()=>{
  const days=[1,7,30][UI.rp],now=Date.now(),from=sod(now)-(days-1)*DAY,pf=from-days*DAY;
  const cur=sumRange(from,now+1),prev=sumRange(pf,from);
  const cd=days===1?7:days;const vals=series(cd,UI.rm);
  const inR=S.sales.filter(s=>s.t>=from&&s.status==='done');
  const byCh={};inR.forEach(s=>byCh[s.channel]=(byCh[s.channel]||0)+saleTotal(s));const chs=Object.entries(byCh).sort((a,b)=>b[1]-a[1]);
  const byP={};inR.forEach(s=>s.items.forEach(i=>{const o=byP[i.pid]=byP[i.pid]||{q:0,r:0};o.q+=i.qty;o.r+=i.qty*i.price;}));const tops=Object.entries(byP).sort((a,b)=>b[1].q-a[1].q).slice(0,5);
  const recent=S.sales.filter(s=>s.t>=from).slice(0,5);const lab=['امروز','۷ روز اخیر','۳۰ روز اخیر'][UI.rp];
  return `${rootHdr('گزارش',[['list','sales']])}<div class="scroll">
    ${chipsRow(['امروز','۷ روز','۳۰ روز'],UI.rp,'rp')}
    <div class="stagger">
    <div class="pad" style="padding-top:18px"><div class="muted small">فروش ${lab}</div><div class="bignum num"><span data-count="${cur.rev}">${money(cur.rev)}</span><small>تومان</small></div><div class="small" style="font-weight:700">${delta(cur.rev,prev.rev,days===1?'نسبت به دیروز':'نسبت به دوره قبل')}</div></div>
    ${cur.n||cur.c?`
    <div class="sec" style="padding-top:16px"><div class="grow">${seg(['مبلغ','تعداد'],UI.rm==='rev'?0:1,'rm')}</div><div class="vtog" style="margin-right:10px"><button class="${UI.rt==='bar'?'on':''}" data-act="rt|bar" aria-label="ستونی">${ic('chart')}</button><button class="${UI.rt==='line'?'on':''}" data-act="rt|line" aria-label="خطی">${ic('line')}</button></div></div>
    ${chartH(vals,{type:UI.rt,hi:cd-1,labels:dayLabels(cd),metric:UI.rm==='rev'?'rev':'orders'})}
    <div class="tiles" style="margin-top:18px">
      <div class="tilem"><div class="l">سفارش</div><div class="v num">${fa(cur.n)}</div><div class="d">${delta(cur.n,prev.n)}</div></div>
      <div class="tilem"><div class="l">میانگین هر سفارش</div><div class="v num">${short(cur.n?cur.rev/cur.n:0)}</div><div class="d muted" style="font-weight:400">تومان</div></div>
      <div class="tilem"><div class="l">کالای فروخته‌شده</div><div class="v num">${fa(cur.q)}</div><div class="d">${delta(cur.q,prev.q)}</div></div>
      <button class="tilem" data-act="salesCancelled"><div class="l">لغوشده</div><div class="v num">${fa(cur.c)}</div><div class="d muted" style="font-weight:400">سفارش</div></button>
    </div>
    ${secH('سهم کانال‌ها')}<div class="pad">${chs.map(([c,v])=>{const p=Math.round(v/cur.rev*100);return `<div class="chrow"><span class="tile">${ic((SCH[c]||SCH.other).icon)}</span><div class="grow"><div class="row" style="gap:6px"><span class="grow">${(SCH[c]||SCH.other).name}</span><b class="num">${fa(p)}٪</b></div><div class="track"><i style="width:${Math.max(2,p)}%"></i></div></div></div>`;}).join('')}</div>
    ${secH('پرفروش‌ها')}<div class="list">${tops.map(([pid,o],i)=>{const p=P_(pid);return `<button class="li" data-act="product|${pid}"><span class="rank">${fa(i+1)}</span>${thumbH(p,44)}<div class="grow"><div class="t1">${esc(p?p.name:'محصول حذف‌شده')}</div><div class="t2">${fa(o.q)} عدد</div></div><span class="val num">${short(o.r)}</span></button>`;}).join('')}</div>
    ${secH('فروش‌ها','sales')}<div class="list">${recent.map(saleRow).join('')}</div>`
    :emptyV('chart','در این بازه فروشی نبود',days===1?'اولین فروش امروز را ثبت کنید.':'بازه دیگری را انتخاب کنید.',days===1?'ثبت فروش':null,'sale')}
  </div></div>`;
};
TABS.reports.after=el=>{const e=$('[data-count]',el);if(e)countUp(e,+e.dataset.count,v=>money(v));};
A.rp=i=>{UI.rp=+i;refresh();};A.rt=t=>{UI.rt=t;refresh();};A.rm=i=>{UI.rm=+i?'orders':'rev';refresh();};
A.salesCancelled=()=>{UI.sf=3;push(SalesScreen,{});};

/* ===== SALES LIST ===== */
UI.sf=0;UI.sq2='';
const SF=['همه','حضوری','آنلاین','لغوشده'];
function salesListH(){let l=S.sales;const q=UI.sq2.trim();
  if(UI.sf===1)l=l.filter(s=>MANUAL.includes(s.channel)&&s.status==='done');if(UI.sf===2)l=l.filter(s=>OCH[s.channel]&&s.status==='done');if(UI.sf===3)l=l.filter(s=>s.status!=='done');
  if(q)l=l.filter(s=>String(s.no).includes(q.replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))||s.items.some(i=>{const p=P_(i.pid);return p&&p.name.includes(q);})||(s.buyer||'').includes(q));
  if(!S.sales.length)return emptyV('bag','هنوز فروشی ندارید','فروش حضوری یا آنلاین را ثبت کنید تا اینجا ببینید.','ثبت فروش','sale');
  if(!l.length)return emptyV(q?'search':'bag',q?'چیزی پیدا نشد':'موردی نیست',q?'شماره فروش یا نام کالا را دوباره بنویسید.':UI.sf===3?'فروش لغوشده‌ای ندارید.':'در این دسته فروشی نیست.');
  const g={};l.forEach(s=>{const d=sod(s.t);(g[d]=g[d]||[]).push(s);});
  return Object.entries(g).sort((a,b)=>b[0]-a[0]).map(([d,ss])=>{d=+d;const lbl=d===sod(Date.now())?'امروز':d===sod(Date.now()-DAY)?'دیروز':`${dayFull(d)} ${dateStr(d)}`;const tot=ss.filter(s=>s.status==='done').reduce((a,s)=>a+saleTotal(s),0);
    return `<div class="dayh"><span>${lbl}</span><span class="num">${money(tot)}</span></div><div class="list">${ss.map(saleRow).join('')}</div>`;}).join('');}
function SalesScreen(){return `${navBar('فروش‌ها',{trail:'plus',trailAct:'sale'})}<label class="search">${ic('search')}<input data-on="sq2" placeholder="شماره فروش، کالا یا خریدار" value="${esc(UI.sq2)}"></label>${chipsRow(SF,UI.sf,'sf')}<div class="scroll no-tab" id="sll" style="padding-top:6px">${salesListH()}</div>`;}
ON.sq2=v=>{UI.sq2=v;$('#sll').innerHTML=salesListH();};
A.sf=i=>{UI.sf=+i;refresh();};
A.sales=()=>{push(SalesScreen,{});};

/* ===== SALE DETAIL ===== */
A.saleDetail=id=>push(SaleDetail,{id});
function SaleDetail({id}){const s=S.sales.find(x=>x.id===id);if(!s)return navBar('فروش')+emptyV('bag','این فروش پیدا نشد','','بازگشت','back');
  const c=SCH[s.channel]||SCH.other;const done=s.status==='done';const sub=s.items.reduce((a,i)=>a+i.price*i.qty,0);
  return `${navBar('فروش #'+fa(s.no),{trail:'up',trailAct:'shareSale|'+id})}<div class="scroll no-tab">
    <div class="pad" style="text-align:center;padding-top:8px"><span class="pill" style="background:${done?'var(--green-soft)':'var(--red-soft)'};color:${done?'var(--green)':'var(--red)'}">${done?'ثبت‌شده':'لغوشده'}</span>
    <div class="bignum num" style="justify-content:center;${done?'':'text-decoration:line-through;color:var(--text3)'}">${money(saleTotal(s))}<small>تومان</small></div>
    <div class="muted small">${c.name} · ${dayFull(s.t)} ${dateStr(s.t)} · ساعت ${timeStr(s.t)}</div></div>
    ${!done?`<div style="margin-top:14px">${banner('refresh','این فروش لغو شده',`${s.cancelledAt?ago(s.cancelledAt)+' · ':''}موجودی به انبار برگشت`,'','','err')}</div>`:''}
    <div class="sec"><div class="h2">کالاها</div><span class="muted small">${fa(saleQty(s))} عدد</span></div>
    <div class="list">${s.items.map(i=>{const p=P_(i.pid);const v=p&&V_(p,i.vid);return `<button class="li" data-act="product|${i.pid}">${thumbH(p,44)}<div class="grow"><div class="t1">${esc(p?p.name:'محصول حذف‌شده')}</div><div class="t2">${v?esc(vLabel(v))+' · ':''}${fa(i.qty)} × ${money(i.price)}</div></div><span class="price num">${money(i.qty*i.price)}</span></button>`;}).join('')}</div>
    <div class="pad" style="margin-top:12px"><div class="kv"><span class="k">جمع کالاها</span><span class="num">${money(sub)}</span></div>${s.discount?`<div class="kv"><span class="k">تخفیف</span><span class="num" style="color:var(--red)">−${money(s.discount)}</span></div>`:''}${s.extra?`<div class="kv"><span class="k">هزینه ارسال</span><span class="num">+${money(s.extra)}</span></div>`:''}<div class="hr"></div><div class="kv" style="font-weight:700"><span>مبلغ نهایی</span><span class="num">${toman(saleTotal(s))}</span></div>
    ${s.buyer?`<div class="kv"><span class="k">خریدار</span><span>${esc(s.buyer)}</span></div>`:''}</div>
  </div>${done?`<div class="bottom"><button class="btn danger" data-act="cancelSale|${id}">لغو این فروش</button></div>`:''}`;}
A.cancelSale=(id,after)=>{const s=S.sales.find(x=>x.id===id);confirmSheet('این فروش لغو شود؟',`${fa(saleQty(s))} کالا به موجودی برمی‌گردد.<br>فروش در گزارش با برچسب «لغوشده» می‌ماند.`,'لغو فروش',()=>{s.status='cancelled';s.cancelledAt=Date.now();s.items.forEach(i=>{const p=P_(i.pid);const v=p&&V_(p,i.vid);if(v)v.stock+=i.qty;});save();if(after==='pop')pop();else refresh();toast('فروش لغو شد','موجودی برگشت');});};
A.shareSale=id=>{const s=S.sales.find(x=>x.id===id);const txt=`${S.user.shop}\nفروش #${fa(s.no)} · ${dateStr(s.t)}\n`+s.items.map(i=>{const p=P_(i.pid);return `${p?p.name:''} × ${fa(i.qty)}: ${money(i.price*i.qty)}`;}).join('\n')+`\nمبلغ نهایی: ${toman(saleTotal(s))}`;
  const copy=()=>{try{navigator.clipboard.writeText(txt).then(()=>toast('متن فاکتور کپی شد','حالا هر جا خواستید بچسبانید','info'),()=>toast('کپی نشد','دوباره امتحان کنید','err'));}catch(e){toast('کپی نشد','دوباره امتحان کنید','err');}};
  if(navigator.share){navigator.share({title:'فاکتور',text:txt}).catch(e=>{if(e&&e.name!=='AbortError')copy();});}else copy();};

/* ===== RECORD SALE ===== */
Object.assign(UI,{scat:-1,sq3:''});
function cartN(){return S.cart.items.reduce((a,i)=>a+i.qty,0);}
function cartSub(){return S.cart.items.reduce((a,i)=>a+i.qty*i.price,0);}
function cartTotal(){return Math.max(0,cartSub()-S.cart.discount+S.cart.extra);}
function cartAdd(pid,vid,q){const p=P_(pid),v=V_(p,vid);const it=S.cart.items.find(i=>i.vid===vid);const cur=it?it.qty:0;
  if(cur+q>v.stock){toast('موجودی کافی نیست',v.stock?`فقط ${fa(v.stock)} عدد از این کالا دارید`:'این کالا تمام شده','err');return false;}
  if(it)it.qty+=q;else S.cart.items.push({pid,vid,qty:q,price:p.price});S.cart.items=S.cart.items.filter(i=>i.qty>0);UI._bump=true;save();haptic();return true;}
A.sale=()=>{UI._cbWas=cartN()>0;push(SaleScreen,{});};
function salePs(){let ps=S.products;if(UI.scat>=0)ps=ps.filter(p=>p.cat===S.cats[UI.scat].id);const q=UI.sq3.trim();if(q)ps=ps.filter(p=>p.name.includes(q)||p.variants.some(v=>v.sku.toLowerCase().includes(q.toLowerCase())));return ps;}
function pgridH(){const ps=salePs();if(!S.products.length)return emptyV('box','محصولی ندارید','اول محصول اضافه کنید، بعد فروش ثبت کنید.','افزودن محصول','addProduct');
  if(!ps.length)return emptyV('search','چیزی پیدا نشد','نام کالا را دوباره بنویسید.');
  return `<div class="pgrid">${ps.map(p=>{const ts=totalStock(p);const inCart=S.cart.items.filter(i=>i.pid===p.id).reduce((a,i)=>a+i.qty,0);const single=p.variants.length===1;
    return `<div class="pc ${ts<=0?'out':''}"><div class="im" data-act="pcTap|${p.id}">${p.img?`<img src="${p.img}" alt="" loading="lazy">`:`<div class="noimg">${ic('tag')}</div>`}${ts<=0?'<span class="tag">ناموجود</span>':ts<=S.settings.low?`<span class="tag" style="color:var(--orange)">${fa(ts)} عدد</span>`:''}
      <div class="add">${single&&inCart?`<button data-act="pcQ|${p.id}|-1" aria-label="کم">−</button><b class="num">${fa(inCart)}</b><button data-act="pcQ|${p.id}|1" aria-label="زیاد">+</button>`:inCart?`<b class="num" style="padding:0 6px">${fa(inCart)}</b><button data-act="pcTap|${p.id}" aria-label="افزودن">+</button>`:`<button data-act="pcTap|${p.id}" aria-label="افزودن">+</button>`}</div></div>
      <div class="t1" style="font-size:14px;margin-top:4px">${esc(p.name)}</div><div class="price num">${money(p.price)} <span class="muted tiny" style="font-weight:400">تومان</span></div></div>`;}).join('')}</div>`;}
function SaleScreen(){const n=cartN();
  return `${navBar('ثبت فروش',{trail:'scan',trailAct:'scan'})}<label class="search">${ic('search')}<input data-on="sq3" placeholder="جستجوی کالا" value="${esc(UI.sq3)}"></label>
  ${chipsRow(['همه',...S.cats.map(c=>c.name)],UI.scat+1,'scat')}
  <div class="scroll no-tab" id="pg" style="padding-top:8px">${pgridH()}</div>
  <button class="cartbar ${UI._cbWas&&n?'in':''}" data-act="cart"><span class="ci ${UI._bump?'bump':''}">${ic('bag')}<i>${fa(n)}</i></span><div class="grow" style="text-align:right"><b class="num">${toman(cartSub())}</b><div class="tiny" style="opacity:.8">${fa(n)} کالا در سبد</div></div><span class="btn sm" style="background:#fff;color:var(--accent)">ادامه</span></button>`;}
SaleScreen.after=el=>{const n=cartN();const cb=$('.cartbar',el);if(n&&!UI._cbWas)requestAnimationFrame(()=>requestAnimationFrame(()=>cb.classList.add('in')));UI._cbWas=n>0;UI._bump=false;};
ON.sq3=v=>{UI.sq3=v;$('#pg').innerHTML=pgridH();};
A.scat=i=>{UI.scat=+i-1;refresh();};
const saleRefresh=()=>{const top=UI.stack[UI.stack.length-1];if(top&&top.fn===SaleScreen){const y=$('#pg',top.el).scrollTop;renderInto(top.el,SaleScreen);$('#pg',top.el).scrollTop=y;}else refresh();};
A.pcTap=pid=>{const p=P_(pid);if(totalStock(p)<=0)return toast('موجودی کافی نیست','این کالا تمام شده','err');if(p.variants.length===1){if(cartAdd(pid,p.variants[0].id,1))saleRefresh();return;}pickVariant(pid,saleRefresh);};
A.pcQ=(pid,d)=>{const p=P_(pid);if(cartAdd(pid,p.variants[0].id,+d))saleRefresh();};
function pickVariant(pid,done){const p=P_(pid);const sel=p.attrs.map((a,i)=>{const v=p.variants.find(v=>v.stock>0)||p.variants[0];return v.opts[i];});let q=1;
  const cur=()=>p.variants.find(v=>v.opts.every((o,i)=>o===sel[i]));
  const sh=sheet('',()=>{const v=cur();const ok=v&&v.stock>0;return `<div class="pad"><div class="row" style="gap:14px">${thumbH(p,72)}<div class="grow"><div class="t1" style="font-weight:700;font-size:17px">${esc(p.name)}</div><div class="price num" style="margin-top:4px">${toman(p.price)}</div><div class="small" style="margin-top:4px">${v?v.stock<=0?'<span class="st err">این ترکیب تمام شده</span>':`<span class="st ${v.stock<=S.settings.low?'warn':'ok'}">${fa(v.stock)} عدد موجود</span>`:'—'}</div></div></div>
    ${p.attrs.map((a,i)=>`<div class="lbl">${esc(a.name)}</div><div class="chips" style="padding:0;flex-wrap:wrap;row-gap:8px">${a.values.map(val=>{const any=p.variants.some(x=>x.opts[i]===val&&x.stock>0&&x.opts.every((o,k)=>k===i||o===sel[k]));return `<button class="chip ${sel[i]===val?'on':''}" ${any||sel[i]===val?'':'style="opacity:.45;text-decoration:line-through"'} data-act="pvSel|${i}|${encodeURIComponent(val)}">${esc(val)}</button>`;}).join('')}</div>`).join('')}
    <div class="row" style="margin-top:22px"><span class="grow">تعداد</span>${stepper(q,'pvQ|-1','pvQ|1')}</div>
    <button class="btn primary" style="margin-top:20px" data-act="pvAdd" ${ok?'':'disabled'}>${ok?`افزودن · ${money(p.price*q)} تومان`:'ناموجود'}</button></div>`;},{left:'بستن'});
  A.pvSel=(i,val)=>{sel[+i]=decodeURIComponent(val);q=1;sh.render();};A.pvQ=d=>{const v=cur();q=Math.max(1,Math.min(v?v.stock:1,q+(+d)));sh.render();};
  A.pvAdd=()=>{const v=cur();if(cartAdd(pid,v.id,q)){sh.close();toast('به سبد اضافه شد',`${esc(p.name)} · ${esc(vLabel(v))}`);done&&done();}};}
A.quickSale=pid=>{const p=P_(pid);if(totalStock(p)<=0)return toast('موجودی کافی نیست','این کالا تمام شده','err');const go=()=>push(CartScreen,{});if(p.variants.length===1){if(cartAdd(pid,p.variants[0].id,1))go();}else pickVariant(pid,go);};

/* ===== CART ===== */
A.cart=()=>{if(!cartN())return;push(CartScreen,{});};
function cartSumH(){const c=S.cart;return `<div class="kv"><span class="k">جمع کالاها</span><span class="num">${money(cartSub())}</span></div>${c.discount?`<div class="kv"><span class="k">تخفیف</span><span class="num" style="color:var(--red)">−${money(c.discount)}</span></div>`:''}${c.extra?`<div class="kv"><span class="k">هزینه ارسال</span><span class="num">+${money(c.extra)}</span></div>`:''}<div class="hr"></div><div class="kv" style="font-weight:700;font-size:17px"><span>مبلغ نهایی</span><span class="num">${toman(cartTotal())}</span></div>`;}
function CartScreen(){const c=S.cart;
  if(!c.items.length)return `${navBar('سبد فروش')}<div class="scroll no-tab">${emptyV('bag','سبد خالی است','از فهرست محصولات، کالا اضافه کنید.','افزودن کالا','cartBack')}</div>`;
  return `${navBar('سبد فروش',{trail:'trash',trailAct:'cartClear'})}<div class="scroll no-tab">
    <div class="pad"><div class="lbl" style="margin-top:0">کجا فروختید؟</div></div>${chipsRow(MANUAL.map(k=>SCH[k].name),MANUAL.indexOf(c.channel),'cartCh')}
    <div class="sec"><div class="h2">کالاها</div><button class="link" data-act="cartBack">${ic('plus')}افزودن</button></div>
    <div class="list">${c.items.map((i,k)=>{const p=P_(i.pid),v=V_(p,i.vid);return `<div class="li">${thumbH(p,48)}<div class="grow"><div class="t1">${esc(p.name)}</div><div class="t2">${v.opts.length?esc(vLabel(v))+' · ':''}<span class="num">${money(i.price*i.qty)}</span></div></div>${stepper(i.qty,`cartQ|${k}|-1`,`cartQ|${k}|1`)}</div>`;}).join('')}</div>
    <div class="pad"><div class="lbl">خریدار <span class="muted small">(اختیاری)</span></div><input class="input" data-on="cartBuyer" placeholder="نام یا شماره موبایل" value="${esc(c.buyer)}">
    <div class="row" style="gap:10px;margin-top:4px"><div class="grow"><div class="lbl">تخفیف</div><input class="input num" inputmode="numeric" data-on="cartAmt|discount" placeholder="۰" value="${c.discount?money(c.discount):''}"></div><div class="grow"><div class="lbl">هزینه ارسال</div><input class="input num" inputmode="numeric" data-on="cartAmt|extra" placeholder="۰" value="${c.extra?money(c.extra):''}"></div></div>
    <div id="csum" style="margin-top:18px">${cartSumH()}</div></div>
  </div><div class="bottom"><button class="btn primary" data-act="cartDone" id="cdone">ثبت فروش · <span class="num">${money(cartTotal())}</span></button></div>`;}
A.cartBack=()=>{const below=UI.stack[UI.stack.length-2];if(below&&below.fn===SaleScreen)pop();else{pop();setTimeout(A.sale,380);}};
A.cartCh=i=>{S.cart.channel=MANUAL[+i];save();refresh();};
A.cartQ=(k,d)=>{const it=S.cart.items[+k];const v=V_(P_(it.pid),it.vid);if(+d>0&&it.qty>=v.stock)return toast('موجودی کافی نیست',`فقط ${fa(v.stock)} عدد دارید`,'err');it.qty+=(+d);if(it.qty<=0)S.cart.items.splice(+k,1);save();haptic();refresh();};
A.cartClear=()=>confirmSheet('سبد خالی شود؟','همه کالاهای سبد برداشته می‌شوند.','خالی کردن سبد',()=>{S.cart.items=[];save();refresh();});
ON.cartBuyer=v=>{S.cart.buyer=v;save();};
ON.cartAmt=(v,k,t)=>{const n=parseNum(v);S.cart[k]=n;t.value=n?money(n):'';save();$('#csum').innerHTML=cartSumH();$('#cdone').innerHTML=`ثبت فروش · <span class="num">${money(cartTotal())}</span>`;};
A.cartDone=()=>{const c=S.cart;for(const i of c.items){const v=V_(P_(i.pid),i.vid);if(i.qty>v.stock)return toast('موجودی کافی نیست',`${P_(i.pid).name}: فقط ${fa(v.stock)} عدد`,'err');}
  const b=$('#cdone');b.innerHTML='<i class="spin"></i>';b.disabled=true;
  setTimeout(()=>{const s={id:uid(),no:++S.seq,t:Date.now(),channel:c.channel,items:c.items.map(i=>({...i})),discount:c.discount,extra:c.extra,buyer:c.buyer.trim(),status:'done'};
    s.items.forEach(i=>{V_(P_(i.pid),i.vid).stock-=i.qty;});S.sales.unshift(s);
    let auto=0;if(S.settings.autoStock&&online()){connectedCh().forEach(cid=>{if(S.channels[cid].status!=='ok')return;s.items.forEach(i=>{const sn=(S.synced[i.pid]||{})[cid];if(sn&&sn.stock[i.vid]!=null){const pp=P_(i.pid);sn.stock[i.vid]=vStock(pp,V_(pp,i.vid),cid);auto=1;}});});}
    s.items.forEach(i=>{const v=V_(P_(i.pid),i.vid);if(v.stock<=S.settings.low&&S.settings.notif)notify('warn',`موجودی ${P_(i.pid).name} ${v.opts.length?vLabel(v)+' ':''}${v.stock?'کم شد':'تمام شد'}`,v.stock?`${fa(v.stock)} عدد مانده.`:'برای فروش دوباره، موجودی را به‌روز کنید.');});
    S.cart={items:[],channel:c.channel,buyer:'',discount:0,extra:0};save();
    const i=UI.stack.findIndex(x=>x.fn===SaleScreen);if(i>=0){UI.stack[i].el.remove();UI.stack.splice(i,1);}
    replace(SaleSuccess,{id:s.id,auto});},650);};
function SaleSuccess({id,auto}){const s=S.sales.find(x=>x.id===id);const pend=pendingCount();
  return `<div class="top-safe"></div><div class="nav"><button class="gbtn" data-act="back" aria-label="بستن">${ic('x')}</button><span></span><span></span></div>
  <div class="scroll no-tab"><div class="pad" style="text-align:center;padding-top:30px;display:flex;flex-direction:column;align-items:center;gap:8px">
    <div class="check-anim pop">${ic('check')}</div><h2 class="big" style="margin-top:14px">فروش ثبت شد</h2><div class="bignum num" style="justify-content:center">${money(saleTotal(s))}<small>تومان</small></div>
    <div class="muted">فروش #${fa(s.no)} · ${(SCH[s.channel]||SCH.other).name}</div>
    <div class="okline">${ic('checkc')}موجودی ${fa(saleQty(s))} کالا کم شد${auto?' و به کانال‌ها رسید':''}</div>
    ${pend&&!auto?`<button class="okline warn" data-act="send">${ic('up')}${fa(pend)} محصول منتظر ارسال به کانال‌ها</button>`:''}
    <button class="textbtn" style="color:var(--red);margin-top:18px" data-act="cancelSale|${id}|pop">لغو این فروش</button>
  </div></div><div class="bottom"><button class="btn gray" data-act="succView|${id}">جزئیات</button><button class="btn primary" data-act="succNew">فروش جدید</button></div>`;}
A.succNew=()=>{UI._cbWas=false;replace(SaleScreen,{});};
A.succView=id=>replace(SaleDetail,{id});

/* ===== PROFILE ===== */
TABS.profile=()=>{const u=S.user,sub=S.sub,pl=PLANS.find(p=>p.id===sub.plan)||PLANS[1];const ending=sub.left<=5;
  const exp=connectedCh().filter(c=>S.channels[c].status==='expired').length;
  return `${rootHdr('پروفایل',[['settings','settings']])}<div class="scroll"><div class="stagger">
    <div class="row pad" style="gap:14px;padding-top:4px"><span class="avatar">${esc(u.name.trim()[0]||'ا')}</span><div class="grow"><div style="font-weight:700;font-size:18px">${esc(u.name)}</div><div class="muted small">${esc(u.shop)}${u.phone?' · <span class="ltr">'+fa(u.phone)+'</span>':''}</div></div><button class="chip" data-act="editMe">ویرایش</button></div>
    <div class="pad" style="margin-top:18px"><button class="sub-card ${ending?'ending':''}" data-act="plans" style="width:100%;text-align:right"><div class="row"><span class="grow" style="font-size:13px;opacity:.85">اشتراک ${pl.name}</span>${ic('crown')}</div>
      <div style="font-size:24px;font-weight:700;margin-top:6px">${fa(sub.left)} روز مانده</div><div class="bar"><i style="width:${Math.round(sub.left/sub.total*100)}%"></i></div>
      <div class="row small"><span class="grow" style="opacity:.85">${ending?'به‌زودی تمام می‌شود؛ همگام‌سازی قطع می‌شود':'همگام‌سازی همه کانال‌ها فعال است'}</span><span class="pill" style="background:#fff;color:#2930c7">${ending?'تمدید':'مدیریت'}</span></div></button></div>
    <div class="sec"><div class="h2">فروشگاه</div></div><div class="list">
      ${li({icon:'link',title:'کانال‌های فروش',sub:exp?`<span style="color:var(--red)">${fa(exp)} کانال نیاز به اتصال دارد</span>`:'',val:fa(connectedCh().length)+' وصل',act:'channels'})}
      ${li({icon:'tag',title:'قاعده‌های قیمت',val:fa(S.strategies.length),act:'strategies'})}
      ${li({icon:'grid',title:'دسته‌بندی‌ها',val:fa(S.cats.length),act:'cats'})}
      ${li({icon:'history',title:'تاریخچه تغییرات',val:fa(S.versions.length),act:'history'})}</div>
    <div class="sec"><div class="h2">حساب</div></div><div class="list">
      ${li({icon:'users',title:'تیم',val:fa(S.team.length)+' نفر',act:'team'})}
      ${li({icon:'bell',title:'اعلان‌ها',val:unread()?fa(unread())+' تازه':'',act:'notifs'})}
      ${li({icon:'settings',title:'تنظیمات',act:'settings'})}
      <button class="li" data-act="logout"><span class="tile" style="color:var(--red)">${ic('logout')}</span><div class="grow t1" style="color:var(--red)">خروج</div></button></div>
    <div class="muted tiny" style="text-align:center;margin-top:24px">الان · نسخه ۱٫۰</div>
  </div></div>`;};
A.editMe=()=>{const sh=sheet('ویرایش پروفایل',()=>`<div class="pad"><div class="lbl" style="margin-top:0">نام شما</div><input class="input" id="emn" value="${esc(S.user.name)}"><div class="lbl">نام فروشگاه</div><input class="input" id="ems" value="${esc(S.user.shop)}"></div>`,{right:'ذخیره',onRight:()=>{const n=$('#emn').value.trim(),s=$('#ems').value.trim();if(!n||!s){toast('هر دو را پر کنید','','err');return false;}S.user.name=n;S.user.shop=s;const me=S.team.find(t=>t.me);if(me)me.name=n;save();refresh();Object.values(UI.tabEls).forEach(e=>e.dataset.stale='1');toast('ذخیره شد');}});};
A.logout=()=>confirmSheet('از حساب خارج می‌شوید؟','برای ورود دوباره، کد تأیید پیامک می‌شود.','خروج',()=>{S.onboarded=false;save();showOnboarding();});

/* ===== CHANNELS ===== */
A.channels=()=>push(ChannelsScreen,{});
function ChannelsScreen(){const con=connectedCh();const avail=[...Object.keys(OCH).filter(c=>!con.includes(c)),...Object.keys(EXTRA_CH).filter(c=>!OCH[c])];
  return `${navBar('کانال‌های فروش')}<div class="scroll no-tab">
    ${con.length?`<div class="list stagger">${con.map(c=>{const st=S.channels[c];return `<button class="li" data-act="channel|${c}"><span class="tile">${ic(OCH[c].icon)}</span><div class="grow"><div class="t1">${OCH[c].name}</div><div class="t2">${st.status==='expired'?'<span style="color:var(--red)">اتصال منقضی شده</span>':'<span style="color:var(--green)">وصل</span> · آخرین ارسال '+ago(st.last)}</div></div>${ic('chevL','chev')}</button>`;}).join('')}</div>`:emptyV('link','هنوز کانالی وصل نیست','کانال‌ها را وصل کنید تا قیمت و موجودی خودکار به آن‌ها برسد.')}
    ${avail.length?`<div class="sec"><div class="h2">افزودن کانال</div></div><div class="list">${avail.map(c=>{const d=OCH[c]||EXTRA_CH[c];return `<div class="li"><span class="tile">${ic(d.icon)}</span><div class="grow"><div class="t1">${d.name}</div><div class="t2">${d.desc}</div></div>${d.soon?'<span class="muted small">به‌زودی</span>':`<button class="btn sm gray" data-act="connect|${c}">وصل کردن</button>`}</div>`;}).join('')}</div>`:''}
    <div class="sec"><div class="h2">فروش دستی</div></div><div class="pad muted small" style="line-height:1.9">حضوری، اینستاگرام، تلگرام و واتس‌اپ اتصال لازم ندارند؛ موقع ثبت فروش انتخابشان می‌کنید.</div>
  </div>`;}
A.connect=cid=>{const d=OCH[cid]||EXTRA_CH[cid];const sh=sheet(`اتصال ${d.name}`,()=>`<div class="pad" style="text-align:center"><div class="empty-ic">${ic(d.icon)}</div><h3 style="margin:14px 0 6px">${d.name} را وصل کنید</h3><p class="muted" style="margin:0 0 20px;line-height:1.9">وارد پنل فروشندگی ${d.name} می‌شوید و دسترسی می‌دهید.<br>رمز شما را الان نمی‌بیند.</p><button class="btn primary" id="cnb" data-act="cngo">${ic('link')}ورود به پنل ${d.name}</button></div>`,{left:'انصراف'});
  A.cngo=()=>{const b=$('#cnb');b.innerHTML='<i class="spin"></i>در حال اتصال…';b.disabled=true;setTimeout(()=>{if(!OCH[cid])OCH[cid]=EXTRA_CH[cid];S.channels[cid]={...(S.channels[cid]||{strategy:'s_mk'}),connected:true,status:'ok',last:Date.now()};S.products.forEach(p=>{if(!p.ch[cid])p.ch[cid]={on:false,price:null};});save();sh.close();refresh();if(UI.ob)obRefresh();toast(`${d.name} وصل شد`,UI.ob?'':'محصولات را در این کانال روشن کنید');},1300);};};
A.channel=cid=>push(ChannelScreen,{cid});
function ChannelScreen({cid}){const st=S.channels[cid],d=OCH[cid];if(!st||!st.connected)return navBar(d?d.name:'کانال')+emptyV('link','این کانال وصل نیست','','وصل کردن','connect|'+cid);
  const on=S.products.filter(p=>p.ch[cid]&&p.ch[cid].on).length;const pend=S.products.filter(p=>changesFor(p).some(x=>x.cid===cid)).length;const exp=st.status==='expired';
  return `${navBar(d.name)}<div class="scroll no-tab"><div class="pad" style="text-align:center;padding-top:6px"><div class="empty-ic" style="margin:0 auto">${ic(d.icon)}</div><h2 class="big" style="margin:12px 0 4px">${d.name}</h2><span class="pill" style="background:${exp?'var(--red-soft)':'var(--green-soft)'};color:${exp?'var(--red)':'var(--green)'}">${exp?'اتصال منقضی شده':'وصل'}</span></div>
    ${exp?`<div style="margin-top:16px">${banner('alert','تغییرها به این کانال نمی‌رسند','یک بار دوباره وصل شوید','reconnect|'+cid,'اتصال','err')}</div>`:''}
    <div class="pad" style="margin-top:16px"><div class="kv"><span class="k">آخرین ارسال</span><span>${ago(st.last)}</span></div><div class="kv"><span class="k">محصول در این کانال</span><span class="num">${fa(on)}</span></div><div class="kv"><span class="k">ارسال‌نشده</span><span class="num" style="${pend?'color:var(--accent);font-weight:700':''}">${fa(pend)}</span></div></div>
    <div class="sec"><div class="h2">تنظیمات</div></div><div class="list">
      ${li({icon:'tag',title:'قاعده قیمت',sub:esc(stratDesc(strat(st.strategy))),val:esc(strat(st.strategy).name),act:'stratPick|'+cid})}
      <div class="li"><span class="tile">${ic('refresh')}</span><div class="grow"><div class="t1">ارسال خودکار موجودی</div><div class="t2">بعد از هر فروش، موجودی خودکار ارسال شود</div></div>${tg(S.settings.autoStock,'autoStock')}</div>
      ${li({icon:'down',title:'دریافت از کانال',sub:'مقایسه قیمت و موجودی با الان',act:'pull'})}</div>
    <div class="pad" style="margin-top:22px">${pend?`<button class="btn primary" data-act="send">${ic('up')}ارسال ${fa(pend)} تغییر</button>`:''}<button class="textbtn" style="color:var(--red);width:100%;margin-top:16px" data-act="disconnect|${cid}">قطع اتصال</button></div></div>`;}
A.autoStock=()=>{S.settings.autoStock=!S.settings.autoStock;save();refresh();};
A.disconnect=cid=>confirmSheet(`اتصال ${OCH[cid].name} قطع شود؟`,'محصولات در این کانال دیگر به‌روز نمی‌شوند. هر وقت بخواهید دوباره وصل می‌شود.','قطع اتصال',()=>{S.channels[cid].connected=false;Object.values(S.synced).forEach(x=>delete x[cid]);save();pop();toast(`${OCH[cid].name} قطع شد`);});

/* ===== STRATEGIES ===== */
A.strategies=()=>push(StratScreen,{});
function StratScreen(){return `${navBar('قاعده‌های قیمت',{trail:'plus',trailAct:'stratNew'})}<div class="scroll no-tab"><div class="pad muted small" style="line-height:1.9;margin-bottom:6px">قیمت هر کانال از روی قیمت پایه ساخته می‌شود. یک قاعده را به چند کانال بدهید.</div>
  <div class="list stagger">${S.strategies.map(s=>{const used=Object.keys(S.channels).filter(c=>S.channels[c].connected&&S.channels[c].strategy===s.id&&OCH[c]);return `<button class="li" data-act="stratEdit|${s.id}"><span class="tile num" dir="ltr" style="font-size:13px;font-weight:700">${s.pct>0?'+':''}${fa(s.pct)}٪</span><div class="grow"><div class="t1">${esc(s.name)}</div><div class="t2">${used.length?used.map(c=>OCH[c].name).join('، '):'به کانالی داده نشده'}</div></div>${ic('chevL','chev')}</button>`;}).join('')}</div></div>`;}
A.stratNew=()=>push(StrategyEdit,{});A.stratEdit=id=>push(StrategyEdit,{id});
function StrategyEdit({id}){if(!UI.sdft||UI.sdft._for!==(id||'new')){const s=id?strat(id):{name:'',pct:5,round:1000};UI.sdft={...s,_for:id||'new'};}const d=UI.sdft;const ex=S.products[0];
  return `${navBar(id?'ویرایش قاعده':'قاعده جدید',{left:'انصراف',leftAct:'sgCancel',right:'ذخیره',rightAct:'sgSave|'+(id||'')})}<div class="scroll no-tab"><div class="pad">
    <div class="lbl" style="margin-top:4px">نام قاعده</div><input class="input" id="sdn" data-on="sgName" placeholder="مثلاً دیجی‌کالا ۶٪ بالاتر" value="${esc(d.name)}">
    <div class="lbl">نسبت به قیمت پایه</div><div class="pctbox"><button class="gbtn" data-act="sgPct|-1">${ic('minus')}</button><div class="grow" style="text-align:center"><div class="pctv num" id="pctv" dir="ltr">${d.pct>0?'+':''}${fa(d.pct)}٪</div><div class="muted small" id="pctl">${d.pct===0?'همان قیمت پایه':d.pct>0?'گران‌تر':'ارزان‌تر'}</div></div><button class="gbtn" data-act="sgPct|1">${ic('plus')}</button></div>
    <input type="range" min="-30" max="50" step="1" value="${d.pct}" data-on="sgRange" class="range">
    <div class="lbl">گرد کردن</div></div>${chipsRow(['بدون گرد کردن','به ۱٬۰۰۰','به ۱۰٬۰۰۰'],[0,1000,10000].indexOf(d.round),'sgRound')}
    <div class="pad"><div class="card" style="margin-top:22px"><div class="muted small">مثال${ex?' با '+esc(ex.name):''}</div><div class="row" style="margin-top:8px"><span class="grow num">${money(ex?ex.price:1000000)}</span>${ic('chevL','')}<b class="num grow" style="text-align:left;font-size:20px" id="sdex">${money(applyStr(ex?ex.price:1000000,d))}</b></div></div>
    ${id&&id!=='s_base'?`<button class="textbtn" style="color:var(--red);width:100%;margin-top:22px" data-act="sgDel|${id}">حذف قاعده</button>`:''}</div></div>`;}
const sdUpd=()=>{const d=UI.sdft;const ex=S.products[0];$('#pctv').textContent=(d.pct>0?'+':'')+fa(d.pct)+'٪';$('#pctl').textContent=d.pct===0?'همان قیمت پایه':d.pct>0?'گران‌تر':'ارزان‌تر';$('#sdex').textContent=money(applyStr(ex?ex.price:1000000,d));const r=$('.range');if(r&&+r.value!==d.pct)r.value=d.pct;};
A.sgPct=dd=>{UI.sdft.pct=Math.max(-30,Math.min(50,UI.sdft.pct+(+dd)));haptic();sdUpd();};
ON.sgRange=v=>{UI.sdft.pct=+v;sdUpd();};ON.sgName=v=>{UI.sdft.name=v;};
A.sgRound=i=>{UI.sdft.round=[0,1000,10000][+i];const top=UI.stack[UI.stack.length-1];renderInto(top.el,StrategyEdit,top.params);};
A.sgCancel=()=>{UI.sdft=null;pop();};
A.sgSave=id=>{const d=UI.sdft;if(!d.name.trim()){d.name=`${d.pct>0?'+':''}${fa(d.pct)}٪ نسبت به پایه`;}
  if(id){Object.assign(strat(id),{name:d.name.trim(),pct:d.pct,round:d.round});}else S.strategies.push({id:uid(),name:d.name.trim(),pct:d.pct,round:d.round});
  UI.sdft=null;save();pop();toast('قاعده ذخیره شد',pendingCount()?'قیمت کانال‌ها عوض شد؛ ارسال کنید':'');};
A.sgDel=id=>confirmSheet('این قاعده حذف شود؟','کانال‌هایی که از آن استفاده می‌کنند به «قیمت پایه» برمی‌گردند.','حذف قاعده',()=>{S.strategies=S.strategies.filter(s=>s.id!==id);Object.values(S.channels).forEach(c=>{if(c.strategy===id)c.strategy='s_base';});UI.sdft=null;save();pop();toast('قاعده حذف شد');});

/* ===== HISTORY ===== */
A.history=()=>push(HistoryScreen,{});
function HistoryScreen(){return `${navBar('تاریخچه تغییرات')}<div class="scroll no-tab">${S.versions.length?`<div class="list stagger">${S.versions.map(v=>{const r=Object.values(v.res);const fail=r.filter(x=>x==='fail').length;return `<button class="li" data-act="version|${v.id}"><span class="tile">${ic('up')}</span><div class="grow"><div class="t1">${esc(v.title)}</div><div class="t2">${fa(v.items.length)} محصول · ${fa(r.length)} کانال · ${ago(v.t)}</div></div>${fail?`<span class="st warn">${ic('alert')}ناقص</span>`:`<span class="st ok">${ic('checkc')}ارسال شد</span>`}</button>`;}).join('')}</div>`:emptyV('history','هنوز تغییری نفرستاده‌اید','هر بار که به کانال‌ها ارسال کنید، یک نسخه اینجا ذخیره می‌شود.')}</div>`;}
A.version=id=>push(VersionScreen,{id});
function VersionScreen({id}){const v=S.versions.find(x=>x.id===id);return `${navBar('جزئیات ارسال')}<div class="scroll no-tab"><div class="pad"><h2 class="big" style="margin:4px 0">${esc(v.title)}</h2><div class="muted small">${dayFull(v.t)} ${dateStr(v.t)} · ساعت ${timeStr(v.t)}</div></div>
  <div class="sec"><div class="h2">کانال‌ها</div></div><div class="list">${Object.entries(v.res).map(([c,r])=>`<div class="li"><span class="tile">${ic((OCH[c]||SCH.other).icon)}</span><div class="grow t1">${(OCH[c]||SCH.other).name}</div>${r==='ok'?`<span class="st ok">${ic('checkc')}رسید</span>`:`<span class="st err">${ic('xc')}نرسید</span>`}</div>`).join('')}</div>
  <div class="sec"><div class="h2">محصول‌ها</div></div><div class="list">${v.items.map(i=>{const p=P_(i.pid);return `<div class="li">${thumbH(p,44)}<div class="grow"><div class="t1">${esc(p?p.name:'محصول حذف‌شده')}</div><div class="t2">${i.lines.join('، ')}</div></div></div>`;}).join('')}</div></div>
  <div class="bottom"><button class="btn gray" data-act="vRestore|${id}">${ic('history')}برگرداندن قیمت‌ها به این نسخه</button></div>`;}
A.vRestore=id=>{const v=S.versions.find(x=>x.id===id);confirmSheet('قیمت‌ها برگردانده شود؟',`قیمت پایه محصولات به ${dateStr(v.t)} برمی‌گردد. بعد از آن باید ارسال کنید.`,'برگرداندن',()=>{let n=0;S.products.forEach(p=>{if(v.prices[p.id]&&v.prices[p.id]!==p.price){p.price=v.prices[p.id];n++;}});save();pop();toast(n?'قیمت‌ها برگشت':'قیمت‌ها از قبل همین بود',n?`${fa(n)} محصول · حالا ارسال کنید`:'');},false);};

/* ===== PLANS ===== */
A.plans=()=>{UI.plan=S.sub.plan;UI.cyc='m';push(PlansScreen,{});};
function PlansScreen(){return `${navBar('اشتراک')}<div class="scroll no-tab"><div class="pad"><h2 class="big" style="margin:4px 0 4px">یک پلن انتخاب کنید</h2><p class="muted" style="margin:0 0 16px">هر وقت بخواهید عوضش می‌کنید.</p>${seg(['ماهانه','سالانه · ۲ ماه هدیه'],UI.cyc==='m'?0:1,'cyc')}
  <div class="plans stagger">${PLANS.map(p=>`<button class="plan ${UI.plan===p.id?'on':''}" data-act="plan|${p.id}"><div class="row"><b class="grow" style="font-size:17px">${p.name}</b>${S.sub.plan===p.id?'<span class="pill" style="background:var(--accent-soft);color:var(--accent)">پلن فعلی</span>':''}${p.id==='pro'&&S.sub.plan!=='pro'?'<span class="pill" style="background:var(--orange-soft);color:var(--orange)">پیشنهادی</span>':''}</div>
    <div class="num" style="font-size:22px;font-weight:700;margin:6px 0 8px">${money(UI.cyc==='m'?p.m:p.y)} <span class="muted small" style="font-weight:400">تومان / ${UI.cyc==='m'?'ماه':'سال'}</span></div>${p.feat.map(f=>`<div class="feat">${ic('check')}${f}</div>`).join('')}</button>`).join('')}</div></div></div>
  <div class="bottom"><button class="btn primary" data-act="pay">پرداخت ${money(UI.cyc==='m'?PLANS.find(p=>p.id===UI.plan).m:PLANS.find(p=>p.id===UI.plan).y)} تومان</button></div>`;}
A.cyc=i=>{UI.cyc=+i?'y':'m';refresh();};A.plan=id=>{UI.plan=id;haptic();refresh();};
A.pay=()=>{if(!online())return toast('اینترنت وصل نیست','برای پرداخت به اینترنت نیاز است','err');const b=$('.bottom .btn');b.innerHTML='<i class="spin"></i>در حال پرداخت…';b.disabled=true;setTimeout(()=>{const p=PLANS.find(x=>x.id===UI.plan);S.sub={plan:p.id,left:UI.cyc==='m'?30:365,total:UI.cyc==='m'?30:365,cycle:UI.cyc};save();replace(PaySuccess,{});},1500);};
function PaySuccess(){const p=PLANS.find(x=>x.id===S.sub.plan);return `<div class="top-safe"></div><div class="nav"><button class="gbtn" data-act="back">${ic('x')}</button><span></span><span></span></div><div class="scroll no-tab"><div class="pad" style="text-align:center;padding-top:50px;display:flex;flex-direction:column;align-items:center;gap:8px"><div class="check-anim pop">${ic('check')}</div><h2 class="big" style="margin-top:14px">اشتراک ${p.name} فعال شد</h2><p class="muted" style="margin:0">${fa(S.sub.left)} روز همگام‌سازی بدون وقفه</p></div></div><div class="bottom"><button class="btn primary" data-act="back">برگشت به الان</button></div>`;}

/* ===== TEAM ===== */
A.team=()=>push(TeamScreen,{});
const ROLES=['مدیر','فروشنده','انباردار'];
function TeamScreen(){return `${navBar('تیم',{trail:'plus',trailAct:'invite'})}<div class="scroll no-tab"><div class="list stagger">${S.team.map(m=>`<button class="li" data-act="${m.me?'editMe':'member|'+m.id}"><span class="avatar sm">${esc(m.name[0]||'؟')}</span><div class="grow"><div class="t1">${esc(m.name)}${m.me?' <span class="muted small">(شما)</span>':''}</div><div class="t2"><span class="ltr">${esc(m.phone)}</span></div></div>${m.invited?'<span class="st neu">دعوت‌شده</span>':`<span class="val">${m.role}</span>`}${ic('chevL','chev')}</button>`).join('')}</div>
  <div class="pad muted small" style="line-height:1.9;margin-top:14px">فروشنده فقط فروش ثبت می‌کند. انباردار موجودی را به‌روز می‌کند. مدیر به همه‌چیز دسترسی دارد.</div></div>`;}
A.invite=()=>{const d={phone:'',name:'',role:1,err:''};const sh=sheet('دعوت عضو جدید',()=>`<div class="pad"><div class="lbl" style="margin-top:0">شماره موبایل</div><input class="input ltr" id="ivp" inputmode="tel" placeholder="09xx xxx xxxx" value="${esc(d.phone)}" style="text-align:left">${d.err?`<div class="err-text">${ic('alert')}${d.err}</div>`:''}<div class="lbl">نام <span class="muted small">(اختیاری)</span></div><input class="input" id="ivn" value="${esc(d.name)}"><div class="lbl">نقش</div></div>${chipsRow(ROLES,d.role,'ivr')}<div class="pad" style="margin-top:22px"><button class="btn primary" data-act="ivgo">${ic('send')}فرستادن دعوت</button></div>`,{left:'انصراف'});
  const grab=()=>{d.phone=$('#ivp').value;d.name=$('#ivn').value;};
  A.ivr=i=>{grab();d.role=+i;sh.render();};A.ivgo=()=>{grab();const ph=parseNum(d.phone).toString();if(!/^9\d{9}$/.test(ph)){d.err='شماره باید ۱۱ رقم باشد و با ۰۹ شروع شود';sh.render();return;}
    S.team.push({id:uid(),name:d.name.trim()||'عضو جدید',role:ROLES[d.role],phone:fa('0'+ph.slice(0,3)+' '+ph.slice(3,6)+' '+ph.slice(6)),invited:true});save();sh.close();refresh();toast('دعوت فرستاده شد','لینک ورود پیامک شد');};};
A.member=id=>{const m=S.team.find(x=>x.id===id);let r=ROLES.indexOf(m.role);const sh=sheet(esc(m.name),()=>`<div class="pad"><div class="lbl" style="margin-top:0">نقش</div></div>${chipsRow(ROLES,r,'mr')}<div class="pad" style="margin-top:22px"><button class="btn danger" data-act="mdel">${ic('trash')}حذف از تیم</button></div>`,{right:'ذخیره',onRight:()=>{m.role=ROLES[r];save();refresh();toast('نقش ذخیره شد');}});
  A.mr=i=>{r=+i;sh.render();};A.mdel=()=>{S.team=S.team.filter(x=>x.id!==id);save();sh.close();refresh();toast('از تیم حذف شد');};};

/* ===== SETTINGS ===== */
A.settings=()=>push(SettingsScreen,{});
function SettingsScreen(){const st=S.settings;return `${navBar('تنظیمات')}<div class="scroll no-tab">
  <div class="sec" style="padding-top:6px"><div class="h2">ظاهر</div></div><div class="pad">${seg(['روشن','تیره','خودکار'],['light','dark','system'].indexOf(st.theme),'theme')}</div>
  <div class="sec"><div class="h2">اعلان و هشدار</div></div><div class="list">
    <div class="li"><div class="grow"><div class="t1">اعلان‌ها</div><div class="t2">خطای ارسال، موجودی کم، تمدید</div></div>${tg(st.notif,'stNotif')}</div>
    <div class="li"><div class="grow"><div class="t1">هشدار موجودی کم</div><div class="t2">وقتی به این تعداد یا کمتر رسید</div></div>${stepper(st.low,'stLow|-1','stLow|1')}</div></div>
  <div class="sec"><div class="h2">همگام‌سازی</div></div><div class="list">
    <div class="li"><div class="grow"><div class="t1">ارسال خودکار موجودی</div><div class="t2">بعد از هر فروش، موجودی کانال‌ها به‌روز شود</div></div>${tg(st.autoStock,'autoStock')}</div></div>
  <div class="sec"><div class="h2">حالت‌های نمایشی</div></div><div class="pad muted small" style="margin-bottom:2px">برای دیدن صفحه‌های خطا و خالی</div><div class="list">
    <div class="li"><div class="grow"><div class="t1">قطع اینترنت</div><div class="t2">بنر آفلاین و خطای ارسال</div></div>${tg(UI.fakeOff,'fakeOff')}</div>
    <div class="li"><div class="grow"><div class="t1">نزدیک پایان اشتراک</div><div class="t2">کارت اشتراک در پروفایل</div></div>${tg(S.sub.left<=5,'fakeEnd')}</div>
    ${li({title:'فروشگاه خالی',sub:'همه حالت‌های خالی را ببینید',act:'fakeEmpty'})}
    ${li({title:'ورود از اول',sub:'خوش‌آمد، شماره، کد تأیید',act:'restartOb'})}
    <button class="li" data-act="resetDemo"><div class="grow t1" style="color:var(--red)">بازنشانی داده‌های نمونه</div></button></div>
  <div class="muted tiny" style="text-align:center;margin-top:24px">الان · نسخه ۱٫۰</div></div>`;}
A.theme=i=>{S.settings.theme=['light','dark','system'][+i];save();applyTheme();refresh();};
A.stNotif=()=>{S.settings.notif=!S.settings.notif;save();refresh();};
A.stLow=d=>{S.settings.low=Math.max(0,Math.min(50,S.settings.low+(+d)));save();refresh();};
A.fakeOff=()=>{UI.fakeOff=!UI.fakeOff;netChange();refresh();};
A.fakeEnd=()=>{S.sub.left=S.sub.left<=5?24:2;save();refresh();toast(S.sub.left<=5?'اشتراک: ۲ روز مانده':'اشتراک: ۲۴ روز مانده','در پروفایل ببینید','info');};
A.fakeEmpty=()=>confirmSheet('فروشگاه خالی شود؟','همه محصولات، فروش‌ها و اعلان‌ها پاک می‌شوند تا حالت‌های خالی را ببینید. با «بازنشانی» برمی‌گردند.','خالی کن',()=>{S.products=[];S.sales=[];S.notifs=[];S.versions=[];S.synced={};S.cart.items=[];save();switchTab('home');toast('فروشگاه خالی شد','حالت‌های خالی را ببینید','info');});
A.restartOb=()=>{S.onboarded=false;save();showOnboarding();};
A.resetDemo=()=>confirmSheet('داده‌های نمونه برگردد؟','همه تغییرهای شما پاک می‌شود.','بازنشانی',()=>{const th=S.settings.theme;seed();S.onboarded=true;S.settings.theme=th;save();UI.chat=null;Object.keys(OCH).forEach(k=>{if(EXTRA_CH[k])delete OCH[k];});switchTab('home');toast('داده‌های نمونه برگشت');});
