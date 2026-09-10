(()=>{
'use strict';
const fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const money=n=>fa(Number(n||0).toLocaleString('en-US'));
const months=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const get=id=>document.getElementById(id);
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function selectedPeriod(){const y=Number(get('uYear')?.value)||new Intl.DateTimeFormat('en-US-u-ca-persian',{year:'numeric'}).format(new Date());const m=Number(get('uMonth')?.value)||1;return{y,m}}
function load(){try{const x=JSON.parse(localStorage.getItem('shahan-charge-entries')||'[]');return Array.isArray(x)?x:[]}catch{return[]}}
function addButtons(){
 const stats=document.querySelector('.stats'); if(!stats||document.getElementById('reportButtons'))return;
 const box=document.createElement('div');box.id='reportButtons';box.className='report-buttons';
 box.innerHTML='<button type="button" id="reportSummary">📸 دانلود گزارش خلاصه</button><button type="button" id="reportFull">📋 دانلود گزارش کامل</button>';
 stats.parentNode.insertBefore(box,stats.nextSibling);
 const style=document.createElement('style');style.textContent='.report-buttons{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px}.report-buttons button{border:1px solid #c7d2fe;background:linear-gradient(135deg,#eef2ff,#f5f3ff);color:#4338ca;border-radius:12px;padding:11px 8px;font-family:inherit;font-size:10px;font-weight:900;cursor:pointer}.report-buttons button:active{transform:scale(.99)}@media(max-width:650px){.report-buttons{grid-template-columns:1fr}}';document.head.appendChild(style);
 get('reportSummary').onclick=()=>makeReport(false);get('reportFull').onclick=()=>makeReport(true);
}
function makeReport(full){
 try{
  const {y,m}=selectedPeriod(), all=load();
  const list=all.filter(e=>Number(e.year)===y&&Number(e.month)===m).sort((a,b)=>(Number(a.day)-Number(b.day))||(Number(a.id)-Number(b.id)));
  const dep=list.filter(e=>e.type==='deposit'), wit=list.filter(e=>e.type==='withdraw');
  const sumDep=dep.reduce((s,e)=>s+Number(e.amount||0),0),sumWit=wit.reduce((s,e)=>s+Number(e.amount||0),0),bal=sumDep-sumWit;
  const units=[...new Set(dep.map(e=>Number(e.unit)))].filter(Boolean).sort((a,b)=>a-b), unpaid=Array.from({length:9},(_,i)=>i+1).filter(u=>!units.includes(u));
  const W=1400,H=full?Math.max(1100,650+list.length*62):850;
  const c=document.createElement('canvas');c.width=W*2;c.height=H*2;const ctx=c.getContext('2d');ctx.scale(2,2);ctx.direction='rtl';ctx.textAlign='right';
  ctx.fillStyle='#f8fafc';ctx.fillRect(0,0,W,H);
  const grad=ctx.createLinearGradient(0,0,W,0);grad.addColorStop(0,'#111827');grad.addColorStop(1,'#4338ca');ctx.fillStyle=grad;ctx.fillRect(0,0,W,155);
  ctx.fillStyle='#fff';ctx.font='900 42px IRANSansX, IRANSans, Yekan, Tahoma, sans-serif';ctx.fillText('شارژ ساختمان شاهان',W-65,65);ctx.font='700 23px IRANSansX, IRANSans, Yekan, Tahoma, sans-serif';ctx.fillText(`گزارش ${months[m-1]||''} ${fa(y)}`,W-65,108);ctx.font='500 18px IRANSansX, IRANSans, Yekan, Tahoma, sans-serif';ctx.fillText(full?'گزارش کامل مالی':'گزارش خلاصه مالی',W-65,137);
  const cards=[['مجموع واریز',money(sumDep),'#059669'],['مجموع برداشت',money(sumWit),'#dc2626'],['مانده ماه',money(bal),bal>=0?'#4338ca':'#dc2626'],['واحدهای پرداخت‌کننده',fa(units.length),'#334155']];
  cards.forEach((x,i)=>{const gap=18,cw=(W-130-gap*3)/4,xx=65+i*(cw+gap);ctx.fillStyle='#fff';roundRect(ctx,xx,185,cw,115,18);ctx.fill();ctx.strokeStyle='#e2e8f0';ctx.stroke();ctx.fillStyle='#64748b';ctx.font='700 18px IRANSansX, IRANSans, Yekan, Tahoma, sans-serif';ctx.textAlign='center';ctx.fillText(x[0],xx+cw/2,222);ctx.fillStyle=x[2];ctx.font='900 28px IRANSansX, IRANSans, Yekan, Tahoma, sans-serif';ctx.fillText(x[1]+' تومان',xx+cw/2,267)});
  ctx.textAlign='right';let yy=350;
  ctx.fillStyle='#172033';ctx.font='900 25px IRANSansX, IRANSans, Yekan, Tahoma, sans-serif';ctx.fillText(`واحدهای پرداخت‌نشده: ${fa(unpaid.length)}`,W-65,yy);yy+=30;
  ctx.fillStyle='#fff';roundRect(ctx,65,yy,W-130,full?list.length*62+65:105,18);ctx.fill();ctx.strokeStyle='#e2e8f0';ctx.stroke();
  ctx.fillStyle='#f1f5f9';ctx.fillRect(66,yy+1,W-132,52);ctx.fillStyle='#475569';ctx.font='800 17px IRANSansX, IRANSans, Yekan, Tahoma, sans-serif';ctx.textAlign='right';ctx.fillText('واحد',W-100,yy+34);ctx.fillText('مبلغ',W-390,yy+34);ctx.fillText('نوع',W-690,yy+34);ctx.fillText('تاریخ',W-930,yy+34);ctx.fillText('توضیحات',W-1130,yy+34);
  if(full){list.forEach((e,i)=>{const yrow=yy+52+i*62;ctx.strokeStyle='#eef2f7';ctx.beginPath();ctx.moveTo(80,yrow+61);ctx.lineTo(W-80,yrow+61);ctx.stroke();ctx.fillStyle='#334155';ctx.font='700 17px IRANSansX, IRANSans, Yekan, Tahoma, sans-serif';ctx.fillText('واحد '+fa(e.unit),W-100,yrow+38);ctx.fillText(money(e.amount)+' تومان',W-390,yrow+38);ctx.fillStyle=e.type==='deposit'?'#059669':'#dc2626';ctx.fillText(e.type==='deposit'?'واریز':'برداشت',W-690,yrow+38);ctx.fillStyle='#475569';ctx.fillText(`${fa(e.year)}/${fa(e.month)}/${fa(e.day)}`,W-930,yrow+38);ctx.fillText(String(e.desc||'—').slice(0,28),W-1130,yrow+38)});}
  else{ctx.fillStyle='#334155';ctx.font='700 20px IRANSansX, IRANSans, Yekan, Tahoma, sans-serif';ctx.textAlign='center';ctx.fillText(`تعداد تراکنش‌های ماه: ${fa(list.length)}`,W/2,yy+88);ctx.fillText(`تعداد واحدهای بدهکار: ${fa(unpaid.length)}`,W/2,yy+122)}
  const footerY=full?yy+52+list.length*62+55:yy+145;ctx.textAlign='center';ctx.fillStyle='#94a3b8';ctx.font='500 15px IRANSansX, IRANSans, Yekan, Tahoma, sans-serif';ctx.fillText('گزارش تهیه‌شده توسط سامانه مدیریت مالی شارژ ساختمان شاهان — آفلاین',W/2,footerY);
  c.toBlob(blob=>{if(!blob)throw new Error('blob');const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`گزارش-شارژ-شاهان-${months[m-1]}-${y}-${full?'کامل':'خلاصه'}.png`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)},'image/png');
 }catch(e){console.error(e);alert('ساخت گزارش انجام نشد. لطفاً صفحه را یک‌بار تازه‌سازی کنید.');}
}
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function init(){addButtons();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
