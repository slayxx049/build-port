/* Designed by transition -> original OLGA loading screen. */
(()=>{
 const screen=document.getElementById('bootScreen');
 if(!screen)return;
 const progress=document.getElementById('bootProgress');
 const percent=document.getElementById('bootPercent');
 const status=document.getElementById('bootStatus');
 const track=screen.querySelector('[role="progressbar"]');
 const letters=[...screen.querySelectorAll('.designed-by-letters span')];
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 letters.forEach((letter,index)=>letter.style.setProperty('--letter-index',index));
 let finished=false;
 const finish=()=>{
  if(finished)return;
  finished=true;
  if(progress)progress.style.width='100%';
  if(percent)percent.textContent='100%';
  if(status)status.textContent='SYSTEM READY';
  if(track)track.setAttribute('aria-valuenow','100');
  screen.classList.add('show-loading');
  setTimeout(()=>{
   screen.classList.add('boot-done');
   document.body.classList.remove('boot-active');
   setTimeout(()=>{if(screen.isConnected)screen.remove()},reduced?100:850);
  },reduced?100:450);
 };
 const revealDuration=reduced?250:2100;
 setTimeout(()=>{
  if(!screen.isConnected)return;
  screen.classList.add('show-loading');
  const started=performance.now();
  let value=0;
  const maxWait=6500;
  function tick(now){
   if(finished||!screen.isConnected)return;
   const elapsed=now-started;
   const target=Math.min(100,12+elapsed/45);
   value+=(target-value)*0.12;
   if(elapsed>1800)value=Math.max(value,96);
   const shown=Math.min(99,Math.floor(value));
   if(progress)progress.style.width=shown+'%';
   if(percent)percent.textContent=String(shown).padStart(2,'0')+'%';
   if(status)status.textContent=shown<28?'INITIALIZING PORTFOLIO':shown<58?'LOADING RESOURCES':shown<90?'PREPARING EXPERIENCE':'READY TO EXPLORE';
   if(track)track.setAttribute('aria-valuenow',String(shown));
   if(elapsed>=maxWait){finish();return}
   if(elapsed>=2600&&document.readyState==='complete'){
    finish();return;
   }
   requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
 },revealDuration);
})();
 

const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer=matchMedia('(pointer:fine)').matches;
// Reversible reveal: elements animate in and out as the visitor scrolls in either direction.
const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('visible',e.isIntersecting)),{threshold:.13});
document.querySelectorAll('.reveal,.keyboard-build').forEach(el=>observer.observe(el));
// Timeline checkpoints activate one by one as each milestone enters the reading zone.
const eventObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('visible',entry.isIntersecting)),{threshold:.28,rootMargin:'-8% 0px -38% 0px'});
document.querySelectorAll('.timeline .event').forEach(el=>eventObserver.observe(el));
// Single-piece jelly cursor: one deforming blob, never layered circles or bubbles.
const blob=document.querySelector('.cursor-blob');
if(blob&&finePointer&&!reduceMotion){
 document.body.classList.add('custom-cursor');
 let tx=innerWidth/2,ty=innerHeight/2,x=tx,y=ty,vx=0,vy=0,active=false;
 function moveJelly(e){tx=e.clientX;ty=e.clientY;if(!active){x=tx;y=ty;active=true}document.body.classList.add('custom-cursor');blob.classList.add('active')}
 addEventListener('pointermove',moveJelly);
 addEventListener('pointerenter',e=>{document.body.classList.add('custom-cursor');moveJelly(e)});
 addEventListener('pointerleave',()=>{blob.classList.remove('active','hover','press');document.body.classList.remove('custom-cursor');active=false});
 addEventListener('focus',()=>{document.body.classList.remove('custom-cursor');blob.classList.remove('active');active=false});
 addEventListener('pointerdown',()=>blob.classList.add('press'));
 addEventListener('pointerup',()=>blob.classList.remove('press'));
 addEventListener('blur',()=>{blob.classList.remove('active','hover','press');document.body.classList.remove('custom-cursor');active=false});
 document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('pointerenter',()=>blob.classList.add('hover'));el.addEventListener('pointerleave',()=>blob.classList.remove('hover'))});
 function cursorLoop(){
  const dx=tx-x,dy=ty-y;
  vx=(vx+dx*.16)*.72;vy=(vy+dy*.16)*.72;
  x+=vx;y+=vy;
  const speed=Math.hypot(vx,vy),stretch=Math.min(speed*.024,.42),angle=Math.atan2(vy,vx)*180/Math.PI;
  const wobble=Math.sin(performance.now()*.018+speed*.35)*Math.min(speed*.0012,.055);
  blob.style.left=x+'px';blob.style.top=y+'px';
  blob.style.borderRadius=(50+stretch*11)+'% '+(50-stretch*13)+'% '+(47+stretch*13)+'% '+(53-stretch*11)+'% / '+(49-stretch*9)+'% '+(51+stretch*10)+'% '+(54-stretch*10)+'% '+(46+stretch*9)+'%';
  blob.style.transform='translate(-50%,-50%) rotate('+angle+'deg) scale('+(1+stretch*.24+wobble)+','+(1-stretch*.17-wobble*.3)+')';
  requestAnimationFrame(cursorLoop);
 }
 cursorLoop();
}else if(blob){blob.remove()}
// Interactive 3D keyboard. Details appear only after a key is clicked.
const keys=[...document.querySelectorAll('.key')],info=document.getElementById('skillInfo'),skillName=document.getElementById('skillName'),skillDetail=document.getElementById('skillDetail');
let selectedKey=null;
function showKey(key){skillName.textContent=key.dataset.skill;skillDetail.textContent=key.dataset.detail;info.hidden=false}
function hideKeyInfo(){info.hidden=true;skillName.textContent='';skillDetail.textContent=''}
function updateSelected(){keys.forEach(k=>k.classList.toggle('active',k===selectedKey))}
keys.forEach(key=>key.addEventListener('click',()=>{
 selectedKey=selectedKey===key?null:key;
 updateSelected();
 if(selectedKey)showKey(selectedKey);else hideKeyInfo();
}));
// Rotating digital globe.
const wc=document.getElementById('worldCanvas'),wctx=wc.getContext('2d');let ws;
function size(c){const d=Math.min(devicePixelRatio||1,2),r=c.getBoundingClientRect();c.width=Math.max(1,r.width*d);c.height=Math.max(1,r.height*d);return{w:c.width,h:c.height,d}}
function resizeWorld(){ws=size(wc)}resizeWorld();let angle=0;
function globe(){const{w,h,d}=ws;wctx.clearRect(0,0,w,h);wctx.save();wctx.translate(w/2,h*.48);const R=Math.min(w,h)*.36;angle+=reduceMotion?0:.0025;const pt=(lat,lon)=>{lon+=angle;const cl=Math.cos(lat);return{x:R*cl*Math.sin(lon),y:R*Math.sin(lat),z:R*cl*Math.cos(lon)}};wctx.strokeStyle='rgba(116,223,255,.2)';wctx.lineWidth=d;for(let lat=-1.2;lat<=1.21;lat+=.3){wctx.beginPath();let on=false;for(let lon=0;lon<=Math.PI*2+.04;lon+=.06){const p=pt(lat,lon);if(p.z>0){if(!on){wctx.moveTo(p.x,p.y);on=true}else wctx.lineTo(p.x,p.y)}else on=false}wctx.stroke()}for(let lon=0;lon<Math.PI*2;lon+=Math.PI/8){wctx.beginPath();let on=false;for(let lat=-Math.PI/2;lat<=Math.PI/2+.03;lat+=.04){const p=pt(lat,lon);if(p.z>0){if(!on){wctx.moveTo(p.x,p.y);on=true}else wctx.lineTo(p.x,p.y)}else on=false}wctx.stroke()}for(let i=0;i<190;i++){const lat=Math.asin(-1+2*(i+.5)/190),lon=Math.PI*(1+Math.sqrt(5))*i,p=pt(lat,lon);if(p.z>0){wctx.fillStyle=i%9===0?'rgba(202,255,104,.95)':'rgba(116,223,255,.8)';wctx.beginPath();wctx.arc(p.x,p.y,(i%9===0?2:1)*d,0,Math.PI*2);wctx.fill()}}wctx.restore();if(!reduceMotion)requestAnimationFrame(globe)}globe();addEventListener('resize',resizeWorld);
// Cosmic star field now belongs to the build-history section.
const hc=document.getElementById('historyCanvas'),hctx=hc.getContext('2d');let hs=size(hc),ht=0;
function resizeHistory(){hs=size(hc)}resizeHistory();
const stars=Array.from({length:950},()=>({x:Math.random(),y:Math.random(),z:.15+Math.random()*.85,s:.3+Math.random()*1.15,p:Math.random()*6.28}));
let pointer={x:.5,y:.5};hc.addEventListener('pointermove',e=>{const r=hc.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width;pointer.y=(e.clientY-r.top)/r.height});
function historyCosmos(){const{w,h,d}=hs;hctx.clearRect(0,0,w,h);ht+=reduceMotion?0:.002;for(const s of stars){const drift=Math.sin(ht+s.p)*.008,px=(s.x+drift+(pointer.x-.5)*.012*s.z+1)%1,py=(s.y+Math.cos(ht*.7+s.p)*.006+(pointer.y-.5)*.012*s.z+1)%1;hctx.fillStyle=s.z>.88?'rgba(202,255,104,'+(.22+s.z*.5)+')':'rgba(128,165,220,'+(.12+s.z*.48)+')';hctx.beginPath();hctx.arc(px*w,py*h,s.s*d,0,Math.PI*2);hctx.fill()}if(!reduceMotion)requestAnimationFrame(historyCosmos)}historyCosmos();addEventListener('resize',resizeHistory);
// The travelling ray moves down the connector as the visitor scrolls through every project.
const historySection=document.getElementById('history');
const timeline=historySection?.querySelector('.timeline');
if(timeline){
 const timelineRay=document.createElement('div');
 timelineRay.className='timeline-ray';
 timelineRay.setAttribute('aria-hidden','true');
 timeline.prepend(timelineRay);
 let progressFrame=false;
 function updateTimelineRay(){
  progressFrame=false;
  const rect=timeline.getBoundingClientRect();
  const vh=window.innerHeight;
  const start=vh*.78;
  const end=-rect.height+vh*.22;
  const progress=Math.max(0,Math.min(1,(start-rect.top)/(start-end)));
  const travel=Math.max(0,timeline.scrollHeight-timelineRay.offsetHeight);
  timelineRay.style.transform='translateY('+Math.round(progress*travel)+'px)';
 }
 function requestTimelineRayUpdate(){
  if(!progressFrame){progressFrame=true;requestAnimationFrame(updateTimelineRay)}
 }
 window.addEventListener('scroll',requestTimelineRayUpdate,{passive:true});
 window.addEventListener('resize',requestTimelineRayUpdate);
 updateTimelineRay();
}

