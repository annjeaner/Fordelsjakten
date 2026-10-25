# Artikkelpakken – klargjøring til gjennomgang

Pakkeveiledningen er behandlet som redaksjonelt grunnlag, og lenker og produktbeskrivelser er avklart mot prosjektets faktiske kode.

## Publisering

Alle ni artiklene ble publisert samlet 25. oktober 2026, med samme dato i `datePublished` og `dateModified`. Den opprinnelige planen med én artikkel per dag fra 21. oktober og grensen på to artikler per dato er fjernet.

Forhåndsvisning viser alle artikler. Produksjonsbygg utelater artikler med fremtidig dato fra HTML, kort, sitemap og Blog-schema, og interne lenker til dem vises som tekst. Fremtidige datoer krever en daglig ombygging, som ikke er satt opp.

## Avklaringer som er løst

- Eksisterende struktur er `/blogg/{slug}`, med canonical `https://fordelsjakten.no`. Alle internlenkemarkeringene er erstattet med faktiske artikkeladresser og beskrivende titler.
- Kalkulatorlenker peker til `/`. Påmeldingslenker peker til `/#epostpamelding`, en nå permanent tilgjengelig seksjon som bruker samme eksisterende påmeldingsfunksjon og API som kalkulatoren.
- E-postteksten lover bare nytt innhold og annen relevant informasjon, uten fast frekvens. Bekreftelse kreves, i samsvar med API-ets PENDING-status. Ingen mottakere er registrert under testing.
- Brukeren har avklart Fordelsjakten som ansvarlig og Fordelsdetektiven som forfatter. Begge er synlig forklart på `/blogg#redaksjon`. Ingen privatperson, ekspertittel eller uverifisert fagkompetanse er lagt til.
- Kildemarkeringer er fjernet etter kontroll av de relevante primærsidene; selve lenkene er beholdt. Datatilsynets generelle oversikt støttet ikke den presise formuleringen om rente/avslag tilstrekkelig. Avsnittet er derfor tilpasset Navs dokumenterte omtale av avslag ved betalingsanmerkning.
- Foreløpige datoer fra pakken er erstattet av planen. Gamle «Sist oppdatert 20. oktober»-linjer er fjernet; datoer og avsender genereres fra innholdsdata.
- Alle sju nye artikler har BlogPosting, brødsmuler og FAQPage generert fra synlige FAQ-blokker. Ingen ferdig schema-fil fra pakken kopieres ukritisk. Alle ni artikler har nå egne bilder med alt-tekst og KI-kreditering, responsive WebP-kopier og delingsbilde. De sju nye illustrasjonene følger samme varme skandinaviske uttrykk med ulike motiv per tema. Bildene er koblet til artikkel-HTML, kort, BlogPosting/ImageObject og Open Graph/Twitter. Se BLOG-BILDER.md for motiver og kategorier.

## Kontroll mot kalkulatoren

Kilde: src/App.js, funksjonene annuitet, effektivRente og calculation.

- Innfelt rente er nominell årsrente; månedsrenten er prosent / 100 / 12. Effektiv rente er et beregnet resultat. Gebyrer skal ikke legges oppå en effektiv rente som om den var nominell.
- Restgjeld er 10 000–1 000 000 kr. Rente er 1–30 prosent. Tid er 1–120 måneder, felles for dagens og nytt lån.
- Månedlig termingebyr legges til annuitetsbetalingen. Nytt etableringsgebyr regnes separat ved oppstart og trekkes fra netto låneproveny i effektiv-renteberegningen; det legges ikke til hovedstolen.
- Tidligere etableringsgebyr på dagens lån er ikke med i de fremtidige kostnadene. Felles beløp og tid betyr at modellen ikke er en full beregning av flere ulike lån med hver sin løpetid eller av et pantelån med alle særskilte kostnader.
- Femtenårseksemplet og tabeller som sammenligner 36 med 60 måneder er undervisningseksempler. De er ikke funksjoner kalkulatoren kan sammenligne i én kjøring. Dette er presisert i teksten.
- Alle elleve eksempler i content/blog-calculations.json er sammenlignet med de faktiske beregningsfunksjonene. Renter, gebyrer og effektive renter er kontrollert numerisk.
- Break-even-visningen var mer kategorisk enn modellens forutsetninger. Visningen er nå merket «Forenklet break-even» og forklarer at månedsforskjellen inkluderer avdrag og ikke sammenligner restgjeld ved tidlig innfrielse. Beregningsformelen er beholdt.

## Kilder kontrollert i denne runden

- [Finanstilsynet: Bank og finans, ordliste](https://www.finanstilsynet.no/forbrukerinformasjon/bank-og-finans/)
- [Finanstilsynet: Praksis for lån til forbrukere, punkt 6](https://www.finanstilsynet.no/nyhetsarkiv/rundskriv/2024/praksis-for-lan-til-forbrukere/)
- [Finansdepartementet: Utlånsforskriften, refinansiering](https://www.regjeringen.no/no/tema/okonomi-og-budsjett/finansmarkedene/utlansforskriften2/id3077676/)
- [Datatilsynet: Kredittvurdering](https://www.datatilsynet.no/personvern-pa-ulike-omrader/kredittvurdering/)
- [Datatilsynet: For deg som blir kredittvurdert, gjenpartsbrev](https://www.datatilsynet.no/personvern-pa-ulike-omrader/kredittvurdering/for-deg-som-blir-kredittvurdert/)
- [Gjeldsregisteret: Gjeldsopplysninger for privatpersoner](https://www.gjeldsregisteret.com/om-gjeldsopplysninger-for-privatpersoner)
- [Gjeldsregisteret: FAQ, retting og oppdatering](https://www.gjeldsregisteret.com/faq)
- [Gjeldsregisteret: Gratis innsyn](https://www.gjeldsregisteret.com/bedre-oversikt-over-egen-okonomi)
- [Nav: Økonomi og gjeld](https://www.nav.no/okonomi-gjeld)
- [OsloMet/SIFO: Referansebudsjettet og hva det utelater](https://www.oslomet.no/om/sifo/referansebudsjettet)

## Før publisering

- Kontroller reell Vercel-ruting og HTTP 404, og ekstern schema-/delingsvisning. Tidligere forsøk på å hente beskyttet forhåndsvisning fikk 403; lokal kontroll er ikke en ekstern Rich Results Test.
- Verifiser reell leveranse/bekreftelse av e-post med en godkjent testadresse ved lansering. Nettlesertesten simulerer API-svaret og sender ingen e-post.


## Fremtidig forbedring av kalkulatoren

[GitHub-sak #11](https://github.com/annjeaner/Fordelsjakten/issues/11) beskriver uavhengig nedbetalingstid for dagens og nytt lån, prioritet lav / nice to have. Kalkulatorens beregning er ikke endret i denne bilderunden.
