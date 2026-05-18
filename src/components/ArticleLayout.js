// =============================================================
// ArticleLayout.js — Fordelsjakten artikkelmal
// Denne filen rører du ALDRI (med mindre du vil endre design
// for alle artikler samtidig).
//
// Slik bruker du den:
// 1. Kopier eksempel-artikkel.js og gi den nytt filnavn
// 2. Fyll inn innholdet ditt i const-ene
// 3. Importer ArticleLayout og send inn artikkelen som prop
//
// CTA-HIERARKI (velg én sekundær per artikkel):
//   Refinansiering/renter  → sekundaerCTA: ‘affiliate’
//   Støtteordninger/tips   → sekundaerCTA: ‘epost’
//   Produktartikler        → sekundaerCTA: ‘produkt’
// =============================================================

import React, { useEffect } from ‘react’;

// — STILER —————————————————
const styles = `
@import url(‘https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;0,800;1,400&display=swap’);

:root {
–blå: #2A34B8;
–blå-mørk: #1e27a0;
–lilla: #BC9BFE;
–lilla-lys: #EDE8FF;
–hvit: #ffffff;
–grå: #f5f5f7;
–grå-kant: #e5e7eb;
–tekst: #1a1a2e;
–tekst-lys: #6b7280;
}

.fj-artikkel * { box-sizing: border-box; margin: 0; padding: 0; }

.fj-artikkel {
font-family: ‘DM Sans’, sans-serif;
color: var(–tekst);
line-height: 1.7;
}

/* SKIP-LENKE */
.fj-skip {
position: absolute; top: -100%; left: 0;
background: var(–blå); color: var(–hvit);
padding: 8px 16px; font-size: 14px; font-weight: 700;
text-decoration: none; z-index: 9999;
}
.fj-skip:focus { top: 0; }

/* HEADER */
.fj-header {
background: var(–blå); padding: 16px 24px;
display: flex; align-items: center; justify-content: space-between;
}
.fj-logo {
display: flex; align-items: center; gap: 10px; text-decoration: none;
}
.fj-logo-ikon {
width: 36px; height: 36px; background: var(–lilla);
border-radius: 50%; display: flex; align-items: center;
justify-content: center; font-size: 18px;
}
.fj-logo-tekst { font-size: 18px; font-weight: 800; color: var(–hvit); }
.fj-nav a {
color: rgba(255,255,255,0.85); text-decoration: none;
font-size: 14px; font-weight: 500; margin-left: 20px;
}
.fj-nav a:hover { color: var(–hvit); }

/* BREADCRUMB */
.fj-breadcrumb {
padding: 14px 24px; font-size: 13px; color: var(–tekst-lys);
max-width: 720px; margin: 0 auto;
}
.fj-breadcrumb a { color: var(–blå); text-decoration: none; font-weight: 500; }
.fj-breadcrumb a:hover { text-decoration: underline; }
.fj-breadcrumb span { margin: 0 6px; color: var(–grå-kant); }

/* HERO */
.fj-hero {
background: linear-gradient(135deg, var(–blå) 0%, var(–blå-mørk) 100%);
padding: 48px 24px 64px; text-align: center;
}
.fj-kategori-tag {
display: inline-block;
background: rgba(188,155,254,0.2); color: var(–lilla);
border: 1px solid rgba(188,155,254,0.4);
padding: 4px 14px; border-radius: 20px; font-size: 12px;
font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
margin-bottom: 16px;
}
.fj-hero h1 {
font-size: clamp(24px, 5vw, 40px); font-weight: 800;
color: var(–hvit); line-height: 1.2; max-width: 640px;
margin: 0 auto 16px; letter-spacing: -0.5px;
}
.fj-meta {
color: rgba(255,255,255,0.7); font-size: 13px;
display: flex; align-items: center; justify-content: center;
gap: 16px; flex-wrap: wrap; margin-top: 16px;
}

/* BILDE */
.fj-bilde-wrap {
max-width: 720px; margin: -32px auto 0;
padding: 0 24px; position: relative; z-index: 10;
}
.fj-bilde-wrap img {
width: 100%; height: auto; border-radius: 16px; display: block;
box-shadow: 0 16px 48px rgba(42,52,184,0.15);
}

/* ARTIKKEL-CONTAINER */
.fj-container {
max-width: 680px; margin: 0 auto; padding: 40px 24px 80px;
}

/* INGRESS */
.fj-ingress {
font-size: 18px; color: #374151; line-height: 1.6;
border-left: 4px solid var(–lilla); padding-left: 20px;
margin-bottom: 36px; font-style: italic;
}

/* HØYDEPUNKT */
.fj-høydepunkt {
background: var(–lilla-lys); border-radius: 16px;
padding: 24px; margin-bottom: 32px;
}
.fj-høydepunkt-tittel {
font-size: 13px; font-weight: 700; color: var(–blå);
text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;
}
.fj-høydepunkt ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.fj-høydepunkt li {
display: flex; align-items: flex-start; gap: 10px;
font-size: 15px; color: var(–tekst);
}
.fj-høydepunkt li::before { content: ‘✓’; color: var(–blå); font-weight: 700; flex-shrink: 0; }

/* OVERSKRIFTER */
.fj-container h2 {
font-size: 22px; font-weight: 800; color: var(–tekst);
margin: 40px 0 14px; letter-spacing: -0.3px; padding-top: 8px;
}
.fj-container h3 { font-size: 17px; font-weight: 700; color: var(–tekst); margin: 24px 0 10px; }
.fj-container p { font-size: 16px; color: #374151; margin-bottom: 18px; line-height: 1.75; }

/* FAKTABOKS */
.fj-faktaboks {
background: var(–grå); border-radius: 12px;
padding: 20px 24px; margin: 28px 0; border-left: 4px solid var(–blå);
}
.fj-faktaboks-tittel {
font-size: 13px; font-weight: 700; color: var(–tekst-lys);
text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;
}
.fj-faktaboks p { font-size: 15px; margin-bottom: 0; color: var(–tekst); }

/* TALLKORT */
.fj-tall-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 28px 0; }
.fj-tall-kort { background: var(–blå); border-radius: 14px; padding: 20px; text-align: center; }
.fj-tall { font-size: 28px; font-weight: 800; color: var(–lilla); display: block; letter-spacing: -1px; }
.fj-tall-label { font-size: 13px; color: rgba(255,255,255,0.85); margin-top: 4px; display: block; }

/* CTA */
.fj-cta {
background: linear-gradient(135deg, var(–blå), var(–blå-mørk));
border-radius: 20px; padding: 32px 24px; text-align: center; margin: 40px 0;
}
.fj-cta h2 {
font-size: 20px !important; font-weight: 800 !important;
color: var(–hvit) !important; margin: 0 0 8px !important; padding-top: 0 !important;
}
.fj-cta p { color: rgba(255,255,255,0.8) !important; font-size: 15px; margin-bottom: 20px !important; }
.fj-cta-knapp {
display: inline-block; background: var(–hvit); color: var(–blå);
font-weight: 800; font-size: 15px; padding: 14px 32px;
border-radius: 50px; text-decoration: none;
transition: transform 0.2s, box-shadow 0.2s;
}
.fj-cta-knapp:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,255,255,0.2); }
.fj-tillits-linje {
display: flex; align-items: center; justify-content: center;
gap: 16px; flex-wrap: wrap; margin-top: 12px;
font-size: 12px; color: rgba(255,255,255,0.65);
}
.fj-tillits-linje span { display: flex; align-items: center; gap: 4px; }

/* E-POST FANGST — midtside */
.fj-epost-boks {
background: var(–lilla-lys); border-radius: 20px;
padding: 28px 24px; margin: 36px 0; text-align: center;
border: 2px solid #D4C4FF;
}
.fj-epost-boks h3 { font-size: 18px !important; font-weight: 800 !important; color: var(–tekst) !important; margin: 0 0 6px !important; }
.fj-epost-ingress { font-size: 14px !important; color: var(–tekst-lys) !important; margin: 0 0 16px !important; }
.fj-epost-form { display: flex; gap: 8px; max-width: 420px; margin: 0 auto 10px; flex-wrap: wrap; }
.fj-epost-input {
flex: 1; min-width: 200px; padding: 12px 16px;
border: 2px solid var(–grå-kant); border-radius: 50px;
font-size: 15px; font-family: ‘DM Sans’, sans-serif; outline: none;
}
.fj-epost-input:focus { border-color: var(–blå); }
.fj-epost-knapp {
background: var(–blå); color: var(–hvit); font-weight: 700;
font-size: 14px; padding: 12px 20px; border-radius: 50px;
border: none; cursor: pointer; font-family: ‘DM Sans’, sans-serif;
white-space: nowrap;
}
.fj-epost-knapp:hover { background: var(–blå-mørk); }
.fj-epost-samtykke { font-size: 11px !important; color: var(–tekst-lys) !important; margin: 0 !important; line-height: 1.5 !important; }
.fj-epost-samtykke a { color: var(–blå); }

/* AFFILIATE-BOKS */
.fj-affiliate {
border: 2px solid var(–lilla); border-radius: 16px;
padding: 20px 24px; margin: 28px 0; background: #faf9ff;
}
.fj-affiliate-label {
font-size: 11px; font-weight: 700; color: var(–tekst-lys);
text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; display: block;
}
.fj-affiliate h3 { font-size: 16px !important; font-weight: 800 !important; margin: 0 0 6px !important; color: var(–tekst) !important; }
.fj-affiliate-beskrivelse { font-size: 14px; color: var(–tekst-lys); margin-bottom: 0 !important; }
.fj-priseksempel {
background: var(–grå); border-radius: 10px; padding: 14px 16px;
margin: 12px 0 16px; font-size: 13px; color: var(–tekst-lys);
line-height: 1.7; border-left: 3px solid var(–blå);
}
.fj-priseksempel strong {
color: var(–tekst); display: block; font-size: 11px;
text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 6px; font-weight: 700;
}
.fj-affiliate-lenke {
display: inline-block; background: var(–blå); color: var(–hvit);
font-weight: 700; font-size: 14px; padding: 10px 20px;
border-radius: 50px; text-decoration: none;
}
.fj-affiliate-lenke:hover { background: var(–blå-mørk); }

/* PRODUKT-BOKS */
.fj-produkt {
background: linear-gradient(135deg, #1a1a2e, var(–blå));
border-radius: 16px; padding: 24px; margin: 28px 0;
display: flex; gap: 20px; align-items: center;
}
.fj-produkt-ikon { font-size: 40px; flex-shrink: 0; line-height: 1; }
.fj-produkt h3 { font-size: 16px !important; font-weight: 800 !important; color: var(–hvit) !important; margin: 0 0 6px !important; }
.fj-produkt p { font-size: 14px; color: rgba(255,255,255,0.7) !important; margin-bottom: 12px !important; }
.fj-produkt-pris {
display: inline-block; background: var(–lilla); color: var(–tekst);
font-weight: 800; font-size: 14px; padding: 8px 18px;
border-radius: 50px; text-decoration: none;
}

/* FAQ */
.fj-faq { margin: 40px 0; }
.fj-faq-item { border-bottom: 1px solid var(–grå-kant); padding: 18px 0; }
.fj-faq-item h3 { font-size: 15px !important; font-weight: 700 !important; margin: 0 0 8px !important; color: var(–tekst) !important; }
.fj-faq-item p { font-size: 14px; color: var(–tekst-lys); margin-bottom: 0 !important; line-height: 1.6; }

/* RELATERTE */
.fj-relaterte { border-top: 1px solid var(–grå-kant); padding-top: 40px; margin-top: 40px; }
.fj-relaterte h2 { font-size: 18px !important; font-weight: 800 !important; margin: 0 0 20px !important; padding-top: 0 !important; }
.fj-relaterte-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.fj-relatert-kort {
background: var(–grå); border-radius: 14px; padding: 18px;
text-decoration: none; color: var(–tekst); display: block;
border: 1.5px solid transparent; transition: all 0.2s;
}
.fj-relatert-kort:hover { border-color: var(–lilla); transform: translateY(-2px); }
.fj-relatert-tag { font-size: 11px; font-weight: 700; color: var(–blå); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block; }
.fj-relatert-kort h3 { font-size: 14px !important; font-weight: 700 !important; line-height: 1.4 !important; margin: 0 !important; color: var(–tekst) !important; }

/* FOOTER CAPTURE */
.fj-footer-capture {
background: #1a1a2e; padding: 40px 24px;
text-align: center; border-top: 3px solid var(–lilla);
}
.fj-footer-capture h3 { font-size: 18px; font-weight: 800; color: var(–hvit); margin: 0 0 6px; }
.fj-footer-capture p { font-size: 14px; color: rgba(255,255,255,0.6); margin: 0 0 16px; }
.fj-footer-capture .fj-epost-knapp { background: var(–lilla); color: var(–tekst); }
.fj-footer-capture .fj-epost-knapp:hover { background: #a87ffe; }
.fj-footer-capture .fj-epost-samtykke { color: rgba(255,255,255,0.45) !important; }
.fj-footer-capture .fj-epost-samtykke a { color: var(–lilla); }

/* FOOTER */
.fj-footer {
background: var(–blå); color: rgba(255,255,255,0.75);
text-align: center; padding: 28px 24px; font-size: 13px; line-height: 1.6;
}
.fj-footer a { color: var(–lilla); text-decoration: underline; }
.fj-footer a:hover { color: var(–hvit); }
.fj-footer-disclaimer { margin-top: 8px; font-size: 11px; opacity: 0.7; }

/* RESPONSIV */
@media (max-width: 480px) {
.fj-relaterte-grid { grid-template-columns: 1fr; }
.fj-tall-grid { grid-template-columns: 1fr; }
.fj-produkt { flex-direction: column; }
}
`;

