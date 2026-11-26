/* ===== shared view bits ===== */
const thumbH=(p,size)=>{const st=size?`width:${size}px;height:${size}px;border-radius:${Math.round(size/3.6)}px;`:'';return p&&p.img?`<img class="thumb" style="${st}" src="${p.img}" alt="" loading="lazy">`:`<span class="thumb" style="${st}display:grid;place-items:center;color:var(--text3)">${ic('tag')}</span>`;};
const sod=t=>{const d=new Date(t);d.setHours(0,0,0,0);return d.getTime();};
const COSTR=.62;
const saleCost=s=>s.items.reduce((a,i)=>{const p=P_(i.pid);return a+i.qty*((p&&p.cost)||i.price*COSTR);},0);
const saleProfit=s=>saleTotal(s)-saleCost(s);
function series(days,metric){const end=sod(Date.now());const start=end-(days-1)*DAY;const a=Array(days).fill(0),n=Array(days).fill(0);S.sales.forEach(s=>{if(s.status!=='done')return;const d=sod(s.t);if(d<start||d>end)return;const k=Math.round((d-start)/DAY);n[k]++;a[k]+=metric==='orders'?1:metric==='profit'?saleProfit(s):saleTotal(s);});return metric==='avg'?a.map((v,k)=>n[k]?Math.round(v/n[k]):0):a;}
function sumRange(f,t){let rev=0,n=0,q=0,c=0,pr=0;S.sales.forEach(s=>{if(s.t<f||s.t>=t)return;if(s.status!=='done'){c++;return;}rev+=saleTotal(s);pr+=saleProfit(s);n++;q+=saleQty(s);});return {rev,n,q,c,pr,avg:n?Math.round(rev/n):0};}
const pctCh=(a,b)=>b?Math.round((a-b)/b*100):(a?100:0);
const delta=(a,b,label='')=>{const p=pctCh(a,b);return `<span class="${p>=0?'up':'down'}">${p>=0?'↑':'↓'} ${fa(Math.abs(p))}٪${label?' <span class="muted" style="font-weight:400">'+label+'</span>':''}</span>`;};
const dayLabels=n=>{const out=[];for(let i=n-1;i>=0;i--){const t=Date.now()-i*DAY;out.push(n<=7?(i===0?'امروز':dayName(t)):(i%5===0?fa(new Date(t).getDate()):''));}return out;};
function chartH(vals,{type='bar',hi=-1,labels=[],metric='rev'}={}){
  const W=360,H=160,n=vals.length,mx=Math.max(...vals,1)*1.12,bw=W/n,gap=n>12?2.5:12;
  const X=i=>W-(i+.5)*bw,Y=v=>H-(v/mx)*(H-8);
  let g='';for(let k=1;k<=3;k++){const yy=(H-(H-8)*k/3).toFixed(1);g+=`<line x1="0" x2="${W}" y1="${yy}" y2="${yy}" stroke="var(--sep)" stroke-dasharray="2 4" stroke-width="1" vector-effect="non-scaling-stroke"/>`;}
  if(type==='bar'){vals.forEach((v,i)=>{const h=Math.max(4,H-Y(v)),w=Math.max(2,bw-gap);g+=`<rect class="cbar" x="${(X(i)-w/2).toFixed(1)}" y="${(H-h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${Math.min(7,w/2).toFixed(1)}" fill="${i===hi?'var(--accent)':'var(--fill2)'}" style="animation-delay:${Math.round(i*(n>12?10:45))}ms"/>`;});}
  else{const pts=vals.map((v,i)=>[+X(i).toFixed(1),+Y(v).toFixed(1)]);let d=`M${pts[0][0]},${pts[0][1]}`;for(let i=1;i<n;i++){const [x0,y0]=pts[i-1],[x1,y1]=pts[i];const cx=((x0+x1)/2).toFixed(1);d+=` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;}
    g+=`<defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".22"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs><path class="carea" d="${d} L${pts[n-1][0]},${H} L${pts[0][0]},${H}Z" fill="url(#lg)"/><path class="cline" d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" vector-effect="non-scaling-stroke" pathLength="1000"/>`;
    if(hi>=0)g+=`<circle class="cdot" cx="${pts[hi][0]}" cy="${pts[hi][1]}" r="4.5" fill="var(--bg)" stroke="var(--accent)" stroke-width="2.5" vector-effect="non-scaling-stroke"/>`;}
  vals.forEach((v,i)=>g+=`<rect x="${(X(i)-bw/2).toFixed(1)}" y="0" width="${bw.toFixed(1)}" height="${H}" fill="transparent" data-act="ctip|${i}"/>`);
  const lab=labels.length?`<div class="xl" style="grid-template-columns:repeat(${n},1fr)">${labels.map(l=>`<span>${l}</span>`).join('')}</div>`:'';
  return `<div class="chart" data-vals="${vals.join(',')}" data-m="${metric}" style="position:relative"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${H}px">${g}</svg><div class="tip" style="opacity:0"></div></div>${lab}`;
}
A.ctip=(i,t)=>{i=+i;const ch=t.closest('.chart');const vals=ch.dataset.vals.split(',').map(Number);const W=360,H=160,n=vals.length,mx=Math.max(...vals,1)*1.12,bw=W/n;
  const X=W-(i+.5)*bw,Y=H-(vals[i]/mx)*(H-8);const svg=ch.querySelector('svg');const r=svg.getBoundingClientRect(),cr=ch.getBoundingClientRect();
  const tip=ch.querySelector('.tip');tip.textContent=ch.dataset.m==='orders'?fa(vals[i])+' سفارش':toman(vals[i]);
  tip.style.right=(cr.right-(r.left+X/W*r.width))+'px';tip.style.top=(Y/H*r.height+(r.top-cr.top)-8)+'px';tip.style.opacity=1;
  $$('.cbar',ch).forEach((b,k)=>b.setAttribute('fill',k===i?'var(--accent)':'var(--fill2)'));
  const dot=$('.cdot',ch);if(dot){dot.setAttribute('cx',X);dot.setAttribute('cy',Y);}
  haptic();clearTimeout(ch._t);ch._t=setTimeout(()=>tip.style.opacity=0,2200);};
const banner=(icon,title,sub,act,btn,cls='')=>`<${act?'button':'div'} class="banner ${cls}" ${act?`data-act="${act}"`:''}><span class="bi">${ic(icon)}</span><div class="grow"><b>${title}</b>${sub?`<span>${sub}</span>`:''}</div>${btn?`<span class="bb">${btn}</span>`:act?ic('chevL','chev'):''}</${act?'button':'div'}>`;

/* ===== HOME ===== */
UI.hm='rev';UI.ht='bar';
TABS.home=()=>{
  const now=Date.now(),t0=sod(now);const td=sumRange(t0,now+1),yd=sumRange(t0-DAY,t0);
  const pend=pendingAll(),low=lowStock(),recent=S.sales.slice(0,4);
  const vals=series(7,UI.hm);
  return `${rootHdr(`<div class="sub">سلام ${esc(S.user.name.split(' ')[0])}</div>${esc(S.user.shop)}`,[['bell','notifs',unread()]])}
  <div class="scroll"><div class="stagger">
    <div class="tiles">
      <button class="tilem ${UI.hm==='rev'?'on':''}" data-act="hm|rev"><div class="l">فروش امروز</div><div class="v num" data-count="${td.rev}" data-fmt="m">${money(td.rev)}<span class="u">تومان</span></div><div class="d">${delta(td.rev,yd.rev,'از دیروز')}</div></button>
      <button class="tilem ${UI.hm==='orders'?'on':''}" data-act="hm|orders"><div class="l">سفارش امروز</div><div class="v num" data-count="${td.n}">${fa(td.n)}<span class="u">سفارش</span></div><div class="d">${delta(td.n,yd.n,'از دیروز')}</div></button>
      <button class="tilem ${UI.hm==='profit'?'on':''}" data-act="hm|profit"><div class="l">سود خالص</div><div class="v num" data-count="${td.pr}" data-fmt="m">${money(td.pr)}<span class="u">تومان</span></div><div class="d">${delta(td.pr,yd.pr,'از دیروز')}</div></button>
      <button class="tilem ${UI.hm==='avg'?'on':''}" data-act="hm|avg"><div class="l">میانگین هر سفارش</div><div class="v num" data-count="${td.avg}" data-fmt="m">${money(td.avg)}<span class="u">تومان</span></div><div class="d">${delta(td.avg,yd.avg,'از دیروز')}</div></button>
    </div>
    <div class="sec"><div class="h2">${({rev:'فروش',orders:'سفارش‌ها',profit:'سود خالص',avg:'میانگین هر سفارش'})[UI.hm]}<span class="muted small" style="font-weight:400"> · ۷ روز</span></div>
      <div class="vtog"><button class="${UI.ht==='bar'?'on':''}" data-act="ht|bar" aria-label="ستونی">${ic('chart')}</button><button class="${UI.ht==='line'?'on':''}" data-act="ht|line" aria-label="خطی">${ic('line')}</button></div></div>
    ${vals.some(v=>v)?chartH(vals,{type:UI.ht,hi:6,labels:dayLabels(7),metric:UI.hm}):`<div class="pad muted small" style="padding-block:28px;text-align:center">در ۷ روز اخیر فروشی ثبت نشده. بعد از اولین فروش، نمودار اینجا می‌آید.</div>`}
    ${pend.length?banner('up',`${fa(pend.length)} محصول منتظر ارسال`,'تغییرها هنوز به کانال‌ها نرسیده‌اند','send','ارسال'):''}
    <div class="qa" style="margin-top:20px">
      ${[['bag','ثبت فروش','sale'],['box','محصول جدید','addProduct'],['scan','اسکن','scan'],['spark','دستیار','ai']].map(([i,l,a])=>`<button data-act="${a}"><span class="c">${ic(i)}</span>${l}</button>`).join('')}
    </div>
    ${low.length?secH('موجودی کم','lowStock')+`<div class="list">${low.slice(0,3).map(({p,v})=>`<button class="li" data-act="product|${p.id}">${thumbH(p,44)}<div class="grow"><div class="t1">${esc(p.name)}</div><div class="t2">${esc(vLabel(v))}</div></div>${stBadge(v.stock)}</button>`).join('')}</div>`:''}
    ${secH('فروش‌های اخیر','sales')}
    <div class="list">${recent.length?recent.map(saleRow).join(''):emptyV('bag','هنوز فروشی ثبت نشده','اولین فروش را ثبت کنید تا اینجا ببینید.','ثبت فروش','sale')}</div>
  </div></div>`;
};
TABS.home.after=el=>{$$('[data-count]',el).forEach(e=>{const to=+e.dataset.count;const u=e.querySelector('.u');countUp(e.firstChild,to,v=>e.dataset.fmt==='m'?money(v):fa(Math.round(v)));});};
A.hm=m=>{UI.hm=m;refresh();};A.ht=t=>{UI.ht=t;refresh();};
function saleRow(s){const c=SCH[s.channel]||SCH.other;const cancelled=s.status!=='done';const p=P_(s.items[0].pid);
  return `<button class="li" data-act="saleDetail|${s.id}">${thumbH(p,44)}<div class="grow"><div class="t1">${esc(p?p.name:'محصول حذف‌شده')}${s.items.length>1?`<span class="muted small"> +${fa(s.items.length-1)}</span>`:''}</div><div class="t2">${c.name} · ${sod(s.t)===sod(Date.now())?timeStr(s.t):ago(s.t)}</div></div><div style="text-align:left"><div class="price num" ${cancelled?'style="text-decoration:line-through;color:var(--text3)"':''}>${money(saleTotal(s))}</div>${cancelled?'<span class="st err">لغوشده</span>':''}</div></button>`;}

/* ===== PRODUCTS ===== */
Object.assign(UI,{pq:'',pcat:-1,pview:'merged',psort:0,pstock:0,pch:''});
const SORTS=['جدیدترین','پرفروش','ارزان‌ترین','گران‌ترین','کم‌موجودترین'];
function filteredProducts(){
  let ps=S.products.slice();const q=UI.pq.trim();
  if(UI.pcat>=0)ps=ps.filter(p=>p.cat===S.cats[UI.pcat].id);
  if(q)ps=ps.filter(p=>p.name.includes(q)||p.variants.some(v=>v.sku.toLowerCase().includes(q.toLowerCase())||v.barcode.includes(q)));
  if(UI.pstock===1)ps=ps.filter(p=>totalStock(p)>S.settings.low);if(UI.pstock===2)ps=ps.filter(p=>p.variants.some(v=>v.stock>0&&v.stock<=S.settings.low));if(UI.pstock===3)ps=ps.filter(p=>p.variants.some(v=>v.stock<=0));
  if(UI.pch)ps=ps.filter(p=>p.ch[UI.pch]&&p.ch[UI.pch].on);
  const sold=id=>S.sales.filter(s=>s.status==='done').reduce((a,s)=>a+s.items.filter(i=>i.pid===id).reduce((b,i)=>b+i.qty,0),0);
  const so=[(a,b)=>b.created-a.created,(a,b)=>sold(b.id)-sold(a.id),(a,b)=>a.price-b.price,(a,b)=>b.price-a.price,(a,b)=>totalStock(a)-totalStock(b)][UI.psort];
  return ps.sort(so);
}
function plistH(){
  const ps=filteredProducts();const pend=new Set(pendingAll().map(x=>x.p.id));
  if(!S.products.length)return emptyV('box','هنوز محصولی ندارید','اولین محصول را اضافه کنید؛ بعد می‌توانید آن را به همه کانال‌ها بفرستید.','افزودن محصول','addProduct');
  if(!ps.length)return emptyV('search','چیزی پیدا نشد',UI.pq?`برای «${esc(UI.pq)}» محصولی نداریم. املای دیگری را امتحان کنید.`:'با این فیلترها محصولی نیست.',null,null,'',UI.pq?'پاک کردن جستجو':'حذف فیلترها','pclear');
  if(UI.pview==='variants')return `<div class="list stagger">${ps.flatMap(p=>p.variants.map(v=>`<button class="li" data-act="product|${p.id}">${thumbH(p,44)}<div class="grow"><div class="t1">${esc(p.name)}</div><div class="t2">${esc(vLabel(v))} · <span class="ltr">${v.sku}</span></div></div>${stBadge(v.stock)}</button>`)).join('')}</div>`;
  return `<div class="list stagger">${ps.map(p=>{const ts=totalStock(p);const lowv=p.variants.filter(v=>v.stock<=0).length;
    return `<button class="li" data-act="product|${p.id}">${thumbH(p)}<div class="grow"><div class="t1">${esc(p.name)}</div><div class="t2">${p.variants.length>1?fa(p.variants.length)+' تنوع · ':''}${fa(ts)} عدد${pend.has(p.id)?' · <span style="color:var(--accent)">ارسال‌نشده</span>':''}</div></div><div style="text-align:left;display:flex;flex-direction:column;align-items:flex-end;gap:4px"><div class="price num">${money(p.price)}</div>${ts<=0?'<span class="st err">ناموجود</span>':lowv?`<span class="st warn">${fa(lowv)} تنوع تمام</span>`:''}</div></button>`;}).join('')}</div>`;
}
TABS.products=()=>{
  const nf=(UI.pstock?1:0)+(UI.pch?1:0);
  return `${rootHdr('محصولات',[['scan','scan'],['plus','addProduct']])}
  <label class="search">${ic('search')}<input data-on="psearch" placeholder="نام، کد کالا یا بارکد" value="${esc(UI.pq)}" enterkeyhint="search">${UI.pq?`<button data-act="pclear" aria-label="پاک کردن">${ic('x')}</button>`:''}</label>
  <div class="utabs"><button class="${UI.pcat<0?'on':''}" data-act="pcat|-1">همه</button>${S.cats.map((c,i)=>`<button class="${UI.pcat===i?'on':''}" data-act="pcat|${i}">${esc(c.name)}</button>`).join('')}</div>
  <div class="row" style="padding:10px 20px 2px"><button class="chip" data-act="psortSheet">${ic('chevD')}${SORTS[UI.psort]}</button><button class="chip ${nf?'on':''}" data-act="pfilter">${ic('filter')}فیلتر${nf?' · '+fa(nf):''}</button><span class="grow"></span>
    <div class="vtog"><button class="${UI.pview==='merged'?'on':''}" data-act="pview|merged" aria-label="محصول‌ها">${ic('stack')}</button><button class="${UI.pview==='variants'?'on':''}" data-act="pview|variants" aria-label="تنوع‌ها">${ic('list')}</button></div></div>
  <div class="scroll" id="plist">${plistH()}</div>`;
};
ON.psearch=v=>{UI.pq=v;const l=$('#plist');if(l)l.innerHTML=plistH();const s=document.activeElement.closest('.search');if(s){const b=s.querySelector('button');if(!v&&b)b.remove();else if(v&&!b)s.insertAdjacentHTML('beforeend',`<button data-act="pclear" aria-label="پاک کردن">${ic('x')}</button>`);}};
A.pclear=()=>{UI.pq='';UI.pstock=0;UI.pch='';refresh();};
A.pcat=i=>{UI.pcat=+i;refresh();};A.pview=v=>{UI.pview=v;refresh();};
A.psortSheet=()=>{const sh=sheet('مرتب‌سازی',()=>`<div class="list">${SORTS.map((s,i)=>`<button class="li" data-act="psort|${i}"><div class="grow t1">${s}</div>${UI.psort===i?`<span style="color:var(--accent)">${ic('check')}</span>`:''}</button>`).join('')}</div>`);A.psort=i=>{UI.psort=+i;sh.close();refresh();};};
A.pfilter=()=>{const sh=sheet('فیلتر',()=>`<div class="pad"><div class="muted small" style="margin:6px 0 10px">موجودی</div></div>${chipsRow(['همه','موجود','رو به اتمام','ناموجود'],UI.pstock,'pfst')}<div class="pad"><div class="muted small" style="margin:20px 0 10px">کانال</div></div>${chipsRow(['همه',...Object.values(OCH).map(c=>c.name)],UI.pch?Object.keys(OCH).indexOf(UI.pch)+1:0,'pfch')}<div class="pad" style="margin-top:26px"><button class="btn primary" data-act="pfapply">نمایش نتیجه</button></div>`,{left:'بستن'});
  A.pfst=i=>{UI.pstock=+i;sh.render();};A.pfch=i=>{UI.pch=+i?Object.keys(OCH)[i-1]:'';sh.render();};A.pfapply=()=>{sh.close();refresh();};};

/* ===== PRODUCT DETAIL ===== */
A.product=pid=>{if(!P_(pid))return toast('این محصول حذف شده','', 'err');push(ProductScreen,{pid});};
function ProductScreen({pid}){
  const p=P_(pid);if(!p)return navBar('محصول')+emptyV('box','این محصول دیگر وجود ندارد','ممکن است حذف شده باشد.','بازگشت','back');
  UI.vsel=UI.vsel||{};let v=V_(p,UI.vsel[pid])||p.variants[0];UI.vsel[pid]=v.id;
  const chg=changesFor(p);const multi=p.variants.length>1;
  const subl=p.attrs.length?p.attrs.map(a=>`${fa(a.values.length)} ${esc(a.name)}`).join('، '):'بدون تنوع';
  const chRows=Object.keys(OCH).map(cid=>{const conn=S.channels[cid]&&S.channels[cid].connected;const st=conn?chStatus(p,cid):'off';
    const val=!conn?'وصل نیست':vOn(p,v,cid)?`${fa(vStock(p,v,cid))}، ${money(vPrice(p,v,cid))}`:'فروخته نمی‌شود';
    const dot=st==='fail'?'<i class="pdot err"></i>':st==='pending'?'<i class="pdot"></i>':'';
    return li({icon:OCH[cid].icon,title:OCH[cid].name,val:dot+`<span class="num">${val}</span>`,act:`vChSheet|${pid}|${v.id}|${cid}`});}).join('');
  const since=Date.now()-30*DAY,bv={};let tq=0,tr=0;
  S.sales.forEach(s=>{if(s.status!=='done'||s.t<since)return;s.items.forEach(i=>{if(i.pid!==pid)return;const o=bv[i.vid]=bv[i.vid]||{q:0,r:0};o.q+=i.qty;o.r+=i.qty*i.price;tq+=i.qty;tr+=i.qty*i.price;});});
  const tops=Object.entries(bv).filter(([vid])=>V_(p,vid)).sort((x,y)=>y[1].q-x[1].q).slice(0,3);
  return `<div class="pnav" id="pnav"><div class="top-safe"></div><div class="nav"><button class="gbtn" data-act="back" aria-label="بازگشت">${ic('chevR')}</button><div class="t">${esc(p.name)}</div><button class="gbtn" data-act="pmore|${pid}" style="justify-self:end" aria-label="بیشتر">${ic('dots')}</button></div></div>
  <div class="scroll no-tab" data-scrollnav>
    <div class="phero"><div class="pimg">${p.img?`<img src="${p.img}" alt="">`:`<div class="noimg">${ic('image')}</div>`}</div></div>
    <div class="pdt center"><div class="muted small">${esc(catName(p.cat))}</div><h1 class="ptitle">${esc(p.name)}</h1><div class="muted small">${subl}</div></div>
    ${multi?`<div class="utabs" id="vtabs">${p.variants.map(x=>`<button class="${x.id===v.id?'on':''}" data-act="vsel|${pid}|${x.id}">${esc(x.opts.join('، '))}</button>`).join('')}</div>`:''}
    <div class="list">
      ${li({title:'کد کالا (SKU)',val:`<span class="ltr">${esc(v.sku)}</span>`,act:'variants|'+pid})}
      ${li({title:'بارکد',val:`<span class="num">${fa(v.barcode)}</span>`,act:`vBarcode|${pid}|${v.id}`})}
      ${li({title:'موجودی انبار',val:`<span class="num" ${v.stock<=0?'style="color:var(--red)"':''}>${v.stock<=0?'تمام شد':fa(v.stock)+' عدد'}</span>`,act:`vStockSheet|${pid}|${v.id}`})}
    </div>
    <div class="sec"><div class="h2">قیمت و موجودی در کانال‌ها</div></div>
    <div class="list">${chRows}${li({icon:'store',title:'حضوری و اینستاگرام',val:`<span class="num">${money(p.price)}</span>`,act:'editPrice|'+pid})}</div>
    <div class="sec"><div class="h2">${multi?'پرفروش‌ترین تنوع‌ها':'فروش'}</div><span class="muted small">۳۰ روز اخیر${tq?` · ${fa(tq)} عدد · ${short(tr)} تومان`:''}</span></div>
    ${tops.length?`<div class="list">${tops.map(([vid,o],i)=>{const vv=V_(p,vid);return `<button class="li" data-act="vselTop|${pid}|${vid}"><span class="rank">${fa(i+1)}</span>${thumbH(p,44)}<div class="grow"><div class="t1">${esc(vv.opts.length?vv.opts.join('، '):p.name)}</div><div class="t2">${fa(o.q)} عدد</div></div><span class="val num">${short(o.r)}</span></button>`;}).join('')}</div>`:`<div class="pad muted small">در ۳۰ روز اخیر فروشی نداشته.</div>`}
    ${chg.length?`<div class="pinfo">${ic('alert')}<div class="grow"><b>${fa(chg.length)} تغییر هنوز ارسال نشده</b><span>${chg.slice(0,2).map(changeText).join('، ')}${chg.length>2?' و…':''}</span></div></div>`:''}
  </div>
  ${chg.length?`<div class="bottom ${UI._pdpChg&&UI._pdpChg[pid]?'':'slidein'}"><button class="btn primary" data-act="send|${pid}">${ic('up')}ارسال به کانال‌ها<span class="bcount num">${fa(chg.length)}</span></button></div>`:''}`;
}
ProductScreen.after=(el,{pid})=>{UI._pdpChg=UI._pdpChg||{};UI._pdpChg[pid]=!!$('.bottom',el);
  const t=$('#vtabs .on',el);if(t){const r=t.parentNode;r.scrollLeft=t.offsetLeft+t.offsetWidth/2-r.clientWidth/2;}
  const sc=$('[data-scrollnav]',el),nav=$('#pnav',el),im=$('.pimg',el),hero=$('.phero',el),tt=$('.pdt .ptitle',el);if(!sc||!nav||!im)return;
  hero.style.paddingTop=(nav.offsetHeight+6)+'px';
  let raf=0;const f=()=>{raf=0;const y=sc.scrollTop;const end=tt.offsetTop+tt.offsetHeight-nav.offsetHeight;
    if(y<0){im.style.transform=`scale(${(1+(-y)/300).toFixed(3)})`;im.style.opacity=1;}
    else{const k=Math.min(1,y/140);im.style.transform=`translateY(${(y*.15).toFixed(1)}px) scale(${(1-k*.3).toFixed(3)})`;im.style.opacity=(1-k).toFixed(3);}
    nav.classList.toggle('solid',y>end);};
  sc.addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(f);},{passive:true});f();};
