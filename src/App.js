import { useEffect, useMemo, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const LOGO = "/Fordelsdetektiven-fordelsjakten-logo.png";

const SITE = {
  title: "Fordelsjakten – Se hva en lavere rente kan bety",
  description:
    "Bruk refinansieringskalkulatoren og se hva en lavere rente kan bety for månedsbeløpet og den totale kostnaden. Gratis og uforpliktende.",
  url: "https://fordelsjakten.no",
  image: "https://fordelsjakten.no/og-image.png",
};

const AFFILIATES = [
  {
    id: 1,
    name: "Uno Finans",
    desc: "Sammenlign lån fra 20+ banker med én søknad.",
    url: "https://ormedlink.com/fordelsjakten-3",
    cta: "Sjekk tilbud hos Uno Finans",
    effRente: "10,94",
    tag: "Bred sammenligning",
    renteeksempel:
      "Renteeksempel: 300 000 kr over 5 år med 10,10 % nominell og 10,94 % effektiv rente koster 85 133 kr. Totalt tilbakebetalt: 385 133 kr.",
  },
  {
    id: 2,
    name: "Motty",
    desc: "Sammenlign muligheter for å samle og refinansiere gjeld.",
    url: "https://ormedlink.com/fordelsjakten-11",
    cta: "Søk hos Motty",
    effRente: "14,44",
    tag: "Samle gjeld",
    renteeksempel:
      "Renteeksempel: 160 000 kr over 5 år med 14,44 % effektiv rente koster 60 688 kr. Totalt tilbakebetalt: 220 688 kr. Nominell rente 6–23 %.",
  },
  {
    id: 3,
    name: "Zensum",
    desc: "Sammenlign refinansiering og samle flere lån i ett.",
    url: "https://ormedlink.com/fordelsjakten-10",
    cta: "Se renten hos Zensum",
    effRente: "11,46",
    tag: "Refinansiering",
    renteeksempel:
      "Renteeksempel: 150 000 kr over 5 år med 10,90 % nominell og 11,46 % effektiv rente, 0 kr i gebyr. Totalkostnad: 195 240 kr, som er 3 254 kr per måned.",
  },
];

const FAQS = [
  {
    q: "Hva er forskjellen på nominell og effektiv rente?",
    a: "Nominell rente er grunnrenten. Effektiv rente inkluderer også gebyrer og viser derfor den reelle årlige kostnaden. Det er den effektive renten du bør bruke når du sammenligner lån.",
  },
  {
    q: "Når kan det lønne seg å refinansiere?",
    a: "Det kan lønne seg når den nye totale lånekostnaden er lavere enn den du har i dag. Husk å ta med etableringsgebyr, termingebyr og hvor lang tid du har igjen av lånet.",
  },
  {
    q: "Hva betyr break-even?",
    a: "Break-even viser hvor mange måneder det tar før den månedlige besparelsen har dekket etableringsgebyret på det nye lånet.",
  },
];

const STEP_CALC = 1;
const STEP_RESULT = 2;
const STEP_OFFERS = 3;

function ensureHeadAssets() {
  if (!document.querySelector('link[data-fordelsjakten-fonts="true"]')) {
    const preconnectGoogle = document.createElement("link");
    preconnectGoogle.rel = "preconnect";
    preconnectGoogle.href = "https://fonts.googleapis.com";
    preconnectGoogle.dataset.fordelsjaktenFonts = "true";
    document.head.appendChild(preconnectGoogle);

    const preconnectStatic = document.createElement("link");
    preconnectStatic.rel = "preconnect";
    preconnectStatic.href = "https://fonts.gstatic.com";
    preconnectStatic.crossOrigin = "anonymous";
    preconnectStatic.dataset.fordelsjaktenFonts = "true";
    document.head.appendChild(preconnectStatic);

    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Manrope:wght@400;500;600;700;800&display=swap";
    fontLink.dataset.fordelsjaktenFonts = "true";
    document.head.appendChild(fontLink);
  }

  if (!document.getElementById("fordelsjakten-global-styles")) {
    const style = document.createElement("style");
    style.id = "fordelsjakten-global-styles";
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
  }
}

function upsertMeta(selector, attributes) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function upsertLink(rel, href, extra = {}) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
  Object.entries(extra).forEach(([key, value]) => element.setAttribute(key, value));
}

function injectSEO() {
  document.title = SITE.title;

  upsertMeta('meta[name="description"]', {
    name: "description",
    content: SITE.description,
  });
  upsertMeta('meta[name="robots"]', { name: "robots", content: "index, follow" });
  upsertMeta('meta[name="theme-color"]', { name: "theme-color", content: "#20213f" });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: SITE.url });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: SITE.title });
  upsertMeta('meta[property="og:description"]', {
    property: "og:description",
    content: SITE.description,
  });
  upsertMeta('meta[property="og:image"]', { property: "og:image", content: SITE.image });
  upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: "nb_NO" });
  upsertMeta('meta[property="og:site_name"]', {
    property: "og:site_name",
    content: "Fordelsjakten",
  });
  upsertMeta('meta[name="twitter:card"]', {
    name: "twitter:card",
    content: "summary_large_image",
  });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: SITE.title });
  upsertMeta('meta[name="twitter:description"]', {
    name: "twitter:description",
    content: SITE.description,
  });
  upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: SITE.image });

  upsertLink("canonical", SITE.url);
  upsertLink("icon", "/favicon.ico", { type: "image/x-icon" });
  upsertLink("apple-touch-icon", "/apple-touch-icon.png", { sizes: "180x180" });
  upsertLink("manifest", "/site.webmanifest");

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Fordelsjakten",
      url: SITE.url,
      description: SITE.description,
      inLanguage: "nb",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Refinansieringskalkulator – Fordelsjakten",
      url: SITE.url,
      description:
        "Gratis kalkulator som estimerer månedlig og total besparelse ved refinansiering av forbrukslån.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      offers: { "@type": "Offer", price: "0", priceCurrency: "NOK" },
      inLanguage: "nb",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  let schemaScript = document.getElementById("fordelsjakten-schema");
  if (!schemaScript) {
    schemaScript = document.createElement("script");
    schemaScript.id = "fordelsjakten-schema";
    schemaScript.type = "application/ld+json";
    document.head.appendChild(schemaScript);
  }
  schemaScript.textContent = JSON.stringify(schemas);
}