// — KONVERTKIT FORM ID ————————————
const CONVERTKIT_FORM_ID = ‘fc5a02df26’;
const CONVERTKIT_URL = `https://app.kit.com/forms/${CONVERTKIT_FORM_ID}/subscriptions`;

// — DELKOMPONENTER ––––––––––––––––––––

// E-post skjema — gjenbrukes i midtside og footer
function EpostSkjema({ knappLabel = ‘Send meg listen →’, variant = ‘midtside’ }) {
return (
<>
<form
className=“fj-epost-form”
action={CONVERTKIT_URL}
method=“post”
aria-label=“E-postpåmelding”
style={variant === ‘footer’ ? { margin: ‘0 auto 10px’ } : {}}
>
<input
className="fj-epost-input"
type="email"
name="email_address"
placeholder="din@epost.no"
required
aria-label="E-postadresse"
autoComplete="email"
/>
<button type="submit" className="fj-epost-knapp">
{knappLabel}
</button>
</form>
{/* GDPR: Påkrevd samtykketekst — markedsføringsloven § 15 */}
<p className="fj-epost-samtykke">
Ved å sende inn godtar du at vi lagrer e-postadressen din for nyhetsbrev
fra Fordelsjakten. Meld deg av når som helst.{’ ’}
<a href="/personvern">Personvernerklæring</a>.
</p>
</>
);
}