A.vsel=(pid,vid)=>{UI.vsel[pid]=vid;haptic();refresh();};
A.vselTop=(pid,vid)=>{UI.vsel[pid]=vid;haptic();refresh();const top=UI.stack[UI.stack.length-1];const sc=top&&$('[data-scrollnav]',top.el);if(sc){const tb=$('#vtabs',top.el)||$('.pdt',top.el);sc.scrollTo({top:Math.max(0,tb.offsetTop-90),behavior:'smooth'});}};
A.vstock=(pid,vid,d)=>{const p=P_(pid),v=V_(p,vid);const n=v.stock+(+d);if(n<0)return;v.stock=n;save();haptic();refresh();};
A.vBarcode=(pid,vid)=>{const v=V_(P_(pid),vid);const sh=sheet('بارکد',()=>`<div class="pad"><input class="input ltr num" id="vbc" inputmode="numeric" value="${esc(v.barcode)}" style="text-align:center;font-size:20px;letter-spacing:1px" data-enter="vbcSave"><div id="vbce"></div><p class="muted small" style="text-align:center;line-height:1.9">بارکد را اسکن کنید یا عددش را بنویسید.</p><button class="btn gray" data-act="vbcScan">${ic('scan')}اسکن بارکد</button></div>`,{right:'ذخیره',onRight:()=>A.vbcSave()});
  A.vbcSave=()=>{const d=String($('#vbc').value).replace(/[۰-۹]/g,x=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(x)).replace(/\D/g,'');if(d.length<8||d.length>14){$('#vbce').innerHTML=`<div class="err-text">${ic('alert')}بارکد باید ۸ تا ۱۴ رقم باشد</div>`;return false;}v.barcode=d;save();sh.close();refresh();toast('بارکد ذخیره شد');return false;};
  A.vbcScan=()=>{const i=$('#vbc');i.value='';let k=0;const code=barcode(Date.now()%1e5);const t=setInterval(()=>{i.value=code.slice(0,++k);if(k>=code.length){clearInterval(t);haptic();toast('بارکد خوانده شد','','info');}},40);};};
