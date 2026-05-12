import { useState, useEffect, useRef } from "react";
import { Analytics } from '@vercel/analytics/react';

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
link({ rel: "icon",             type: "image/png", sizes: "32x32", href: "/favicon-32.png" });
link({ rel: "icon",             type: "image/png", sizes: "16x16", href: "/favicon-16.png" });
link({ rel: "apple-touch-icon", sizes: "180x180",  href: "/apple-touch-icon.png" });
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

// ─── LOGO (base64) ────────────────────────────────────────────────────────
const LOGO_B64 = "data:image/png;base64,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";
const LOGO_RESULT_B64 = "data:image/png;base64,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";

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
const [showPrivacy, setShowPrivacy] = useState(false);
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
                      <button onClick={() => setShowPrivacy(true)} style={{ background: "none", border: "none", color: "#2A34B8", cursor: "pointer", textDecoration: "underline", fontFamily: "'DM Sans',sans-serif", fontSize: 12 }}>
                        Personvernerklæring
                      </button>
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
                    <button onClick={() => setShowPrivacy(true)} style={{ background: "none", border: "none", color: "#2A34B8", cursor: "pointer", textDecoration: "underline", fontFamily: "'DM Sans',sans-serif", fontSize: 12 }}>
                      Personvern
                    </button>
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
      <small style={{ ...T.small, color: "#aaa" }}>© 2025 Fordelsjakten.no</small>
      <button onClick={() => setShowPrivacy(true)} style={{ background: "none", border: "none", color: "#2A34B8", cursor: "pointer", textDecoration: "underline", fontFamily: "'DM Sans',sans-serif", fontSize: 12 }}>
        Personvern & GDPR
      </button>
    </footer>

    {/* ── Scroll-to-top ── */}
    {showScroll && (
      <button aria-label="Scroll til topp" style={s.scrollTopBtn} onClick={scrollToTop}>↑</button>
    )}
  </div>

  {/* ── PERSONVERN MODAL ── */}
  {showPrivacy && (
    <div role="dialog" aria-modal="true" aria-label="Personvernerklæring" style={s.privacyOverlay}>
      <div style={s.privacyCard}>
        <div style={s.privacyHeader}>
          <h2 style={{ ...T.h2, margin: 0 }}>🔒 Personvernerklæring</h2>
          <button aria-label="Lukk" style={s.privacyClose} onClick={() => setShowPrivacy(false)}>✕</button>
        </div>
        <div style={s.privacyScroll}>
          <p style={{ ...T.label, color: "#2A34B8", marginBottom: 6 }}>Sist oppdatert: Mai 2025</p>

          <h3 style={{ ...T.h3, marginBottom: 6, marginTop: 16 }}>Hvem er vi?</h3>
          <p style={{ ...T.body, marginBottom: 12, marginTop: 0 }}>Fordelsjakten.no drives av en privatperson i Norge. Vi tilbyr en gratis refinansieringskalkulator og formidler lenker til finanstjenester.</p>

          <h3 style={{ ...T.h3, marginBottom: 6, marginTop: 16 }}>Hvilke data samler vi inn?</h3>
          <p style={{ ...T.body, marginBottom: 4, marginTop: 0 }}>Vi samler kun inn e-postadresse dersom du frivillig oppgir den i skjemaet på nettsiden. Vi samler ikke inn navn, personnummer, bankopplysninger eller andre sensitive data.</p>
          <p style={{ ...T.body, marginBottom: 12, marginTop: 0 }}>Kalkulatoren lagrer ingen data – alle beregninger skjer lokalt i nettleseren din og sendes ikke til noen server.</p>

          <h3 style={{ ...T.h3, marginBottom: 6, marginTop: 16 }}>Hvorfor samler vi inn e-post?</h3>
          <p style={{ ...T.body, marginBottom: 12, marginTop: 0 }}>E-postadressen brukes til å sende deg informasjon om relevante finanstjenester og sparetips. Du kan når som helst melde deg av ved å klikke avmeld-lenken i e-posten.</p>

          <h3 style={{ ...T.h3, marginBottom: 6, marginTop: 16 }}>Hvem deler vi data med?</h3>
          <ul style={{ ...T.body, marginBottom: 12, marginTop: 0, paddingLeft: 20 }}>
            <li><strong>Kit (ConvertKit)</strong> – e-postmarkedsføring. Lagrer e-postadressen din på servere i USA.</li>
            <li><strong>Vercel</strong> – hosting av nettsiden. Kan logge IP-adresser i korte perioder.</li>
            <li><strong>Affiliate-lenker</strong> – når du klikker en lenke kan de sette egne cookies. Vi har ikke kontroll over disse.</li>
          </ul>

          <h3 style={{ ...T.h3, marginBottom: 6, marginTop: 16 }}>Dine rettigheter (GDPR)</h3>
          <ul style={{ ...T.body, marginBottom: 12, marginTop: 0, paddingLeft: 20 }}>
            <li>Se hvilke data vi har lagret om deg</li>
            <li>Kreve at data slettes</li>
            <li>Trekke tilbake samtykke når som helst</li>
            <li>Klage til Datatilsynet (datatilsynet.no)</li>
          </ul>

          <h3 style={{ ...T.h3, marginBottom: 6, marginTop: 16 }}>Cookies</h3>
          <p style={{ ...T.body, marginBottom: 12, marginTop: 0 }}>Nettsiden bruker ingen egne sporings-cookies. Vercel kan sette tekniske cookies. Affiliate-lenker kan medføre cookies fra tredjeparter.</p>

          <h3 style={{ ...T.h3, marginBottom: 6, marginTop: 16 }}>Kontakt</h3>
          <p style={{ ...T.body, marginBottom: 16, marginTop: 0 }}>Spørsmål om personvern? Ta kontakt på <strong>heia@fordelsjakten.no</strong></p>
        </div>
        <button style={{ ...s.primaryBtn, margin: "0 20px 20px" }} onClick={() => setShowPrivacy(false)}>
          Lukk
        </button>
      </div>
    </div>
  )}

  <Analytics />
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
privacyOverlay: { position: "fixed", inset: 0, background: "rgba(26,16,53,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" },
privacyCard:    { background: "#fff", borderRadius: "28px 28px 0 0", width: "100%", maxWidth: 680, maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 -8px 40px rgba(42,52,184,0.15)" },
privacyHeader:  { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 22px 16px", borderBottom: "1px solid rgba(42,52,184,0.08)" },
privacyClose:   { background: "rgba(42,52,184,0.08)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 14, color: "#2A34B8", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" },
privacyScroll:  { flex: 1, overflowY: "auto", padding: "8px 22px 8px", scrollbarWidth: "none" },
};