function annuitet(principal, nominalRate, months) {
  const monthlyRate = nominalRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

function effektivRente(principal, monthlyFee, establishmentFee, nominalRate, months) {
  const monthlyPayment = annuitet(principal, nominalRate, months) + monthlyFee;
  const netLoan = principal - establishmentFee;
  if (netLoan <= 0) return null;

  let rate = nominalRate / 100 / 12;
  for (let i = 0; i < 200; i += 1) {
    const pv = (monthlyPayment * (1 - Math.pow(1 + rate, -months))) / rate;
    const dpv =
      monthlyPayment *
      ((months * Math.pow(1 + rate, -(months + 1))) / rate -
        (1 - Math.pow(1 + rate, -months)) / (rate * rate));
    const nextRate = rate - (pv - netLoan) / dpv;
    if (!Number.isFinite(nextRate)) return null;
    if (Math.abs(nextRate - rate) < 1e-10) {
      rate = nextRate;
      break;
    }
    rate = nextRate;
  }

  return (Math.pow(1 + rate, 12) - 1) * 100;
}

function formatNO(number, decimals = 2) {
  if (number == null || !Number.isFinite(number)) return "–";
  return number.toLocaleString("nb-NO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatKr(number) {
  if (!Number.isFinite(number)) return "–";
  return `${Math.round(number).toLocaleString("nb-NO")} kr`;
}

function getStableVariant() {
  try {
    const existing = window.sessionStorage.getItem("fordelsjakten-email-variant");
    if (existing === "A" || existing === "B") return existing;
    const next = Math.random() < 0.5 ? "A" : "B";
    window.sessionStorage.setItem("fordelsjakten-email-variant", next);
    return next;
  } catch {
    return "A";
  }
}

export default function App() {
  const [step, setStep] = useState(STEP_CALC);
  const [variant] = useState(getStableVariant);
  const [showScroll, setShowScroll] = useState(false);

  const [loanAmount, setLoanAmount] = useState(200000);
  const [currentRate, setCurrentRate] = useState(12);
  const [currentFee, setCurrentFee] = useState(45);
  const [months, setMonths] = useState(60);
  const [newRate, setNewRate] = useState(7);
  const [newFee, setNewFee] = useState(35);
  const [establishmentFee, setEstablishmentFee] = useState(995);

  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState("idle");
  const [emailError, setEmailError] = useState("");
  const [offerEmail, setOfferEmail] = useState("");
  const [offerEmailState, setOfferEmailState] = useState("idle");
  const [offerEmailError, setOfferEmailError] = useState("");

  useEffect(() => {
    ensureHeadAssets();
    injectSEO();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const pageHeight = document.documentElement.scrollHeight;
      const nearFooter = window.scrollY + window.innerHeight > pageHeight - 260;
      setShowScroll(window.scrollY > 900 && !nearFooter);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const calculation = useMemo(() => {
    const currentMonthly = annuitet(loanAmount, currentRate, months) + currentFee;
    const proposedMonthly = annuitet(loanAmount, newRate, months) + newFee;
    const monthlyDifference = currentMonthly - proposedMonthly;
    const monthlySaving = Math.round(monthlyDifference);
    const totalSaving = Math.round(monthlyDifference * months - establishmentFee);
    const breakEven = monthlyDifference > 0 ? Math.ceil(establishmentFee / monthlyDifference) : null;
    const currentEffective = effektivRente(loanAmount, currentFee, 0, currentRate, months);
    const proposedEffective = effektivRente(
      loanAmount,
      newFee,
      establishmentFee,
      newRate,
      months,
    );
    const worthIt =
      totalSaving > 0 && breakEven !== null && breakEven < months && monthlyDifference > 0;

    return {
      currentMonthly,
      proposedMonthly,
      monthlySaving,
      totalSaving,
      breakEven,
      currentEffective,
      proposedEffective,
      worthIt,
    };
  }, [
    loanAmount,
    currentRate,
    currentFee,
    months,
    newRate,
    newFee,
    establishmentFee,
  ]);

  async function subscribe(address, setState, setError) {
    const cleanAddress = address.trim();
    if (!/^\S+@\S+\.\S+$/.test(cleanAddress)) {
      setError("Skriv inn en gyldig e-postadresse.");
      return false;
    }

    setState("loading");
    setError("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanAddress }),
      });

      if (!response.ok) throw new Error("Kunne ikke registrere e-postadressen.");
      setState("success");
      return true;
    } catch (error) {
      console.error(error);
      setState("error");
      setError("Noe gikk galt. Prøv igjen, eller fortsett uten e-post.");
      return false;
    }
  }

  async function handleResultEmailSubmit() {
    const success = await subscribe(email, setEmailState, setEmailError);
    if (success) window.setTimeout(() => setStep(STEP_OFFERS), 650);
  }

  function goToStep(nextStep) {
    setStep(nextStep);
  }

  return (
    <div className="app-shell">
      <Header step={step} />

      <main>
        {step === STEP_CALC && (
          <>
            <section className="hero-layout" aria-labelledby="calculator-title">
              <div className="hero-copy">
                <span className="eyebrow">Gratis refinansieringskalkulator</span>
                <h1 id="calculator-title">
                  Finn ut om lånet ditt kan bli <em>rimeligere.</em>
                </h1>
                <p className="hero-lead">
                  Sammenlign det du betaler i dag med et mulig nytt lån. Du får et
                  veiledende svar på månedsbeløp, total besparelse og break-even.
                </p>

                <div className="trust-list" aria-label="Fordeler med kalkulatoren">
                  <TrustItem title="Ingen BankID" text="Du trenger ikke identifisere deg." />
                  <TrustItem title="Beregnes lokalt" text="Tallene sendes ikke til oss." />
                  <TrustItem title="Tar rundt ett minutt" text="Juster tallene med enkle skyveknapper." />
                </div>

                <div className="hero-note">
                  <span className="hero-note-icon" aria-hidden="true">i</span>
                  <p>
                    Kalkulatoren gir et estimat, ikke et lånetilbud. Den hjelper deg å
                    vurdere om det er verdt å hente inn faktiske tilbud.
                  </p>
                </div>
              </div>

              <div className="calculator-card">
                <div className="card-heading">
                  <div>
                    <span className="section-kicker">Dine tall</span>
                    <h2>Beregn sparepotensialet</h2>
                  </div>
                  <span className="time-badge">ca. 1 min</span>
                </div>

                <div className="loan-sections">
                  <LoanSection
                    title="Lånet du har i dag"
                    number="1"
                    tone="current"
                    effectiveRate={calculation.currentEffective}
                    effectiveLabel="Effektiv rente nå"
                  >
                    <SliderField
                      label="Lånebeløp"
                      value={loanAmount}
                      min={10000}
                      max={1000000}
                      step={5000}
                      display={formatKr(loanAmount)}
                      onChange={setLoanAmount}
                    />
                    <SliderField
                      label="Nominell rente"
                      value={currentRate}
                      min={1}
                      max={30}
                      step={0.1}
                      display={`${formatNO(currentRate, 1)} %`}
                      onChange={setCurrentRate}
                    />
                    <SliderField
                      label="Termingebyr"
                      value={currentFee}
                      min={0}
                      max={300}
                      step={5}
                      display={`${currentFee} kr/mnd`}
                      onChange={setCurrentFee}
                      hint="Ofte 30–100 kr per måned"
                    />
                    <MonthSlider value={months} onChange={setMonths} />
                  </LoanSection>

                  <LoanSection
                    title="Et mulig nytt lån"
                    number="2"
                    tone="new"
                    effectiveRate={calculation.proposedEffective}
                    effectiveLabel="Ny effektiv rente"
                    isPositive={
                      calculation.proposedEffective != null &&
                      calculation.currentEffective != null &&
                      calculation.proposedEffective < calculation.currentEffective
                    }
                  >
                    <SliderField
                      label="Ny nominell rente"
                      value={newRate}
                      min={1}
                      max={30}
                      step={0.1}
                      display={`${formatNO(newRate, 1)} %`}
                      onChange={setNewRate}
                      hint="Bruk renten fra et konkret tilbud når du har det"
                    />
                    <SliderField
                      label="Nytt termingebyr"
                      value={newFee}
                      min={0}
                      max={300}
                      step={5}
                      display={`${newFee} kr/mnd`}
                      onChange={setNewFee}
                    />
                    <SliderField
                      label="Etableringsgebyr"
                      value={establishmentFee}
                      min={0}
                      max={5000}
                      step={50}
                      display={formatKr(establishmentFee)}
                      onChange={setEstablishmentFee}
                      hint="Legg inn hele kostnaden ved å opprette lånet"
                    />
                  </LoanSection>
                </div>

                <button className="primary-button" onClick={() => goToStep(STEP_RESULT)}>
                  Se resultatet
                  <span aria-hidden="true">→</span>
                </button>
                <p className="button-note">
                  Gratis og uforpliktende. Ingen personopplysninger er nødvendig.
                </p>
              </div>
            </section>

            <section className="how-it-works" aria-labelledby="how-title">
              <div className="section-heading">
                <span className="section-kicker">Slik bruker du resultatet</span>
                <h2 id="how-title">Fra magefølelse til et konkret regnestykke</h2>
              </div>
              <div className="steps-grid">
                <InfoStep number="1" title="Legg inn dagens lån">
                  Bruk nominell rente, termingebyr og gjenstående nedbetalingstid.
                </InfoStep>
                <InfoStep number="2" title="Test en ny rente">
                  Se hvordan en annen rente og nye gebyrer påvirker hele kostnaden.
                </InfoStep>
                <InfoStep number="3" title="Hent faktiske tilbud">
                  Sammenlign tilbudene og test de konkrete tallene i kalkulatoren.
                </InfoStep>
              </div>
            </section>

            <FaqSection />
          </>
        )}

        {step === STEP_RESULT && (
          <section className="page-section result-page" aria-labelledby="result-title">
            <button className="text-button" onClick={() => goToStep(STEP_CALC)}>
              <span aria-hidden="true">←</span> Endre tallene
            </button>

            <div className="result-layout">
              <ResultCard calculation={calculation} months={months} />

              <aside className="next-step-card">
                <span className="section-kicker">Neste steg</span>
                <h2 id="result-title">
                  {calculation.worthIt
                    ? "Sammenlign med faktiske tilbud"
                    : "Prøv et konkret tilbud før du bestemmer deg"}
                </h2>
                <p>
                  Banker vurderer rente individuelt. Derfor vet du først hva du faktisk
                  kan spare når du har mottatt et tilbud med nominell rente og alle gebyrer.
                </p>

                <div className="mini-process">
                  <div><span>1</span><p>Hent ett eller flere uforpliktende tilbud.</p></div>
                  <div><span>2</span><p>Legg tilbudets tall inn i kalkulatoren.</p></div>
                  <div><span>3</span><p>Sammenlign total kostnad, ikke bare månedsbeløpet.</p></div>
                </div>

                {variant === "A" ? (
                  <EmailCapture
                    email={email}
                    setEmail={setEmail}
                    state={emailState}
                    error={emailError}
                    onSubmit={handleResultEmailSubmit}
                    title="Få oversikten sendt på e-post"
                    description="Vi sender deg lenker til tjenestene i oversikten, så du kan fortsette når det passer."
                    buttonText="Send meg oversikten"
                  />
                ) : (
                  <button className="primary-button" onClick={() => goToStep(STEP_OFFERS)}>
                    Se mulighetene
                    <span aria-hidden="true">→</span>
                  </button>
                )}

                <button className="quiet-button" onClick={() => goToStep(STEP_OFFERS)}>
                  Fortsett uten e-post
                </button>
              </aside>
            </div>
          </section>
        )}

        {step === STEP_OFFERS && (
          <section className="page-section offers-page" aria-labelledby="offers-title">
            <button className="text-button" onClick={() => goToStep(STEP_RESULT)}>
              <span aria-hidden="true">←</span> Tilbake til resultatet
            </button>

            <div className="offers-heading">
              <div>
                <span className="eyebrow">Annonselenker</span>
                <h1 id="offers-title">Tjenester som kan hente inn lånetilbud</h1>
                <p>
                  Det er gratis og uforpliktende å søke. Et faktisk tilbud kan deretter
                  testes i kalkulatoren før du bestemmer deg.
                </p>
              </div>

              {calculation.worthIt && (
                <div className="saving-summary">
                  <span>Estimert sparepotensial</span>
                  <strong>{formatKr(calculation.monthlySaving)} / mnd</strong>
                  <small>{formatKr(calculation.totalSaving)} totalt med tallene du la inn</small>
                </div>
              )}
            </div>

            <div className="affiliate-disclosure">
              <span aria-hidden="true">i</span>
              <p>
                Fordelsjakten kan få provisjon når du klikker eller søker via lenkene.
                Det koster ikke ekstra for deg. Renteeksemplene nedenfor gjelder ulike
                lånebeløp og løpetider og kan derfor ikke brukes som en direkte rangering.
              </p>
            </div>

            <div className="offers-grid">
              {AFFILIATES.map((affiliate) => (
                <AffiliateCard key={affiliate.id} affiliate={affiliate} />
              ))}
            </div>

            {variant === "B" && (
              <div className="offers-email-wrap">
                <EmailCapture
                  email={offerEmail}
                  setEmail={setOfferEmail}
                  state={offerEmailState}
                  error={offerEmailError}
                  onSubmit={() =>
                    subscribe(offerEmail, setOfferEmailState, setOfferEmailError)
                  }
                  title="Ta vare på oversikten"
                  description="Få lenkene sendt på e-post, så slipper du å finne dem igjen senere."
                  buttonText="Send meg lenkene"
                />
              </div>
            )}

            <div className="offers-footer-actions">
              <button className="secondary-button" onClick={() => goToStep(STEP_CALC)}>
                Beregn på nytt
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {showScroll && (
        <button
          className="scroll-top"
          aria-label="Gå til toppen av siden"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      )}

      <Analytics />
      <SpeedInsights />
    </div>
  );
}

function Header({ step }) {
  const labels = ["Beregn", "Resultat", "Muligheter"];
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/" aria-label="Fordelsjakten forside">
          <img src={LOGO} alt="" />
          <span>
            <strong>Fordelsjakten</strong>
            <small>Finn fordelene dine</small>
          </span>
        </a>

        <nav className="progress" aria-label="Fremdrift">
          {labels.map((label, index) => {
            const number = index + 1;
            const active = step === number;
            const complete = step > number;
            return (
              <div
                className={`progress-step ${active ? "active" : ""} ${complete ? "complete" : ""}`}
                key={label}
                aria-current={active ? "step" : undefined}
              >
                <span>{complete ? "✓" : number}</span>
                <small>{label}</small>
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function TrustItem({ title, text }) {
  return (
    <div className="trust-item">
      <span aria-hidden="true">✓</span>
      <div>
        <strong>{title}</strong>
        <small>{text}</small>
      </div>
    </div>
  );
}

function LoanSection({
  title,
  number,
  tone,
  effectiveRate,
  effectiveLabel,
  isPositive,
  children,
}) {
  return (
    <section className={`loan-section ${tone}`} aria-label={title}>
      <div className="loan-section-heading">
        <span>{number}</span>
        <h3>{title}</h3>
      </div>
      {children}
      <div className="effective-row">
        <span>
          {effectiveLabel}
          <Tooltip text="Effektiv rente inkluderer renter og gebyrer og er det mest nyttige tallet når du sammenligner lån." />
        </span>
        <strong className={isPositive ? "positive" : ""}>{formatNO(effectiveRate)} %</strong>
      </div>
    </section>
  );
}

function SliderField({ label, value, min, max, step, display, onChange, hint }) {
  const id = `slider-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div className="field-group">
      <div className="field-label-row">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{display}</output>
      </div>
      <input
        id={id}
        className="range-input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ "--range-progress": `${progress}%` }}
      />
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

function MonthSlider({ value, onChange }) {
  const min = 1;
  const max = 120;
  const progress = ((value - min) / (max - min)) * 100;
  const years = value / 12;
  const display =
    value < 12
      ? `${value} mnd`
      : `${value} mnd (${Number.isInteger(years) ? years : years.toFixed(1)} år)`;

  function snap(raw) {
    if (raw <= 24) return Math.round(raw);
    if (raw <= 60) return Math.round(raw / 3) * 3;
    return Math.round(raw / 6) * 6;
  }

  return (
    <div className="field-group month-field">
      <div className="field-label-row">
        <label htmlFor="month-slider">Gjenstående nedbetalingstid</label>
        <output htmlFor="month-slider">{display}</output>
      </div>
      <input
        id="month-slider"
        className="range-input"
        type="range"
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={(event) => onChange(snap(Number(event.target.value)))}
        style={{ "--range-progress": `${progress}%` }}
      />
      <div className="range-markers" aria-hidden="true">
        <span>1 mnd</span>
        <span>5 år</span>
        <span>10 år</span>
      </div>
    </div>
  );
}

function Tooltip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="tooltip-wrap">
      <button
        type="button"
        className="tooltip-button"
        aria-label="Vis forklaring"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        ?
      </button>
      {open && (
        <span className="tooltip-content" role="tooltip">
          {text}
        </span>
      )}
    </span>
  );
}

function InfoStep({ number, title, children }) {
  return (
    <article className="info-step">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}

function FaqSection() {
  return (
    <section className="faq-section" aria-labelledby="faq-title">
      <div className="section-heading">
        <span className="section-kicker">Greit å vite</span>
        <h2 id="faq-title">Vanlige spørsmål om refinansiering</h2>
      </div>
      <div className="faq-list">
        {FAQS.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function ResultCard({ calculation, months }) {
  const period = months >= 24 ? `${formatNO(months / 12, months % 12 === 0 ? 0 : 1)} år` : `${months} måneder`;
  const modestSaving = calculation.monthlySaving < 150 || calculation.totalSaving < 3000;

  if (!calculation.worthIt) {
    return (
      <article className="result-card neutral">
        <span className="result-eyebrow">Beregnet resultat</span>
        <h1>Det nye lånet er ikke billigere med tallene du la inn.</h1>
        <p className="result-intro">
          Prøv med renten og gebyrene fra et konkret tilbud. Små forskjeller kan få stor
          effekt over flere år.
        </p>
        <div className="result-comparison">
          <ResultStat label="Dagens kostnad" value={`${formatKr(calculation.currentMonthly)} / mnd`} />
          <span aria-hidden="true">→</span>
          <ResultStat label="Ny kostnad" value={`${formatKr(calculation.proposedMonthly)} / mnd`} />
        </div>
        <p className="result-disclaimer">
          Beregningen er veiledende og forutsetter samme lånebeløp og nedbetalingstid.
        </p>
      </article>
    );
  }

  return (
    <article className={`result-card positive-card ${modestSaving ? "modest-card" : ""}`}>
      <span className="result-eyebrow">
        {modestSaving ? "Et lite sparepotensial" : "Estimert sparepotensial"}
      </span>
      <p className="result-big-number">{formatKr(calculation.monthlySaving)}</p>
      <p className="result-big-label">mindre per måned</p>
      <p className="result-intro">
        Med tallene du la inn kan den totale besparelsen bli omtrent
        <strong> {formatKr(calculation.totalSaving)}</strong> over {period}.
      </p>

      <div className="result-comparison">
        <ResultStat label="Dagens kostnad" value={`${formatKr(calculation.currentMonthly)} / mnd`} />
        <span aria-hidden="true">→</span>
        <ResultStat label="Ny kostnad" value={`${formatKr(calculation.proposedMonthly)} / mnd`} />
      </div>

      {calculation.breakEven != null && (
        <div className="break-even">
          <div>
            <span>Break-even</span>
            <strong>
              {calculation.breakEven} {calculation.breakEven === 1 ? "måned" : "måneder"}
            </strong>
          </div>
          <p>
            Etter dette har den løpende besparelsen dekket etableringsgebyret.
          </p>
        </div>
      )}

      <p className="result-disclaimer">
        Resultatet er et estimat basert på tallene du la inn. Et faktisk lånetilbud kan
        inneholde andre vilkår og kostnader.
      </p>
    </article>
  );
}

function ResultStat({ label, value }) {
  return (
    <div>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function EmailCapture({
  email,
  setEmail,
  state,
  error,
  onSubmit,
  title,
  description,
  buttonText,
}) {
  if (state === "success") {
    return (
      <div className="email-success" role="status">
        <span aria-hidden="true">✓</span>
        <div>
          <strong>Da er det ordnet.</strong>
          <p>Sjekk innboksen din om litt.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="email-capture">
      <h3>{title}</h3>
      <p>{description}</p>
      <label htmlFor={`email-${title.replace(/\s+/g, "-").toLowerCase()}`}>
        E-postadresse
      </label>
      <div className="email-row">
        <input
          id={`email-${title.replace(/\s+/g, "-").toLowerCase()}`}
          type="email"
          value={email}
          placeholder="din@epost.no"
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && onSubmit()}
          aria-invalid={Boolean(error)}
        />
        <button type="button" onClick={onSubmit} disabled={state === "loading"}>
          {state === "loading" ? "Sender …" : buttonText}
        </button>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <small>
        Ved å registrere deg godtar du at vi sender denne oversikten og relevant
        oppfølging. Du kan melde deg av når som helst. <a href="/personvern">Personvern</a>
      </small>
    </div>
  );
}

function AffiliateCard({ affiliate }) {
  return (
    <a
      className="affiliate-card"
      href={affiliate.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
    >
      <div className="affiliate-topline">
        <span className="affiliate-tag">{affiliate.tag}</span>
        <span className="ad-label">Annonselenke</span>
      </div>
      <h2>{affiliate.name}</h2>
      <p className="affiliate-desc">{affiliate.desc}</p>
      <div className="rate-example">
        <span>Renteeksempel</span>
        <strong>{affiliate.effRente} %</strong>
      </div>
      <span className="affiliate-cta">
        {affiliate.cta} <span aria-hidden="true">→</span>
      </span>
      <p className="legal-example">{affiliate.renteeksempel}</p>
    </a>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={LOGO} alt="" />
          <div>
            <strong>Fordelsjakten</strong>
            <p>Enkle verktøy for smartere økonomiske valg.</p>
          </div>
        </div>
        <div className="footer-links">
          <a href="/personvern">Personvern og GDPR</a>
          <span>© 2026 Fordelsjakten.no</span>
        </div>
      </div>
    </footer>
  );
}

const GLOBAL_CSS = `
  :root {
    --ink: #20213f;
    --ink-soft: #555872;
    --muted: #7c7f97;
    --paper: #fbfaf7;
    --surface: #ffffff;
    --surface-soft: #f4f1f8;
    --violet: #5146d8;
    --violet-dark: #3c34ae;
    --violet-light: #ece9ff;
    --coral: #f57f68;
    --green: #24745b;
    --green-soft: #e9f5ef;
    --border: rgba(32, 33, 63, 0.11);
    --shadow: 0 24px 70px rgba(44, 39, 91, 0.11);
    --radius-lg: 28px;
    --radius-md: 18px;
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    background: var(--paper);
    color: var(--ink);
    font-family: "Manrope", sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  button, input { font: inherit; }
  button, a { -webkit-tap-highlight-color: transparent; }
  a { color: inherit; }

  .app-shell { min-height: 100vh; overflow: hidden; }
  .site-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(251, 250, 247, 0.9);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(18px);
  }
  .header-inner {
    width: min(1180px, calc(100% - 40px));
    min-height: 78px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 11px;
    text-decoration: none;
  }
  .brand img { width: 43px; height: 43px; object-fit: cover; border-radius: 50%; }
  .brand span { display: flex; flex-direction: column; }
  .brand strong {
    font-family: "Bricolage Grotesque", sans-serif;
    font-size: 17px;
    line-height: 1.1;
    letter-spacing: -0.2px;
  }
  .brand small { margin-top: 3px; color: var(--muted); font-size: 11px; font-weight: 700; }

  .progress { display: flex; align-items: center; gap: 8px; }
  .progress-step { display: flex; align-items: center; gap: 7px; color: var(--muted); }
  .progress-step::after {
    content: "";
    width: 34px;
    height: 1px;
    margin: 0 3px;
    background: var(--border);
  }
  .progress-step:last-child::after { display: none; }
  .progress-step > span {
    width: 27px;
    height: 27px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    border: 1px solid var(--border);
    background: var(--surface);
    font-size: 11px;
    font-weight: 800;
  }
  .progress-step small { font-size: 11px; font-weight: 700; }
  .progress-step.active { color: var(--violet); }
  .progress-step.active > span { background: var(--violet); border-color: var(--violet); color: #fff; }
  .progress-step.complete > span { background: var(--green); border-color: var(--green); color: #fff; }

  .hero-layout {
    width: min(1180px, calc(100% - 40px));
    margin: 0 auto;
    padding: 72px 0 76px;
    display: grid;
    grid-template-columns: minmax(0, 0.83fr) minmax(570px, 1.17fr);
    gap: 72px;
    align-items: start;
    position: relative;
  }
  .hero-layout::before {
    content: "";
    position: absolute;
    width: 460px;
    height: 460px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(188,155,254,.22), transparent 68%);
    left: -260px;
    top: -80px;
    pointer-events: none;
  }
  .hero-copy { padding-top: 42px; position: sticky; top: 118px; }
  .eyebrow, .section-kicker {
    display: inline-block;
    color: var(--violet);
    font-size: 11px;
    line-height: 1;
    letter-spacing: 1.45px;
    text-transform: uppercase;
    font-weight: 800;
  }
  .hero-copy h1, .offers-heading h1 {
    max-width: 720px;
    margin: 17px 0 20px;
    font-family: "Bricolage Grotesque", sans-serif;
    font-size: clamp(43px, 5vw, 67px);
    line-height: .98;
    letter-spacing: -2.3px;
    font-weight: 650;
  }
  .hero-copy h1 em { color: var(--violet); font-style: normal; }
  .hero-lead, .offers-heading > div > p {
    max-width: 590px;
    margin: 0;
    color: var(--ink-soft);
    font-size: 17px;
    line-height: 1.75;
  }
  .trust-list { margin-top: 31px; display: grid; gap: 13px; }
  .trust-item { display: flex; align-items: flex-start; gap: 12px; }
  .trust-item > span {
    width: 25px;
    height: 25px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--green-soft);
    color: var(--green);
    font-size: 12px;
    font-weight: 900;
  }
  .trust-item div { display: flex; flex-direction: column; gap: 2px; }
  .trust-item strong { font-size: 13px; }
  .trust-item small { color: var(--muted); font-size: 11px; line-height: 1.5; }
  .hero-note {
    margin-top: 31px;
    max-width: 470px;
    padding: 15px 17px;
    display: flex;
    align-items: flex-start;
    gap: 11px;
    border: 1px solid var(--border);
    border-radius: 15px;
    background: rgba(255,255,255,.55);
  }
  .hero-note-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    background: var(--ink);
    color: #fff;
    font-size: 11px;
    font-weight: 800;
  }
  .hero-note p { margin: 0; color: var(--ink-soft); font-size: 11px; line-height: 1.65; }

  .calculator-card {
    position: relative;
    z-index: 2;
    padding: 29px;
    background: rgba(255,255,255,.9);
    border: 1px solid rgba(32,33,63,.09);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
  }
  .card-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 22px; }
  .card-heading h2, .section-heading h2, .next-step-card h2 {
    margin: 7px 0 0;
    font-family: "Bricolage Grotesque", sans-serif;
    font-size: 28px;
    line-height: 1.08;
    letter-spacing: -0.8px;
  }
  .time-badge {
    padding: 7px 10px;
    border-radius: 999px;
    background: var(--surface-soft);
    color: var(--ink-soft);
    font-size: 10px;
    font-weight: 800;
    white-space: nowrap;
  }
  .loan-sections { display: grid; gap: 14px; }
  .loan-section {
    padding: 19px;
    border: 1px solid var(--border);
    border-radius: 19px;
    background: #fff;
  }
  .loan-section.new { background: #fcfbff; border-color: rgba(81,70,216,.18); }
  .loan-section-heading { display: flex; align-items: center; gap: 9px; margin-bottom: 18px; }
  .loan-section-heading > span {
    width: 27px;
    height: 27px;
    display: grid;
    place-items: center;
    border-radius: 9px;
    background: var(--surface-soft);
    color: var(--violet);
    font-size: 10px;
    font-weight: 800;
  }
  .loan-section.new .loan-section-heading > span { background: var(--violet); color: #fff; }
  .loan-section-heading h3 { margin: 0; font-size: 13px; }
  .field-group { margin-bottom: 16px; }
  .field-label-row { display: flex; justify-content: space-between; align-items: center; gap: 18px; margin-bottom: 8px; }
  .field-label-row label { color: var(--ink-soft); font-size: 11px; font-weight: 700; }
  .field-label-row output {
    padding: 4px 8px;
    border-radius: 8px;
    background: var(--surface-soft);
    color: var(--ink);
    font-size: 11px;
    font-weight: 800;
    white-space: nowrap;
  }
  .range-input {
    width: 100%;
    height: 4px;
    margin: 5px 0 0;
    appearance: none;
    border-radius: 99px;
    background: linear-gradient(to right, var(--violet) 0 var(--range-progress), #e7e5ed var(--range-progress) 100%);
    cursor: pointer;
  }
  .range-input::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 4px solid #fff;
    border-radius: 50%;
    background: var(--violet);
    box-shadow: 0 2px 9px rgba(40,34,111,.28);
  }
  .range-input::-moz-range-thumb {
    width: 11px;
    height: 11px;
    border: 4px solid #fff;
    border-radius: 50%;
    background: var(--violet);
    box-shadow: 0 2px 9px rgba(40,34,111,.28);
  }
  .range-input:focus-visible { outline: 3px solid rgba(81,70,216,.2); outline-offset: 7px; }
  .field-hint { margin: 8px 0 0; color: var(--muted); font-size: 9.5px; line-height: 1.45; }
  .range-markers { display: flex; justify-content: space-between; margin-top: 7px; color: var(--muted); font-size: 8.5px; font-weight: 700; }
  .effective-row {
    margin-top: 4px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .effective-row > span { display: inline-flex; align-items: center; color: var(--ink-soft); font-size: 10px; font-weight: 700; }
  .effective-row > strong { color: var(--violet); font-size: 15px; }
  .effective-row > strong.positive { color: var(--green); }
  .tooltip-wrap { position: relative; display: inline-flex; }
  .tooltip-button {
    width: 18px;
    height: 18px;
    margin-left: 6px;
    padding: 0;
    border: 1px solid rgba(81,70,216,.25);
    border-radius: 50%;
    background: var(--violet-light);
    color: var(--violet);
    font-size: 10px;
    font-weight: 900;
    cursor: pointer;
  }
  .tooltip-content {
    position: absolute;
    left: 50%;
    bottom: calc(100% + 9px);
    z-index: 20;
    width: 225px;
    padding: 11px 12px;
    transform: translateX(-50%);
    border-radius: 11px;
    background: var(--ink);
    color: #fff;
    box-shadow: 0 12px 30px rgba(32,33,63,.23);
    font-size: 10px;
    font-weight: 500;
    line-height: 1.55;
  }
  .primary-button, .secondary-button, .quiet-button, .text-button, .email-row button {
    border: 0;
    cursor: pointer;
    transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
  }
  .primary-button {
    width: 100%;
    min-height: 53px;
    margin-top: 5px;
    padding: 0 19px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 15px;
    background: var(--violet);
    color: #fff;
    box-shadow: 0 12px 28px rgba(81,70,216,.25);
    font-size: 13px;
    font-weight: 800;
  }
  .primary-button:hover { transform: translateY(-1px); background: var(--violet-dark); box-shadow: 0 16px 32px rgba(81,70,216,.3); }
  .primary-button:focus-visible, .secondary-button:focus-visible, .quiet-button:focus-visible, .text-button:focus-visible, .email-row button:focus-visible { outline: 3px solid rgba(81,70,216,.25); outline-offset: 3px; }
  .button-note { margin: 10px 0 0; text-align: center; color: var(--muted); font-size: 9.5px; }

  .how-it-works, .faq-section {
    width: min(1080px, calc(100% - 40px));
    margin: 0 auto;
    padding: 78px 0;
  }
  .how-it-works { border-top: 1px solid var(--border); }
  .section-heading.centered { text-align: center; }
  .section-heading h2 { font-size: 37px; }
  .steps-grid { margin-top: 35px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
  .info-step {
    padding: 25px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: rgba(255,255,255,.65);
  }
  .info-step > span {
    width: 31px;
    height: 31px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: var(--violet-light);
    color: var(--violet);
    font-size: 11px;
    font-weight: 900;
  }
  .info-step h3 { margin: 23px 0 8px; font-family: "Bricolage Grotesque", sans-serif; font-size: 19px; }
  .info-step p { margin: 0; color: var(--ink-soft); font-size: 12px; line-height: 1.7; }

  .faq-section { padding-top: 35px; display: grid; grid-template-columns: .78fr 1.22fr; gap: 70px; align-items: start; }
  .faq-list { border-top: 1px solid var(--border); }
  .faq-list details { border-bottom: 1px solid var(--border); }
  .faq-list summary {
    padding: 20px 34px 20px 0;
    position: relative;
    list-style: none;
    cursor: pointer;
    font-family: "Bricolage Grotesque", sans-serif;
    font-size: 16px;
    font-weight: 650;
  }
  .faq-list summary::-webkit-details-marker { display: none; }
  .faq-list summary::after { content: "+"; position: absolute; right: 4px; top: 18px; color: var(--violet); font-size: 22px; font-weight: 400; }
  .faq-list details[open] summary::after { content: "–"; }
  .faq-list details p { margin: -4px 40px 20px 0; color: var(--ink-soft); font-size: 12px; line-height: 1.75; }

  .page-section { width: min(1100px, calc(100% - 40px)); margin: 0 auto; padding: 56px 0 90px; }
  .text-button {
    padding: 7px 0;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    color: var(--violet);
    font-size: 11px;
    font-weight: 800;
  }
  .result-layout { margin-top: 24px; display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(350px, .92fr); gap: 20px; align-items: start; }
  .result-card, .next-step-card {
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
  }
  .result-card { min-height: 610px; padding: clamp(30px, 5vw, 55px); display: flex; flex-direction: column; }
  .positive-card { background: linear-gradient(145deg, #26284e 0%, #343561 100%); color: #fff; }
  .result-card.neutral { background: #fff; }
  .result-eyebrow { color: rgba(255,255,255,.62); font-size: 10px; letter-spacing: 1.4px; text-transform: uppercase; font-weight: 800; }
  .result-card.neutral .result-eyebrow { color: var(--violet); }
  .result-card.neutral h1 {
    margin: 23px 0 16px;
    font-family: "Bricolage Grotesque", sans-serif;
    font-size: clamp(35px, 5vw, 52px);
    line-height: 1.03;
    letter-spacing: -1.5px;
  }
  .result-big-number {
    margin: 45px 0 0;
    font-family: "Bricolage Grotesque", sans-serif;
    font-size: clamp(64px, 9vw, 94px);
    line-height: .85;
    letter-spacing: -3px;
    font-weight: 700;
  }
  .result-big-label { margin: 15px 0 0; color: rgba(255,255,255,.66); font-size: 13px; font-weight: 700; }
  .result-intro { margin: 34px 0 0; color: rgba(255,255,255,.74); font-size: 14px; line-height: 1.75; }
  .result-card.neutral .result-intro { color: var(--ink-soft); }
  .result-intro strong { color: #fff; }
  .result-comparison {
    margin-top: 32px;
    padding: 18px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 18px;
    border: 1px solid rgba(255,255,255,.13);
    border-radius: 17px;
    background: rgba(255,255,255,.06);
  }
  .result-card.neutral .result-comparison { border-color: var(--border); background: var(--surface-soft); }
  .result-comparison > div { display: flex; flex-direction: column; gap: 5px; }
  .result-comparison > div:last-child { text-align: right; }
  .result-comparison small { color: rgba(255,255,255,.55); font-size: 9px; font-weight: 700; }
  .result-card.neutral .result-comparison small { color: var(--muted); }
  .result-comparison strong { font-size: 14px; }
  .result-comparison > span { color: rgba(255,255,255,.4); }
  .result-card.neutral .result-comparison > span { color: var(--muted); }
  .break-even {
    margin-top: 14px;
    padding: 17px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    border-radius: 17px;
    background: rgba(188,155,254,.13);
    border: 1px solid rgba(188,155,254,.18);
  }
  .break-even > div { display: flex; flex-direction: column; gap: 4px; white-space: nowrap; }
  .break-even span { color: rgba(255,255,255,.55); font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  .break-even strong { font-size: 17px; }
  .break-even p { margin: 0; color: rgba(255,255,255,.65); font-size: 10px; line-height: 1.55; }
  .result-disclaimer { margin: auto 0 0; padding-top: 26px; color: rgba(255,255,255,.43); font-size: 9.5px; line-height: 1.65; }
  .result-card.neutral .result-disclaimer { color: var(--muted); }

  .next-step-card { padding: 31px; background: #fff; }
  .next-step-card h2 { font-size: 32px; }
  .next-step-card > p { margin: 15px 0 0; color: var(--ink-soft); font-size: 12px; line-height: 1.75; }
  .mini-process { margin: 24px 0; padding: 17px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); display: grid; gap: 13px; }
  .mini-process > div { display: flex; align-items: flex-start; gap: 10px; }
  .mini-process span {
    width: 22px;
    height: 22px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--violet-light);
    color: var(--violet);
    font-size: 9px;
    font-weight: 900;
  }
  .mini-process p { margin: 2px 0 0; color: var(--ink-soft); font-size: 10px; line-height: 1.5; }
  .quiet-button { width: 100%; margin-top: 9px; padding: 10px; background: transparent; color: var(--muted); font-size: 10px; font-weight: 700; text-decoration: underline; }

  .email-capture { margin-top: 5px; padding: 17px; border-radius: 17px; background: var(--surface-soft); }
  .email-capture h3 { margin: 0 0 6px; font-family: "Bricolage Grotesque", sans-serif; font-size: 16px; }
  .email-capture > p { margin: 0 0 13px; color: var(--ink-soft); font-size: 9.5px; line-height: 1.55; }
  .email-capture label { display: block; margin-bottom: 6px; color: var(--ink-soft); font-size: 9px; font-weight: 800; }
  .email-row { display: grid; grid-template-columns: 1fr auto; gap: 7px; }
  .email-row input {
    min-width: 0;
    height: 42px;
    padding: 0 11px;
    border: 1px solid var(--border);
    border-radius: 11px;
    background: #fff;
    color: var(--ink);
    font-size: 10px;
    outline: none;
  }
  .email-row input:focus { border-color: var(--violet); box-shadow: 0 0 0 3px rgba(81,70,216,.1); }
  .email-row button { padding: 0 13px; border-radius: 11px; background: var(--ink); color: #fff; font-size: 9.5px; font-weight: 800; }
  .email-row button:disabled { opacity: .6; cursor: wait; }
  .email-capture > small { display: block; margin-top: 8px; color: var(--muted); font-size: 8px; line-height: 1.55; }
  .email-capture a { color: var(--violet); }
  .form-error { margin: 8px 0 0 !important; color: #a43838 !important; font-size: 9px !important; }
  .email-success {
    padding: 17px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 17px;
    background: var(--green-soft);
    color: var(--green);
  }
  .email-success > span { width: 27px; height: 27px; display: grid; place-items: center; border-radius: 50%; background: var(--green); color: #fff; font-weight: 900; }
  .email-success strong { font-size: 11px; }
  .email-success p { margin: 2px 0 0; font-size: 9px; }

  .offers-page { max-width: 1180px; }
  .offers-heading { margin-top: 30px; display: grid; grid-template-columns: minmax(0,1fr) 290px; gap: 70px; align-items: end; }
  .offers-heading h1 { margin-bottom: 16px; font-size: clamp(42px, 5vw, 61px); }
  .saving-summary {
    padding: 21px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-radius: 18px;
    background: var(--ink);
    color: #fff;
  }
  .saving-summary span { color: rgba(255,255,255,.56); font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  .saving-summary strong { font-family: "Bricolage Grotesque", sans-serif; font-size: 28px; }
  .saving-summary small { color: rgba(255,255,255,.55); font-size: 8.5px; line-height: 1.5; }
  .affiliate-disclosure {
    margin-top: 35px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: rgba(255,255,255,.55);
  }
  .affiliate-disclosure > span { width: 19px; height: 19px; flex: 0 0 auto; display: grid; place-items: center; border-radius: 50%; background: var(--ink); color: #fff; font-size: 9px; font-weight: 800; }
  .affiliate-disclosure p { margin: 0; color: var(--ink-soft); font-size: 9.5px; line-height: 1.65; }
  .offers-grid { margin-top: 18px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .affiliate-card {
    min-height: 425px;
    padding: 23px;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
    border-radius: 21px;
    background: #fff;
    text-decoration: none;
    box-shadow: 0 14px 38px rgba(44,39,91,.06);
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
  }
  .affiliate-card:hover { transform: translateY(-3px); border-color: rgba(81,70,216,.28); box-shadow: 0 22px 45px rgba(44,39,91,.11); }
  .affiliate-topline { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .affiliate-tag { padding: 5px 8px; border-radius: 999px; background: var(--violet-light); color: var(--violet); font-size: 8px; font-weight: 800; }
  .ad-label { color: var(--muted); font-size: 7.5px; letter-spacing: .8px; text-transform: uppercase; font-weight: 800; }
  .affiliate-card h2 { margin: 28px 0 7px; font-family: "Bricolage Grotesque", sans-serif; font-size: 27px; letter-spacing: -.5px; }
  .affiliate-desc { min-height: 40px; margin: 0; color: var(--ink-soft); font-size: 10.5px; line-height: 1.6; }
  .rate-example { margin-top: 25px; padding: 15px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); display: flex; align-items: end; justify-content: space-between; gap: 10px; }
  .rate-example span { max-width: 80px; color: var(--muted); font-size: 8px; line-height: 1.35; }
  .rate-example strong { font-family: "Bricolage Grotesque", sans-serif; font-size: 27px; }
  .affiliate-cta { margin-top: 20px; color: var(--violet); font-size: 11px; font-weight: 800; }
  .legal-example { margin: auto 0 0; padding-top: 22px; color: var(--muted); font-size: 7.8px; line-height: 1.55; }
  .offers-email-wrap { max-width: 570px; margin: 35px auto 0; }
  .offers-footer-actions { max-width: 350px; margin: 28px auto 0; }
  .secondary-button { width: 100%; min-height: 46px; border-radius: 13px; background: var(--surface-soft); color: var(--violet); font-size: 11px; font-weight: 800; }
  .secondary-button:hover { background: var(--violet-light); }

  .site-footer { margin-top: 10px; border-top: 1px solid var(--border); background: #fff; }
  .footer-inner {
    width: min(1180px, calc(100% - 40px));
    min-height: 120px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
  }
  .footer-brand { display: flex; align-items: center; gap: 12px; }
  .footer-brand img { width: 37px; height: 37px; border-radius: 50%; }
  .footer-brand strong { font-family: "Bricolage Grotesque", sans-serif; font-size: 14px; }
  .footer-brand p { margin: 3px 0 0; color: var(--muted); font-size: 9px; }
  .footer-links { display: flex; align-items: center; gap: 20px; color: var(--muted); font-size: 9px; }
  .footer-links a { color: var(--violet); }
  .scroll-top {
    position: fixed;
    right: 22px;
    bottom: 22px;
    z-index: 40;
    width: 42px;
    height: 42px;
    border: 0;
    border-radius: 50%;
    background: var(--ink);
    color: #fff;
    box-shadow: 0 9px 24px rgba(32,33,63,.22);
    cursor: pointer;
  }

  @media (max-width: 980px) {
    .hero-layout { grid-template-columns: 1fr; gap: 38px; padding-top: 55px; }
    .hero-copy { position: static; padding-top: 0; max-width: 700px; }
    .calculator-card { max-width: 760px; }
    .faq-section { grid-template-columns: 1fr; gap: 30px; }
    .result-layout { grid-template-columns: 1fr; }
    .result-card { min-height: auto; }
    .offers-heading { grid-template-columns: 1fr; gap: 25px; }
    .saving-summary { max-width: 330px; }
    .offers-grid { grid-template-columns: 1fr; }
    .affiliate-card { min-height: 0; }
    .affiliate-desc { min-height: 0; }
    .legal-example { margin-top: 24px; }
  }

  @media (max-width: 720px) {
    .header-inner, .hero-layout, .how-it-works, .faq-section, .page-section, .footer-inner { width: min(100% - 28px, 1180px); }
    .header-inner { min-height: 68px; }
    .brand img { width: 37px; height: 37px; }
    .brand small { display: none; }
    .progress-step small, .progress-step::after { display: none; }
    .progress { gap: 5px; }
    .hero-layout { padding: 45px 0 55px; }
    .hero-copy h1, .offers-heading h1 { font-size: 45px; letter-spacing: -1.6px; }
    .hero-lead, .offers-heading > div > p { font-size: 15px; }
    .calculator-card { padding: 19px; border-radius: 22px; }
    .card-heading h2 { font-size: 24px; }
    .loan-section { padding: 16px; }
    .steps-grid { grid-template-columns: 1fr; }
    .how-it-works, .faq-section { padding: 55px 0; }
    .section-heading h2 { font-size: 31px; }
    .page-section { padding: 38px 0 65px; }
    .result-card, .next-step-card { border-radius: 22px; }
    .result-card { padding: 30px 23px; }
    .result-big-number { margin-top: 36px; font-size: 64px; }
    .break-even { align-items: flex-start; flex-direction: column; gap: 11px; }
    .next-step-card { padding: 25px 21px; }
    .next-step-card h2 { font-size: 28px; }
    .email-row { grid-template-columns: 1fr; }
    .email-row button { min-height: 42px; }
    .footer-inner { min-height: 145px; flex-direction: column; align-items: flex-start; justify-content: center; }
    .footer-links { width: 100%; justify-content: space-between; }
  }

  @media (max-width: 430px) {
    .hero-copy h1, .offers-heading h1 { font-size: 40px; }
    .trust-item small { max-width: 250px; }
    .calculator-card { padding: 15px; }
    .card-heading { padding: 4px 2px 0; }
    .time-badge { display: none; }
    .loan-section { border-radius: 16px; }
    .field-label-row { gap: 8px; }
    .field-label-row label { font-size: 10px; }
    .result-comparison { gap: 8px; padding: 14px 12px; }
    .result-comparison strong { font-size: 11px; }
    .affiliate-card { padding: 20px; }
  }

  /* V2: tydeligere typografi, roligere uttrykk og mindre luft på mobil */
  :root {
    --ink-soft: #41445d;
    --muted: #62657b;
    --border: rgba(32, 33, 63, 0.15);
  }

  body {
    font-size: 16px;
    line-height: 1.6;
  }

  .eyebrow,
  .section-kicker,
  .result-eyebrow,
  .saving-summary span,
  .break-even span,
  .ad-label {
    text-transform: none;
    letter-spacing: 0;
  }

  .eyebrow,
  .section-kicker {
    font-size: 14px;
    line-height: 1.35;
    font-weight: 750;
  }

  .brand strong { font-size: 19px; }
  .brand small { font-size: 13px; font-weight: 600; }
  .progress-step small { font-size: 13px; }
  .progress-step > span { font-size: 13px; }

  .hero-copy h1,
  .offers-heading h1 {
    letter-spacing: -1.7px;
  }
  .hero-lead,
  .offers-heading > div > p {
    color: var(--ink-soft);
    font-size: 18px;
    line-height: 1.65;
  }
  .trust-list { gap: 12px; }
  .trust-item strong { font-size: 15px; }
  .trust-item small {
    color: var(--muted);
    font-size: 13px;
    line-height: 1.45;
  }
  .hero-note p {
    color: var(--ink-soft);
    font-size: 13px;
    line-height: 1.55;
  }

  .card-heading h2,
  .section-heading h2,
  .next-step-card h2 {
    letter-spacing: -0.55px;
  }
  .time-badge { font-size: 12px; }
  .loan-section-heading > span { font-size: 12px; }
  .loan-section-heading h3 { font-size: 15px; }
  .field-label-row label {
    color: var(--ink-soft);
    font-size: 14px;
  }
  .field-label-row output {
    font-size: 14px;
    padding: 6px 10px;
  }
  .field-hint {
    color: var(--muted);
    font-size: 12.5px;
    line-height: 1.5;
  }
  .range-markers {
    color: var(--muted);
    font-size: 11.5px;
  }
  .effective-row > span {
    color: var(--ink-soft);
    font-size: 13px;
  }
  .effective-row > strong { font-size: 18px; }
  .tooltip-button { font-size: 12px; }
  .tooltip-content {
    font-size: 13px;
    line-height: 1.5;
  }
  .primary-button {
    font-size: 15px;
    font-weight: 750;
  }
  .button-note {
    color: var(--muted);
    font-size: 12.5px;
    line-height: 1.45;
  }

  .section-heading.centered,
  .section-heading {
    text-align: left;
  }
  .how-it-works .section-heading { max-width: 700px; }
  .info-step h3 { font-size: 21px; }
  .info-step p {
    color: var(--ink-soft);
    font-size: 14.5px;
    line-height: 1.65;
  }
  .faq-list summary { font-size: 18px; }
  .faq-list details p {
    color: var(--ink-soft);
    font-size: 15px;
    line-height: 1.7;
  }

  .text-button { font-size: 14px; }
  .result-eyebrow {
    font-size: 14px;
    font-weight: 700;
  }
  .result-big-label { font-size: 16px; }
  .result-intro {
    color: rgba(255,255,255,.84);
    font-size: 17px;
    line-height: 1.65;
  }
  .result-comparison small {
    color: rgba(255,255,255,.72);
    font-size: 13px;
  }
  .result-comparison strong { font-size: 16px; }
  .break-even span {
    color: rgba(255,255,255,.72);
    font-size: 13px;
  }
  .break-even strong { font-size: 20px; }
  .break-even p {
    color: rgba(255,255,255,.78);
    font-size: 14px;
    line-height: 1.55;
  }
  .result-disclaimer {
    color: rgba(255,255,255,.68);
    font-size: 12.5px;
    line-height: 1.6;
  }

  .result-card.modest-card {
    background: #f2f0fb;
    color: var(--ink);
    border-color: rgba(81,70,216,.2);
  }
  .modest-card .result-eyebrow { color: var(--violet); }
  .modest-card .result-big-number { color: var(--ink); }
  .modest-card .result-big-label,
  .modest-card .result-intro,
  .modest-card .result-comparison small,
  .modest-card .break-even span,
  .modest-card .break-even p,
  .modest-card .result-disclaimer { color: var(--ink-soft); }
  .modest-card .result-intro strong,
  .modest-card .result-comparison strong,
  .modest-card .break-even strong { color: var(--ink); }
  .modest-card .result-comparison,
  .modest-card .break-even {
    border-color: rgba(32,33,63,.14);
    background: rgba(255,255,255,.6);
  }

  .next-step-card > p {
    color: var(--ink-soft);
    font-size: 15px;
    line-height: 1.65;
  }
  .mini-process span { font-size: 12px; }
  .mini-process p {
    color: var(--ink-soft);
    font-size: 13.5px;
    line-height: 1.5;
  }
  .quiet-button { font-size: 13px; }

  .email-capture h3 { font-size: 19px; }
  .email-capture > p {
    color: var(--ink-soft);
    font-size: 13.5px;
    line-height: 1.55;
  }
  .email-capture label { font-size: 12.5px; }
  .email-row input { font-size: 14px; }
  .email-row button { font-size: 13px; }
  .email-capture > small {
    color: var(--muted);
    font-size: 11.5px;
    line-height: 1.5;
  }
  .form-error { font-size: 12.5px !important; }
  .email-success strong { font-size: 14px; }
  .email-success p { font-size: 12.5px; }

  .saving-summary span {
    color: rgba(255,255,255,.76);
    font-size: 13px;
  }
  .saving-summary small {
    color: rgba(255,255,255,.72);
    font-size: 12px;
  }
  .affiliate-disclosure p {
    color: var(--ink-soft);
    font-size: 13.5px;
    line-height: 1.6;
  }
  .affiliate-tag {
    font-size: 12px;
    font-weight: 700;
  }
  .ad-label {
    color: var(--muted);
    font-size: 11.5px;
    font-weight: 700;
  }
  .affiliate-card h2 { font-size: 30px; }
  .affiliate-desc {
    color: var(--ink-soft);
    font-size: 14px;
    line-height: 1.55;
  }
  .rate-example span {
    max-width: none;
    color: var(--muted);
    font-size: 12.5px;
  }
  .rate-example strong { font-size: 30px; }
  .affiliate-cta {
    font-size: 14px;
    line-height: 1.35;
  }
  .legal-example {
    color: var(--muted);
    font-size: 12px;
    line-height: 1.6;
  }
  .secondary-button { font-size: 14px; }

  .footer-brand strong { font-size: 16px; }
  .footer-brand p { font-size: 12px; }
  .footer-links { font-size: 12px; }

  @media (max-width: 980px) {
    .hero-layout {
      gap: 28px;
      padding-top: 42px;
      padding-bottom: 54px;
    }
    .hero-copy { max-width: 760px; }
    .trust-list {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }
    .trust-item small { max-width: 190px; }
    .offers-grid { gap: 16px; }
    .affiliate-card { min-height: 0; }
  }

  @media (max-width: 720px) {
    .header-inner,
    .hero-layout,
    .how-it-works,
    .faq-section,
    .page-section,
    .footer-inner {
      width: min(100% - 24px, 1180px);
    }
    .header-inner { min-height: 64px; }
    .brand { gap: 9px; }
    .brand img { width: 36px; height: 36px; }
    .brand strong { font-size: 18px; }
    .progress-step > span { width: 31px; height: 31px; }

    .hero-layout {
      gap: 22px;
      padding: 26px 0 38px;
    }
    .hero-copy h1,
    .offers-heading h1 {
      margin: 10px 0 13px;
      font-size: 35px;
      line-height: 1.02;
      letter-spacing: -1px;
    }
    .eyebrow,
    .section-kicker { font-size: 13px; }
    .hero-lead,
    .offers-heading > div > p {
      font-size: 16px;
      line-height: 1.55;
    }
    .trust-list {
      margin-top: 19px;
      grid-template-columns: 1fr;
      gap: 8px;
    }
    .trust-item { gap: 10px; }
    .trust-item > span { width: 23px; height: 23px; }
    .trust-item strong { font-size: 14px; }
    .trust-item small { max-width: none; font-size: 12.5px; }
    .hero-note {
      margin-top: 18px;
      max-width: none;
      padding: 12px 13px;
      border-radius: 13px;
    }
    .hero-note p { font-size: 12.5px; }

    .calculator-card {
      padding: 15px;
      border-radius: 20px;
    }
    .card-heading {
      margin-bottom: 15px;
      padding: 2px 2px 0;
    }
    .card-heading h2 { font-size: 25px; }
    .loan-sections { gap: 10px; }
    .loan-section {
      padding: 14px;
      border-radius: 15px;
      box-shadow: none;
    }
    .loan-section-heading { margin-bottom: 15px; }
    .field-group { margin-bottom: 14px; }
    .field-label-row { margin-bottom: 7px; }
    .field-label-row label { font-size: 13.5px; }
    .field-label-row output { font-size: 13.5px; }
    .field-hint { margin-top: 7px; font-size: 12px; }
    .range-markers { font-size: 11px; }
    .effective-row { padding-top: 12px; }
    .effective-row > span { font-size: 12.5px; }
    .effective-row > strong { font-size: 17px; }
    .primary-button { min-height: 50px; }
    .button-note { margin-top: 8px; }

    .how-it-works,
    .faq-section { padding: 42px 0; }
    .how-it-works { padding-top: 38px; }
    .section-heading h2 { font-size: 30px; }
    .steps-grid { margin-top: 24px; gap: 10px; }
    .info-step {
      padding: 18px;
      border-radius: 15px;
    }
    .info-step h3 { margin: 15px 0 6px; font-size: 20px; }
    .info-step p { font-size: 14px; }
    .faq-section { gap: 22px; }
    .faq-list summary { padding: 17px 32px 17px 0; font-size: 17px; }
    .faq-list details p { margin-right: 18px; font-size: 14px; }

    .page-section { padding: 30px 0 52px; }
    .result-layout { margin-top: 18px; }
    .result-card { padding: 26px 21px; }
    .result-big-number { margin-top: 26px; font-size: 58px; }
    .result-big-label { margin-top: 11px; }
    .result-intro { margin-top: 25px; font-size: 16px; }
    .result-comparison { margin-top: 24px; }
    .next-step-card { padding: 22px 19px; }
    .next-step-card h2 { font-size: 27px; }

    .offers-heading { margin-top: 20px; }
    .affiliate-disclosure { margin-top: 24px; }
    .offers-grid { margin-top: 13px; gap: 12px; }
    .affiliate-card {
      min-height: 0;
      padding: 19px;
      border-radius: 18px;
    }
    .affiliate-card h2 { margin: 17px 0 5px; font-size: 28px; }
    .affiliate-desc { font-size: 14px; }
    .rate-example {
      margin-top: 17px;
      padding: 13px 0;
    }
    .rate-example strong { font-size: 27px; }
    .affiliate-cta {
      width: 100%;
      margin-top: 15px;
      padding: 12px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 12px;
      background: var(--violet);
      color: #fff;
    }
    .legal-example {
      margin-top: 16px;
      padding-top: 0;
      font-size: 11.5px;
    }

    .footer-inner {
      min-height: 0;
      padding: 26px 0;
      gap: 20px;
    }
    .footer-links {
      flex-direction: column;
      align-items: flex-start;
      gap: 9px;
    }
    .scroll-top {
      width: 38px;
      height: 38px;
      right: 10px;
      bottom: calc(12px + env(safe-area-inset-bottom));
    }
  }

  @media (max-width: 430px) {
    .hero-copy h1,
    .offers-heading h1 { font-size: 33px; }
    .hero-layout { padding-top: 22px; }
    .calculator-card { padding: 13px; }
    .loan-section { padding: 13px; }
    .field-label-row { align-items: flex-start; }
    .field-label-row label { max-width: 62%; }
    .result-comparison {
      grid-template-columns: 1fr;
      gap: 11px;
      text-align: left;
    }
    .result-comparison > span { transform: rotate(90deg); justify-self: start; }
    .affiliate-topline { align-items: flex-start; }
  }

`;
