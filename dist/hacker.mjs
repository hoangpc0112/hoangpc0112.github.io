import {selectProjects, replyFor} from './portfolio-core.mjs';
import {initLanguage,language,projectCount} from './locale.mjs';
import './navigation.mjs';

initLanguage();

const {gsap,ScrollTrigger}=window;
const root = document.documentElement;
let scrollReveals=[];
if(gsap && ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.fps(30);

  let visible = true;
  const rotation={angle:.45};
  let width = 1, height = 1;
  const canvas = document.querySelector('#network-canvas');
  const art = document.querySelector('.hero-art');
  const context = canvas.getContext('2d');
  const chars = ['0','1','·','+','/','∶'];
  const pointCount=innerWidth<640?420:720;
  const points = Array.from({length:pointCount},(_,i) => {
    const y = 1 - (i/(pointCount-1))*2;
    const radius = Math.sqrt(1-y*y);
    const theta = Math.PI*(3-Math.sqrt(5))*i;
    return {x:Math.cos(theta)*radius,y,z:Math.sin(theta)*radius,glyph:i%chars.length};
  });
  const projected=points.map(source=>({source,x:0,y:0,z:0}));
  const glyphAtlas=document.createElement('canvas');
  glyphAtlas.width=chars.length*5*24;glyphAtlas.height=8*24;
  function cacheGlyphs(){
    const atlas=glyphAtlas.getContext('2d');
    atlas.clearRect(0,0,glyphAtlas.width,glyphAtlas.height);
    atlas.textAlign='center';atlas.textBaseline='middle';
    for(let shade=0;shade<8;shade++)for(let glyph=0;glyph<chars.length;glyph++)for(let size=0;size<5;size++){
      atlas.font=`${7+size}px "JetBrains Mono",monospace`;
      atlas.fillStyle=`rgba(164,255,102,${.12+shade/7*.75})`;
      atlas.fillText(chars[glyph],(glyph*5+size)*24+12,shade*24+12);
    }
  }
  cacheGlyphs();
  function draw() {
    if (!context) return;
    context.clearRect(0,0,width,height);
    const scale = Math.min(width,height)*.325;
    const cx = width*.5, cy = height*.5;
    const tilt = -.2;
    const spin = rotation.angle;
    const cos = Math.cos(spin), sin = Math.sin(spin);
    const c = Math.cos(tilt), s = Math.sin(tilt);
    for(const dot of projected){
      const p=dot.source;
      const x=p.x*cos+p.z*sin, z=-p.x*sin+p.z*cos;
      const y=p.y*c-z*s, depth=p.y*s+z*c;
      const perspective=2.8/(2.8-depth*.3);
      dot.x=cx+x*scale*perspective;dot.y=cy+y*scale*perspective;dot.z=depth;
    }
    projected.sort((a,b)=>a.z-b.z);
    for (const p of projected) {
      const brightness=(p.z+1)/2;
      const size=Math.round(brightness*4),shade=Math.round(brightness*7);
      context.drawImage(glyphAtlas,(p.source.glyph*5+size)*24,shade*24,24,24,p.x-12,p.y-12,24,24);
    }
    // Both orbital rings are part of the same bounded hero canvas.
    for (let ring=0;ring<2;ring++) {
      context.beginPath();
      const rotate=ring===0?-.45:.55;
      for(let i=0;i<=160;i++) {
        const t=i/160*Math.PI*2;
        const x=Math.cos(t)*scale*1.35, y=Math.sin(t)*scale*.34;
        const dx=x*Math.cos(rotate)-y*Math.sin(rotate), dy=x*Math.sin(rotate)+y*Math.cos(rotate);
        if(i===0) context.moveTo(cx+dx,cy+dy); else context.lineTo(cx+dx,cy+dy);
      }
      context.strokeStyle=ring===0?'rgba(164,255,102,.38)':'rgba(132,215,172,.18)';
      context.lineWidth=.7; context.stroke();
      const t=rotation.angle*(ring===0?1.4:-.8)+ring;
      const x=Math.cos(t)*scale*1.35,y=Math.sin(t)*scale*.34;
      const dx=x*Math.cos(rotate)-y*Math.sin(rotate),dy=x*Math.sin(rotate)+y*Math.cos(rotate);
      context.beginPath();context.arc(cx+dx,cy+dy,3,0,Math.PI*2);context.fillStyle='#a4ff66';context.fill();
    }
    art.classList.add('is-canvas');
  }
  const sphereMotion=gsap.to(rotation,{id:'hero-sphere',angle:rotation.angle+Math.PI*2,duration:52,repeat:-1,ease:'none',paused:true,onUpdate:draw});
  gsap.timeline({id:'hero-entrance',defaults:{duration:.8,ease:'power3.out'}})
    .from('.command-line',{y:12,opacity:0})
    .from('#hero-h',{y:28,opacity:0},.12)
    .from('.hero-role, .hero__lead, .hero-copy .btn-row, .hero-facts',{y:16,opacity:0,stagger:.1},.3)
    .from('.hero-art',{scale:.92,opacity:0,duration:1.2},.15);

  scrollReveals=gsap.utils.toArray('.section-head, .about-copy, .terminal, .project-body, .stack-table > div').map((element,index)=>{
    const animation=gsap.fromTo(element,{y:24,opacity:.15},{y:0,opacity:1,duration:.7,ease:'power2.out',paused:true});
    const trigger=ScrollTrigger.create({id:`scroll-reveal-${index}`,trigger:element,animation,start:'top 92%',toggleActions:'none none none none',onEnter:()=>{animation.play();},onEnterBack:()=>{animation.play();}});
    element.addEventListener('focusin',()=>animation.progress(1).pause());
    return {element,animation,trigger};
  });
  document.fonts.ready.then(()=>{cacheGlyphs();draw();ScrollTrigger.refresh();});
  document.addEventListener('languagechange',()=>ScrollTrigger.refresh());
  function syncAnimation() {
    sphereMotion.paused(!visible || document.hidden || !context);
    draw();
  }
  function resize() {
    const box=art.getBoundingClientRect();
    width=Math.max(1,box.width);height=Math.max(1,box.height);
    const ratio=Math.min(devicePixelRatio||1,1.5);
    canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
    context?.setTransform(ratio,0,0,ratio,0,0);draw();
  }
  document.addEventListener('visibilitychange',syncAnimation);
  new ResizeObserver(resize).observe(art);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncAnimation();},{threshold:.05}).observe(art);
  syncAnimation();
}

