const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer=matchMedia('(pointer:fine)').matches;
// Reversible reveal: elements animate in and out as the visitor scrolls in either direction.
const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('visible',e.isIntersecting)),{threshold:.13});
document.querySelectorAll('.reveal,.event').forEach(el=>observer.observe(el));
// Gooey pointer: hide the operating-system pointer only on fine-pointer devices.
const blob=document.querySelector('.cursor-blob');
if(blob&&finePointer&&!reduceMotion){
 document.body.classList.add('custom-cursor');
 let tx=innerWidth/2,ty=innerHeight/2,x=tx,y=ty,vx=0,vy=0,px=tx,py=ty,active=false;
 addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(!active){x=tx;y=ty;active=true;blob.classList.add('active')}});
 addEventListener('pointerdown',()=>blob.classList.add('press'));
 addEventListener('pointerup',()=>blob.classList.remove('press'));
 addEventListener('blur',()=>blob.classList.remove('active'));
 document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('pointerenter',()=>blob.classList.add('hover'));el.addEventListener('pointerleave',()=>blob.classList.remove('hover'))});
 function cursorLoop(){
  const dx=tx-x,dy=ty-y;vx=(vx+dx*.145)*.77;vy=(vy+dy*.145)*.77;x+=vx;y+=vy;
  const speed=Math.hypot(vx,vy),stretch=Math.min(speed*.041,.9),angle=Math.atan2(vy,vx)*180/Math.PI;
  const wobble=Math.sin(performance.now()*.021+speed*.7)*Math.min(speed*.0022,.12);
  blob.style.left=x+'px';blob.style.top=y+'px';
  blob.style.borderRadius=(49+stretch*12)+'% '+(51-stretch*17)+'% '+(46+stretch*17)+'% '+(54-stretch*12)+'% / '+(47-stretch*12)+'% '+(53+stretch*15)+'% '+(55-stretch*14)+'% '+(45+stretch*11)+'%';
  blob.style.transform='translate(-50%,-50%) rotate('+angle+'deg) scale('+(1+stretch*.31+wobble)+','+(1-stretch*.31-wobble*.4)+')';
  requestAnimationFrame(cursorLoop);
 }
 cursorLoop();
}else if(blob){blob.remove()}
// Interactive 3D keyboard. Hover previews; clicking the selected key again switches it off.
const keys=[...document.querySelectorAll('.key')],display=document.querySelector('.keyboard-display'),skillName=document.getElementById('skillName'),skillDetail=document.getElementById('skillDetail');
let selectedKey=null;
function showKey(key){skillName.textContent=key.dataset.skill;skillDetail.textContent=key.dataset.detail;display.classList.add('has-selection')}
function clearKeyDisplay(){skillName.textContent='SELECT A KEY';skillDetail.textContent='Press or hover over a key to inspect the skill.';display.classList.remove('has-selection')}
function updateSelected(){keys.forEach(k=>k.classList.toggle('active',k===selectedKey))}
keys.forEach(key=>{
 key.addEventListener('pointerenter',()=>showKey(key));
 key.addEventListener('focus',()=>showKey(key));
 key.addEventListener('click',()=>{
  selectedKey=selectedKey===key?null:key;
  updateSelected();
  if(selectedKey)showKey(selectedKey);else clearKeyDisplay();
 });
 key.addEventListener('pointerleave',()=>{
  if(selectedKey)showKey(selectedKey);else clearKeyDisplay();
 });
 key.addEventListener('blur',()=>{
  if(selectedKey)showKey(selectedKey);else clearKeyDisplay();
 });
});
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
// Timeline progress follows scroll position in both directions, so scrolling upward rewinds the line.
const historySection=document.getElementById('history'),timeline=historySection.querySelector('.timeline');let progressFrame=false;
function updateTimeline(){progressFrame=false;const r=timeline.getBoundingClientRect(),vh=innerHeight;const start=vh*.78,end=-r.height+vh*.22;const p=Math.max(0,Math.min(1,(start-r.top)/(start-end)));timeline.style.setProperty('--timeline-progress',p.toFixed(4))}
function requestTimelineUpdate(){if(!progressFrame){progressFrame=true;requestAnimationFrame(updateTimeline)}}
addEventListener('scroll',requestTimelineUpdate,{passive:true});addEventListener('resize',requestTimelineUpdate);updateTimeline();