A.vStockSheet=(pid,vid)=>{const p=P_(pid),v=V_(p,vid);let n=v.stock;const sh=sheet('موجودی انبار',()=>`<div class="pad" style="text-align:center"><div class="muted small">${esc(p.name)}${v.opts.length?' · '+esc(v.opts.join('، ')):''}</div><div class="bigstep"><button data-act="vsN|-1" aria-label="کم">${ic('minus')}</button><input id="vsn" class="num" inputmode="numeric" value="${fa(n)}" data-on="vsIn"><button data-act="vsN|1" aria-label="زیاد">${ic('plus')}</button></div>
  <div class="chips" style="justify-content:center;padding:0">${[5,10,20].map(x=>`<button class="chip" data-act="vsN|${x}">+${fa(x)}</button>`).join('')}</div><p class="muted small" style="line-height:1.9;margin-top:16px">موجودی کانال‌ها هم از روی همین عدد به‌روز می‌شود.</p></div>`,{right:'ذخیره',onRight:()=>{v.stock=n;save();refresh();toast('موجودی ذخیره شد',pendingCount()?'برای کانال‌ها ارسال کنید':'');}});
  A.vsN=d=>{n=Math.max(0,n+(+d));haptic();$('#vsn').value=fa(n);};ON.vsIn=val=>{n=parseNum(val);};};
const chBase=(p,cid)=>(p.ch[cid]&&p.ch[cid].price)||applyStr(p.price,strat(S.channels[cid].strategy));
A.vChSheet=(pid,vid,cid)=>{const p=P_(pid),v=V_(p,vid);const chs=S.channels[cid];
  if(!chs||!chs.connected)return sheet(OCH[cid].name,()=>emptyV(OCH[cid].icon,`${OCH[cid].name} وصل نیست`,'اول کانال را وصل کنید تا بتوانید در آن بفروشید.','وصل کردن','connect|'+cid),{left:'بستن'});
  const o=vch(v,cid);const d={manual:!!o.price,price:o.price||chBase(p,cid),cap:o.stock!=null?Math.min(o.stock,v.stock):v.stock,on:vOn(p,v,cid)};
  const title=`${OCH[cid].name}${v.opts.length?' · '+esc(v.opts.join('، ')):''}`;
  const grab=()=>{const i=$('#vcp');if(i)d.price=parseNum(i.value)||d.price;};
  const sh=sheet(OCH[cid].name,()=>`<div class="pad"><div class="muted small" style="text-align:center;margin-top:-4px">${v.opts.length?esc(v.opts.join('، ')):esc(p.name)}</div><div class="sht">قیمت‌گذاری</div></div>
    <div class="list">${li({title:'استراتژی قیمت',val:esc(strat(chs.strategy).name),act:'vcStrat|'+cid})}${li({title:'قیمت حاصل',val:`<span class="num">${toman(chBase(p,cid))}</span>`,act:'vcFormula|'+cid})}</div>
    <div class="pad"><div class="sht" style="margin-top:22px">قیمت جدا برای این تنوع</div></div>
    <div class="list"><div class="li"><div class="grow t1">قیمت دستی</div>${tg(d.manual,'vcMan')}</div>
      <div class="li"><div class="grow t1" ${d.manual?'':'style="color:var(--text3)"'}>قیمت</div>${d.manual?`<span class="inlwrap"><input class="inl num" id="vcp" inputmode="numeric" data-on="numfmt" value="${money(d.price)}"><span class="muted small">تومان</span></span>`:`<span class="val num" style="color:var(--text3)">${toman(chBase(p,cid))}</span>`}</div>
      <div class="li"><div class="grow"><div class="t1">موجودی قابل فروش</div><div class="t2">از ${fa(v.stock)} عدد انبار</div></div>${stepper(d.cap,'vcCap|-1','vcCap|1')}</div></div>
    <div class="list" style="margin-top:14px"><div class="li"><div class="grow t1">فروش این تنوع در ${OCH[cid].name}</div>${tg(d.on,'vcOn')}</div></div>
    ${chs.status==='expired'?`<div style="margin-top:14px">${banner('alert','اتصال منقضی شده','تغییرها به این کانال نمی‌رسند','reconnect|'+cid,'اتصال','err')}</div>`:''}`,
    {right:'ذخیره',onClose:()=>{UI._stratCb=null;},onRight:()=>{grab();if(d.manual&&!d.price){toast('قیمت را وارد کنید','','err');return false;}
      setVch(v,cid,{price:d.manual?d.price:null,stock:d.cap>=v.stock?null:d.cap});
      if(d.on){if(!p.ch[cid]||!p.ch[cid].on){p.ch[cid]={...(p.ch[cid]||{}),on:true};p.variants.forEach(x=>{if(x!==v)setVch(x,cid,{off:true});});}setVch(v,cid,{off:false});}
      else{setVch(v,cid,{off:true});if(p.variants.every(x=>vch(x,cid).off)){p.ch[cid]={...(p.ch[cid]||{}),on:false};p.variants.forEach(x=>setVch(x,cid,{off:false}));}}
      save();refresh();toast('ذخیره شد',d.on?`${OCH[cid].name}: ${fa(vStock(p,v,cid))} عدد · ${toman(vPrice(p,v,cid))}`:`این تنوع در ${OCH[cid].name} فروخته نمی‌شود`);}});
  UI._stratCb=()=>sh.render();
  A.vcMan=()=>{grab();d.manual=!d.manual;sh.render();if(d.manual)setTimeout(()=>{const i=$('#vcp');i&&i.select();},60);};
  A.vcCap=dd=>{grab();d.cap=Math.max(0,Math.min(v.stock,d.cap+(+dd)));if(+dd>0&&d.cap===v.stock&&v.stock>0)toast('بیشتر از موجودی انبار نمی‌شود','','info');haptic();sh.render();};
  A.vcOn=()=>{grab();d.on=!d.on;sh.render();};
  A.vcFormula=c=>{const st=strat(S.channels[c].strategy);toast(p.ch[c]&&p.ch[c].price?'قیمت جدا برای کل محصول':`${money(p.price)} ${st.pct>=0?'+':'−'} ${fa(Math.abs(st.pct))}٪`,p.ch[c]&&p.ch[c].price?'':st.round?`گرد به ${short(st.round)}`:'','info');};
  A.vcStrat=c=>{grab();A.stratPick(c);};};

/* ===== VARIANTS & SKU ===== */
A.variants=pid=>{const p=P_(pid);UI.va={pid,attrs:JSON.parse(JSON.stringify(p.attrs)),sku:Object.fromEntries(p.variants.map(v=>[v.opts.join('|'),v.sku])),dirty:false};push(VariantsScreen,{pid});};
const vaCombos=()=>{const a=UI.va.attrs.filter(x=>x.values.length);return a.length?cart(a.map(x=>x.values)):[[]];};
const vaSku=(p,o)=>UI.va.sku[o.join('|')]||skuFor(p.code||'P',o);
const attrSum=a=>!a.values.length?'بدون مقدار':a.name==='سایز'&&a.values.length>2?`${a.values[0]} تا ${a.values[a.values.length-1]}`:a.values.join('، ');
function VariantsScreen({pid}){const p=P_(pid);const d=UI.va;const combos=vaCombos();
  return `${navBar('تنوع‌ها و SKU',{trail:'plus',trailAct:'vaAdd'})}<div class="scroll no-tab">
    <div class="sec" style="padding-top:6px"><div class="h2">ویژگی‌ها</div></div>
    <div class="list">${d.attrs.length?d.attrs.map((a,i)=>li({title:esc(a.name),val:esc(attrSum(a)),act:'vaAttr|'+i})).join(''):li({icon:'plus',title:'افزودن ویژگی',sub:'رنگ، سایز یا هر ویژگی دیگر',act:'vaAdd'})}</div>
    ${secH('کد کالای هر تنوع','vaAuto','ساخت خودکار')}
    <div class="list">${combos.map(o=>li({title:o.length?esc(o.join('، ')):'تک',val:`<span class="ltr">${esc(vaSku(p,o))}</span>`,act:'vaSkuEdit|'+encodeURIComponent(o.join('|'))})).join('')}</div>
  </div><div class="bottom"><button class="btn primary" data-act="vaSave">ذخیره</button></div>`;}