// Affiliate-boks med juridisk påkrevd priseksempel
function AffiliateBoks({ affiliate }) {
if (!affiliate) return null;
return (
/*
* ANNONSE-MERKING: “Annonse” øverst er påkrevd av markedsføringsloven § 3.
* Merkingen MÅ være synlig uten å scrolle eller klikke “mer”.
* rel=“noopener sponsored” er påkrevd på affiliate-lenker.
*/
<aside className="fj-affiliate" aria-label="Affiliatelenke">
<span className="fj-affiliate-label">
🤝 Annonse — affiliatelenke. Fordelsjakten mottar provisjon ved klikk.
</span>
<h3>{affiliate.navn}</h3>
<p className="fj-affiliate-beskrivelse">{affiliate.beskrivelse}</p>

```
  {/*
   * REPRESENTATIVT PRISEKSEMPEL — JURIDISK PÅKREVD
   * Finansavtaleforskriften krever dette ved all kredittmarkedsføring.
   * Hent tallene fra Orion Media / partneren din før publisering.
   * Alle felt MÅ fylles ut — du kan ikke publisere uten dette.
   */}
  <div className="fj-priseksempel" role="note" aria-label="Representativt priseksempel">
    <strong>📊 Representativt priseksempel (påkrevd av finansavtaleforskriften)</strong>
    Lånebeløp: {affiliate.priseksempel.lånebeløp} ·{' '}
    Nedbetalingstid: {affiliate.priseksempel.nedbetalingstid}<br />
    Nominell rente: {affiliate.priseksempel.nominellRente} ·{' '}
    <strong style={{ color: 'var(--tekst)', display: 'inline', textTransform: 'none', letterSpacing: 0, fontSize: 'inherit' }}>
      Effektiv rente: {affiliate.priseksempel.effektivRente}
    </strong><br />
    Termingebyr: {affiliate.priseksempel.termingebyr} ·{' '}
    Etableringsgebyr: {affiliate.priseksempel.etableringsgebyr}<br />
    Månedlig kostnad: {affiliate.priseksempel.månedligKostnad} ·{' '}
    Totalt å betale: {affiliate.priseksempel.totalt}
  </div>

  <a
    href={affiliate.lenke}
    className="fj-affiliate-lenke"
    target="_blank"
    rel="noopener sponsored"
    aria-label={`Se tilbud hos ${affiliate.navn} — åpnes i ny fane`}
  >
    Se tilbud hos {affiliate.navn} →
  </a>
</aside>
```

);
}

