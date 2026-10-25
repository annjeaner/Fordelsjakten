# Retningslinjer for Fordelsjakten

## Design og tekst
- Ikke bruk piler (→, ←, ↗ og lignende) i knapper, lenker, kort eller tekst. Det gjelder appen, bloggen og dokumentasjonen. Bruk tydelig tekst, og en nøytral skillelinje der en pil ellers ville skilt to verdier.

## Annonser og affiliatelenker
- Partnerne, lenkene og renteeksemplene ligger bare i `src/affiliates.json`. Både kalkulatoren (`src/App.js`) og bloggen (`scripts/build-blog.cjs`) leser derfra, så endringer gjøres der og ingen andre steder.
- Alle eksterne lenker for å sjekke rente, refinansiere og lignende skal ha et representativt renteeksempel med effektiv rente.
- Se `BLOG.md` for regler om plassering og rullering av annonseblokker i artiklene.