const vaRender=()=>{const top=UI.stack[UI.stack.length-1];if(top&&top.fn===VariantsScreen)renderInto(top.el,VariantsScreen,top.params);};
A.vaAuto=()=>{const p=P_(UI.va.pid);vaCombos().forEach(o=>UI.va.sku[o.join('|')]=skuFor(p.code||'P',o));UI.va.dirty=true;vaRender();toast('کد کالاها ساخته شد','','info');};
A.vaSkuEdit=k=>{k=decodeURIComponent(k);const p=P_(UI.va.pid);const o=k?k.split('|'):[];const sh=sheet('کد کالا (SKU)',()=>`<div class="pad"><div class="muted small" style="text-align:center;margin-bottom:10px">${o.length?esc(o.join('، ')):'تک'}</div><input class="input ltr" id="vask" value="${esc(vaSku(p,o))}" style="text-align:center;font-size:18px" data-enter="vaskOk"></div>`,{right:'ذخیره',onRight:()=>A.vaskOk()});setTimeout(()=>{const i=$('#vask');i&&i.select();},400);
  A.vaskOk=()=>{const v=$('#vask').value.trim().toUpperCase();if(!v){toast('کد کالا را بنویسید','','err');return false;}const clash=vaCombos().some(c=>c.join('|')!==k&&vaSku(p,c)===v);if(clash){toast('این کد برای تنوع دیگری است','کد هر تنوع باید یکتا باشد','err');return false;}UI.va.sku[k]=v;UI.va.dirty=true;sh.close();vaRender();return false;};};
A.vaAdd=()=>{const used=UI.va.attrs.map(a=>a.name);const sh=sheet('ویژگی جدید',()=>`<div class="list">${Object.keys(PRESET).filter(n=>!used.includes(n)).map(n=>li({title:n,sub:PRESET[n].slice(0,3).join('، ')+'…',act:'vaNew|'+n})).join('')}</div><div class="pad" style="margin-top:14px"><div class="lbl" style="margin-top:0">یا ویژگی دیگر</div><input class="input" id="vanew" placeholder="مثلاً طرح، وزن، ظرفیت" data-enter="vaNewIn"></div>`,{right:'افزودن',onRight:()=>A.vaNewIn()});
  A.vaNew=n=>{sh.close();UI.va.attrs.push({name:n,values:[]});UI.va.dirty=true;vaRender();setTimeout(()=>A.vaAttr(UI.va.attrs.length-1),380);};
  A.vaNewIn=()=>{const n=$('#vanew').value.trim();if(!n){toast('نام ویژگی را بنویسید','','err');return false;}if(used.includes(n)){toast('این ویژگی از قبل هست','','err');return false;}A.vaNew(n);return false;};};
A.vaAttr=i=>{const a=UI.va.attrs[+i];const sh=sheet(esc(a.name),()=>`<div class="pad"><div class="vals" style="display:flex;flex-wrap:wrap;gap:8px">${a.values.map((x,j)=>`<span class="chip on">${esc(x)}<button data-act="vaValDel|${j}" aria-label="حذف">${ic('x')}</button></span>`).join('')}<input class="valin" id="vaval" placeholder="+ مقدار" data-enter="vaValIn" enterkeyhint="done"></div>
    ${(PRESET[a.name]||[]).filter(x=>!a.values.includes(x)).length?`<div class="sugg">${PRESET[a.name].filter(x=>!a.values.includes(x)).map(x=>`<button data-act="vaValAdd|${encodeURIComponent(x)}">+ ${x}</button>`).join('')}</div>`:''}
    <p class="muted small" style="line-height:1.9;margin-top:16px">با هر مقدار جدید، تنوع‌های تازه با موجودی صفر ساخته می‌شوند.</p><button class="textbtn" style="color:var(--red);width:100%;margin-top:6px" data-act="vaAttrDel">حذف این ویژگی</button></div>`,{left:'بستن',onClose:vaRender});
  const add=x=>{x=x.trim();if(x&&!a.values.includes(x)){a.values.push(x);UI.va.dirty=true;}sh.render();vaRender();setTimeout(()=>{const n=$('#vaval');n&&n.focus();},30);};
  A.vaValIn=()=>add($('#vaval').value);A.vaValAdd=x=>add(decodeURIComponent(x));
  A.vaValDel=j=>{a.values.splice(+j,1);UI.va.dirty=true;sh.render();vaRender();};
  A.vaAttrDel=()=>{UI.va.attrs.splice(+i,1);UI.va.dirty=true;sh.close();};};
A.vaSave=()=>{const p=P_(UI.va.pid);const attrs=UI.va.attrs.filter(a=>a.values.length);const combos=attrs.length?cart(attrs.map(a=>a.values)):[[]];
  const before=p.variants.length;let added=0;
  const nv=combos.map((o,i)=>{const k=o.join('|');const ex=p.variants.find(v=>v.opts.join('|')===k)||(!o.length&&p.variants[0]);const sku=UI.va.sku[k]||skuFor(p.code||'P',o);if(ex)return {...ex,opts:o,sku};added++;return {id:uid(),opts:o,sku,barcode:barcode(Date.now()%1e5+i),stock:0};});
  const removed=p.variants.filter(v=>!nv.some(x=>x.id===v.id)).length;p.attrs=attrs;p.variants=nv;if(!nv.some(x=>x.id===UI.vsel[p.id]))UI.vsel[p.id]=nv[0].id;save();UI.va=null;pop();
  toast('تنوع‌ها ذخیره شد',[added?`${fa(added)} تنوع جدید`:'',removed?`${fa(removed)} تنوع حذف شد`:''].filter(Boolean).join(' · '));};
A.editPrice=pid=>{const p=P_(pid);let val=p.price;const sh=sheet('قیمت پایه',()=>`<div class="pad"><input class="input num" inputmode="numeric" data-on="numfmt" id="pp" value="${money(val)}" style="text-align:center;font-size:24px;font-weight:700;height:64px"><p class="muted small" style="text-align:center;line-height:1.9">قیمت هر کانال از روی قاعده‌اش حساب می‌شود.<br>برای قیمت فقط یک کانال، روی آن کانال بزنید.</p></div>`,{right:'ذخیره',onRight:()=>{const n=parseNum($('#pp').value);if(!n){toast('قیمت را وارد کنید','','err');return false;}p.price=n;save();refresh();toast('قیمت ذخیره شد','حالا آن را به کانال‌ها بفرستید');}});setTimeout(()=>$('#pp').select(),400);};
const parseNum=s=>+String(s).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[^0-9]/g,'')||0;
ON.numfmt=(v,...r)=>{const t=r[r.length-2];const n=parseNum(v);t.value=n?money(n):'';};
A.chSheet=(pid,cid)=>{const p=P_(pid);const chs=S.channels[cid];
  if(!chs||!chs.connected){return sheet(OCH[cid].name,()=>emptyV(OCH[cid].icon,`${OCH[cid].name} وصل نیست`,'اول کانال را وصل کنید تا بتوانید در آن بفروشید.','وصل کردن','connect|'+cid),{left:'بستن'});}
  const d={on:!!p.ch[cid].on,mode:p.ch[cid].price?1:0,price:p.ch[cid].price||chPrice({...p,ch:{[cid]:{on:true}}},cid)};
  const st=strat(chs.strategy);
  const sh=sheet(OCH[cid].name,()=>`<div class="list"><div class="li"><div class="grow"><div class="t1">فروش در ${OCH[cid].name}</div><div class="t2">${d.on?'این محصول در کانال نمایش داده می‌شود':'این محصول در کانال نمایش داده نمی‌شود'}</div></div>${tg(d.on,'chOn')}</div></div>
    ${d.on?`<div class="pad"><div class="choice"><button class="${d.mode===0?'on':''}" data-act="chMode|0"><small>طبق قاعده</small><b class="num">${money(applyStr(p.price,st))}</b><small>${esc(st.name)}</small></button><button class="${d.mode===1?'on':''}" data-act="chMode|1"><small>قیمت جدا</small><b class="num">${money(d.price)}</b><small>فقط برای این کانال</small></button></div>
    ${d.mode===1?`<input class="input num" style="margin-top:14px;text-align:center;font-weight:700" inputmode="numeric" data-on="numfmt" id="cpi" value="${money(d.price)}">`:''}</div>`:''}
    ${S.channels[cid].status==='expired'?`<div style="margin-top:14px">${banner('alert','اتصال منقضی شده','تغییرها به این کانال نمی‌رسند','reconnect|'+cid,'اتصال','err')}</div>`:''}`,{right:'ذخیره',onRight:()=>{if(d.mode===1){const n=parseNum(($('#cpi')||{}).value||d.price);if(!n){toast('قیمت را وارد کنید','','err');return false;}d.price=n;}
      p.ch[cid]={on:d.on,price:d.on&&d.mode===1?d.price:null};save();refresh();toast('ذخیره شد',d.on?`قیمت ${OCH[cid].name}: ${toman(chPrice(p,cid))}`:`از ${OCH[cid].name} برداشته می‌شود`);}});
  A.chOn=()=>{d.on=!d.on;sh.render();};A.chMode=m=>{if($('#cpi'))d.price=parseNum($('#cpi').value)||d.price;d.mode=+m;sh.render();if(+m===1)setTimeout(()=>$('#cpi')&&$('#cpi').focus(),50);};};
A.pmore=pid=>{const p=P_(pid);const sh=sheet(esc(p.name),()=>`<div class="list">${li({icon:'pencil',title:'ویرایش نام و دسته',act:'pedit|'+pid})}${li({icon:'stack',title:'کپی از این محصول',act:'pdup|'+pid})}${li({icon:'refresh',title:'دریافت از کانال‌ها',act:'pull'})}<button class="li" data-act="pdel|${pid}"><span class="tile" style="color:var(--red)">${ic('trash')}</span><div class="grow t1" style="color:var(--red)">حذف محصول</div></button></div>`,{left:'بستن'});
  A.pedit=()=>{sh.close();setTimeout(()=>editProductSheet(p),300);};
  A.pdup=()=>{sh.close();const np=JSON.parse(JSON.stringify(p));np.id=uid();np.name=p.name+' (کپی)';np.created=Date.now();np.variants.forEach(v=>{v.id=uid();v.stock=0;});S.products.push(np);save();setTimeout(()=>{replace(ProductScreen,{pid:np.id});toast('کپی ساخته شد','موجودی تنوع‌ها صفر است');},250);};
  A.pdel=()=>{sh.close();setTimeout(()=>confirmSheet('این محصول حذف شود؟','از همه کانال‌ها هم برداشته می‌شود. این کار برگشت ندارد.','حذف محصول',()=>{S.products=S.products.filter(x=>x.id!==pid);delete S.synced[pid];save();pop();toast('محصول حذف شد');}),300);};};
