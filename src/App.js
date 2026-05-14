import { useState, useEffect, useRef } from "react";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// ─── FONTS ────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const agrandir = document.createElement("link");
agrandir.href = "https://fonts.cdnfonts.com/css/agrandir";
agrandir.rel = "stylesheet";
document.head.appendChild(agrandir);

// Responsiv CSS for break-even
const style = document.createElement("style");
style.textContent = `.breakeven-mobile { display: flex !important; } .breakeven-desktop { display: none !important; } @media (min-width: 520px) { .breakeven-mobile { display: none !important; } .breakeven-desktop { display: block !important; } }`;
document.head.appendChild(style);

// ─── SEO & METADATA ───────────────────────────────────────────────────────
(function injectSEO() {
const SITE = {
title:       "Fordelsdetektiven – Betaler du mer rente enn du må?",
description: "Bruk kalkulatoren og finn ut hva du faktisk kan spare på refinansiering av forbrukslånet ditt. Gratis, uforpliktende og på under ett minutt.",
url:         "https://fordelsjakten.no",
image:       "https://fordelsjakten.no/og-image.png",
locale:      "nb_NO",
author:      "FordelsDetektiven",
keywords:    "refinansiering, forbrukslån, rente, effektiv rente, kalkulator, spare penger, lånesammenligning",
};
document.title = SITE.title;
const meta = (attrs) => {
const key = attrs.name ? `meta[name="${attrs.name}"]` : `meta[property="${attrs.property}"]`;
let el = document.querySelector(key);
if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
};
const link = (attrs) => {
const el = document.createElement("link");
Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
document.head.appendChild(el);
};
meta({ name: "description",        content: SITE.description });
meta({ name: "keywords",           content: SITE.keywords });
meta({ name: "author",             content: SITE.author });
meta({ name: "robots",             content: "index, follow" });
meta({ name: "theme-color",        content: "#2A34B8" });
meta({ name: "viewport",           content: "width=device-width, initial-scale=1, viewport-fit=cover" });
meta({ property: "og:type",        content: "website" });
meta({ property: "og:url",         content: SITE.url });
meta({ property: "og:title",       content: SITE.title });
meta({ property: "og:description", content: SITE.description });
meta({ property: "og:image",       content: SITE.image });
meta({ property: "og:image:width", content: "1200" });
meta({ property: "og:image:height",content: "630" });
meta({ property: "og:locale",      content: SITE.locale });
meta({ property: "og:site_name",   content: "Fordelsdetektiven" });
meta({ name: "twitter:card",        content: "summary_large_image" });
meta({ name: "twitter:site",        content: "@fordelsjakten" });
meta({ name: "twitter:title",       content: SITE.title });
meta({ name: "twitter:description", content: SITE.description });
meta({ name: "twitter:image",       content: SITE.image });
link({ rel: "canonical", href: SITE.url });
link({ rel: "icon",             type: "image/x-icon",  href: "/favicon.ico" });
link({ rel: "icon",             type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" });
link({ rel: "icon",             type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" });
link({ rel: "apple-touch-icon", sizes: "180x180",  href: "/apple-touch-icon.png" });
link({ rel: "manifest", href: "/site.webmanifest" });
const schemas = [
{
"@context": "https://schema.org", "@type": "WebSite",
"name": "Fordelsdetektiven", "url": SITE.url, "description": SITE.description, "inLanguage": "nb",
"potentialAction": { "@type": "SearchAction", "target": `${SITE.url}/?q={search_term_string}`, "query-input": "required name=search_term_string" },
},
{
"@context": "https://schema.org", "@type": "WebApplication",
"name": "Refinansieringskalkulator – Fordelsdetektiven", "url": SITE.url,
"description": "Gratis kalkulator som beregner månedlig og total besparelse ved refinansiering av forbrukslån, inkludert termingebyr, etableringsgebyr og break-even.",
"applicationCategory": "FinanceApplication", "operatingSystem": "All",
"offers": { "@type": "Offer", "price": "0", "priceCurrency": "NOK" },
"inLanguage": "nb", "author": { "@type": "Organization", "name": "Fordelsdetektiven", "url": SITE.url },
},
{
"@context": "https://schema.org", "@type": "FAQPage",
"mainEntity": [
{ "@type": "Question", "name": "Hva er forskjellen på nominell og effektiv rente?", "acceptedAnswer": { "@type": "Answer", "text": "Nominell rente er grunnrenten uten gebyrer. Effektiv rente inkluderer alle kostnader som termingebyr og etableringsgebyr, og viser den reelle årlige kostnaden på lånet." } },
{ "@type": "Question", "name": "Når lønner det seg å refinansiere forbrukslånet?", "acceptedAnswer": { "@type": "Answer", "text": "Refinansiering lønner seg når den effektive renten på et nytt lån er lavere enn på det eksisterende, og du rekker å tjene inn etableringsgebyret (break-even) innen lånets løpetid." } },
{ "@type": "Question", "name": "Hva er et termingebyr?", "acceptedAnswer": { "@type": "Answer", "text": "Et termingebyr er et fast månedlig administrasjonsgebyr banken tar for å forvalte lånet ditt. Det ligger typisk mellom 30 og 75 kr per måned." } },
{ "@type": "Question", "name": "Hva betyr break-even ved refinansiering?", "acceptedAnswer": { "@type": "Answer", "text": "Break-even er antall måneder det tar å tjene inn etableringsgebyret på det nye lånet. Refinansiering er lønnsomt først etter dette punktet." } },
],
},
];
schemas.forEach((schema) => {
const script = document.createElement("script");
script.type = "application/ld+json";
script.textContent = JSON.stringify(schema, null, 2);
document.head.appendChild(script);
});
})();

// ─── TYPOGRAPHY ───────────────────────────────────────────────────────────
const T = {
display: { fontFamily: "'Agrandir', 'Sora', sans-serif", fontSize: 26, fontWeight: 700, lineHeight: 1.2, letterSpacing: -0.5, color: "#1a1035" },
h1:      { fontFamily: "'Agrandir', 'Sora', sans-serif", fontSize: 22, fontWeight: 700, lineHeight: 1.25, letterSpacing: -0.3, color: "#1a1035" },
h2:      { fontFamily: "'Agrandir', 'Sora', sans-serif", fontSize: 16, fontWeight: 700, lineHeight: 1.3, color: "#1a1035" },
h3:      { fontFamily: "'Agrandir', 'Sora', sans-serif", fontSize: 14, fontWeight: 700, lineHeight: 1.4, color: "#1a1035" },
body:    { fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 400, lineHeight: 1.6, color: "#222" },
bodyMed: { fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, lineHeight: 1.5, color: "#333" },
small:   { fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, lineHeight: 1.5, color: "#555" },
label:   { fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, lineHeight: 1, letterSpacing: 0.8, textTransform: "uppercase", color: "#777" },
};

// ─── AFFILIATE DATA ───────────────────────────────────────────────────────
const AFFILIATES = [
{ id: 1, name: "Uno Finans", desc: "Sammenlign lån fra 20+ banker på 2 minutter",  tag: "Mest populær",   tagColor: "#2A34B8", url: "https://ormedlink.com/fordelsjakten-3",  icon: "🏆", cta: "Sjekk tilbud →" },
{ id: 2, name: "Motty",     desc: "Få kontroll på gjeldsspøkelset",               tag: "Som sett på TV", tagColor: "#3D47C9", url: "https://ormedlink.com/fordelsjakten-11", icon: "⚡", cta: "Søk nå →" },
{ id: 3, name: "Zensum",    desc: "Refinansier og samle lån til lavere rente",    tag: "Enkel og rask",  tagColor: "#6B78E5", url: "https://ormedlink.com/fordelsjakten-10", icon: "🔄", cta: "Se rente →" },
];

// ─── NORSK TALLFORMAT ─────────────────────────────────────────────────────
const formatNO = (num, decimals = 2) => {
if (num == null) return "–";
return num.toFixed(decimals).replace(".", ",");
};

// ─── MATH ─────────────────────────────────────────────────────────────────
function annuitet(P, rNom, n) {
const r = rNom / 100 / 12;
if (r === 0) return P / n;
return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}
function effektivRente(P, termingebyr, etablering, rNom, n) {
const monthly = annuitet(P, rNom, n) + termingebyr;
const nettoLaan = P - etablering;
if (nettoLaan <= 0) return null;
let r = rNom / 100 / 12;
for (let i = 0; i < 200; i++) {
const pv  = monthly * (1 - Math.pow(1 + r, -n)) / r;
const dpv = monthly * (n * Math.pow(1 + r, -(n + 1)) / r - (1 - Math.pow(1 + r, -n)) / (r * r));
const newR = r - (pv - nettoLaan) / dpv;
if (Math.abs(newR - r) < 1e-10) { r = newR; break; }
r = newR;
}
return (Math.pow(1 + r, 12) - 1) * 100;
}

// ─── STEPS ────────────────────────────────────────────────────────────────
const STEP_CALC   = 1;
const STEP_RESULT = 2;
const STEP_OFFERS = 3;

// ─── LOGO ─────────────────────────────────────────────────────────────────
const LOGO_B64 = "/Fordelsdetektiven-fordelsjakten-logo.png";
const LOGO_RESULT_B64 = "/Fordelsdetektiven-fordelsjakten-logo.png";

// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
const [step, setStep]             = useState(STEP_CALC);
const [variant]                   = useState(() => Math.random() < 0.5 ? "A" : "B");
const [bEmailSent, setBEmailSent] = useState(false);
const [bEmail, setBEmail]         = useState("");
const [loaded, setLoaded]         = useState(false);
const [email, setEmail]           = useState("");
const [emailSent, setEmailSent]   = useState(false);
const [showScroll, setShowScroll] = useState(false);
const scrollRef = useRef(null);

// Kalkulator
const [loanAmount,  setLoanAmount]  = useState(200000);
const [currentRate, setCurrentRate] = useState(12);
const [currentFee,  setCurrentFee]  = useState(45);
const [months,      setMonths]      = useState(60);
const [newRate,     setNewRate]     = useState(7);
const [newFee,      setNewFee]      = useState(35);
const [estab,       setEstab]       = useState(995);

useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

useEffect(() => {
const el = scrollRef.current;
if (!el) return;
const handler = () => setShowScroll(el.scrollTop > 160);
el.addEventListener("scroll", handler);
return () => el.removeEventListener("scroll", handler);
}, []);

const scrollToTop = () => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });

const n             = months;
const curMonthly    = annuitet(loanAmount, currentRate, n) + currentFee;
const newMonthly    = annuitet(loanAmount, newRate, n) + newFee;
const monthlySaving = Math.round(curMonthly - newMonthly);
const totalSaving   = Math.round(monthlySaving * n - estab);
const breakEven     = monthlySaving > 0 ? Math.ceil(estab / monthlySaving) : null;
const effNaa        = effektivRente(loanAmount, currentFee, 0, currentRate, n);
const effNy         = effektivRente(loanAmount, newFee, estab, newRate, n);
const worthIt       = totalSaving > 0 && breakEven !== null && breakEven < n;

const handleBEmailSubmit = async () => {
if (!bEmail.includes("@")) return;
try {
const formData = new FormData();
formData.append("fields[email]", bEmail);
formData.append("ml-submit", "1");
formData.append("anticsrf", "true");
await fetch("https://assets.mailerlite.com/jsonp/2333063/forms/187028110944765638/subscribe", {
method: "POST",
body: formData,
});
} catch (e) { console.error(e); }
setBEmailSent(true);
};

const handleEmailSubmit = async () => {
if (!email.includes("@")) return;
try {
const formData = new FormData();
formData.append("fields[email]", email);
formData.append("ml-submit", "1");
formData.append("anticsrf", "true");
await fetch("https://assets.mailerlite.com/jsonp/2333063/forms/187028110944765638/subscribe", {
method: "POST",
body: formData,
});
} catch (e) { console.error(e); }
setEmailSent(true);
setTimeout(() => setStep(STEP_OFFERS), 800);
};

return (
<div style={s.shell}>
<div style={s.phone}>

    {/* ── Header ── */}
    <header style={s.header}>
      <div style={s.logo}>
        <img src={LOGO_B64} style={s.logoIcon} alt="Fordelsdetektiven logo" />
        <div>
          <p style={{ ...T.h3, margin: 0 }}>Fordelsdetektiven</p>
          <p style={{ ...T.small, color: "#BC9BFE", fontWeight: 600, margin: 0 }}>Finn fordelene dine</p>
        </div>
      </div>
      <nav aria-label="Steg-indikator" style={s.stepIndicator}>
        {[1, 2, 3].map((i) => (
          <div key={i} aria-current={step === i ? "step" : undefined} style={{ ...s.stepDot, background: step >= i ? "#2A34B8" : "#e0d9ff" }} />
        ))}
      </nav>
    </header>

    {/* ── Scroll container ── */}
    <main style={s.scroll} ref={scrollRef}>

      {/* ══ STEG 1: KALKULATOR ══ */}
      {step === STEP_CALC && (
        <section aria-label="Refinansieringskalkulator" style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease 0.1s" }}>
          <div style={s.pageHero}>
            <h1 style={{ ...T.display, fontSize: 22, marginBottom: 6, marginTop: 0 }}>
              Betaler du mer rente enn du må?
            </h1>
            <p style={{ ...T.body, color: "#444", margin: 0 }}>
              Fyll inn lånebetingelsene dine og se hvor mye du kan spare. Tar bare ett minutt.
            </p>
          </div>

          {/* Nåværende lån */}
          <section aria-label="Ditt nåværende forbrukslån" style={s.calcSection}>
            <div style={s.calcHeader}>
              <div style={s.calcDot} aria-hidden="true" />
              <h2 style={{ ...T.h3, margin: 0 }}>Ditt nåværende forbrukslån</h2>
            </div>
            <SliderField label="Lånebeløp"      value={loanAmount}  min={10000} max={1000000} step={5000} display={`${loanAmount.toLocaleString("no")} kr`} onChange={setLoanAmount} />
            <SliderField label="Nominell rente"  value={currentRate} min={1}     max={30}      step={0.1}  display={`${formatNO(currentRate, 1)} %`}          onChange={setCurrentRate} />
            <SliderField label="Termingebyr"     value={currentFee}  min={0}     max={300}     step={5}    display={`${currentFee} kr/mnd`}                   onChange={setCurrentFee}  hint="Vanlig: 30–100 kr/mnd" />
            <MonthSlider value={months} onChange={setMonths} />
            <div style={s.effRow}>
              <span style={{ ...T.small, fontWeight: 500, color: "#444", display: "flex", alignItems: "center" }}>
                Effektiv rente nå
                <Tooltip text="Effektiv rente inkluderer alle gebyrer. Dette er den reelle kostnaden på lånet ditt – alltid sammenlign denne." />
              </span>
              <strong style={{ ...T.h3, color: "#2A34B8" }}>{formatNO(effNaa)} %</strong>
            </div>
          </section>

          {/* Nytt lån */}
          <section aria-label="Nytt lån" style={s.calcSection}>
            <div style={s.calcHeader}>
              <div style={{ ...s.calcDot, background: "#4caf82" }} aria-hidden="true" />
              <h2 style={{ ...T.h3, margin: 0 }}>Nytt lån – samme nedbetalingstid</h2>
            </div>
            <SliderField label="Ny nominell rente" value={newRate} min={1}   max={30}   step={0.1} display={`${formatNO(newRate, 1)} %`}          onChange={setNewRate} hint="De fleste betaler mellom 8 og 14 % i dag" />
            <SliderField label="Nytt termingebyr"  value={newFee}  min={0}   max={300}  step={5}   display={`${newFee} kr/mnd`}                   onChange={setNewFee}  hint="Vanlig: 30–100 kr/mnd" />
            <SliderField label="Etableringsgebyr"  value={estab}   min={0}   max={5000} step={50}  display={`${estab.toLocaleString("no")} kr`}   onChange={setEstab}   hint="Vanlig: 0–2 000 kr" />
            <div style={s.effRow}>
              <span style={{ ...T.small, fontWeight: 500, color: "#444", display: "flex", alignItems: "center" }}>
                Ny effektiv rente
                <Tooltip text="Effektiv rente på det nye lånet, inkludert etableringsgebyr fordelt over låneperioden. Lavere enn nå = lønnsomt." />
              </span>
              <strong style={{ ...T.h3, color: effNy != null && effNy < effNaa ? "#4caf82" : "#ff6b6b" }}>{formatNO(effNy)} %</strong>
            </div>
          </section>

          <button style={s.primaryBtn} onClick={() => setStep(STEP_RESULT)}>
            Se hvor mye du kan spare →
          </button>
        </section>
      )}

      {/* ══ STEG 2: RESULTAT + EMAIL ══ */}
      {step === STEP_RESULT && (
        <section aria-label="Ditt sparepotensial">
          <button style={s.backBtn} onClick={() => setStep(STEP_CALC)}>← Endre tall</button>

          {/* Resultat-kort */}
          <article style={{ ...s.resultCard, background: worthIt ? "linear-gradient(135deg,#1E2690,#2A34B8)" : "linear-gradient(135deg,#64748b,#94a3b8)" }}>
            {worthIt ? (
              <>
                <img src={LOGO_RESULT_B64} style={{ width: 64, height: 64, borderRadius: "50%", display: "block", margin: "0 auto 12px" }} alt="" aria-hidden="true" />
                <p style={{ ...T.body, color: "rgba(255,255,255,0.8)", textAlign: "center", marginBottom: 10, marginTop: 0 }}>
                  Hver måned kan du spare:
                </p>
                <p style={s.painNumber}>
                  {monthlySaving.toLocaleString("no")} kr
                </p>
                <div style={s.gainRow}>
                  <span aria-hidden="true" style={{ fontSize: 16 }}>👉</span>
                  <p style={{ ...T.bodyMed, color: "#fff", margin: 0 }}>
                    Du kan spare totalt{" "}
                    <strong>{totalSaving.toLocaleString("no")} kr</strong>{" "}
                    over {months >= 24 ? `${Math.round(months / 12)} år` : `${months} måneder`}
                  </p>
                </div>
                <p style={s.urgencyLine}>
                  Renten din endres ikke av seg selv. Men nå kan du gjøre noe med den.
                </p>
                <div style={s.resultStats}>
                  <div style={s.resultStat}>
                    <p style={{ ...T.label, color: "rgba(255,255,255,0.65)", marginBottom: 4, marginTop: 0 }}>Nå / mnd</p>
                    <strong style={{ fontFamily: "'Agrandir','Sora',sans-serif", fontSize: 17, fontWeight: 700, color: "#fff" }}>{Math.round(curMonthly).toLocaleString("no")} kr</strong>
                  </div>
                  <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.4)", fontSize: 20 }}>→</span>
                  <div style={s.resultStat}>
                    <p style={{ ...T.label, color: "rgba(255,255,255,0.65)", marginBottom: 4, marginTop: 0 }}>Ny / mnd</p>
                    <strong style={{ fontFamily: "'Agrandir','Sora',sans-serif", fontSize: 17, fontWeight: 700, color: "#fff" }}>{Math.round(newMonthly).toLocaleString("no")} kr</strong>
                  </div>
                </div>
                {breakEven != null && monthlySaving > 0 && (
                  <div style={s.breakEvenCard}>
                    <div style={s.breakEvenCardTop}>
                      <span aria-hidden="true" style={{ fontSize: 28 }}>⏱</span>
                      <div>
                        <p style={{ ...T.label, color: "rgba(255,255,255,0.6)", marginBottom: 4, marginTop: 0 }}>Break-even punkt</p>
                        <strong style={{ fontFamily: "'Agrandir','Sora',sans-serif", fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1, display: "block" }}>
                          {breakEven} {breakEven === 1 ? "måned" : "måneder"}
                        </strong>
                      </div>
                    </div>
                    <p style={s.breakEvenCardDesc}>
                      Etter {breakEven} {breakEven === 1 ? "måned" : "måneder"} har du tjent inn etableringsgebyret.
                    </p>
                  </div>
                )}
                <p style={s.disclaimerInResult}>
                  <span aria-hidden="true">📋</span>{" "}
                  Tallene er veiledende. De gir deg likevel et realistisk bilde på hva refinansiering kan bety for deg basert på renten du la inn. Når du har et konkret tilbud, kan du teste det i kalkulatoren.
                </p>
              </>
            ) : (
              <>
                <img src={LOGO_RESULT_B64} style={{ width: 64, height: 64, borderRadius: "50%", display: "block", margin: "0 auto 12px" }} alt="" aria-hidden="true" />
                <h2 style={{ ...T.h1, color: "#fff", textAlign: "center", marginBottom: 8, marginTop: 0 }}>
                  Med disse tallene lønner det seg ikke å bytte nå
                </h2>
                <p style={{ ...T.body, color: "rgba(255,255,255,0.75)", textAlign: "center", marginBottom: 16, marginTop: 0 }}>
                  Prøv å justere renten under nytt lån, selv små endringer kan snu regnestykket.
                </p>
                <button style={{ ...s.primaryBtn, background: "rgba(255,255,255,0.2)", boxShadow: "none", border: "1.5px solid rgba(255,255,255,0.3)" }} onClick={() => setStep(STEP_CALC)}>
                  ← Juster tallene
                </button>
              </>
            )}
          </article>

          {/* EMAIL CAPTURE – A/B */}
          {variant === "A" ? (
            <>
              <div style={s.emailCard}>
                <p aria-hidden="true" style={s.emailIcon}>📬</p>
                <h2 style={{ ...T.h2, textAlign: "center", marginBottom: 8, marginTop: 0 }}>
                  Få de 3 beste tilbudene – tilpasset ditt lån
                </h2>
                <p style={{ ...T.body, textAlign: "center", color: "#444", marginBottom: 14, marginTop: 0 }}>
                  Skriv inn e-posten din, så sender vi deg de tjenestene som passer best til din situasjon.
                </p>
                <div style={s.microFlow}>
                  <p style={s.microFlowTitle}>💡 Slik gjør du det:</p>
                  <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {["Få tilbud", "Test dem i kalkulatoren", "Se hva du faktisk sparer"].map((txt, i) => (
                      <li key={i} style={s.microFlowStep}>
                        <span aria-hidden="true" style={s.microFlowNum}>{i + 1}</span>
                        <span style={{ ...T.small, color: "#444", fontWeight: 600 }}>{txt}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                {!emailSent ? (
                  <>
                    <label htmlFor="email-a" style={{ ...T.small, color: "#555", display: "block", marginBottom: 6 }}>
                      E-postadresse
                    </label>
                    <input id="email-a" type="email" placeholder="din@epost.no" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                      style={s.emailInput} />
                    <button style={s.primaryBtn} onClick={handleEmailSubmit}>
                      Vis meg hva jeg faktisk kan spare
                    </button>
                    <p style={{ ...T.small, textAlign: "center", marginTop: 10, color: "#888" }}>
  ✅ Gratis, uforpliktende og enkelt å avslutte når som helst.{" "}
  <a
    href="/personvern.html"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: "#2A34B8",
      cursor: "pointer",
      textDecoration: "underline",
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 12
    }}
  >
    Personvernerklæring
  </a>
</p>
                  </>
                ) : (
                  <div style={s.emailConfirm}>
                    <p aria-hidden="true" style={{ fontSize: 32, marginBottom: 8 }}>✅</p>
                    <p style={{ ...T.bodyMed, color: "#4caf82", margin: 0 }}>Tusen takk! Ordner tilbud til deg nå...</p>
                  </div>
                )}
              </div>
              <button style={s.skipBtn} onClick={() => setStep(STEP_OFFERS)}>
                Fortsett uten e-post →
              </button>
            </>
          ) : (
            <button style={{ ...s.primaryBtn, marginTop: 8 }} onClick={() => setStep(STEP_OFFERS)}>
              Se mine muligheter →
            </button>
          )}
        </section>
      )}

      {/* ══ STEG 3: AFFILIATE-TILBUD ══ */}
      {step === STEP_OFFERS && (
        <section aria-label="Anbefalte lånetjenester">
          {worthIt && (
            <div style={s.summaryPill}>
              <span aria-hidden="true" style={{ fontSize: 16 }}>💰</span>
              <div style={{ flex: 1 }}>
                <p style={{ ...T.bodyMed, color: "#2A34B8", margin: 0 }}>
                  Du kan spare <strong>{monthlySaving.toLocaleString("no")} kr</strong> hver eneste måned
                </p>
                <p style={{ ...T.small, color: "#6B78E5", marginTop: 2, marginBottom: 0 }}>
                  og totalt <strong>{totalSaving.toLocaleString("no")} kr</strong>. Jo tidligere du starter, jo mer kan du spare.
                </p>
              </div>
            </div>
          )}

          <h1 style={{ ...T.h1, marginBottom: 4, marginTop: 12 }}>
            Disse 3 kan gi deg lavere rente allerede denne uken
          </h1>
          <p style={{ ...T.body, color: "#444", marginBottom: 6, marginTop: 0 }}>
            Gratis å søke, og du forplikter deg ikke til noe.
          </p>
          <p style={s.reinforceLine}>
            💡 Bruk disse for å hente et konkret lånetilbud og test det i kalkulatoren etterpå.
          </p>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {AFFILIATES.map((item, i) => (
              <li key={item.id}>
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <article style={{ ...s.affCard, ...(i === 0 ? s.affCardTop : {}) }}>
                    {i === 0 && <p style={s.topBadge}>⭐ Anbefalt for deg</p>}
                    <div style={s.affInner}>
                      <div style={s.affLeft}>
                        <span aria-hidden="true" style={s.affIcon}>{item.icon}</span>
                        <div>
                          <h3 style={{ ...T.h3, margin: 0 }}>{item.name}</h3>
                          <p style={{ ...T.small, marginTop: 2, maxWidth: 180, marginBottom: 0 }}>{item.desc}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                        <span style={{ ...T.label, background: item.tagColor + "15", color: item.tagColor, borderRadius: 8, padding: "3px 9px", fontSize: 9 }}>{item.tag}</span>
                        <span style={{ ...T.bodyMed, color: "#2A34B8", fontSize: 13 }}>{item.cta}</span>
                      </div>
                    </div>
                  </article>
                </a>
              </li>
            ))}
          </ul>

          <ul style={{ ...s.trustRow, listStyle: "none", padding: 0 }}>
            {["✅ Gratis å søke", "✅ Trygt og uforpliktende", "⚡ Ofte svar innen 24t"].map((t) => (
              <li key={t} style={{ ...T.small, color: "#555", fontSize: 11 }}>{t}</li>
            ))}
          </ul>

          <p style={{ ...s.disclaimerBox, ...T.small, color: "#888", lineHeight: 1.6 }}>
            ⚠️ Noen lenker er affiliate-lenker. Det koster deg ingenting ekstra, og vi kan motta en liten provisjon om du velger et av våre tilbud.
          </p>

          {variant === "B" && (
            <div style={s.bEmailBox}>
              {!bEmailSent ? (
                <>
                  <h2 style={{ ...T.h3, marginBottom: 6, textAlign: "center", marginTop: 0 }}>
                    📩 Send dette til meg på e-post
                  </h2>
                  <p style={{ ...T.small, color: "#666", textAlign: "center", marginBottom: 14, marginTop: 0 }}>
                    Vi sender deg oversikten over tilbudene – så har du dem når du er klar.
                  </p>
                  <label htmlFor="email-b" style={{ ...T.small, color: "#555", display: "block", marginBottom: 6 }}>
                    E-postadresse
                  </label>
                  <input id="email-b" type="email" placeholder="din@epost.no" value={bEmail}
                    onChange={(e) => setBEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleBEmailSubmit()}
                    style={s.emailInput} />
                  <button style={s.primaryBtn} onClick={handleBEmailSubmit}>
                    Send meg tilbudene
                  </button>
                  <p style={{ ...T.small, textAlign: "center", marginTop: 8, color: "#888" }}>
  🔒 Gratis og uforpliktende.{" "}
  <a
    href="/personvern.html"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: "#2A34B8",
      cursor: "pointer",
      textDecoration: "underline",
      fontFamily: "'DM Sans',sans-serif",
      fontSize: 12
    }}
  >
    Personvernerklæring
  </a>
</p>
                </>
              ) : (
                <div style={s.bEmailConfirm}>
                  <p aria-hidden="true" style={{ fontSize: 36, marginBottom: 8 }}>✅</p>
                  <h2 style={{ ...T.h3, color: "#2A34B8", textAlign: "center", marginBottom: 4, marginTop: 0 }}>
                    Tusen takk.
                  </h2>
                  <p style={{ ...T.body, color: "#666", textAlign: "center", margin: 0 }}>
                    Følg med i innboksen din.
                  </p>
                </div>
              )}
            </div>
          )}

          <button style={s.secondaryBtn} onClick={() => setStep(STEP_CALC)}>
            ← Gå tilbake til kalkulatoren
          </button>
        </section>
      )}
    </main>

    {/* ── Footer ── */}
    <footer style={s.footer}>
      <small style={{ ...T.small, color: "#aaa" }}>© 2026 Fordelsjakten.no</small>
      <a
  href="/personvern.html"
  target="_blank"
  rel="noopener noreferrer"
  style={{
    color: "#2A34B8",
    cursor: "pointer",
    textDecoration: "underline",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 12
  }}
>
  Personvern & GDPR
</a>
    </footer>

    {/* ── Scroll-to-top ── */}
    {showScroll && (
      <button aria-label="Scroll til topp" style={s.scrollTopBtn} onClick={scrollToTop}>↑</button>
    )}
  </div>

  <Analytics />
  <SpeedInsights />
</div>
);
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────
function MonthSlider({ value, onChange }) {
const MIN = 1, MAX = 120;
const displayYears = value >= 12 ? ` (${(value / 12) % 1 === 0 ? value / 12 : (value / 12).toFixed(1)} år)` : "";
const display = `${value} mnd${displayYears}`;
const snap = (raw) => {
if (raw <= 24) return Math.round(raw);
if (raw <= 60) return Math.round(raw / 3) * 3;
return Math.round(raw / 6) * 6;
};
const toPercent = (v) => ((v - MIN) / (MAX - MIN)) * 100;
const markers = [{ label: "1 mnd", val: 1 }, { label: "2 år", val: 24 }, { label: "5 år", val: 60 }, { label: "10 år", val: 120 }];
return (
<div style={{ marginBottom: 14 }}>
<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
<label htmlFor="month-slider" style={{ ...T.small, fontWeight: 600, color: "#555" }}>Nedbetalingstid</label>
<span style={{ ...T.small, fontWeight: 800, color: "#2A34B8" }}>{display}</span>
</div>
<input id="month-slider" type="range" min={MIN} max={MAX} step={1} value={value}
onChange={(e) => onChange(snap(parseInt(e.target.value)))}
style={{ width: "100%", accentColor: "#2A34B8", cursor: "pointer" }} />
<div style={{ position: "relative", height: 18, marginTop: 3 }}>
{markers.map(({ label, val }) => (
<button key={label} onClick={() => onChange(val)} style={{
position: "absolute", left: `${toPercent(val)}%`,
transform: val === MIN ? "none" : val === MAX ? "translateX(-100%)" : "translateX(-50%)",
background: "none", border: "none", padding: 0,
...T.small, fontSize: 10, color: value === val ? "#2A34B8" : "#777",
fontWeight: value === val ? 800 : 600, cursor: "pointer", whiteSpace: "nowrap",
}}>{label}</button>
))}
</div>
</div>
);
}

