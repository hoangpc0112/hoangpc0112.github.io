import {language} from './locale.mjs';

const nav=document.querySelector('.nav');
const button=nav.querySelector('.nav__toggle');
const outside=[document.querySelector('main'),document.querySelector('footer')];
function label(){
  const open=button.getAttribute('aria-expanded')==='true';
  button.setAttribute('aria-label',language==='en'?(open?'Close menu':'Open menu'):(open?'Đóng menu':'Mở menu'));
}
function setOpen(open){
  nav.classList.toggle('is-open',open);
  document.body.classList.toggle('nav-locked',open);
  button.setAttribute('aria-expanded',String(open));
  button.querySelector('path').setAttribute('d',open?'M4 4l10 10M14 4L4 14':'M2 5h14M2 13h14');
  outside.forEach(element=>element.inert=open);
  label();
}
button.addEventListener('click',()=>setOpen(button.getAttribute('aria-expanded')!=='true'));
nav.addEventListener('click',event=>{if(event.target.closest('a[href]'))setOpen(false);});
document.addEventListener('keydown',event=>{
  if(button.getAttribute('aria-expanded')!=='true')return;
  if(event.key==='Escape'){setOpen(false);button.focus();}
  if(event.key==='Tab'){
    const controls=[...nav.querySelectorAll('a[href],button')].filter(element=>element.getClientRects().length);
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});
matchMedia('(min-width:1024px)').addEventListener('change',event=>{if(event.matches)setOpen(false);});
document.addEventListener('languagechange',label);
label();