function confirmSheet(title,msg,btn,onYes,danger=true){const sh=sheet('',()=>`<div class="pad" style="text-align:center;padding-top:6px"><div class="empty-ic ${danger?'err':''}">${ic(danger?'trash':'alert')}</div><h3 style="margin:14px 0 6px">${title}</h3><p class="muted" style="margin:0 0 22px;line-height:1.9">${msg}</p><button class="btn ${danger?'danger':'primary'}" data-act="cfyes">${btn}</button><button class="btn gray" style="margin-top:10px" data-act="cfno">انصراف</button></div>`,{left:''});A.cfyes=()=>{sh.close();onYes();};A.cfno=()=>sh.close();return sh;}
function editProductSheet(p){const d={name:p.name,cat:p.cat};const sh=sheet('ویرایش محصول',()=>`<div class="pad"><div class="muted small" style="margin:4px 0 8px">نام محصول</div><input class="input" id="epn" value="${esc(d.name)}"><div class="muted small" style="margin:18px 0 8px">دسته</div></div><div class="chips" style="flex-wrap:wrap">${S.cats.map(c=>`<button class="chip ${d.cat===c.id?'on':''}" data-act="epc|${c.id}">${esc(c.name)}</button>`).join('')}</div>`,{right:'ذخیره',onRight:()=>{const n=$('#epn').value.trim();if(!n){toast('نام محصول را بنویسید','','err');return false;}p.name=n;p.cat=d.cat;save();refresh();toast('ذخیره شد');}});A.epc=c=>{d.name=$('#epn').value;d.cat=c;sh.render();};}

/* ===== SEND / PULL ===== */
A.send=pid=>push(SendScreen,{pid});
function SendScreen({pid}){
  let pend=pendingAll();if(pid)pend=pend.filter(x=>x.p.id===pid).length?pend:pend;
  if(!pend.length)return navBar('ارسال تغییرات')+`<div class="scroll no-tab">${emptyV('checkc','همه کانال‌ها به‌روزند','تغییری برای ارسال نیست.','بازگشت','back')}</div>`;
  const chs=[...new Set(pend.flatMap(x=>x.ch.map(c=>c.cid)))];const exp=chs.filter(c=>S.channels[c].status==='expired');
  return `${navBar('ارسال تغییرات')}<div class="scroll no-tab">
    <div class="pad" style="padding-top:4px"><h2 class="big">${fa(pend.length)} محصول، ${fa(chs.length)} کانال</h2><p class="muted" style="margin:4px 0 0">این تغییرها به کانال‌ها فرستاده می‌شود.</p></div>
    <div class="chips" style="margin-top:14px">${chs.map(c=>`<span class="chip">${ic(OCH[c].icon)}${OCH[c].name}${S.channels[c].status==='expired'?` <span style="color:var(--red)">●</span>`:''}</span>`).join('')}</div>
    ${exp.length?`<div style="margin-top:6px">${banner('alert',`اتصال ${exp.map(c=>OCH[c].name).join('، ')} منقضی شده`,'تا دوباره وصل نشوید، به این کانال نمی‌رسد','reconnect|'+exp[0],'اتصال','err')}</div>`:''}
    <div class="list stagger" style="margin-top:8px">${pend.map(({p,ch})=>`<div class="li" style="align-items:flex-start">${thumbH(p,44)}<div class="grow"><div class="t1">${esc(p.name)}</div>${ch.map(c=>`<div class="t2 num">${changeText(c)}</div>`).join('')}</div></div>`).join('')}</div>
  </div><div class="bottom"><button class="btn primary" data-act="doSend">${ic('send')}ارسال به ${fa(chs.length)} کانال</button></div>`;
}
A.doSend=()=>{const pend=pendingAll();const chs=[...new Set(pend.flatMap(x=>x.ch.map(c=>c.cid)))];replace(SendProgress,{chs,pend:pend.map(x=>({pid:x.p.id,ch:x.ch}))});};
function SendProgress({chs}){return `<div class="top-safe"></div><div class="nav"><span></span><div class="t">در حال ارسال</div><span></span></div><div class="scroll no-tab"><div class="pad" style="padding-top:30px;text-align:center"><div class="sendorb" id="orb">${ic('send')}</div><h2 class="big" id="sph" style="margin-top:22px">در حال ارسال…</h2><p class="muted" id="spp" style="margin:6px 0 24px">چند ثانیه صبر کنید</p><div class="progress"><i id="spbar" style="width:4%"></i></div></div>
  <div class="list" style="margin-top:20px">${chs.map(c=>`<div class="li" id="sp-${c}"><span class="tile">${ic(OCH[c].icon)}</span><div class="grow"><div class="t1">${OCH[c].name}</div><div class="t2">در صف</div></div><span class="sst"><i class="spin dark"></i></span></div>`).join('')}</div></div><div class="bottom" id="spbtm" style="opacity:0;pointer-events:none"></div>`;}
SendProgress.after=(el,{chs,pend})=>{
  const res={};let k=0;const step=()=>{if(!el.isConnected)return;if(k>=chs.length)return finish();const c=chs[k];const row=$('#sp-'+c,el);row.querySelector('.t2').textContent='در حال ارسال…';
    setTimeout(()=>{if(!el.isConnected)return;const ok=S.channels[c].status!=='expired'&&online();res[c]=ok?'ok':'fail';
      row.querySelector('.sst').innerHTML=`<span class="st ${ok?'ok':'err'} pop">${ic(ok?'checkc':'xc')}</span>`;row.querySelector('.t2').innerHTML=ok?'<span style="color:var(--green)">به‌روز شد</span>':`<span style="color:var(--red)">${online()?'اتصال منقضی شده':'اینترنت وصل نیست'}</span>`;
      if(ok){S.products.forEach(p=>{const cs=changesFor(p).filter(x=>x.cid===c);if(!cs.length)return;S.synced[p.id]=S.synced[p.id]||{};if(p.ch[c]&&p.ch[c].on)S.synced[p.id][c]=snapOf(p,c);else delete S.synced[p.id][c];});S.channels[c].last=Date.now();}
      k++;$('#spbar',el).style.width=(k/chs.length*100)+'%';haptic();setTimeout(step,250);},700+Math.random()*500);};
  const finish=()=>{const ok=Object.values(res).filter(x=>x==='ok').length,fail=chs.filter(c=>res[c]==='fail');
    S.versions.unshift({id:uid(),t:Date.now(),title:pend.length===1?(P_(pend[0].pid)||{}).name||'ارسال تغییرات':`${fa(pend.length)} محصول`,items:pend.map(x=>({pid:x.pid,lines:[...new Set(x.ch.map(c=>c.kind==='price'||c.kind==='vprice'?'قیمت':c.kind==='stock'?'موجودی':c.kind==='new'?'محصول جدید':'حذف'))]})),res,prices:Object.fromEntries(S.products.map(p=>[p.id,p.price]))});
    if(fail.length)notify('err',`ارسال به ${fail.map(c=>OCH[c].name).join('، ')} انجام نشد`,'اتصال را بررسی کنید و دوباره بفرستید.');save();
    const orb=$('#orb',el);orb.classList.add(fail.length?(ok?'warn':'err'):'ok');orb.innerHTML=ic(fail.length?'alert':'check');
    $('#sph',el).textContent=!fail.length?'همه کانال‌ها به‌روز شدند':ok?`${fa(ok)} از ${fa(chs.length)} کانال به‌روز شد`:'ارسال انجام نشد';
    $('#spp',el).textContent=!fail.length?'قیمت و موجودی همه‌جا یکی است.':`${fail.map(c=>OCH[c].name).join('، ')} به‌روز نشد. تغییرهایش نگه داشته شده.`;
    const b=$('#spbtm',el);b.innerHTML=fail.length?`<button class="btn gray" data-act="back">بستن</button><button class="btn primary" data-act="reconnect|${fail[0]}">اتصال دوباره</button>`:`<button class="btn primary" data-act="back">تمام</button>`;b.style.opacity=1;b.style.pointerEvents='auto';b.style.transition='opacity .3s';toast(fail.length?'بخشی از تغییرها ارسال شد':'ارسال شد',fail.length?'یک کانال نیاز به اتصال دارد':'',fail.length?'err':'ok');};
  setTimeout(step,500);};
A.reconnect=cid=>{const sh=sheet(`اتصال ${OCH[cid].name}`,()=>`<div class="pad" style="text-align:center"><div class="empty-ic">${ic(OCH[cid].icon)}</div><h3 style="margin:14px 0 6px">دوباره وصل شوید</h3><p class="muted" style="margin:0 0 20px;line-height:1.9">اتصال ${OCH[cid].name} منقضی شده.<br>با تأیید، دسترسی دوباره گرفته می‌شود.</p><button class="btn primary" id="rcb" data-act="rcgo">${ic('link')}اتصال به ${OCH[cid].name}</button></div>`,{left:'انصراف'});
  A.rcgo=()=>{const b=$('#rcb');b.innerHTML='<i class="spin"></i>در حال اتصال…';b.disabled=true;setTimeout(()=>{S.channels[cid].status='ok';S.channels[cid].connected=true;S.notifs.forEach(n=>{if(n.act==='channel|'+cid)n.read=true;});save();sh.close();refresh();toast(`${OCH[cid].name} وصل شد`,pendingCount()?'حالا تغییرها را بفرستید':'');},1300);};};
A.pull=()=>push(PullScreen,{});
function PullScreen(){return `${navBar('دریافت از کانال‌ها')}<div class="scroll no-tab" id="pullb"><div class="pad" style="text-align:center;padding-top:80px"><div class="sendorb spinning">${ic('refresh')}</div><h2 class="big" style="margin-top:22px">در حال مقایسه…</h2><p class="muted">قیمت و موجودی کانال‌ها با الان مقایسه می‌شود</p></div></div><div class="bottom" id="pullbtm" style="display:none"></div>`;}
PullScreen.after=el=>{setTimeout(()=>{if(!el.isConnected)return;
  if(!online()){$('#pullb',el).innerHTML=emptyV('wifioff','اینترنت وصل نیست','برای دریافت از کانال‌ها به اینترنت نیاز است.','دوباره امتحان کنید','pullRetry','warn');return;}
  const fresh=Date.now()-S.lastPull<120000;let conf=[];
  if(!fresh){const cand=S.products.filter(p=>p.ch.dk.on&&S.synced[p.id]&&S.synced[p.id].dk);
    cand.slice(0,2).forEach((p,i)=>{const v=p.variants.find(v=>v.stock>2)||p.variants[0];conf.push({id:uid(),pid:p.id,vid:v.id,cid:'dk',kind:'stock',mine:v.stock,theirs:Math.max(0,v.stock-(i+1)),pick:'mine'});});
    const pw=S.products.find(p=>p.ch.web.on&&S.synced[p.id]&&S.synced[p.id].web&&p.id!=='p1');if(pw)conf.push({id:uid(),pid:pw.id,cid:'web',kind:'price',mine:chPrice(pw,'web'),theirs:chPrice(pw,'web')+40000,pick:'mine'});}
  UI.conf=conf;S.lastPull=Date.now();save();
  if(!conf.length){$('#pullb',el).innerHTML=emptyV('checkc','همه‌چیز یکی است','قیمت و موجودی کانال‌ها با الان فرقی ندارد.','بازگشت','back');return;}
  renderConf(el);},1400);};