function Tooltip({ text }) {
const [show, setShow] = useState(false);
return (
<span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
<button aria-label="Forklaring" aria-expanded={show} onClick={() => setShow(!show)}
style={{ background: "#2A34B8", border: "none", borderRadius: "50%", width: 20, height: 20, color: "#fff", fontSize: 12, fontWeight: 900, cursor: "pointer", marginLeft: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "'Agrandir','Sora',sans-serif", flexShrink: 0, boxShadow: "0 2px 6px rgba(42,52,184,0.35)" }}>?</button>
{show && (
<div role="tooltip" style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "#2A34B8", color: "#ffffff", fontSize: 13, fontWeight: 500, borderRadius: 12, padding: "12px 14px", width: 220, zIndex: 50, lineHeight: 1.6, boxShadow: "0 8px 32px rgba(0,0,0,0.45)", fontFamily: "'DM Sans',sans-serif", border: "1px solid rgba(255,255,255,0.12)", pointerEvents: "none" }}>
{text}
<div aria-hidden="true" style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", width: 12, height: 12, background: "#2A34B8", rotate: "45deg" }} />
</div>
)}
</span>
);
}

function SliderField({ label, value, min, max, step, display, onChange, hint }) {
const id = `slider-${label.replace(/\s+/g, "-").toLowerCase()}`;
return (
<div style={{ marginBottom: 14 }}>
<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
<label htmlFor={id} style={{ ...T.small, fontWeight: 600, color: "#555" }}>{label}</label>
<span aria-live="polite" style={{ ...T.small, fontWeight: 800, color: "#2A34B8" }}>{display}</span>
</div>
<input id={id} type="range" min={min} max={max} step={step} value={value}
onChange={(e) => onChange(parseFloat(e.target.value))}
style={{ width: "100%", accentColor: "#2A34B8", cursor: "pointer" }} />
{hint && <p style={{ ...T.small, color: "#666", marginTop: 4, fontSize: 12, fontWeight: 500, marginBottom: 0 }}>{hint}</p>}
</div>
);
}

