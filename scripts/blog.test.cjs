const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const articles = fs.readdirSync(path.join(root,'content/blog')).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(path.join(root,'content/blog',f))));
const pages = ['blogg.html',...articles.map(a=>'blogg/'+a.slug+'.html')];
for (const file of pages) test(`${file}: crawlable HTML, metadata and schema`,()=>{
 const html=fs.readFileSync(path.join(root,'build',file),'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
 assert.match(html,/<html lang="nb">/);
 assert.match(html,/<link rel="canonical" href="https:\/\/fordelsjakten.no\/blogg/);
 assert.match(html,/<meta name="description" content="[^"]+">/);
 assert.match(html,/<meta property="og:url"/);
 assert.doesNotMatch(html,/static\/js\/main/);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 assert.ok(schema['@graph'].some(s=>s['@type']==='BreadcrumbList'));
 const article=articles.find(a=>file.endsWith(a.slug+'.html'));
 if(article) {
  assert.ok(html.includes(article.title));
  const post=schema['@graph'].find(s=>s['@type']==='BlogPosting');
  assert.equal(post.headline,article.title);
  if (article.publicationPending) {
   assert.equal(post.datePublished, undefined);
   assert.equal(post.dateModified, undefined);
   assert.match(html, /Ikke publisert/);
   assert.match(html, /name="robots" content="noindex, follow"/);
   assert.doesNotMatch(html, /article:published_time|datetime="null"/);
  } else assert.equal(post.datePublished,article.datePublished);
  assert.ok(post.articleBody.includes(article.intro));
  for(const section of article.sections) assert.ok(html.includes(`id="${section.id}"`));
 }
 for(const match of html.matchAll(/href="(\/blogg[^"#]*)(?:#[^"]*)?"/g)) {
  const url=match[1];
  const filePath=url.endsWith('.css') ? url.slice(1) : url.slice(1)+'.html';
  assert.ok(fs.existsSync(path.join(root,'build',filePath)),`Broken internal link: ${url}`);
 }
});
test('sitemap includes every article and preserves existing pages',()=>{
 const sitemap=fs.readFileSync(path.join(root,'build/sitemap.xml'),'utf8');
 for(const a of articles) assert.ok(sitemap.includes('https://fordelsjakten.no/blogg/'+a.slug));
 assert.ok(sitemap.includes('https://fordelsjakten.no/personvern'));
 assert.ok(sitemap.includes('<loc>https://fordelsjakten.no/</loc>'));
});
test('article image is connected to HTML, sharing and schema',()=>{
 for(const a of articles.filter(a=>a.image)) {
  const html=fs.readFileSync(path.join(root,'build/blogg',a.slug+'.html'),'utf8');
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const post=graph.find(s=>s['@type']==='BlogPosting');
  assert.equal(post.image.url,'https://fordelsjakten.no'+a.image.src);
  assert.ok(html.includes('content="https://fordelsjakten.no'+a.image.share+'"'));
  assert.ok(html.includes('alt="'+a.image.alt+'"'));
  assert.ok(html.includes(a.image.credit));
  assert.ok(html.includes('fetchpriority="high"'));
  assert.ok(html.includes('srcset="'));
  for(const key of ['src','small','share']) assert.ok(fs.existsSync(path.join(root,'build',a.image[key])));
 }
});

test('article titles, sharing, sources and summary follow editorial fields',()=>{
 for (const a of articles) {
  const html=fs.readFileSync(path.join(root,'build/blogg',a.slug+'.html'),'utf8');
  assert.ok(html.includes(`<title>${a.seoTitle || a.title+' | Fordelsjakten'}</title>`));
  for (const field of ['og:title','twitter:title']) assert.ok(html.includes(`content="${a.shareTitle || a.seoTitle || a.title+' | Fordelsjakten'}"`));
  if (a.shareDescription) assert.ok(html.includes(`content="${a.shareDescription}"`));
  for (const source of a.sources || []) {
   assert.ok(html.includes(`<a href="${source.url}">${source.title}</a>`));
   assert.ok(html.indexOf('id="kilder"') < html.lastIndexOf(source.url));
  }
  if (a.summary) for (const item of a.summary) assert.ok(html.includes(`<li>${item}</li>`));
  assert.doesNotMatch(html,/\[(Forbrukerrådet|SpareBank 1)\]\(/);
 }
});
test('pending publication dates block production until actual dates are supplied',()=>{
 const os=require('node:os');
 const {spawnSync}=require('node:child_process');
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'fj-blog-publication-'));
 try {
  for(const name of ['scripts','src','public','content']) fs.cpSync(path.join(root,name),path.join(temp,name),{recursive:true});
  // Spread the articles over separate days so the date filter is exercised independently of the real dates.
  const scheduled=articles.map((a,i)=>({...a,datePublished:`2026-10-${21+i}`,dateModified:`2026-10-${21+i}`}));
  for(const a of scheduled) fs.writeFileSync(path.join(temp,'content/blog',a.slug+'.json'),JSON.stringify(a));
  let dateOffset=0;
  for (const name of fs.readdirSync(path.join(temp,'content/blog'))) {
   const file=path.join(temp,'content/blog',name);
   const a=JSON.parse(fs.readFileSync(file,'utf8'));
   delete a.editorialNotes;
   delete a.publicationPending;
   a.datePublished=a.dateModified=`2026-01-${String(++dateOffset+1).padStart(2,'0')}`;
   fs.writeFileSync(file,JSON.stringify(a));
  }
  const fixture=JSON.parse(fs.readFileSync(path.join(temp,'content/blog',fs.readdirSync(path.join(temp,'content/blog'))[0]),'utf8'));
  fixture.publicationPending=true;
  fixture.datePublished=fixture.dateModified=null;
  const fixtureFile=path.join(temp,'content/blog',fixture.slug+'.json');
  fs.writeFileSync(fixtureFile,JSON.stringify(fixture));
  const run=()=>spawnSync(process.execPath,[path.join(temp,'scripts/build-blog.cjs')],{env:{...process.env,VERCEL_ENV:'production'},encoding:'utf8'});
  const blocked=run();
  assert.notEqual(blocked.status,0);
  assert.match(blocked.stderr,/Set actual publication dates/);
  for(const name of fs.readdirSync(path.join(temp,'content/blog'))) {
   const file=path.join(temp,'content/blog',name);
   const article=JSON.parse(fs.readFileSync(file,'utf8'));
   if(article.publicationPending) {
    delete article.publicationPending;
    article.datePublished=article.dateModified='2026-01-01';
    fs.writeFileSync(file,JSON.stringify(article));
   }
  }
  const published=run();
  assert.equal(published.status,0,published.stderr);
  const html=fs.readFileSync(path.join(temp,'build/blogg',fixture.slug+'.html'),'utf8');
  assert.match(html,/"datePublished":"2026-01-01","dateModified":"2026-01-01"/);
  assert.doesNotMatch(html,/Ikke publisert|noindex/);
 } finally { fs.rmSync(temp,{recursive:true,force:true}); }
});

test('package articles keep working links, FAQ/schema parity, tables and unresolved notes',()=>{
 const {JSDOM}=require('jsdom');
 const packageArticles=articles.filter(a=>a.sections.some(s=>s.blocks));
 assert.equal(packageArticles.length,7);
 const strip=value=>value.replace(/`([^`]+)`/g,'$1').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'$1');
 for(const a of packageArticles) {
  const html=fs.readFileSync(path.join(root,'build/blogg',a.slug+'.html'),'utf8');
  const doc=new JSDOM(html).window.document;
  assert.doesNotMatch(doc.querySelector('.article-body').textContent,/\[INTERNLENKE:|\[KILDE:/);
  assert.equal(doc.querySelectorAll('a[href="/#epostpamelding"]').length,1);
  assert.equal(doc.querySelector('.article-editorial-notes'),null);
  const graph=JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
  const faq=graph.find(n=>n['@type']==='FAQPage');
  const blocks=a.sections.find(s=>s.id==='ofte-stilte-sporsmal').blocks;
  const questions=blocks.filter(b=>b.type==='heading');
  const answers=blocks.filter(b=>b.type==='paragraph');
  assert.equal(faq.mainEntity.length,3);
  faq.mainEntity.forEach((question,i)=>{
   assert.equal(question.name,strip(questions[i].text));
   assert.equal(question.acceptedAnswer.text,strip(answers[i].text));
   assert.ok(doc.querySelector('#ofte-stilte-sporsmal').textContent.includes(question.acceptedAnswer.text));
  });
  for(const anchor of doc.querySelectorAll('a[href^="/blogg"]')) {
   const url=new URL(anchor.href,'https://fordelsjakten.no');
   const file=path.join(root,'build',url.pathname.slice(1)+'.html');
   assert.ok(fs.existsSync(file),url.pathname);
   if(url.hash) assert.ok(new JSDOM(fs.readFileSync(file,'utf8')).window.document.getElementById(url.hash.slice(1)));
  }
  const expectedTables=a.sections.flatMap(s=>s.blocks).filter(b=>b.type==='table');
  assert.equal(doc.querySelectorAll('.article-table table').length,expectedTables.length);
  expectedTables.forEach((table,i)=>assert.equal(doc.querySelectorAll('.article-table table')[i].querySelectorAll('tbody tr').length,table.rows.length));
 }
});
test('all eleven package examples match calculator annuities and fee handling',()=>{
 const vm=require('node:vm');
 const code=fs.readFileSync(path.join(root,'src/App.js'),'utf8');
 const funcs=code.slice(code.indexOf('function annuitet('),code.indexOf('function formatNO('));
 const context={};vm.createContext(context);vm.runInContext(funcs,context);
 const examples=JSON.parse(fs.readFileSync(path.join(root,'content/blog-calculations.json'),'utf8'));
 const close=(actual,expected,label)=>assert.ok(Math.abs(actual-expected)<0.001,`${label}: ${actual} vs ${expected}`);
 assert.equal(Object.keys(examples).length,11);
 for(const [key,a] of Object.entries(examples)) {
  const monthly=context.annuitet(a.P,a.rate,a.months);
  close(monthly,a.monthly_base,key+' base');
  close(monthly+a.fee_monthly,a.monthly,key+' payment');
  close(monthly*a.months-a.P,a.interest,key+' interest');
  close(a.fee_upfront+a.fee_monthly*a.months,a.fees,key+' fees');
  close((monthly+a.fee_monthly)*a.months+a.fee_upfront-a.P,a.cost,key+' cost');
  if(a.effective!==undefined) close(context.effektivRente(a.P,a.fee_monthly,a.fee_upfront,a.rate,a.months),a.effective,key+' effective');
 }
});

test('publication schedule excludes future pages, schema, links and sitemap',()=>{
 const os=require('node:os');const {spawnSync}=require('node:child_process');
 const {JSDOM}=require('jsdom');
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'fj-blog-schedule-'));
 try {
  for(const name of ['scripts','src','public','content']) fs.cpSync(path.join(root,name),path.join(temp,name),{recursive:true});
  // Spread the articles over separate days so the date filter is exercised independently of the real dates.
  const scheduled=articles.map((a,i)=>({...a,datePublished:`2026-10-${21+i}`,dateModified:`2026-10-${21+i}`}));
  for(const a of scheduled) fs.writeFileSync(path.join(temp,'content/blog',a.slug+'.json'),JSON.stringify(a));
  const run=date=>spawnSync(process.execPath,[path.join(temp,'scripts/build-blog.cjs')],{env:{...process.env,VERCEL_ENV:'production',BLOG_BUILD_DATE:date},encoding:'utf8'});
  // Check backwards too: stale future files must disappear on a repeated build.
  for(const [date,count] of [['2026-10-29',9],['2026-10-21',1],['2026-10-22',2],['2026-10-20',0]]) {
   const result=run(date);assert.equal(result.status,0,result.stderr);
   assert.equal(fs.readdirSync(path.join(temp,'build/blogg')).filter(f=>f.endsWith('.html')).length,count);
   const sitemap=fs.readFileSync(path.join(temp,'build/sitemap.xml'),'utf8');
   const html=fs.readFileSync(path.join(temp,'build/blogg.html'),'utf8');
   const doc=new JSDOM(html).window.document;
   assert.equal(doc.querySelectorAll('.blog-card').length,count);
   assert.equal(JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent)['@graph'].find(n=>n['@type']==='Blog').blogPost.length,count);
   for(const a of scheduled) assert.equal(sitemap.includes('/blogg/'+a.slug),a.datePublished<=date);
   for(const file of fs.readdirSync(path.join(temp,'build/blogg')).filter(f=>f.endsWith('.html'))) {
    const articleDoc=new JSDOM(fs.readFileSync(path.join(temp,'build/blogg',file),'utf8')).window.document;
    for(const link of articleDoc.querySelectorAll('a[href^="/blogg/"]')) assert.ok(fs.existsSync(path.join(temp,'build',link.getAttribute('href').slice(1).split('#')[0]+'.html')));
   }
  }
 } finally { fs.rmSync(temp,{recursive:true,force:true}); }
});

test('promo blocks reuse the shared affiliate data and stay out of schema text',()=>{
 const {JSDOM}=require('jsdom');
 const affiliates=JSON.parse(fs.readFileSync(path.join(root,'src/affiliates.json'),'utf8'));
 for(const a of articles) {
  const blocks=a.sections.flatMap(s=>(s.blocks||[]).filter(b=>b.type==='promo'));
  const doc=new JSDOM(fs.readFileSync(path.join(root,'build/blogg',a.slug+'.html'),'utf8')).window.document;
  assert.equal(doc.querySelectorAll('.article-promo').length,blocks.length,a.slug);
  assert.equal(!!doc.querySelector('script[src="/blogg/promo.js"]'),blocks.some(b=>b.ids?.length>1),a.slug);
  for(const [i,box] of [...doc.querySelectorAll('.article-promo--affiliate')].entries()) {
   const ids=blocks.map(b=>b.ids||[b.id]).filter(ids=>affiliates.some(p=>p.id===ids[0]))[i];
   assert.equal(box.hasAttribute('data-rotate'),ids.length>1);
   const cards=[...box.querySelectorAll('.affiliate-card')];
   assert.deepEqual(cards.map(c=>c.getAttribute('href')),ids.map(id=>affiliates.find(p=>p.id===id).url));
   assert.deepEqual(cards.map(c=>c.hidden),cards.map((c,j)=>j>0));
  }
  const body=JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent)['@graph'].find(n=>n['@type']==='BlogPosting').articleBody;
  for(const card of doc.querySelectorAll('.article-promo--affiliate .affiliate-card')) {
   const partner=affiliates.find(p=>p.url===card.getAttribute('href'));
   assert.ok(partner,a.slug);
   assert.equal(card.getAttribute('rel'),'sponsored nofollow noopener noreferrer');
   assert.equal(card.getAttribute('target'),'_blank');
   assert.ok(!partner.segment,a.slug);
   assert.equal(card.querySelector('.ad-label').textContent,'Annonse');
   assert.equal(card.querySelector('.legal-example').textContent,partner.renteeksempel);
   assert.match(card.querySelector('.affiliate-note').textContent,/provisjon/);
   assert.doesNotMatch(card.textContent,/[→←↗]/);
   assert.ok(!body.includes(partner.renteeksempel));
  }
 }
});

test('promo placement rules stop the build',()=>{
 const os=require('node:os');const {spawnSync}=require('node:child_process');
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'fj-blog-promo-'));
 try {
  for(const name of ['scripts','src','public','content']) fs.cpSync(path.join(root,name),path.join(temp,name),{recursive:true});
  const base=articles.find(a=>a.slug==='termingebyr');
  const file=path.join(temp,'content/blog/termingebyr.json');
  const build=()=>spawnSync(process.execPath,[path.join(temp,'scripts/build-blog.cjs')],{encoding:'utf8'});
  const withPromos=(placements,extra={})=>{
   const a=structuredClone({...base,...extra});
   for(const s of a.sections) if(s.blocks) s.blocks=s.blocks.filter(b=>b.type!=='promo');
   for(const [section,id] of placements) a.sections[section].blocks.push(Array.isArray(id) ? {type:'promo',ids:id} : {type:'promo',id});
   fs.writeFileSync(file,JSON.stringify(a));
  };
  withPromos([[1,'kalkulator'],[4,'zensum']]); assert.equal(build().status,0,build().stderr);
  withPromos([[1,'kalkulator'],[3,'epost'],[4,'zensum']]); assert.match(build().stderr,/At most two promo blocks/);
  withPromos([[1,'motty'],[4,'zensum']]); assert.match(build().stderr,/Too many affiliate promos/);
  withPromos([[4,'zensum']],{noAffiliate:true}); assert.match(build().stderr,/Too many affiliate promos/);
  withPromos([[0,'zensum']]); assert.match(build().stderr,/not allowed in section/);
  withPromos([[5,'zensum']]); assert.match(build().stderr,/not allowed in section/);
  withPromos([[4,'ukjent']]); assert.match(build().stderr,/Unknown promo/);
  withPromos([[4,'okida']]); assert.match(build().stderr,/Unknown promo/);
  withPromos([[4,['zensum','zensum-sikret']]]); assert.match(build().stderr,/Unknown promo/);
  withPromos([[1,'kalkulator'],[4,['zensum','motty']]]); assert.equal(build().status,0,build().stderr);
  withPromos([[1,'motty'],[4,['zensum','uno-finans']]]); assert.match(build().stderr,/Too many affiliate promos/);
  withPromos([[4,['zensum','ukjent']]]); assert.match(build().stderr,/Unknown promo/);
  withPromos([[4,['zensum','zensum']]]); assert.match(build().stderr,/unique ids/);
  withPromos([[4,['zensum','kalkulator']]]); assert.match(build().stderr,/Only affiliate promos can rotate/);
  withPromos([]);
  const partners=JSON.parse(fs.readFileSync(path.join(temp,'src/affiliates.json'),'utf8'));
  partners[0].renteeksempel='Lav rente!';
  fs.writeFileSync(path.join(temp,'src/affiliates.json'),JSON.stringify(partners));
  assert.match(build().stderr,/representative rate example/);
 } finally { fs.rmSync(temp,{recursive:true,force:true}); }
});

test('no arrow glyphs in the app, blog or content (see CLAUDE.md)',()=>{
 const files=['src/App.js','src/blog.css','src/blog-index.js','src/blog-promo.js','src/affiliates.json','scripts/build-blog.cjs','content/promos.json','BLOG.md','BLOG-GJENNOMGANG.md','BLOG-BILDER.md',...articles.map(a=>`content/blog/${a.slug}.json`)];
 for(const file of files) {
  const text=fs.readFileSync(path.join(root,file),'utf8');
  const hit=text.match(/[←-⇿➡⟵-⟿⬅-⬇]|&[rl]arr;/);
  assert.equal(hit,null,`${file} contains an arrow: ${hit?.[0]}`);
 }
});