/* Move a subtle, low-intensity neon pool with the pointer inside project cards. */
document.querySelectorAll('.projects .card').forEach(card=>{
 card.addEventListener('pointermove',event=>{
  const rect=card.getBoundingClientRect();
  card.style.setProperty('--glow-x',((event.clientX-rect.left)/rect.width*100)+'%');
  card.style.setProperty('--glow-y',((event.clientY-rect.top)/rect.height*100)+'%');
 });
 card.addEventListener('pointerleave',()=>{
  card.style.setProperty('--glow-x','50%');
  card.style.setProperty('--glow-y','50%');
 });
});


/* Dense interactive spiral starfield in the contact background, based on the supplied reference video. */
const contactCanvas=document.getElementById('contactStars');
if(contactCanvas){
 const cctx=contactCanvas.getContext('2d');let contactSize={w:0,h:0,d:1},rotation=0;
 const pointer={x:.56,y:.52,tx:.56,ty:.52,active:false};
 const galaxyStars=Array.from({length:5200},(_,i)=>{const arm=i%4,radius=Math.pow(Math.random(),.64),spread=(Math.random()-.5)*(.10+.17*radius);return {r:radius,a:arm*Math.PI*.5+radius*5.4+spread,depth:.25+Math.random()*.75,size:.22+Math.random()*.82,phase:Math.random()*Math.PI*2,drift:(Math.random()-.5)*.0008,halo:Math.random()>.988}});
 function sizeContactStars(){const r=contactCanvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);contactSize={w:r.width,h:r.height,d};contactCanvas.width=Math.max(1,Math.round(r.width*d));contactCanvas.height=Math.max(1,Math.round(r.height*d));cctx.setTransform(d,0,0,d,0,0)}
 sizeContactStars();
 const contactSection=document.getElementById('contact');
 contactSection.addEventListener('pointermove',e=>{const r=contactCanvas.getBoundingClientRect();pointer.tx=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));pointer.ty=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));pointer.active=true});
 contactSection.addEventListener('pointerleave',()=>{pointer.active=false;pointer.tx=.56;pointer.ty=.52});
 function drawContactStars(){const {w,h}=contactSize;cctx.clearRect(0,0,w,h);pointer.x+=(pointer.tx-pointer.x)*.075;pointer.y+=(pointer.ty-pointer.y)*.075;rotation+=reduceMotion?0:.00115;const cx=w*.57,cy=h*.52,scale=Math.min(w*.48,h*.72);
  const haze=cctx.createRadialGradient(cx,cy,scale*.04,cx,cy,scale*1.1);haze.addColorStop(0,'rgba(176,190,214,.075)');haze.addColorStop(.55,'rgba(120,143,180,.035)');haze.addColorStop(1,'rgba(8,10,16,0)');cctx.fillStyle=haze;cctx.fillRect(0,0,w,h);
  for(const s of galaxyStars){const a=s.a+rotation*(.45+s.depth*.8)+s.drift*rotation*500,rr=s.r*scale;let x=cx+Math.cos(a)*rr*1.55,y=cy+Math.sin(a)*rr*.55+(s.r-.5)*h*.09;
   if(pointer.active){const px=pointer.x*w,py=pointer.y*h,dx=x-px,dy=y-py,dist=Math.hypot(dx,dy)||1,reach=Math.max(0,1-dist/(scale*.42)),bend=reach*reach*(10+18*s.depth);x+=(-dy/dist)*bend;y+=(dx/dist)*bend}
   const twinkle=.48+.52*Math.sin(rotation*4+s.phase),alpha=(.18+s.depth*.58)*twinkle;cctx.fillStyle=s.depth>.82?'rgba(245,247,255,'+alpha+')':'rgba(190,204,229,'+(alpha*.78)+')';cctx.beginPath();cctx.arc(x,y,s.size*(.55+s.depth*.65),0,Math.PI*2);cctx.fill();
   if(s.halo){cctx.strokeStyle='rgba(224,233,255,'+(alpha*.55)+')';cctx.lineWidth=.55;cctx.beginPath();cctx.moveTo(x-3.5*s.depth,y);cctx.lineTo(x+3.5*s.depth,y);cctx.moveTo(x,y-3.5*s.depth);cctx.lineTo(x,y+3.5*s.depth);cctx.stroke()}
  }if(!reduceMotion)requestAnimationFrame(drawContactStars)}
 drawContactStars();addEventListener('resize',sizeContactStars);
}


