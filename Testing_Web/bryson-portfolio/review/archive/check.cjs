const { chromium } = require('/tmp/bryson-site-qa/node_modules/playwright');
const fs = require('fs');
const root = '/home/brysonn/Projects/bryson-portfolio/review/archive';
(async () => {
 const browser = await chromium.launch({executablePath:'/home/brysonn/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 if(process.argv.includes('--prepare-textures')) {
   const p=await browser.newPage();
   await p.goto('http://127.0.0.1:4174/');
   for(const [name,size] of [['grain',180],['ink-wear',220]]) {
     const data=await p.evaluate(async({name,size})=>{
       const img=new Image();img.src=`assets/images/${name}.svg`;await img.decode();
       const canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;
       canvas.getContext('2d').drawImage(img,0,0,size,size);return canvas.toDataURL('image/png').split(',')[1];
     },{name,size});
     fs.writeFileSync(`/home/brysonn/Projects/bryson-portfolio/assets/images/${name}.png`,Buffer.from(data,'base64'));
   }
   await browser.close();console.log('Existing SVG textures rasterized.');return;
 }
 if(process.argv.includes('--interactions')) { await require('./interactions.cjs')(browser); await browser.close(); return; }
 const report = {screens:[],errors:[]};
 for (const width of [1440,1024,768,390,320]) {
   const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
   page.on('pageerror',e=>report.errors.push({width,error:e.message}));
   page.on('response',r=>{if(r.status()>=400)report.errors.push({width,url:r.url(),status:r.status()})});
   await page.goto('http://127.0.0.1:4174/',{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:`${root}/hero-${width}.png`});
   if(width===1440||width===390)await page.screenshot({path:`${root}/site-${width}.png`,fullPage:true});
   report.screens.push(await page.evaluate(()=>({width:innerWidth,docWidth:document.documentElement.scrollWidth,images:[...document.images].filter(i=>i.loading!=='lazy'&&(!i.complete||!i.naturalWidth)).map(i=>i.src),overflows:[...document.querySelectorAll('h1,h2,h3,p,a,summary,img,div,article')].filter(el=>{const r=el.getBoundingClientRect();return r.left < -6 || r.right>innerWidth+6}).map(el=>({tag:el.tagName,text:el.textContent.slice(0,50)}))})));
   if(width===1440||width===390){
     for(const id of ['evidence','field-notes','equipment','case-file','transmission'])await page.locator(`#${id}`).screenshot({path:`${root}/${id}-${width}.png`});
     await page.locator('#dossier > summary').click();
     await page.locator('#case-file').screenshot({path:`${root}/dossier-open-${width}.png`});
   }
   await page.close();
 }
 fs.writeFileSync(`${root}/layout-report.json`,JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