A.pullRetry=()=>replace(PullScreen,{});
function renderConf(el){const conf=UI.conf;
  $('#pullb',el).innerHTML=`<div class="pad" style="padding-top:4px"><h2 class="big">${fa(conf.length)} اختلاف پیدا شد</h2><p class="muted" style="margin:4px 0 0">برای هر مورد، مقدار درست را انتخاب کنید.</p></div>
  <div class="stagger">${conf.map(c=>{const p=P_(c.pid);const v=c.vid?V_(p,c.vid):null;const fmt=c.kind==='price'?x=>money(x):x=>fa(x)+' عدد';
    return `<div class="conf"><div class="row">${thumbH(p,40)}<div class="grow"><div class="t1">${esc(p.name)}</div><div class="t2 muted small">${c.kind==='price'?'قیمت':'موجودی'}${v?' · '+esc(vLabel(v)):''}</div></div></div>
    <div class="choice"><button class="${c.pick==='mine'?'on':''}" data-act="cpick|${c.id}|mine"><small>الان</small><b class="num">${fmt(c.mine)}</b></button><button class="${c.pick==='theirs'?'on':''}" data-act="cpick|${c.id}|theirs"><small>${OCH[c.cid].name}</small><b class="num">${fmt(c.theirs)}</b></button></div></div>`;}).join('')}</div>`;
  const b=$('#pullbtm',el);b.style.display='flex';b.innerHTML=`<button class="btn primary" data-act="confApply">اعمال انتخاب‌ها</button>`;}
A.cpick=(id,w)=>{const c=UI.conf.find(x=>x.id===id);c.pick=w;const top=UI.stack[UI.stack.length-1];renderConf(top.el);};
A.confApply=()=>{let resend=0;UI.conf.forEach(c=>{const p=P_(c.pid);if(!p)return;const snap=S.synced[p.id][c.cid];
  if(c.pick==='theirs'){if(c.kind==='stock'){const v=V_(p,c.vid);v.stock=c.theirs;snap.stock[v.id]=c.theirs;}else{p.ch[c.cid].price=c.theirs;snap.price=c.theirs;}}
  else{resend++;if(c.kind==='stock')snap.stock[c.vid]=c.theirs;else snap.price=c.theirs;}});save();
  pop();toast('اختلاف‌ها حل شد',resend?'مقدارهای الان را به کانال بفرستید':'مقدارها از کانال گرفته شد');};

/* ===== ADD PRODUCT (3 steps) ===== */
const SAMPLE_IMG=['img/tshirt.webp','img/hoodie.webp','img/jeans.webp','img/sneakers.webp','img/bag.webp'];
const PRESET={'رنگ':['مشکی','سفید','طوسی','سرمه‌ای','کرم'],'سایز':['S','M','L','XL','XXL'],'جنس':['نخ','کتان','پلی‌استر']};
A.addProduct=()=>{UI.np={step:1,img:'',name:'',cat:S.cats[0]?S.cats[0].id:'',specs:[],price:0,ch:{web:true,dk:true,snapp:false},attrs:[],stocks:{},single:0,err:''};push(AddProduct,{});};
function npCombos(){const a=UI.np.attrs.filter(x=>x.values.length);return a.length?cart(a.map(x=>x.values)):[];}
function AddProduct(){const d=UI.np;const T=['عکس و نام','قیمت و کانال‌ها','تنوع و موجودی'];
  let body='';
  if(d.step===1){body=`<div class="pad"><div class="lbl">عکس محصول</div></div><div class="imgpick">
      <label class="ip up">${ic('camera')}<span>عکس از گالری</span><input type="file" accept="image/*" data-on="npFile" hidden></label>
      ${d.img&&!SAMPLE_IMG.includes(d.img)?`<button class="ip on" data-act="npImg|${encodeURIComponent(d.img)}"><img src="${d.img}" alt=""></button>`:''}
      ${SAMPLE_IMG.map(s=>`<button class="ip ${d.img===s?'on':''}" data-act="npImg|${s}"><img src="${s}" alt=""></button>`).join('')}</div>
    <div class="pad"><div class="lbl">نام محصول</div><input class="input" data-on="npName" placeholder="مثلاً تی‌شرت نخی" value="${esc(d.name)}">${d.err?`<div class="err-text">${ic('alert')}${d.err}</div>`:''}
    <div class="lbl">دسته</div></div><div class="chips" style="flex-wrap:wrap;row-gap:8px">${S.cats.map(c=>`<button class="chip ${d.cat===c.id?'on':''}" data-act="npCat|${c.id}">${esc(c.name)}</button>`).join('')}<button class="chip" data-act="addCat|np">${ic('plus')}دسته جدید</button></div>
    <div class="pad"><div class="lbl">مشخصات <span class="muted small">(اختیاری)</span></div>${d.specs.map((s,i)=>`<div class="specrow"><input class="input" placeholder="عنوان، مثلاً جنس" value="${esc(s[0])}" data-on="npSpec|${i}|0"><input class="input" placeholder="مقدار، مثلاً نخ" value="${esc(s[1])}" data-on="npSpec|${i}|1"><button class="gbtn" data-act="npSpecDel|${i}" aria-label="حذف">${ic('x')}</button></div>`).join('')}
    <button class="textbtn row" style="gap:4px;margin-top:8px" data-act="npSpecAdd">${ic('plus')}افزودن مشخصه</button></div>`;}
  if(d.step===2){body=`<div class="pad"><div class="lbl">قیمت پایه</div><div class="pricein"><input class="num" inputmode="numeric" data-on="npPrice" placeholder="۰" value="${d.price?money(d.price):''}"><span>تومان</span></div>${d.err?`<div class="err-text">${ic('alert')}${d.err}</div>`:''}<p class="muted small" style="line-height:1.9;margin:8px 0 0">قیمتی که حضوری می‌فروشید. قیمت هر کانال از روی قاعده‌اش حساب می‌شود.</p>
    <div class="lbl">کجا بفروشید؟</div></div><div class="list">${Object.keys(OCH).map(cid=>{const conn=S.channels[cid]&&S.channels[cid].connected;const st=strat(S.channels[cid]?S.channels[cid].strategy:'s_base');
      return `<div class="li"><span class="tile">${ic(OCH[cid].icon)}</span><button class="grow" style="text-align:right" data-act="${conn?'stratPick|'+cid:'connect|'+cid}"><div class="t1">${OCH[cid].name}</div><div class="t2">${conn?`${esc(st.name)}${d.price?' · <b class="num" style="color:var(--text)">'+money(applyStr(d.price,st))+'</b>':''} <span style="color:var(--accent)">تغییر</span>`:'وصل نیست · <span style="color:var(--accent)">وصل کنید</span>'}</div></button>${conn?tg(d.ch[cid],'npCh|'+cid):''}</div>`;}).join('')}</div>`;}
  if(d.step===3){const combos=npCombos();
    body=`<div class="pad"><p class="muted" style="margin:0 0 6px;line-height:1.9">رنگ، سایز یا هر ویژگی دیگری که دارد را اضافه کنید. تنوع‌ها خودکار ساخته می‌شوند.</p>
    ${d.attrs.map((a,i)=>`<div class="attr"><div class="row"><b class="grow">${esc(a.name)}</b><button class="link" data-act="npAttrDel|${i}">حذف</button></div><div class="vals">${a.values.map((v,j)=>`<span class="chip on">${esc(v)}<button data-act="npValDel|${i}|${j}" aria-label="حذف">${ic('x')}</button></span>`).join('')}<input class="valin" placeholder="+ مقدار" data-enter="npVal|${i}" enterkeyhint="done"></div>
      ${(PRESET[a.name]||[]).filter(v=>!a.values.includes(v)).length?`<div class="sugg">${PRESET[a.name].filter(v=>!a.values.includes(v)).map(v=>`<button data-act="npValAdd|${i}|${v}">+ ${v}</button>`).join('')}</div>`:''}</div>`).join('')}
    <div class="lbl">${d.attrs.length?'ویژگی دیگر':'ویژگی‌ها'}</div><div class="chips" style="padding:0;flex-wrap:wrap;row-gap:8px">${Object.keys(PRESET).filter(k=>!d.attrs.some(a=>a.name===k)).map(k=>`<button class="chip" data-act="npAttr|${k}">${ic('plus')}${k}</button>`).join('')}<button class="chip" data-act="npAttrCustom">${ic('plus')}ویژگی دیگر</button></div></div>
    ${combos.length?`<div class="sec"><div class="h2">${fa(combos.length)} تنوع</div><span class="muted small">موجودی هر کدام</span></div><div class="list">${combos.map(o=>{const k=o.join('|');return `<div class="li"><div class="grow"><div class="t1">${esc(o.join(' · '))}</div><div class="t2 ltr" style="text-align:right">${skuFor('NEW',o)}</div></div>${stepper(d.stocks[k]||0,`npStock|${encodeURIComponent(k)}|-1`,`npStock|${encodeURIComponent(k)}|1`)}</div>`;}).join('')}</div>`
    :`<div class="sec"><div class="h2">موجودی</div></div><div class="list"><div class="li"><div class="grow"><div class="t1">تعداد در انبار</div><div class="t2">بدون تنوع</div></div>${stepper(d.single,'npSingle|-1','npSingle|1')}</div></div>`}`;}
  return `${navBar('محصول جدید',{left:'انصراف',leftAct:'npCancel'})}<div class="steps">${[1,2,3].map(i=>`<i class="${i<=d.step?'on':''}"></i>`).join('')}</div><div class="pad" style="padding-top:14px"><div class="muted small">مرحله ${fa(d.step)} از ۳</div><h2 class="big" style="margin:2px 0 6px">${T[d.step-1]}</h2></div>
  <div class="scroll no-tab" id="npb">${body}</div>
  <div class="bottom">${d.step>1?`<button class="btn gray" style="flex:0 0 110px" data-act="npStep|-1">قبلی</button>`:''}<button class="btn primary" data-act="npStep|1">${d.step<3?'ادامه':'ساخت محصول'}</button></div>`;}