// ─── STYLES ───────────────────────────────────────────────────────────────
const s = {
shell:    { minHeight: "100vh", background: "linear-gradient(160deg,#ede9fe 0%,#ddd6fe 50%,#c4b5fd 100%)", display: "flex", alignItems: "flex-start", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: "40px 20px" },
phone:    { width: "100%", maxWidth: 680, minHeight: "100vh", background: "#f8f7ff", borderRadius: 32, border: "1.5px solid rgba(91,75,255,0.12)", boxShadow: "0 32px 80px rgba(91,75,255,0.2), 0 2px 0 rgba(255,255,255,0.9) inset", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" },
header:   { padding: "22px 22px 14px", borderBottom: "1px solid rgba(91,75,255,0.1)", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 12px rgba(42,52,184,0.07)" },
logo:     { display: "flex", alignItems: "center", gap: 10 },
logoIcon: { width: 40, height: 40, borderRadius: "50%", objectFit: "cover", display: "block" },
stepIndicator: { display: "flex", gap: 6, alignItems: "center" },
stepDot:       { width: 8, height: 8, borderRadius: "50%", transition: "background 0.3s" },
scroll:   { flex: 1, overflowY: "auto", padding: "24px 28px 32px", scrollbarWidth: "none" },
footer:   { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 22px", borderTop: "1px solid rgba(42,52,184,0.07)", background: "#fff" },
pageHero: { marginBottom: 20 },
calcSection: { background: "#fff", border: "1.5px solid rgba(91,75,255,0.1)", borderRadius: 22, padding: "16px", marginBottom: 12, boxShadow: "0 2px 12px rgba(91,75,255,0.06)" },
calcHeader:  { display: "flex", alignItems: "center", gap: 8, marginBottom: 14 },
calcDot:     { width: 10, height: 10, borderRadius: "50%", background: "#2A34B8", flexShrink: 0 },
effRow:      { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid rgba(91,75,255,0.08)" },
primaryBtn:  { width: "100%", background: "linear-gradient(135deg,#2A34B8,#3D47C9)", color: "#fff", border: "none", borderRadius: 16, padding: "15px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Agrandir','Sora',sans-serif", boxShadow: "0 4px 20px rgba(91,75,255,0.35)", marginBottom: 4 },
backBtn:     { background: "none", border: "none", color: "#2A34B8", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 16, padding: 0, fontFamily: "'DM Sans',sans-serif" },
skipBtn:     { width: "100%", background: "none", border: "none", color: "#777", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "12px 0 4px", fontFamily: "'DM Sans',sans-serif", textDecoration: "underline" },
resultCard:      { borderRadius: 24, padding: "24px 20px", marginBottom: 16 },
painNumber:      { fontFamily: "'Agrandir','Sora',sans-serif", fontSize: 42, fontWeight: 700, color: "#fff", textAlign: "center", letterSpacing: -1, marginBottom: 4, marginTop: 0, textShadow: "0 2px 12px rgba(0,0,0,0.15)" },
gainRow:         { display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "10px 14px", marginBottom: 12, border: "1px solid rgba(255,255,255,0.15)" },
urgencyLine:     { fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.65)", textAlign: "center", fontStyle: "italic", marginBottom: 16, lineHeight: 1.5 },
resultStats:     { display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.15)", borderRadius: 16, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.15)" },
resultStat:      { textAlign: "center", flex: 1 },
breakEvenCard:     { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 18, padding: "16px 18px", marginTop: 10, marginBottom: 4 },
breakEvenCardTop:  { display: "flex", alignItems: "center", gap: 14, marginBottom: 10 },
breakEvenCardDesc: { fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, margin: 0 },
disclaimerInResult: { fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: 12, lineHeight: 1.5, padding: "0 4px" },
emailCard:    { background: "#fff", border: "2px solid rgba(91,75,255,0.15)", borderRadius: 24, padding: "24px 20px", marginBottom: 8, boxShadow: "0 4px 24px rgba(91,75,255,0.1)" },
emailIcon:    { fontSize: 36, textAlign: "center", marginBottom: 12, marginTop: 0 },
emailInput:   { width: "100%", border: "1.5px solid rgba(91,75,255,0.2)", borderRadius: 14, padding: "13px 16px", fontSize: 15, fontFamily: "'DM Sans',sans-serif", color: "#1a1035", background: "#faf9ff", marginBottom: 12, boxSizing: "border-box", outline: "none" },
emailConfirm: { textAlign: "center", padding: "16px 0" },
microFlow:      { background: "rgba(42,52,184,0.05)", border: "1px solid rgba(42,52,184,0.1)", borderRadius: 14, padding: "12px 14px", marginBottom: 16 },
microFlowTitle: { fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, color: "#2A34B8", marginBottom: 10, marginTop: 0 },
microFlowStep:  { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
microFlowNum:   { width: 22, height: 22, borderRadius: "50%", background: "#2A34B8", color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Agrandir','Sora',sans-serif", flexShrink: 0 },
summaryPill:  { background: "rgba(42,52,184,0.06)", border: "1.5px solid rgba(42,52,184,0.15)", borderRadius: 18, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 4 },
reinforceLine:{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, color: "#444", background: "rgba(91,75,255,0.05)", border: "1px solid rgba(91,75,255,0.1)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, lineHeight: 1.5 },
affCard:    { background: "#fff", border: "1.5px solid rgba(91,75,255,0.1)", borderRadius: 20, padding: "16px", marginBottom: 12, boxShadow: "0 2px 12px rgba(91,75,255,0.06)", overflow: "hidden", position: "relative" },
affCardTop: { border: "2px solid #2A34B8", background: "linear-gradient(135deg,#faf9ff,#f0edff)", boxShadow: "0 4px 20px rgba(91,75,255,0.14)" },
topBadge:   { background: "linear-gradient(135deg,#2A34B8,#6B78E5)", color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: "'Agrandir','Sora',sans-serif", padding: "5px 14px", marginBottom: 12, marginTop: 0, borderRadius: 8, display: "inline-block" },
affInner:   { display: "flex", justifyContent: "space-between", alignItems: "center" },
affLeft:    { display: "flex", alignItems: "center", gap: 12 },
affIcon:    { width: 44, height: 44, background: "linear-gradient(135deg,#ede9fe,#ddd6fe)", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 },
trustRow:      { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginBottom: 16, padding: "0 4px" },
disclaimerBox: { background: "rgba(0,0,0,0.03)", borderRadius: 14, padding: "12px 14px", marginBottom: 12, marginTop: 0 },
secondaryBtn:  { width: "100%", background: "rgba(91,75,255,0.07)", color: "#2A34B8", border: "none", borderRadius: 14, padding: "13px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 20, fontFamily: "'DM Sans',sans-serif" },
bEmailBox:    { background: "#fff", border: "2px solid rgba(42,52,184,0.15)", borderRadius: 24, padding: "24px 20px", marginBottom: 12, boxShadow: "0 4px 24px rgba(42,52,184,0.08)" },
bEmailConfirm:{ textAlign: "center", padding: "8px 0 4px" },
scrollTopBtn: { position: "absolute", bottom: 24, right: 16, width: 40, height: 40, borderRadius: "50%", background: "#2A34B8", color: "#fff", border: "none", fontSize: 18, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 16px rgba(91,75,255,0.4)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center" },
};
