# Retningslinjer for Fordelsjakten

## Design og tekst: unngå typiske KI-stiler
Fordelsjakten skal se ut og lese som noe et menneske har laget. Disse gjelder appen, bloggen, artiklene og dokumentasjonen:

- Ingen piler (→, ←, ↗, ➜ og lignende) i knapper, lenker, kort eller tekst. Skriv hva som skjer: «Åpne kalkulatoren», ikke «Kalkulator →».
- Ingen skillelinjer som pynt, verken mellom verdier, over småtekst eller mellom avsnitt. Bruk luft og rekkefølge for å skille innhold.
- Ingen emojier eller pyntesymboler (✓, ✨, 🚀, 💡 og lignende) i grensesnitt eller tekst.
- Ingen tankestrek (—) som stilgrep. Bruk punktum eller komma. Vanlig bindestrek og tankestrek i tallintervaller (10–30) er greit.
- Ikke gjør ord fete for å fremheve dem midt i en setning. Overskrifter gjør jobben.
- Ingen gradienter i tekst, glødende skygger eller «glass»-effekter.
- Unngå faste KI-vendinger: «ikke bare X, men Y», tre ting på rad som rytme, og avslutninger som oppsummerer det leseren nettopp har lest.
- Gjenbruk det som finnes i `GLOBAL_CSS` i `src/App.js` og `src/blog.css` før du lager nye visuelle elementer.

Testen i `scripts/blog.test.cjs` stopper bygget hvis det kommer piler inn i kode eller innhold.

## Annonser og affiliatelenker
- Partnerne, lenkene og renteeksemplene ligger bare i `src/affiliates.json`. Både kalkulatoren (`src/App.js`) og bloggen (`scripts/build-blog.cjs`) leser derfra, så endringer gjøres der og ingen andre steder.
- Alle eksterne lenker for å sjekke rente, refinansiere og lignende skal ha et representativt renteeksempel med effektiv rente.
- Se `BLOG.md` for regler om plassering og rullering av annonseblokker i artiklene.