const npRender=()=>{const top=UI.stack[UI.stack.length-1];const sc=top.el.querySelector('#npb');const y=sc?sc.scrollTop:0;renderInto(top.el,AddProduct);const ns=top.el.querySelector('#npb');if(ns)ns.scrollTop=y;};
A.npCancel=()=>{const d=UI.np;if(d.name||d.price||d.attrs.length)confirmSheet('از ساخت محصول منصرف شدید؟','اطلاعاتی که وارد کرده‌اید پاک می‌شود.','بله، پاک شود',()=>pop());else pop();};
A.npImg=s=>{UI.np.img=decodeURIComponent(s);npRender();};
ON.npFile=(v,t)=>{const f=t.files&&t.files[0];if(!f)return;const img=new Image();const url=URL.createObjectURL(f);img.onload=()=>{const c=document.createElement('canvas');const s=Math.min(1,480/Math.max(img.width,img.height));c.width=img.width*s;c.height=img.height*s;c.getContext('2d').drawImage(img,0,0,c.width,c.height);UI.np.img=c.toDataURL('image/jpeg',.8);URL.revokeObjectURL(url);npRender();toast('عکس اضافه شد');};img.src=url;};
ON.npName=v=>{UI.np.name=v;if(UI.np.err&&v.trim()){UI.np.err='';const e=$('#npb .err-text');e&&e.remove();}};
A.npCat=c=>{UI.np.cat=c;npRender();};
A.npSpecAdd=()=>{UI.np.specs.push(['','']);npRender();setTimeout(()=>{const ins=$$('#npb .specrow input');ins[ins.length-2]&&ins[ins.length-2].focus();},50);};
A.npSpecDel=i=>{UI.np.specs.splice(+i,1);npRender();};
ON.npSpec=(v,i,k)=>{UI.np.specs[+i][+k]=v;};
ON.npPrice=(v,t)=>{const n=parseNum(v);UI.np.price=n;const inp=document.activeElement;inp.value=n?money(n):'';clearTimeout(UI._npt);UI._npt=setTimeout(()=>{const pos=null;npRender();const ni=$('#npb .pricein input');if(ni){ni.focus();ni.setSelectionRange(ni.value.length,ni.value.length);}},700);};
A.npCh=cid=>{UI.np.ch[cid]=!UI.np.ch[cid];npRender();};
A.npAttr=k=>{UI.np.attrs.push({name:k,values:[]});npRender();};
A.npAttrCustom=()=>{const sh=sheet('ویژگی جدید',()=>`<div class="pad"><input class="input" id="nac" placeholder="مثلاً طرح، وزن، ظرفیت"></div>`,{right:'افزودن',onRight:()=>{const v=$('#nac').value.trim();if(!v){toast('نام ویژگی را بنویسید','','err');return false;}UI.np.attrs.push({name:v,values:[]});npRender();}});setTimeout(()=>$('#nac').focus(),400);};
A.npAttrDel=i=>{UI.np.attrs.splice(+i,1);npRender();};
A.npVal=(i,t)=>{const v=t.value.trim();if(!v)return;const a=UI.np.attrs[+i];if(!a.values.includes(v))a.values.push(v);npRender();setTimeout(()=>{const ins=$$('#npb .valin');ins[+i]&&ins[+i].focus();},30);};
A.npValAdd=(i,v)=>{const a=UI.np.attrs[+i];if(!a.values.includes(v))a.values.push(v);haptic();npRender();};
A.npValDel=(i,j)=>{UI.np.attrs[+i].values.splice(+j,1);npRender();};
A.npStock=(k,dd)=>{k=decodeURIComponent(k);const s=UI.np.stocks;s[k]=Math.max(0,(s[k]||0)+(+dd));npRender();};
A.npSingle=dd=>{UI.np.single=Math.max(0,UI.np.single+(+dd));npRender();};
A.stratPick=cid=>{const cur=S.channels[cid].strategy;const sh=sheet(`قیمت در ${OCH[cid].name}`,()=>`<div class="list">${S.strategies.map(s=>`<button class="li" data-act="spick|${s.id}"><div class="grow"><div class="t1">${esc(s.name)}</div><div class="t2">${stratDesc(s)}</div></div>${S.channels[cid].strategy===s.id?`<span style="color:var(--accent)">${ic('check')}</span>`:''}</button>`).join('')}</div><div class="pad" style="margin-top:10px"><button class="textbtn row" style="gap:4px" data-act="spnew">${ic('plus')}قاعده جدید</button></div>`,{left:'بستن'});
  A.spick=id=>{S.channels[cid].strategy=id;save();sh.close();if(UI._stratCb)UI._stratCb();if(UI.stack.length&&UI.stack[UI.stack.length-1].fn===AddProduct)npRender();else refresh();toast('قاعده قیمت عوض شد',`${OCH[cid].name}: ${strat(id).name}`);};A.spnew=()=>{sh.close();setTimeout(()=>push(StrategyEdit,{}),250);};};
A.npStep=dd=>{const d=UI.np;dd=+dd;if(dd>0){
    if(d.step===1&&!d.name.trim()){d.err='نام محصول را بنویسید';npRender();return;}
    if(d.step===2&&!d.price){d.err='قیمت را وارد کنید';npRender();return;}
    if(d.step===3){return npCreate();}}
  d.err='';d.step=Math.min(3,Math.max(1,d.step+dd));const top=UI.stack[UI.stack.length-1];renderInto(top.el,AddProduct);$('#npb',top.el).scrollTop=0;$('#npb',top.el).animate([{opacity:0,transform:`translateX(${dd>0?'-':''}24px)`},{opacity:1,transform:'none'}],{duration:320,easing:'cubic-bezier(.32,.72,0,1)'});};
function npCreate(){const d=UI.np;const attrs=d.attrs.filter(a=>a.values.length);const code='P'+fa(S.products.length+1).replace(/[۰-۹]/g,x=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(x));
  const combos=attrs.length?cart(attrs.map(a=>a.values)):[[]];
  const p={id:uid(),name:d.name.trim(),cat:d.cat,img:d.img,price:d.price,code,specs:d.specs.filter(s=>s[0]&&s[1]),desc:'',attrs,variants:combos.map((o,i)=>({id:uid(),opts:o,sku:skuFor(code,o),barcode:barcode(Date.now()%1e5+i),stock:attrs.length?(d.stocks[o.join('|')]||0):d.single})),ch:Object.fromEntries(Object.keys(OCH).map(c=>[c,{on:!!d.ch[c]&&!!(S.channels[c]&&S.channels[c].connected),price:null}])),created:Date.now()};
  S.products.push(p);save();UI.pcat=-1;UI.pq='';
  pop();setTimeout(()=>{push(ProductScreen,{pid:p.id});toast('محصول ساخته شد','برای نمایش در کانال‌ها «ارسال» را بزنید');},420);}
A.addCat=(src)=>{const sh=sheet('دسته جدید',()=>`<div class="pad"><input class="input" id="ncat" placeholder="مثلاً پیراهن"></div>`,{right:'افزودن',onRight:()=>{const v=$('#ncat').value.trim();if(!v){toast('نام دسته را بنویسید','','err');return false;}if(S.cats.some(c=>c.name===v)){toast('این دسته از قبل هست','','err');return false;}const c={id:uid(),name:v};S.cats.push(c);save();if(src==='np'){UI.np.cat=c.id;npRender();}else refresh();toast('دسته اضافه شد');}});setTimeout(()=>$('#ncat').focus(),400);};

/* ===== CATEGORIES ===== */
A.cats=()=>push(CatsScreen,{});
function CatsScreen(){return `${navBar('دسته‌بندی‌ها',{trail:'plus',trailAct:'addCat'})}<div class="scroll no-tab">${S.cats.length?`<div class="list stagger">${S.cats.map(c=>{const n=S.products.filter(p=>p.cat===c.id).length;const p=S.products.find(p=>p.cat===c.id&&p.img);return `<button class="li" data-act="catEdit|${c.id}">${thumbH(p,44)}<div class="grow"><div class="t1">${esc(c.name)}</div><div class="t2">${n?fa(n)+' محصول':'خالی'}</div></div>${ic('chevL','chev')}</button>`;}).join('')}</div>`:emptyV('grid','دسته‌ای ندارید','با دسته‌بندی، محصولات را راحت‌تر پیدا می‌کنید.','افزودن دسته','addCat')}</div>`;}
A.catEdit=id=>{const c=S.cats.find(x=>x.id===id);const n=S.products.filter(p=>p.cat===id).length;const sh=sheet('ویرایش دسته',()=>`<div class="pad"><input class="input" id="ecat" value="${esc(c.name)}"><button class="btn danger" style="margin-top:16px" data-act="catDel">${ic('trash')}حذف دسته</button>${n?`<p class="muted small" style="text-align:center">${fa(n)} محصول این دسته «بدون دسته» می‌شوند.</p>`:''}</div>`,{right:'ذخیره',onRight:()=>{const v=$('#ecat').value.trim();if(!v)return false;c.name=v;save();refresh();toast('ذخیره شد');}});
  A.catDel=()=>{S.cats=S.cats.filter(x=>x.id!==id);S.products.forEach(p=>{if(p.cat===id)p.cat='';});UI.pcat=-1;save();sh.close();refresh();toast('دسته حذف شد');};};

/* ===== LOW STOCK ===== */
A.lowStock=()=>push(LowScreen,{});
function LowScreen(){const l=lowStock();return `${navBar('موجودی کم')}<div class="scroll no-tab">${l.length?`<div class="pad muted small" style="margin-bottom:4px">${fa(S.settings.low)} عدد یا کمتر · قابل تغییر در تنظیمات</div><div class="list stagger">${l.map(({p,v})=>`<div class="li">${thumbH(p,44)}<button class="grow" style="text-align:right" data-act="product|${p.id}"><div class="t1">${esc(p.name)}</div><div class="t2">${esc(vLabel(v))} · ${v.stock<=0?'<span style="color:var(--red)">تمام شد</span>':fa(v.stock)+' عدد'}</div></button>${stepper(v.stock,`vstock|${p.id}|${v.id}|-1`,`vstock|${p.id}|${v.id}|1`)}</div>`).join('')}</div>`:emptyV('checkc','موجودی همه کافی است','هر وقت کالایی رو به اتمام باشد، اینجا می‌بینید.')}</div>`;}

/* ===== STOCK UPDATE ===== */
A.stock=()=>{UI.sd={};UI.sq='';push(StockScreen,{});};
function stockListH(){const q=UI.sq.trim();const ps=S.products.filter(p=>!q||p.name.includes(q)||p.variants.some(v=>v.sku.toLowerCase().includes(q.toLowerCase())));
  if(!ps.length)return emptyV('search','چیزی پیدا نشد','نام یا کد کالا را دوباره بنویسید.');
  return ps.map(p=>`<div class="sgrp"><div class="row" style="padding:14px 20px 4px">${thumbH(p,32)}<b class="grow">${esc(p.name)}</b></div><div class="list">${p.variants.map(v=>{const nv=UI.sd[v.id]??v.stock;const ch=nv!==v.stock;return `<div class="li"><div class="grow"><div class="t1">${esc(vLabel(v))}</div><div class="t2">${ch?`<span style="color:var(--accent)">${fa(v.stock)} ← ${fa(nv)}</span>`:`<span class="ltr">${v.sku}</span>`}</div></div>${stepper(nv,`sdx|${p.id}|${v.id}|-1`,`sdx|${p.id}|${v.id}|1`)}</div>`;}).join('')}</div></div>`).join('');}
function StockScreen(){const n=Object.keys(UI.sd).filter(k=>{const v=S.products.flatMap(p=>p.variants).find(v=>v.id===k);return v&&v.stock!==UI.sd[k];}).length;
  return `${navBar('به‌روزرسانی موجودی',{trail:'scan',trailAct:'scan'})}<label class="search">${ic('search')}<input data-on="sq" placeholder="نام یا کد کالا" value="${esc(UI.sq)}"></label><div class="scroll no-tab" id="sl">${stockListH()}</div>
  <div class="bottom"><button class="btn primary" data-act="sdSave" ${n?'':'disabled'}>${n?`ذخیره ${fa(n)} تغییر`:'تغییری نداده‌اید'}</button></div>`;}
ON.sq=v=>{UI.sq=v;$('#sl').innerHTML=stockListH();};
A.sdx=(pid,vid,d)=>{const v=V_(P_(pid),vid);const cur=UI.sd[vid]??v.stock;const n=Math.max(0,cur+(+d));UI.sd[vid]=n;haptic();const top=UI.stack[UI.stack.length-1];const sc=$('#sl',top.el).scrollTop;renderInto(top.el,StockScreen);$('#sl',top.el).scrollTop=sc;};
A.sdSave=()=>{let n=0;S.products.forEach(p=>p.variants.forEach(v=>{if(UI.sd[v.id]!=null&&UI.sd[v.id]!==v.stock){v.stock=UI.sd[v.id];n++;}}));save();pop();toast('موجودی ذخیره شد',`${fa(n)} تنوع به‌روز شد · برای کانال‌ها ارسال کنید`);};

/* ===== SCANNER ===== */
A.scan=()=>push(ScanScreen,{});
function ScanScreen(){return `<div class="scan"><div class="bgimg" style="background-image:url(img/tshirt.webp)"></div><div class="frame"><i class="line"></i></div>
  <div class="scan-top"><div class="top-safe"></div><div class="nav"><button class="gbtn dark" data-act="back" aria-label="بستن">${ic('x')}</button><div class="t" style="color:#fff">اسکن بارکد</div><button class="gbtn dark" data-act="torch" style="justify-self:end" aria-label="چراغ">${ic('flash')}</button></div></div>
  <div class="scan-hint" id="shint">بارکد را داخل کادر نگه دارید</div>
  <div class="scan-bottom" id="sres"><button class="btn sm" style="background:rgba(255,255,255,.16);color:#fff;backdrop-filter:blur(20px)" data-act="scanManual">${ic('pencil')}وارد کردن کد</button></div></div>`;}