// Produkt-boks for egne digitale produkter
function ProduktBoks({ produkt }) {
if (!produkt) return null;
/*

- EGENREKLAME-MERKING: Fordelsjakten selger dette selv.
- Selv egenreklame skal merkes tydelig (Forbrukertilsynet 2024).
  */
  return (
  <aside className="fj-produkt" aria-label="Digitalt produkt fra Fordelsjakten">
  
   <div className="fj-produkt-ikon" aria-hidden="true">{produkt.ikon}</div>
   <div>
     <h3>{produkt.navn}</h3>
     <p>{produkt.beskrivelse}</p>
     <a
       href={produkt.lenke}
       className="fj-produkt-pris"
       target="_blank"
       rel="noopener"
       aria-label={`Kjøp ${produkt.navn} for ${produkt.pris}`}
     >
       Kjøp nå — {produkt.pris} →
     </a>
   </div>

```
</aside>
```

);
}

// — HOVEDDKOMPONENT —————————————

function ArticleLayout({ artikkel }) {
const {
// SEO
tittel,
metaBeskrivelse,
ogBeskrivelse,
slug,
// Artikkelinfo
kategori,
dato,          // visningsdato, f.eks. “Mai 2026”
datoISO,       // maskinlesbar dato, f.eks. “2026-05-18”
datoEndretISO, // oppdateres hver gang du endrer artikkelen
lesetid,
// Bilde
bilde,         // { src, alt, width, height }
// Innhold
ingress,
høydepunkter,  // array av strenger
seksjoner,     // array av { tittel, avsnitt: [], faktaboks?, tallkort?, fremhevTekst? }
// CTA-hierarki
sekundaerCTA,  // ‘epost’ | ‘affiliate’ | ‘produkt’
affiliate,     // objekt — se eksempel-artikkel.js
produkt,       // objekt — se eksempel-artikkel.js
// FAQ
faq,           // array av { spørsmål, svar }
// Relaterte artikler
relaterte,     // array av { kategori, tittel, slug }
// Brødsmulesti
breadcrumb,    // array av { navn, slug }
} = artikkel;

const baseUrl = ‘https://fordelsjakten.no’;
const artikkelUrl = `${baseUrl}/artikler/${slug}`;

// Injiserer schema-markup i <head> via useEffect
useEffect(() => {
// Article schema
const articleSchema = {
‘@context’: ‘https://schema.org’,
‘@type’: ‘Article’,
headline: tittel,
description: metaBeskrivelse,
image: bilde ? {
‘@type’: ‘ImageObject’,
url: `${baseUrl}${bilde.src}`,
width: bilde.width || 1200,
height: bilde.height || 630,
} : undefined,
datePublished: datoISO,
dateModified: datoEndretISO || datoISO,
author: { ‘@type’: ‘Organization’, name: ‘Fordelsjakten’, url: baseUrl },
publisher: {
‘@type’: ‘Organization’,
name: ‘Fordelsjakten’,
logo: {
‘@type’: ‘ImageObject’,
url: `${baseUrl}/Fordelsdetektiven-fordelsjakten-logo.png`,
width: 512, height: 512,
},
},
mainEntityOfPage: { ‘@type’: ‘WebPage’, ‘@id’: artikkelUrl },
};

```
// FAQ schema
const faqSchema = faq && faq.length > 0 ? {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(({ spørsmål, svar }) => ({
    '@type': 'Question',
    name: spørsmål,
    acceptedAnswer: { '@type': 'Answer', text: svar },
  })),
} : null;

// Breadcrumb schema
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Fordelsjakten', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'Artikler', item: `${baseUrl}/artikler` },
    ...(breadcrumb || []).map((item, i) => ({
      '@type': 'ListItem',
      position: i + 3,
      name: item.navn,
      item: `${baseUrl}/artikler/${item.slug}`,
    })),
    { '@type': 'ListItem', position: (breadcrumb?.length || 0) + 3, name: tittel, item: artikkelUrl },
  ],
};

// Injiser i <head>
const injectSchema = (id, data) => {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

injectSchema('schema-article', articleSchema);
if (faqSchema) injectSchema('schema-faq', faqSchema);
injectSchema('schema-breadcrumb', breadcrumbSchema);

// Meta-tags
document.title = `${tittel} – Fordelsjakten`;
const setMeta = (name, content, prop = false) => {
  const attr = prop ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
  el.setAttribute('content', content);
};
const setLink = (rel, href) => {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
  el.setAttribute('href', href);
};

setMeta('description', metaBeskrivelse);
setLink('canonical', artikkelUrl);
setMeta('og:title', tittel, true);
setMeta('og:description', ogBeskrivelse || metaBeskrivelse, true);
setMeta('og:url', artikkelUrl, true);
setMeta('og:type', 'article', true);
setMeta('og:site_name', 'Fordelsjakten', true);
setMeta('og:locale', 'nb_NO', true);
if (bilde) {
  setMeta('og:image', `${baseUrl}${bilde.src}`, true);
  setMeta('og:image:width', String(bilde.width || 1200), true);
  setMeta('og:image:height', String(bilde.height || 630), true);
}
setMeta('twitter:card', 'summary_large_image');
setMeta('twitter:title', tittel);
setMeta('twitter:description', ogBeskrivelse || metaBeskrivelse);
if (bilde) setMeta('twitter:image', `${baseUrl}${bilde.src}`);

// Rydd opp ved unmount
return () => {
  ['schema-article', 'schema-faq', 'schema-breadcrumb'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
};
```

}, [artikkel]); // eslint-disable-line

return (
<>
{/* Injiser stiler én gang */}
<style>{styles}</style>

```
  <div className="fj-artikkel">
    {/* SKIP-LENKE */}
    <a href="#fj-innhold" className="fj-skip">Hopp til innhold</a>

    {/* HEADER */}
    <header className="fj-header">
      <a href="/" className="fj-logo" aria-label="Fordelsjakten — tilbake til forsiden">
        <div className="fj-logo-ikon" aria-hidden="true">🕵️</div>
        <span className="fj-logo-tekst">Fordelsjakten</span>
      </a>
      <nav className="fj-nav" aria-label="Hovedmeny">
        <a href="/kalkulator">Kalkulator</a>
        <a href="/artikler" aria-current="page">Artikler</a>
      </nav>
    </header>

    {/* BREADCRUMB */}
    <nav className="fj-breadcrumb" aria-label="Brødsmulesti">
      <a href="/">Fordelsjakten</a>
      <span aria-hidden="true">›</span>
      <a href="/artikler">Artikler</a>
      {(breadcrumb || []).map((item) => (
        <React.Fragment key={item.slug}>
          <span aria-hidden="true">›</span>
          <a href={`/artikler/${item.slug}`}>{item.navn}</a>
        </React.Fragment>
      ))}
      <span aria-hidden="true">›</span>
      <span aria-current="page">{tittel}</span>
    </nav>

    {/* HERO */}
    <div className="fj-hero">
      <span className="fj-kategori-tag" aria-label={`Kategori: ${kategori}`}>
        {kategori}
      </span>
      <h1>{tittel}</h1>
      <div className="fj-meta" aria-label="Artikkelinfo">
        <span>🕵️ Fordelsdetektiven</span>
        <span><time dateTime={datoISO}>{dato}</time></span>
        <span>⏱️ {lesetid} min lesing</span>
      </div>
    </div>

    {/* ARTIKKELBILDE */}
    {bilde && (
      <div className="fj-bilde-wrap">
        <img
          src={bilde.src}
          alt={bilde.alt}
          width={bilde.width || 720}
          height={bilde.height || 400}
          loading="eager"
        />
      </div>
    )}

    {/* HOVEDINNHOLD */}
    <main id="fj-innhold">
      <article className="fj-container" aria-labelledby="fj-tittel">

        {/* INGRESS */}
        <p className="fj-ingress">{ingress}</p>

        {/* HØYDEPUNKT-BOKS */}
        {høydepunkter && høydepunkter.length > 0 && (
          <div className="fj-høydepunkt" role="note" aria-label="Hovedpunkter i artikkelen">
            <p className="fj-høydepunkt-tittel">🔍 Det viktigste i denne artikkelen</p>
            <ul>
              {høydepunkter.map((punkt, i) => (
                <li key={i}>{punkt}</li>
              ))}
            </ul>
          </div>
        )}

        {/*
         * SEKSJONER
         * Hver seksjon kan ha: tittel, avsnitt[], faktaboks?, tallkort?, fremhevTekst?
         * Etter seksjon 2 kommer sekundær CTA (e-post, affiliate eller produkt).
         * Etter seksjon 3 kommer primær CTA (kalkulator — alltid med).
         */}
        {(seksjoner || []).map((seksjon, i) => (
          <React.Fragment key={i}>
            <h2>{seksjon.tittel}</h2>

            {(seksjon.avsnitt || []).map((tekst, j) => (
              <p key={j}>{tekst}</p>
            ))}

            {seksjon.faktaboks && (
              <aside className="fj-faktaboks" aria-label="Faktaboks">
                <p className="fj-faktaboks-tittel">{seksjon.faktaboks.tittel}</p>
                <p>{seksjon.faktaboks.tekst}</p>
              </aside>
            )}

            {seksjon.tallkort && seksjon.tallkort.length === 2 && (
              <div className="fj-tall-grid" role="region" aria-label="Sammenligning">
                {seksjon.tallkort.map((kort, k) => (
                  <div className="fj-tall-kort" key={k}>
                    <span className="fj-tall">{kort.tall}</span>
                    <span className="fj-tall-label">{kort.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/*
             * SEKUNDÆR CTA — plasseres etter seksjon 2 (index 1)
             * Velg én type i artikkelen — se CTA-hierarki øverst i filen
             */}
            {i === 1 && sekundaerCTA === 'epost' && (
              <aside className="fj-epost-boks" aria-label="Meld deg på nyhetsbrev">
                <h3>🎁 Få gratis sjekkliste: 10 fordeler du kanskje går glipp av</h3>
                <p className="fj-epost-ingress">
                  Vi sender deg listen med én gang. Ingen spam — bare nyttig innhold.
                </p>
                <EpostSkjema knappLabel="Send meg listen →" />
              </aside>
            )}

            {i === 1 && sekundaerCTA === 'affiliate' && (
              <AffiliateBoks affiliate={affiliate} />
            )}

            {i === 1 && sekundaerCTA === 'produkt' && (
              <ProduktBoks produkt={produkt} />
            )}

            {/*
             * PRIMÆR CTA — alltid med, etter seksjon 3 (index 2)
             * Peker alltid til kalkulatoren — din affiliate-motor
             */}
            {i === 2 && (
              <section className="fj-cta" aria-label="Prøv kalkulatoren">
                <h2>Se hva du kan spare på 60 sekunder 💸</h2>
                <p>Legg inn lånet ditt — kalkulatoren viser deg svaret med én gang.</p>
                <a href="/" className="fj-cta-knapp" aria-label="Start refinansieringskalkulatoren">
                  Se hva du kan spare →
                </a>
                <div className="fj-tillits-linje" aria-label="Tillitsinformasjon">
                  <span>🔒 Gratis</span>
                  <span>✓ Ingen registrering</span>
                  <span>✓ Uforpliktende</span>
                </div>
              </section>
            )}
          </React.Fragment>
        ))}

        {/* FAQ */}
        {faq && faq.length > 0 && (
          <section className="fj-faq" aria-labelledby="fj-faq-tittel">
            <h2 id="fj-faq-tittel">Ofte stilte spørsmål</h2>
            {faq.map(({ spørsmål, svar }, i) => (
              <div className="fj-faq-item" key={i}>
                <h3>{spørsmål}</h3>
                <p>{svar}</p>
              </div>
            ))}
          </section>
        )}

        {/* RELATERTE ARTIKLER */}
        {relaterte && relaterte.length > 0 && (
          <nav className="fj-relaterte" aria-label="Relaterte artikler">
            <h2>Les også</h2>
            <div className="fj-relaterte-grid">
              {relaterte.map((art) => (
                <a
                  key={art.slug}
                  href={`/artikler/${art.slug}`}
                  className="fj-relatert-kort"
                >
                  <span className="fj-relatert-tag">{art.kategori}</span>
                  <h3>{art.tittel}</h3>
                </a>
              ))}
            </div>
          </nav>
        )}

      </article>
    </main>

    {/* FOOTER E-POST CAPTURE — siste sjanse */}
    <section className="fj-footer-capture" aria-label="Meld deg på nyhetsbrev">
      <h3>Vil du ha flere tips som dette? 💸</h3>
      <p>Fordelsdetektiven sender deg de beste sparetipsene rett i innboksen. Gratis.</p>
      <EpostSkjema knappLabel="Ja takk →" variant="footer" />
    </section>

    {/* FOOTER */}
    <footer className="fj-footer">
      <p>
        © 2026 Fordelsjakten ·{' '}
        <a href="/personvern">Personvern</a> ·{' '}
        heia@fordelsjakten.no
      </p>
      <p className="fj-footer-disclaimer">
        Innholdet er veiledende og ikke finansiell rådgivning.
        Noen lenker kan være affiliatelenker — dette påvirker ikke vår redaksjonelle vurdering.
      </p>
    </footer>

  </div>
</>
```

);
}

export default ArticleLayout;