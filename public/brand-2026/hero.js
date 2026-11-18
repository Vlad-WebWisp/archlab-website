const scene=document.querySelector('#scene'),paper=document.querySelector('#paper'),mask=document.querySelector('#renderMask'),cover=document.querySelector('#drawingCover'),lines=document.querySelector('.pencil-lines'),rule=document.querySelector('#revealRule'),scrub=document.querySelector('#scrub');
const duration=14000,reduce=matchMedia('(prefers-reduced-motion: reduce)');let position=reduce.matches?duration:0;
const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
function draw(){const t=position/1000,drawing=smooth(t/3.8),reveal=smooth((t-4)/5.5),settle=smooth((t-9)/5),mobile=innerWidth<701;paper.style.transform=reduce.matches?'none':`translateY(${(1-settle)*-8}px) rotateX(${(1-settle)*(mobile?5:12)}deg) rotateY(${(1-settle)*-10}deg) rotateZ(${-5+settle*5}deg) scale(${1.04-settle*.04})`;cover.style.opacity=1-smooth((t-3.35)/.65);lines.style.opacity=1-smooth((t-3.45)/.55);document.querySelectorAll(".draw-stroke").forEach((stroke,i,all)=>{const unit=3.25/all.length;const start=i*unit;const progress=clamp((t-start)/(unit*.88));stroke.style.strokeDashoffset=1-progress;});mask.style.clipPath=`inset(0 ${100-reveal*100}% 0 0)`;rule.style.left=`${reveal*100}%`;rule.style.opacity=t>4&&t<9.5?.7:0;document.querySelector('#sheetState').textContent=t<4?'GRAPHITE ON PAPER':t<9.5?'EXPLORING LIGHT & MATERIAL':'A NEW PERSPECTIVE';document.querySelector('#sceneIndex').textContent=t<4?'01 — SKETCH':t<9.5?'02 — EXPLORE':'03 — PRESENT';document.querySelector('#time').textContent=`${Math.round(position/duration*100)}% · Scroll ↕`;scrub.value=position;scrub.style.setProperty('--progress',`${position/duration*100}%`);document.querySelectorAll('[data-time]').forEach((b,i)=>{const active=i===(t<4?0:t<9.5?1:2);b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});if(!reduce.matches){document.querySelector('.ghost-one').style.transform=`rotate(-8deg) translateY(${Math.sin(t*.55)*4}px)`;document.querySelector('.ghost-two').style.transform=`rotate(7deg) translateY(${Math.sin(t*.55+2)*4}px)`}}
const scrollRegion=document.querySelector('#heroScroll'),sticky=document.querySelector('#heroSticky');
let start=0,distance=1,pending=false;
function syncScroll(){pending=false;if(reduce.matches)return;position=clamp((scrollY-start)/distance)*duration;draw();}
function measure(){
 const height=sticky.offsetHeight;
 const top=Math.min(0,innerHeight-height);
 distance=Math.max(900,innerHeight*1.65);
 scrollRegion.style.height=reduce.matches?'auto':`${height+distance}px`;
 sticky.style.top=reduce.matches?'auto':`${top}px`;
 start=scrollRegion.getBoundingClientRect().top+scrollY-top;
 if(reduce.matches){position=duration;draw();}else syncScroll();
}
function seek(value){
 if(reduce.matches){position=value;draw();return;}
 scrollTo({top:start+value/duration*distance,behavior:'instant'});
 syncScroll();
}
addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(syncScroll);}},{passive:true});
scrub.addEventListener('input',()=>seek(+scrub.value));
document.querySelectorAll('[data-time]').forEach(b=>b.addEventListener('click',()=>seek(+b.dataset.time)));
document.querySelector('#replay').addEventListener('click',()=>seek(0));
document.querySelector('#replayIntro').addEventListener('click',()=>seek(0));
reduce.addEventListener('change',measure);
addEventListener('resize',measure);
new ResizeObserver(measure).observe(sticky);
document.fonts.ready.then(measure);
measure();
