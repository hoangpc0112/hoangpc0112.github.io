import {mkdir,copyFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
await mkdir(new URL('dist/vendor/',root),{recursive:true});
for(const name of ['gsap.min.js','ScrollTrigger.min.js']){
  await copyFile(new URL(`node_modules/gsap/dist/${name}`,root),new URL(`dist/vendor/${name}`,root));
}
console.log('Vendored GSAP and ScrollTrigger from the pinned pnpm dependency.');
