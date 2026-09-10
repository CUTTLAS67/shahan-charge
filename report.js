(()=>{
'use strict';
const months=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const money=n=>fa(Number(n||0).toLocaleString('en-US'));
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

function findEntries(){
  const keys=[];
  for(let i=0;i<localStorage.length;i++) keys.push(localStorage.key(i));
  for(const key of keys){
    try{
      const value=JSON.parse(localStorage.getItem(key));
      if(Array.isArray(value)&&value.some(x=>x&&typeof x==='object'&&('amount' in x)&&('unit' in x)&&('type' in x)&&('year' in x))) return value;
    }catch{}
  }
  return [];
}
function selectedPeriod(){
  const y=Number($('uYear')?.value)||Number(new Intl.DateTimeFormat('en-US-u-ca-persian',{year:'numeric'}).format(new Date()));
  const m=Number($('uMonth')?.value)||1;
  return {y,m};
}
function reportData(){
  const {y,m}=selectedPeriod();
  const all=findEntries();
  const list=all.filter(e=>Number(e.year)===y&&Number(e.month)===m).sort((a,b)=>(Number(a.day)-Number(b.day))||(Number(a.id)-Number(b.id)));
  const dep=list.filter(e=>e.type==='deposit');
  const wit=list.filter(e=>e.type==='withdraw');
  const sumDep=dep.reduce((s,e)=>s+Number(e.amount||0),0);
  const sumWit=wit.reduce((s,e)=>s+Number(e.amount||0),0);
  const paying=[...new Set(dep.map(e=>Number(e.unit)).filter(Boolean))].sort((a,b)=>a-b);
  const unpaid=Array.from({length:9},(_,i)=>i+1).filter(u=>!paying.includes(u));
  return {y,m,list,sumDep,sumWit,balance:sumDep-sumWit,paying,unpaid};
}

function reportHTML(full){
  const d=reportData();
  const rows=full?d.list.map((e,i)=>`<tr><td>${fa(i+1)}</td><td>واحد ${fa(e.unit)}</td><td class="${e.type==='deposit'?'in':'out'}">${e.type==='deposit'?'واریز':'برداشت'}</td><td>${money(e.amount)} تومان</td><td>${fa(e.year)}/${fa(e.month)}/${fa(e.day)}</td><td>${esc(e.desc||'—')}</td><td>${e.receipt?'دارد':'—'}</td></tr>`).join(''):`<tr><td colspan="7" class="empty">تعداد تراکنش‌های این ماه: ${fa(d.list.length)} &nbsp; | &nbsp; واحدهای پرداخت‌کننده: ${fa(d.paying.length)} &nbsp; | &nbsp; واحدهای پرداخت‌نشده: ${fa(d.unpaid.length)}</td></tr>`;
  const unpaidText=d.unpaid.length?d.unpaid.map(u=>`واحد ${fa(u)}`).join(' ، '):'همه واحدها پرداخت کرده‌اند';
  return `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;background:#eef2f7;color:#172033;font-family:'IRANSansX','IRANSans','IranSans','Yekan','Yekan Bakh',Tahoma,Arial,sans-serif}.sheet{width:1400px;min-height:${full?Math.max(1120,760+d.list.length*64):920}px;margin:0 auto;background:#fff}.head{height:190px;padding:38px 58px;background:linear-gradient(135deg,#111827,#312e81 58%,#4f46e5);color:#fff}.brand{font-size:42px;font-weight:900}.sub{margin-top:10px;font-size:23px;font-weight:800}.kind{margin-top:7px;font-size:16px;opacity:.8}.body{padding:34px 58px}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.card{border:1px solid #e5e7eb;border-radius:20px;padding:22px;text-align:center;background:#fff;box-shadow:0 8px 25px rgba(15,23,42,.06)}.label{font-size:16px;color:#64748b;font-weight:800}.value{font-size:27px;font-weight:900;margin-top:10px}.green{color:#059669}.red{color:#dc2626}.purple{color:#4338ca}.section{margin-top:28px;border:1px solid #e5e7eb;border-radius:20px;overflow:hidden}.section-title{padding:18px 22px;background:#f8fafc;font-size:20px;font-weight:900}.unpaid{padding:18px 22px;font-size:18px;color:#dc2626;font-weight:800}.table{width:100%;border-collapse:collapse}.table th,.table td{padding:14px 12px;border-bottom:1px solid #edf0f4;text-align:center;font-size:15px}.table th{background:#f1f5f9;color:#475569;font-weight:900}.table tr:last-child td{border-bottom:0}.in{color:#059669;font-weight:900}.out{color:#dc2626;font-weight:900}.empty{padding:28px!important;color:#64748b;font-weight:800}.footer{padding:22px 58px 32px;text-align:center;color:#94a3b8;font-size:13px;border-top:1px solid #edf0f4}.badge{display:inline-block;padding:7px 13px;border-radius:999px;background:#fef2f2;color:#dc2626;margin:4px;font-size:14px}@media print{body{background:#fff}.sheet{margin:0}}
</style></head><body><div class="sheet"><div class="head"><div class="brand">شارژ ساختمان شاهان</div><div class="sub">گزارش ${full?'کامل مالی':'خلاصه مالی'} — ${months[d.m-1]||''} ${fa(d.y)}</div><div class="kind">سامانه مدیریت هوشمند شارژ ساختمان</div></div><div class="body"><div class="cards"><div class="card"><div class="label">مجموع واریز</div><div class="value green">${money(d.sumDep)} تومان</div></div><div class="card"><div class="label">مجموع برداشت</div><div class="value red">${money(d.sumWit)} تومان</div></div><div class="card"><div class="label">مانده ماه</div><div class="value ${d.balance>=0?'purple':'red'}">${money(d.balance)} تومان</div></div><div class="card"><div class="label">واحدهای پرداخت‌کننده</div><div class="value">${fa(d.paying.length)} از ۹</div></div></div><div class="section"><div class="section-title">وضعیت پرداخت شارژ</div><div class="unpaid">${d.unpaid.length?'واحدهای پرداخت‌نشده: ':''}${unpaidText}</div></div><div class="section"><div class="section-title">${full?'جزئیات تراکنش‌ها':'خلاصه فعالیت ماه'}</div><table class="table"><thead><tr><th>ردیف</th><th>واحد</th><th>نوع</th><th>مبلغ</th><th>تاریخ</th><th>توضیحات</th><th>رسید</th></tr></thead><tbody>${rows}</tbody></table></div></div><div class="footer">این گزارش به‌صورت آفلاین و مستقیماً از اطلاعات ذخیره‌شده روی دستگاه تهیه شده است.</div></div></body></html>`;
}

function downloadSVG(full){
  try{
    const html=reportHTML(full);
    const {m,y}=selectedPeriod();
    const height=full?Math.max(1120,760+reportData().list.length*64):920;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="1400" height="${height}" viewBox="0 0 1400 ${height}"><foreignObject x="0" y="0" width="1400" height="${height}">${html.replace(/<\!doctype html>|<html[^>]*>|<\/html>|<head>[\s\S]*?<\/head>|<body[^>]*>|<\/body>/gi,'')}</foreignObject></svg>`;
    const blob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=`گزارش-شارژ-شاهان-${months[m-1]}-${y}-${full?'کامل':'خلاصه'}.svg`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);a.remove()},1500);
  }catch(e){console.error(e);alert('ساخت گزارش انجام نشد. لطفاً صفحه را یک‌بار تازه‌سازی کنید.');}
}

function bind(){
  const s=$('reportSummaryBtn'),f=$('reportFullBtn');
  if(s){s.onclick=()=>downloadSVG(false)}
  if(f){f.onclick=()=>downloadSVG(true)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