document.querySelectorAll('.packet-waves i').forEach((wave,i)=>wave.style.setProperty('--i',i));
const loopVisibility=new IntersectionObserver(entries=>{
  for(const entry of entries)for(const loop of entry.target.querySelectorAll('.packet-waves i, .mesh-lines'))loop.style.animationPlayState=entry.isIntersecting?'running':'paused';
});
document.querySelectorAll('.packet-cover, .mesh-cover').forEach(cover=>loopVisibility.observe(cover));
const seats=document.querySelector('.seat-grid');
for(let i=0;i<40;i++) seats.append(document.createElement('i'));

const filterButtons=[...document.querySelectorAll('[data-filter]')];
const cards=[...document.querySelectorAll('[data-repo]')];
const cardHomes=new Map(cards.map(card=>[card,card.parentElement]));
const primaryGrid=document.querySelector('#projects .project-grid');
filterButtons.forEach(button=>button.addEventListener('click',()=>{
  const category=button.dataset.filter;
  const selected=new Set(selectProjects(category).map(p=>p.name));
  cards.forEach(card=>cardHomes.get(card).append(card));
  cards.forEach(card=>card.hidden=!selected.has(card.dataset.repo));
  if(category!=='all') cards.filter(card=>!card.hidden).forEach(card=>primaryGrid.append(card));
  filterButtons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  root.classList.toggle('filtered-view',category!=='all');
  document.querySelector('#more-projects').classList.toggle('is-empty',category!=='all');
  document.querySelector('#filter-count').textContent=projectCount(selected.size);
  // A filtered result must be readable immediately after cards move between sections.
  scrollReveals.filter(({element})=>element.closest('.project-card')).forEach(({animation})=>animation.progress(1).pause());
  if(gsap && ScrollTrigger) ScrollTrigger.refresh();
}));

const form=document.querySelector('#terminal-form');
const input=document.querySelector('#terminal-command');
const output=document.querySelector('#terminal-output');
const history=[];
let historyPosition=0;
form.addEventListener('submit',event=>{
  event.preventDefault();
  const raw=input.value.trim();
  if(!raw) return;
  const reply=replyFor(raw,language);
  history.push(raw);if(history.length>40) history.shift();historyPosition=history.length;
  if(reply.clear) output.replaceChildren();
  else {
    const line=document.createElement('div');line.className='terminal-line';line.dataset.raw=raw;
    const prompt=document.createElement('span');prompt.textContent=`❯ ${raw}`;
    const answer=document.createElement('div');answer.textContent=reply.text;
    line.append(prompt,answer);output.append(line);
    // Bound visitor-generated terminal output to prevent indefinite DOM growth.
    while(output.children.length>25) output.firstElementChild.remove();
  }
  input.value='';output.scrollTop=output.scrollHeight;
});
input.addEventListener('keydown',event=>{
  if(event.key==='ArrowUp'){event.preventDefault();historyPosition=Math.max(0,historyPosition-1);input.value=history[historyPosition]||'';}
  if(event.key==='ArrowDown'){event.preventDefault();historyPosition=Math.min(history.length,historyPosition+1);input.value=history[historyPosition]||'';}
});
