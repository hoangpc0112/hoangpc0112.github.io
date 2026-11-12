import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {PROJECTS,selectProjects,replyFor} from './dist/portfolio-core.mjs';

// Run the interaction code with animation libraries unavailable, without adding a DOM dependency.
const source=(await readFile(new URL('./dist/hacker.mjs',import.meta.url),'utf8')).replace(/^import .*;\r?\n/gm,'');
class Element {
  constructor(dataset={}) {
    this.dataset=dataset;
    this.children=[];
    this.events={};
    this.attributes={};
    this.classList={toggle(){}};
    this.hidden=false;
    this.value='';
    this.textContent='';
  }
  append(...elements) {
    for(const element of elements){
      element.remove();
      element.parentElement=this;
      this.children.push(element);
    }
  }
  remove() {
    if(this.parentElement){
      const siblings=this.parentElement.children;
      siblings.splice(siblings.indexOf(this),1);
      this.parentElement=null;
    }
  }
  replaceChildren(){for(const child of [...this.children])child.remove();}
  get firstElementChild(){return this.children[0];}
  addEventListener(name,handler){this.events[name]=handler;}
  setAttribute(name,value){this.attributes[name]=value;}
}

for(const window of [{},{gsap:{}},{ScrollTrigger:{}}]){
  const primary=new Element(),secondary=new Element();
  const cards=PROJECTS.map(({name},index)=>{
    const card=new Element({repo:name});
    (index<3?primary:secondary).append(card);
    return card;
  });
  const buttons=['all','security','web','tools'].map(filter=>new Element({filter}));
  const elements=new Map([
    ['#projects .project-grid',primary],['#more-projects',secondary],
    ...['#filter-count','#terminal-form','#terminal-command','#terminal-output','.seat-grid'].map(selector=>[selector,new Element()])
  ]);
  const document={
    documentElement:new Element(),
    querySelector:selector=>{assert.ok(elements.has(selector),selector);return elements.get(selector);},
    querySelectorAll:selector=>selector==='[data-filter]'?buttons:selector==='[data-repo]'?cards:[],
    createElement:()=>new Element()
  };
  runInNewContext(source,{
    window,document,selectProjects,replyFor,initLanguage(){},language:'vi',
    projectCount:count=>`${count} dự án`,
    IntersectionObserver:class {observe(){}}
  },{filename:'dist/hacker.mjs'});

  for(const button of buttons){
    button.events.click();
    assert.deepEqual(cards.filter(card=>!card.hidden).map(card=>card.dataset.repo),selectProjects(button.dataset.filter).map(project=>project.name));
    assert.equal(button.attributes['aria-pressed'],'true');
  }
  buttons[0].events.click();
  assert.deepEqual(primary.children,cards.slice(0,3));
  assert.deepEqual(secondary.children,cards.slice(3));

  const input=elements.get('#terminal-command'),output=elements.get('#terminal-output');
  const submit=command=>{
    input.value=command;
    elements.get('#terminal-form').events.submit({preventDefault(){}});
  };
  submit(' WHOAMI ');
  assert.match(output.children[0].children[1].textContent,/Phạm Chính Hoàng/);
  assert.equal(input.value,'');
  input.events.keydown({key:'ArrowUp',preventDefault(){}});
  assert.equal(input.value,'WHOAMI');
  submit('<img src=x onerror=alert(1)>');
  assert.match(output.children.at(-1).children[1].textContent,/Không có lệnh/);
  for(let i=0;i<30;i++)submit('help');
  assert.equal(output.children.length,25);
  submit('clear');
  assert.equal(output.children.length,0);
}
console.log('PASS: filters, card restoration, terminal, history and output bounds with either or both animation libraries missing.');