/* Interactive featured-project tabs. No project numbering is displayed. */
(()=>{
 const tabs=[...document.querySelectorAll('.project-tab')];
 const title=document.getElementById('projectTitle');
 if(!tabs.length||!title)return;
 const projects=[
  {title:'AI Job Finder',status:'BUILT',statusClass:'built',type:'CAREER TOOLS · WEB APPLICATION',lead:'Find relevant opportunities and understand how your resume aligns with a role.',description:'A job-discovery web application with resume upload and ATS-related checking. Built with a Python application layer, API integrations, backend services, and database storage.',tags:['Python','APIs','Backend','Databases'],visual:'job'},
  {title:'Daily Mini Bytes',status:'BUILT',statusClass:'built',type:'NEWS · BLOG · TECHNOLOGY',lead:'A publishing space for news, ideas, and technology updates.',description:'A news, blog, and technology publishing platform with administrator, editor, and visitor roles, theme options, content publishing, and reader-engagement features.',tags:['HTML','Web Development','Backend','Databases'],visual:'dmb'},
  {title:'Mobile Bluetooth Bridge',status:'BUILT',statusClass:'built',type:'ANDROID · BLUETOOTH',lead:'Connect. Transfer. Bridge.',description:'An Android prototype exploring Bluetooth bridging and authenticated local communication, packaged using an Android Gradle build workflow.',tags:['Android','Bluetooth','Gradle'],visual:'bridge'},
  {title:'Oxford Tutor',status:'IN DEVELOPMENT',statusClass:'building',type:'LOCAL AI · EDUCATION',lead:'A local AI assistant for guided English practice.',description:'An offline English-learning assistant being developed around a locally run AI model, designed to support vocabulary, explanations, and guided language practice.',tags:['Ollama','Phi-3','Local AI'],visual:'oxford'},
  {title:'College Deadline Reminder',status:'IN DEVELOPMENT',statusClass:'building',type:'STUDENT PRODUCTIVITY',lead:'Keep academic dates and tasks in one organised place.',description:'A student-focused reminder platform for registrations, assignments, and academic deadlines, with calendar views, completion tracking, and notification workflows.',tags:['Web App','Calendar','Notifications'],visual:'deadlines'},
  {title:'SWASTHYASETU',status:'IN DEVELOPMENT',statusClass:'building',type:'HEALTHCARE · CONNECTIVITY',lead:'Bridging the gap between people and healthcare.',description:'A healthcare initiative focused on improving access and coordination for rural communities and older adults.',tags:['Healthcare Technology','Accessibility','Digital Services'],visual:'health'}
 ];
 const visual=document.getElementById('projectVisual'),status=document.getElementById('projectStatus'),type=document.getElementById('projectType'),lead=document.getElementById('projectLead'),description=document.getElementById('projectDescription'),tags=document.getElementById('projectTags'),progress=document.getElementById('projectProgress');
 function select(index){
  const p=projects[index];if(!p)return;
  tabs.forEach((tab,i)=>{const active=i===index;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});
  title.textContent=p.title;status.textContent=p.status;status.className='project-status '+p.statusClass;
  type.textContent=p.type;lead.textContent=p.lead;description.textContent=p.description;
  tags.replaceChildren(...p.tags.map(tag=>{const el=document.createElement('span');el.textContent=tag;return el}));
  visual.className='project-visual'+(p.visual==='dmb'?' brand-dmb':p.visual==='bridge'?' brand-bridge':p.visual==='oxford'?' brand-oxford':p.visual==='deadlines'?' brand-deadlines':p.visual==='health'?' brand-health':'');
  visual.setAttribute('aria-label',p.title+' project preview');
  if(p.visual==='job')visual.innerHTML='<div class="visual-window"><div class="visual-top"><i></i><i></i><i></i><span>JOB FINDER / DASHBOARD</span></div><div class="job-preview"><div class="job-sidebar"><b>J</b><span></span><span></span><span></span></div><div class="job-main"><small>YOUR SEARCH, IN ONE PLACE</small><strong>Find your next<br>opportunity.</strong><div class="job-searchbar">Search roles, skills, companies <b>↗</b></div><div class="job-metrics"><span><b>Resume</b><small>Uploaded</small></span><span><b>Match</b><small>Role insights</small></span></div></div></div></div>';
  else if(p.visual==='dmb')visual.innerHTML='<div class="visual-window"><div class="brand-word">DAILY MINI BYTES</div></div>';
  else if(p.visual==='bridge')visual.innerHTML='<div class="visual-window"><div class="brand-mark">ᛒ<small>MobileBluetoothBridge<br>CONNECT · TRANSFER · BRIDGE</small></div></div>';
  else if(p.visual==='oxford')visual.innerHTML='<div class="visual-window"><div class="brand-mark">Oxford Tutor<small>LOCAL LANGUAGE ASSISTANT · PHI-3</small></div></div>';
  else if(p.visual==='deadlines')visual.innerHTML='<div class="visual-window"><div class="brand-mark">Your semester,<br>in control.<small>ASSIGNMENTS · EVENTS · REMINDERS</small></div></div>';
  else visual.innerHTML='<div class="visual-window"><div class="brand-mark">SWASTHYASETU<small>BRIDGING PEOPLE AND HEALTHCARE</small></div></div>';
  if(progress)progress.style.transform='scaleX('+(index+1)/projects.length+')';
 }
 tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>select(index));tab.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].focus();select(next)}})});
 select(0);
})();
