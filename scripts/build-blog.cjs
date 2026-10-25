const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'build');
const origin = 'https://fordelsjakten.no';
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
function safeUrl(value) {
  if (typeof value !== 'string') throw new Error('Link URL must be a string');
  if (/^\/(?!\/)/.test(value) && !/[\\\s]/.test(value)) return value;
  const parsed = new URL(value);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error('Links must use HTTPS or local paths');
  return value;
}
const plainText = value => String(value).replace(/`([^`]+)`/g, '$1').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
function richText(value) {
  let result = '', position = 0;
  for (const match of String(value).matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
    const href = safeUrl(match[2]);
    const futureArticle = process.env.VERCEL_ENV === 'production' && href.startsWith('/blogg/') && !publishedPaths.has(href.split('#')[0]);
    result += esc(value.slice(position, match.index)) + (futureArticle ? esc(match[1]) : `<a href="${esc(href)}">${esc(match[1])}</a>`);
    position = match.index + match[0].length;
  }
  return (result + esc(value.slice(position))).replace(/`([^`]+)`/g, '<code>$1</code>');
}
function blockText(block) {
  if (block.type === 'promo') return null;
  if (block.type === 'list') return block.items.join('\n');
  if (block.type === 'table') return [block.headers, ...block.rows].map(row=>row.join(' | ')).join('\n');
  return block.text;
}
// Same markup and classes as AffiliateCard in App.js, so the ad looks identical on the blog and in the calculator.
function promoMarkup(promo) {
  if (promo.type === 'internal') return `<aside class="article-promo article-promo--internal" aria-label="${esc(promo.label)}"><span class="article-promo-label">${esc(promo.label)}</span><p class="article-promo-heading">${esc(promo.heading)}</p><p>${esc(promo.text)}</p><a class="blog-button" href="${esc(safeUrl(promo.href))}">${esc(promo.cta)}</a></aside>`;
  return `<aside class="article-promo article-promo--affiliate" aria-label="Annonse"><a class="affiliate-card" href="${esc(safeUrl(promo.url))}" target="_blank" rel="noopener noreferrer sponsored"><div class="affiliate-topline"><span class="affiliate-tag">${esc(promo.tag)}</span><span class="ad-label">Annonse</span></div><p class="affiliate-name">${esc(promo.name)}</p><p class="affiliate-desc">${esc(promo.desc)}</p><div class="rate-example"><span>Renteeksempel</span><strong>${esc(promo.effRente)} %</strong></div><span class="affiliate-cta">${esc(promo.cta)} <span aria-hidden="true">→</span></span><p class="legal-example">${esc(promo.renteeksempel)}</p></a><p class="article-promo-disclosure">Fordelsjakten kan få provisjon hvis du klikker eller søker. Det koster ikke ekstra for deg, og påvirker ikke innholdet i artiklene.</p></aside>`;
}
function renderBlocks(blocks, heading) {
  return blocks.map(block=>{
    if (block.type === 'heading') return `<h3>${richText(block.text)}</h3>`;
    if (block.type === 'paragraph') return `<p>${richText(block.text)}</p>`;
    if (block.type === 'list') return `<ul>${block.items.map(item=>`<li>${richText(item)}</li>`).join('')}</ul>`;
    if (block.type === 'table') return `<div class="article-table" role="region" aria-label="${esc(heading)} – tabell" tabindex="0"><table><caption>${esc(heading)}</caption><thead><tr>${block.headers.map(cell=>`<th scope="col">${richText(cell)}</th>`).join('')}</tr></thead><tbody>${block.rows.map(row=>`<tr>${row.map((cell,i)=>i===0 ? `<th scope="row">${richText(cell)}</th>` : `<td>${richText(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    if (block.type === 'promo') return promoMarkup(promos.get(block.id));
    throw new Error(`Unknown article block: ${block.type}`);
  }).join('');
}
const publication = a => a.datePublished ? `${a.datePublished > buildDate ? 'Planlagt ' : ''}<time datetime="${a.datePublished}">${dateLabel(a.datePublished)}</time>` : '<span>Ikke publisert</span>';
const allArticles = fs.readdirSync(path.join(root, 'content/blog')).filter(name => name.endsWith('.json')).map(name => JSON.parse(fs.readFileSync(path.join(root, 'content/blog', name), 'utf8'))).sort((a,b) => (b.datePublished || '').localeCompare(a.datePublished || ''));
// Affiliate partners are shared with App.js so rate examples stay identical on every page.
const affiliates = JSON.parse(fs.readFileSync(path.join(root, 'src/affiliates.json'), 'utf8'));
const promos = new Map([
  ...affiliates.map(a => [a.id, {...a, type:'affiliate'}]),
  ...JSON.parse(fs.readFileSync(path.join(root, 'content/promos.json'), 'utf8')).map(p => [p.id, {...p, type:'internal'}]),
]);
for (const promo of promos.values()) {
  const fields = promo.type === 'affiliate' ? ['name','desc','url','cta','effRente','tag','renteeksempel'] : ['label','heading','text','cta','href'];
  for (const field of fields) if (!promo[field]) throw new Error(`Promo ${promo.id} is missing ${field}`);
  safeUrl(promo.url || promo.href);
  if (promo.type === 'affiliate' && !/effektiv rente/.test(promo.renteeksempel)) throw new Error(`Affiliate ${promo.id} needs a representative rate example`);
}
const slugs = new Set();
for (const article of allArticles) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug) || slugs.has(article.slug)) throw new Error('Invalid or duplicate article slug');
  slugs.add(article.slug);
  for (const field of ['title', 'description', 'category', 'intro']) if (!article[field]) throw new Error(`Missing ${field}`);
  if (process.env.VERCEL_ENV === 'production' && article.editorialNotes?.length) throw new Error(`Resolve editorial notes before publishing: ${article.slug}`);
  if (article.publicationPending) {
    if (article.datePublished !== null || article.dateModified !== null) throw new Error('Pending articles must not have publication dates');
    if (process.env.VERCEL_ENV === 'production') throw new Error(`Set actual publication dates and remove publicationPending before publishing: ${article.slug}`);
  } else for (const field of ['datePublished', 'dateModified']) if (!/^\d{4}-\d{2}-\d{2}$/.test(article[field]) || !Number.isFinite(Date.parse(article[field]))) throw new Error(`Invalid ${field}`);
  if (!article.publicationPending && article.dateModified < article.datePublished) throw new Error('Modified date precedes publication');
  for (const source of article.sources || []) safeUrl(source.url);
  if (article.summary && (!Array.isArray(article.summary) || !article.summary.every(item => typeof item === 'string' && item.trim()))) throw new Error('Invalid summary');
  if (article.image) {
    for (const field of ['src','small','share']) {
      const imagePath = article.image[field];
      if (typeof imagePath !== 'string' || !/^\/images\/blog\/[a-z0-9-]+\.(?:webp|jpg|png)$/.test(imagePath) || !fs.existsSync(path.join(root,'public',imagePath))) throw new Error(`Missing or invalid image: ${imagePath}`);
    }
    if (!article.image.alt || !article.image.credit || !['width','height','shareWidth','shareHeight'].every(k=>Number.isInteger(article.image[k]) && article.image[k]>0)) throw new Error('Image metadata is incomplete');
  }
  if (!article.sections?.length || new Set(article.sections.map(s => s.id)).size !== article.sections.length) throw new Error('Missing or duplicate sections');
  for (const section of article.sections) if (!/^[a-z0-9-]+$/.test(section.id) || !section.heading || (!section.paragraphs?.length && !section.blocks?.length)) throw new Error('Invalid section');
  // Ad blocks: at most two per article (the default CTA counts), one affiliate, never in the first section, the FAQ or next to a table.
  const placed = article.sections.flatMap((section, index) => (section.blocks || []).map((block, i, blocks) => ({block, section, index, prev:blocks[i-1], next:blocks[i+1]}))).filter(p => p.block.type === 'promo');
  const affiliateCount = placed.filter(p => promos.get(p.block.id)?.type === 'affiliate').length;
  for (const {block, section, index, prev, next} of placed) {
    if (!promos.has(block.id)) throw new Error(`Unknown promo ${block.id} in ${article.slug}`);
    if (index === 0 || section.id === 'ofte-stilte-sporsmal') throw new Error(`Promo ${block.id} is not allowed in section ${section.id} of ${article.slug}`);
    if ([prev, next].some(b => b?.type === 'table' || b?.type === 'promo')) throw new Error(`Promo ${block.id} must not sit next to a table or another promo in ${article.slug}`);
  }
  if (placed.length + (article.hideDefaultCta ? 0 : 1) > 2) throw new Error(`At most two promo blocks per article: ${article.slug}`);
  if (affiliateCount > (article.noAffiliate ? 0 : 1)) throw new Error(`Too many affiliate promos in ${article.slug}`);
}
const buildDate = process.env.BLOG_BUILD_DATE || new Intl.DateTimeFormat('sv-SE', {timeZone:'Europe/Oslo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
if (!/^\d{4}-\d{2}-\d{2}$/.test(buildDate) || !Number.isFinite(Date.parse(buildDate))) throw new Error('Invalid BLOG_BUILD_DATE');
const articles = process.env.VERCEL_ENV === 'production' ? allArticles.filter(a=>a.datePublished && a.datePublished <= buildDate) : allArticles;
const publishedPaths = new Set(articles.map(a=>'/blogg/'+a.slug));
const css = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8').match(/const GLOBAL_CSS = `([\s\S]*?)`;/)?.[1];
if (!css || css.includes('${')) throw new Error('Shared styles must be a static GLOBAL_CSS template');
fs.mkdirSync(path.join(output, 'blogg'), {recursive:true});
for (const file of fs.readdirSync(path.join(output, 'blogg'))) if (file.endsWith('.html')) fs.unlinkSync(path.join(output, 'blogg', file));
fs.copyFileSync(path.join(root, 'src/blog.css'), path.join(output, 'blogg/blog.css'));
fs.writeFileSync(path.join(output, 'blogg/site.css'), css);
const imageMarkup = (a, card = false) => a.image ? `<img class="${card ? 'blog-card-image' : 'article-cover'}" src="${esc(a.image.src)}" srcset="${esc(a.image.small)} 640w, ${esc(a.image.src)} 1200w" sizes="${card ? '(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 380px' : '(max-width: 1100px) 100vw, 1100px'}" width="${a.image.width}" height="${a.image.height}" alt="${card ? '' : esc(a.image.alt)}" ${card ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">` : '';
const logo = '/Fordelsdetektiven-fordelsjakten-logo.png';
const publisher = {'@type':'Organization','@id':`${origin}/#publisher`,name:'Fordelsjakten',url:origin,logo:{'@type':'ImageObject',url:origin+logo}};
const author = {'@type':'Organization',name:'Fordelsdetektiven',alternateName:'Fordelsjaktens redaksjonelle forfatternavn',url:`${origin}/blogg#redaksjon`};
const articleUrl = article => `${origin}/blogg/${article.slug}`;
const dateLabel = date => new Intl.DateTimeFormat('nb-NO', {day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(date));
const breadcrumbs = article => ({'@type':'BreadcrumbList',itemListElement:[{name:'Forside',item:origin},{name:'Blogg',item:`${origin}/blogg`},...(article ? [{name:article.title,item:articleUrl(article)}] : [])].map((item,i)=>({'@type':'ListItem',position:i+1,...item}))});
const header = current => `<a class="skip-link" href="#innhold">Hopp til innhold</a><header class="site-header"><div class="header-inner"><a class="brand" href="/" aria-label="Fordelsjakten forside"><img src="${logo}" alt="" width="43" height="43"><span><strong>Fordelsjakten</strong><small>Finn fordelene dine</small></span></a><nav class="blog-nav" aria-label="Hovedmeny"><a href="/">Kalkulator</a><a href="/blogg" aria-current="${current}">Blogg</a></nav></div></header>`;
const footer = `<footer class="site-footer"><div class="footer-inner"><div class="footer-brand"><img src="${logo}" alt="" width="37" height="37" loading="lazy"><div><strong>Fordelsjakten</strong><p>Enkle verktøy for bedre oversikt.</p></div></div><div class="footer-links"><a href="/blogg">Blogg</a><a href="/personvern">Personvern og GDPR</a><span>© ${new Date().getUTCFullYear()} Fordelsjakten.no</span></div></div></footer>`;
function page({title, description, url, body, schemas, article}) {
  const shareImage = article?.image ? origin + article.image.share : origin + '/og-image.png';
  const shareAlt = article?.image?.alt || 'Fordelsjakten – Finn fordelene dine';
  const preview = (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') || article?.publicationPending;
  const shareTitle = article?.shareTitle || title;
  const shareDescription = article?.shareDescription || description;
  return `<!doctype html><html lang="nb"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="${preview ? 'noindex, follow' : 'index, follow, max-image-preview:large'}"><link rel="canonical" href="${esc(url)}"><meta name="theme-color" content="#20213f"><meta property="og:type" content="${article ? 'article':'website'}"><meta property="og:locale" content="nb_NO"><meta property="og:site_name" content="Fordelsjakten"><meta property="og:title" content="${esc(shareTitle)}"><meta property="og:description" content="${esc(shareDescription)}"><meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${esc(shareImage)}">${article?.image ? `<meta property="og:image:width" content="${article.image.shareWidth}"><meta property="og:image:height" content="${article.image.shareHeight}">` : ''}<meta property="og:image:alt" content="${esc(shareAlt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(shareTitle)}"><meta name="twitter:description" content="${esc(shareDescription)}"><meta name="twitter:image" content="${esc(shareImage)}">${article?.datePublished ? `<meta property="article:published_time" content="${article.datePublished}"><meta property="article:modified_time" content="${article.dateModified}">` : ''}<link rel="icon" href="/favicon.ico"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="/blogg/site.css"><link rel="stylesheet" href="/blogg/blog.css"><script type="application/ld+json">${json({'@context':'https://schema.org','@graph':schemas})}</script></head><body class="blog-page">${header(article ? 'true' : 'page')}${body}${footer}</body></html>`;
}
const categories = [...new Set(articles.map(a => a.category))].sort((a,b) => a.localeCompare(b, 'nb'));
const controls = `<div class="blog-controls" hidden><div class="blog-control-field"><label for="blog-category">Kategori</label><select id="blog-category"><option value="">Alle kategorier</option>${categories.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select></div><div class="blog-control-field"><label for="blog-sort">Sorter etter</label><select id="blog-sort"><option value="newest">Nyeste først</option><option value="oldest">Eldste først</option><option value="title">Tittel A–Å</option></select></div></div><p class="blog-result-count" role="status" aria-live="polite" hidden></p>`;
fs.copyFileSync(path.join(root, 'src/blog-index.js'), path.join(output, 'blogg/index.js'));
const cards = articles.map(a => `<article class="blog-card" data-category="${esc(a.category)}" data-date="${a.datePublished || ''}" data-title="${esc(a.title)}">${a.image ? `<a href="/blogg/${a.slug}" tabindex="-1" aria-hidden="true">${imageMarkup(a, true)}</a>` : ''}<span class="blog-category">${esc(a.category)}</span><h2><a href="/blogg/${a.slug}">${esc(a.title)}</a></h2><p>${esc(a.description)}</p><div class="card-bottom">${publication(a)}<a href="/blogg/${a.slug}" class="blog-card-link" aria-label="${esc('Les mer: ' + a.title)}">Les mer</a></div></article>`).join('');
fs.writeFileSync(path.join(output, 'blogg.html'), page({title:'Blogg – Guider og økonomisk oversikt | Fordelsjakten',description:'Enkle guider fra Fordelsjakten. Bli kjent med verktøyene våre og få bedre oversikt over tallene i hverdagen.',url:`${origin}/blogg`,schemas:[publisher,{'@type':'Blog','@id':`${origin}/blogg#blog`,name:'Fordelsjakten blogg',url:`${origin}/blogg`,inLanguage:'nb',publisher:{'@id':publisher['@id']},blogPost:articles.map(a=>({'@type':'BlogPosting',headline:a.title,url:articleUrl(a)}))},breadcrumbs()],body:`<main id="innhold" class="blog-main"><div class="blog-hero"><span class="blog-category">Fordelsjaktens blogg</span><h1>Litt mer oversikt.<br><em>Litt enklere valg.</em></h1><p>Her finner du enkle forklaringer og guider som hjelper deg å forstå tallene og bruke verktøyene våre.</p></div><section aria-labelledby="guider"><h2 id="guider" class="blog-section-title">Guider fra Fordelsjakten</h2>${controls}<div class="blog-grid">${cards}</div></section><aside class="blog-callout" id="redaksjon"><div><h2>Fra Fordelsjakten</h2><p>Fordelsjakten har redaksjonelt ansvar for bloggen. Fordelsdetektiven er vårt redaksjonelle forfatternavn, ikke en egen fagperson. Vi vil gjøre det lettere å få oversikt over egen økonomi. Her deler vi forklaringer og guider, og viser hva verktøyene våre kan hjelpe deg med.</p></div><a class="blog-button" href="/">Prøv kalkulatoren</a></aside></main><script src="/blogg/index.js" defer></script>`}));
for (const a of articles) {
  const schema = {'@type':'BlogPosting','@id':articleUrl(a)+'#article',headline:a.title,description:a.description,url:articleUrl(a),mainEntityOfPage:{'@type':'WebPage','@id':articleUrl(a)},...(a.datePublished ? {datePublished:a.datePublished,dateModified:a.dateModified} : {}),inLanguage:'nb',author,...(a.image ? {image:{'@type':'ImageObject',url:origin+a.image.src,width:a.image.width,height:a.image.height,caption:a.image.alt}} : {}),publisher:{'@id':publisher['@id']},isPartOf:{'@id':`${origin}/blogg#blog`},articleSection:a.category,articleBody:[a.intro,...(a.summary || []),...a.sections.flatMap(s=>[s.heading,...(s.blocks ? s.blocks.map(blockText).filter(text=>text !== null) : [...(s.list || []),...s.paragraphs])])].map(plainText).join('\n\n')};
  const faqItems = [];
  for (const block of a.sections.find(section=>section.id === 'ofte-stilte-sporsmal')?.blocks || []) {
    if (block.type === 'heading') faqItems.push({question:block.text,answer:[]});
    else if (block.type === 'paragraph' && faqItems.length) faqItems.at(-1).answer.push(block.text);
  }
  const faqSchema = faqItems.length ? [{'@type':'FAQPage','@id':articleUrl(a)+'#ofte-stilte-sporsmal',url:articleUrl(a),inLanguage:'nb',mainEntity:faqItems.map(item=>({'@type':'Question',name:plainText(item.question),acceptedAnswer:{'@type':'Answer',text:item.answer.map(plainText).join('\n\n')}}))}] : [];
  const toc = a.sections.map(s=>`<li><a href="#${s.id}">${esc(s.heading)}</a></li>`).join('');
  const sections = a.sections.map(section => {
    const content = section.blocks ? renderBlocks(section.blocks,section.heading) :
      (section.list ? `<ul>${section.list.map(item=>`<li>${richText(item)}</li>`).join('')}</ul>` : '') + section.paragraphs.map(p=>`<p>${richText(p)}</p>`).join('');
    return `<section id="${section.id}"><h2>${esc(section.heading)}</h2>${content}</section>`;
  }).join('');
  const summary = a.summary?.length ? `<aside class="article-summary" aria-labelledby="kort-oppsummert"><h2 id="kort-oppsummert">Kort oppsummert</h2><ul>${a.summary.map(item=>`<li>${richText(item)}</li>`).join('')}</ul></aside>` : '';
  const sources = a.sources?.length ? `<section id="kilder" class="article-sources"><h2>Kilder</h2><ul>${a.sources.map(source=>`<li><a href="${esc(safeUrl(source.url))}">${esc(source.title)}</a></li>`).join('')}</ul></section>` : '';
  const editorialNotes = a.editorialNotes?.length ? `<aside class="article-editorial-notes" aria-label="Til redaksjonell gjennomgang"><h2>Avklaringer før publisering</h2><ul>${a.editorialNotes.map(note=>`<li>${esc(note)}</li>`).join('')}</ul></aside>` : '';
  const cta = a.cta || {heading:'Klar for å prøve selv?',text:'Ta frem tallene dine og prøv kalkulatoren. Den er gratis, og du sender ikke inn noen lånesøknad.',label:'Åpne kalkulatoren',href:'/'};
  fs.writeFileSync(path.join(output,'blogg',a.slug+'.html'),page({title:a.seoTitle || `${a.title} | Fordelsjakten`,description:a.description,url:articleUrl(a),article:a,schemas:[publisher,schema,breadcrumbs(a),...faqSchema],body:`<main id="innhold" class="article-main"><nav class="breadcrumbs" aria-label="Brødsmuler"><a href="/">Forside</a><span aria-hidden="true">/</span><a href="/blogg">Blogg</a><span aria-hidden="true">/</span><span aria-current="page">${esc(a.title)}</span></nav><article><header class="article-heading"><span class="blog-category">${esc(a.category)}</span><h1>${esc(a.title)}</h1><p class="article-intro">${esc(a.intro)}</p><p class="article-meta">Av <a href="/blogg#redaksjon">Fordelsdetektiven</a> · ${a.datePublished && a.datePublished <= buildDate ? 'Publisert ' : ''}${publication(a)}${a.dateModified !== a.datePublished ? ` · Oppdatert <time datetime="${a.dateModified}">${dateLabel(a.dateModified)}</time>` : ''}</p></header>${a.image ? `<figure class="article-image">${imageMarkup(a)}<figcaption>${esc(a.image.credit)}</figcaption></figure>` : ''}<div class="article-layout"><nav class="article-toc" aria-label="I denne guiden"><h2>I denne guiden</h2><ol>${toc}</ol></nav><div class="article-body">${editorialNotes}${summary}${sections}${a.hideDefaultCta ? '' : `<aside class="article-cta"><h2>${esc(cta.heading)}</h2><p>${esc(cta.text)}</p><a class="blog-button" href="${esc(safeUrl(cta.href))}">${esc(cta.label)}</a></aside>`}${sources}<a class="back-link" href="/blogg">Alle artikler</a></div></div></article></main>`}));
}
// Preserve the site's existing entries.
const sitemap = fs.readFileSync(path.join(root,'public/sitemap.xml'),'utf8').replace('</urlset>', `<url><loc>${origin}/blogg</loc></url>\n${articles.map(a=>`<url><loc>${articleUrl(a)}</loc>${a.dateModified ? `<lastmod>${a.dateModified}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>`);
fs.writeFileSync(path.join(output,'sitemap.xml'),sitemap);
console.log(`Built blog index and ${articles.length} article(s) with static metadata and JSON-LD.`);
