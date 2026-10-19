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
  assert.equal(post.datePublished,article.datePublished);
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