ScanScreen.after=el=>{UI._scanT=setTimeout(()=>{if(!el.isConnected)return;const all=S.products.flatMap(p=>p.variants.map(v=>({p,v})));const f=all[Math.floor(Math.random()*all.length)];scanFound(el,f);},2200);};
function scanFound(el,f){if(!el.isConnected)return;haptic();$('.frame',el).classList.add('hit');$('#shint',el).textContent='پیدا شد';
  $('#sres',el).innerHTML=`<div class="scard pop">${thumbH(f.p,56)}<div class="grow"><div class="t1" style="font-weight:700">${esc(f.p.name)}</div><div class="t2 muted small">${esc(vLabel(f.v))} · ${f.v.stock>0?fa(f.v.stock)+' عدد':'<span style="color:var(--red)">ناموجود</span>'}</div><div class="price num" style="margin-top:2px">${toman(f.p.price)}</div></div></div>
  <div class="row" style="gap:10px;margin-top:10px;width:100%"><button class="btn gray" style="background:rgba(255,255,255,.16);color:#fff" data-act="scanView|${f.p.id}">مشاهده</button><button class="btn primary" data-act="scanSell|${f.p.id}|${f.v.id}">${ic('bag')}افزودن به فروش</button></div><button class="textbtn" style="color:#fff;opacity:.8;margin-top:10px" data-act="scanAgain">اسکن دوباره</button>`;}
A.torch=t=>{t.classList.toggle('on');toast(t.classList.contains('on')?'چراغ روشن شد':'چراغ خاموش شد','','info');};
A.scanAgain=()=>replace(ScanScreen,{});
A.scanView=pid=>{replace(ProductScreen,{pid});};
A.scanSell=(pid,vid)=>{const v=V_(P_(pid),vid);if(v.stock<=0)return toast('موجودی کافی نیست','این تنوع تمام شده','err');cartAdd(pid,vid,1);replace(SaleScreen,{});};
A.scanManual=()=>{clearTimeout(UI._scanT);const sh=sheet('وارد کردن کد',()=>`<div class="pad"><input class="input ltr" id="mcode" placeholder="SKU یا بارکد" style="text-align:center" data-enter="mcGo"><div id="mcerr"></div><button class="btn primary" style="margin-top:14px" data-act="mcGo">جستجو</button><p class="muted small" style="text-align:center">مثال: <span class="ltr">TS-BLK-M</span></p></div>`,{left:'بستن'});setTimeout(()=>$('#mcode').focus(),400);
  A.mcGo=()=>{const q=$('#mcode').value.trim().toLowerCase();const f=S.products.flatMap(p=>p.variants.map(v=>({p,v}))).find(x=>q&&(x.v.sku.toLowerCase()===q||x.v.barcode===q||x.v.sku.toLowerCase().includes(q)));
    if(!f){$('#mcerr').innerHTML=`<div class="err-text">${ic('alert')}کالایی با این کد پیدا نشد</div>`;$('#mcode').animate([{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'none'}],{duration:300});return;}
    sh.close();const top=UI.stack[UI.stack.length-1];scanFound(top.el,f);};};

/* ===== AI ASSISTANT ===== */
A.ai=()=>{if(!UI.chat)UI.chat=[{who:'ai',html:`سلام ${esc(S.user.name.split(' ')[0])}! من دستیار الان هستم. می‌توانم قیمت‌ها را یک‌جا عوض کنم، موجودی کم را نشان بدهم یا فروش را خلاصه کنم.`}];push(AIScreen,{});};
const AISUG=['قیمت هودی‌ها را ۱۰٪ بالا ببر','چه چیزهایی رو به اتمام است؟','فروش این هفته چطور بود؟'];
function AIScreen(){return `${navBar('دستیار هوشمند')}<div class="scroll no-tab" id="chat"><div class="chatlist">${UI.chat.map(m=>`<div class="bubble ${m.who}">${m.html}</div>`).join('')}</div></div>
  <div class="composer-wrap"><div class="chips" style="padding:0 12px 8px">${AISUG.map((s,i)=>`<button class="chip" data-act="aiSug|${i}">${s}</button>`).join('')}</div><div class="composer" style="position:static"><input id="aiin" placeholder="بنویسید چه کاری انجام شود…" data-enter="aiSend" enterkeyhint="send"><button data-act="aiSend" aria-label="ارسال">${ic('send')}</button></div></div>`;}
AIScreen.after=el=>{const c=$('#chat',el);c.scrollTop=c.scrollHeight;};
A.aiSug=i=>aiAsk(AISUG[+i]);
A.aiSend=()=>{const v=$('#aiin').value.trim();if(v)aiAsk(v);};
function aiPush(m){UI.chat.push(m);const top=UI.stack[UI.stack.length-1];if(top&&top.fn===AIScreen){const cl=$('.chatlist',top.el);cl.insertAdjacentHTML('beforeend',`<div class="bubble ${m.who}">${m.html}</div>`);const sc=$('#chat',top.el);sc.scrollTo({top:sc.scrollHeight,behavior:'smooth'});}}
function aiAsk(q){aiPush({who:'me',html:esc(q)});const inp=$('#aiin');if(inp)inp.value='';
  const top=UI.stack[UI.stack.length-1];const cl=$('.chatlist',top.el);cl.insertAdjacentHTML('beforeend','<div class="bubble ai typing" id="typ"><span></span><span></span><span></span></div>');$('#chat',top.el).scrollTop=1e6;
  setTimeout(()=>{const t=$('#typ');t&&t.remove();aiPush({who:'ai',html:aiReply(q)});},900+Math.random()*500);}
function aiReply(q){const nq=q.replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  if(/قیمت/.test(q)){const m=nq.match(/(\d+)\s*(٪|%|درصد)/);const pct=m?+m[1]:10;const down=/کم|پایین|تخفیف/.test(q);
    const cat=S.cats.find(c=>q.includes(c.name.replace(/ی$/,''))||q.includes(c.name));const ps=cat?S.products.filter(p=>p.cat===cat.id):S.products;
    if(!ps.length)return 'محصولی برای این تغییر پیدا نکردم.';
    const id=uid();UI['ai_'+id]=ps.map(p=>({pid:p.id,to:Math.round(p.price*(1+(down?-pct:pct)/100)/1000)*1000}));
    return `${fa(ps.length)} محصول${cat?' در دسته «'+esc(cat.name)+'»':''} را ${fa(pct)}٪ ${down?'ارزان‌تر':'گران‌تر'} کنم؟<div class="aicard">${UI['ai_'+id].map(x=>{const p=P_(x.pid);return `<div class="kv small"><span class="k">${esc(p.name)}</span><span class="num">${money(p.price)} ← <b>${money(x.to)}</b></span></div>`;}).join('')}<div class="row" style="gap:8px;margin-top:8px"><button class="btn primary sm" data-act="aiApply|${id}">اعمال</button><button class="btn gray sm" data-act="aiNo">نه</button></div></div>`;}
  if(/اتمام|موجودی|کم|تمام/.test(q)){const l=lowStock();if(!l.length)return 'همه موجودی‌ها کافی است.';return `${fa(l.length)} مورد رو به اتمام است:<div class="aicard">${l.slice(0,6).map(({p,v})=>`<div class="kv small"><span class="k">${esc(p.name)} · ${esc(vLabel(v))}</span><b class="num" style="color:${v.stock?'var(--orange)':'var(--red)'}">${v.stock?fa(v.stock)+' عدد':'تمام'}</b></div>`).join('')}<button class="btn gray sm" style="margin-top:8px" data-act="stock">به‌روزرسانی موجودی</button></div>`;}
  if(/فروش|گزارش|هفته|درآمد/.test(q)){const now=Date.now();const a=sumRange(now-7*DAY,now+1),b=sumRange(now-14*DAY,now-7*DAY);const p=pctCh(a.rev,b.rev);
    const best=Object.entries(S.sales.filter(s=>s.status==='done'&&s.t>now-7*DAY).flatMap(s=>s.items).reduce((m,i)=>(m[i.pid]=(m[i.pid]||0)+i.qty,m),{})).sort((x,y)=>y[1]-x[1])[0];
    return `این هفته <b>${toman(a.rev)}</b> از ${fa(a.n)} سفارش فروختید؛ ${fa(Math.abs(p))}٪ ${p>=0?'بیشتر':'کمتر'} از هفته قبل.${best?` پرفروش‌ترین: <b>${esc(P_(best[0]).name)}</b> با ${fa(best[1])} عدد.`:''}<div style="margin-top:8px"><button class="btn gray sm" data-act="tab|reports">دیدن گزارش</button></div>`;}
  return 'متوجه نشدم. مثلاً بنویسید: «قیمت هودی‌ها را ۱۰٪ بالا ببر» یا «چه چیزهایی رو به اتمام است؟»';}
A.aiApply=(id,t)=>{const ch=UI['ai_'+id];if(!ch)return;ch.forEach(x=>{const p=P_(x.pid);if(p)p.price=x.to;});delete UI['ai_'+id];save();t.closest('.aicard').querySelectorAll('button').forEach(b=>b.remove());
  aiPush({who:'ai',html:`انجام شد ✓ قیمت ${fa(ch.length)} محصول عوض شد. حالا آن را به کانال‌ها بفرستید.<div style="margin-top:8px"><button class="btn primary sm" data-act="send">ارسال به کانال‌ها</button></div>`});toast('قیمت‌ها عوض شد',`${fa(ch.length)} محصول`);};
A.aiNo=t=>{t.closest('.aicard').querySelectorAll('button').forEach(b=>b.remove());aiPush({who:'ai',html:'باشد، تغییری ندادم.'});};

/* ===== NOTIFICATIONS ===== */
A.notifs=()=>push(NotifScreen,{});
function NotifScreen(){const n=S.notifs;const icn={err:'alert',warn:'box',ok:'checkc',info:'crown'};
  return `${navBar('اعلان‌ها',n.some(x=>!x.read)?{right:'خواندن همه',rightAct:'nread',left:ic('chevR'),leftAct:'back'}:{})}<div class="scroll no-tab">${n.length?`<div class="list stagger">${n.map(x=>`<button class="li" data-act="nopen|${x.id}" style="align-items:flex-start"><span class="tile ntile ${x.type}">${ic(icn[x.type]||'bell')}</span><div class="grow"><div class="t1" style="${x.read?'':'font-weight:700'}">${x.title}</div><div class="t2" style="line-height:1.7">${x.body}</div><div class="t2">${ago(x.t)}</div></div>${x.read?'':'<i class="udot"></i>'}</button>`).join('')}</div><div class="pad" style="text-align:center;margin-top:16px"><button class="textbtn" style="color:var(--text2)" data-act="nclear">پاک کردن همه</button></div>`:emptyV('bell','اعلانی ندارید','خبرهای مهم مثل تمام شدن موجودی یا خطای ارسال اینجا می‌آید.')}</div>`;}
A.nread=()=>{S.notifs.forEach(n=>n.read=true);save();refresh();};
A.nclear=()=>{S.notifs=[];save();refresh();};
A.nopen=id=>{const n=S.notifs.find(x=>x.id===id);n.read=true;save();if(!n.act){refresh();return;}const [a,arg]=n.act.split('|');
  if(a==='tab'){switchTab(arg);return;}pop();setTimeout(()=>{if(a==='product')A.product(arg);else if(a==='channel')A.channel(arg);else if(a==='plans')A.plans();},380);};
