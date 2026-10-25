# Slik publiserer du på Fordelsjakten

Bloggen har foreløpig ingen egen redaktørside. Artiklene ligger som innholdsfiler i GitHub. Du trenger ikke skrive HTML eller schema: bygget lager bloggsiden, artikkelsiden, metadata og sitemap fra innholdet du legger inn.

## Den enkleste rutinen sammen med ChatGPT

1. Send artikkelutkastet hit. Be om språkvask, kildekontroll og et passende bilde.
2. Vi gjør ferdig tekst, bilde, alt-tekst, kort beskrivelse og publiseringsdato i en egen gren i repoet.
3. Se gjennom Vercel-forhåndsvisningen på mobil og desktop.
4. Når du er fornøyd, slås grenen sammen med produksjonsgrenen i GitHub (vanligvis `main`). Vercel bygger og publiserer hvis Git-integrasjonen er aktiv og bygget lykkes.
5. Åpne artikkeladressen og sjekk bildet, lenkene og hvordan den ser ut ved deling.

For at ChatGPT skal kunne gjøre steg 2–4, må GitHub-tilkoblingen ha skrivetilgang. Sammenslåing og produksjonspublisering gjøres først etter at du har godkjent dem.

## Hvis du vil legge inn en artikkel selv i GitHub

Når bloggfunksjonen er lagt inn i repoet:

1. Opprett en ny gren, for eksempel `artikkel/ny-guide`, fra produksjonsgrenen.
2. Kopier strukturen i `content/blog/slik-bruker-du-kalkulatoren.json` til en ny fil i samme mappe. I GitHubs filvisning kan du bruke **Add file → Create new file**. Filnavnet kan for eksempel være `slik-finner-du-laneopplysningene.json`.
3. Endre `slug`, `title`, `description`, `category`, `intro` og avsnittene i `sections`. En slug er den siste delen av nettadressen: bruk små bokstaver, bindestreker og ingen æ, ø eller å. Hvert avsnitt står i doble anførselstegn. Anførselstegn inne i teksten må skrives som `\"`; komma mellom elementer må beholdes. Be gjerne ChatGPT lage den ferdige filen for deg.
4. Last opp artikkelbildene i `public/images/blog/` på **samme gren**, via **Add file → Upload files**. Bruk bildefiler i to bredder (640 og 1200 piksler) og et delingsbilde på 1200 × 630 piksler. Endre filnavnene, alt-teksten, størrelsene og krediteringen i `image` til bildene du faktisk bruker. Ikke gjenbruk en annen artikkels alt-tekst.
5. Sett `datePublished` til den faktiske publiseringsdatoen. Ved senere innholdsendringer beholder du denne datoen og oppdaterer bare `dateModified`. Begge har formatet `2026-10-17`.
6. Lagre endringene med **Commit changes** på artikkelgrenen, og opprett en **pull request** mot produksjonsgrenen. Åpne Vercel-forhåndsvisningen når bygget er klart. Det forutsetter at GitHub/Vercel-integrasjonen er aktiv for grenen.
7. Sjekk teksten, bildet, mobilvisningen og alle kilder. Slå sammen med **Merge pull request** når alt er klart. Vent på et vellykket produksjonsbygg, og sjekk den publiserte artikkelen.

Kategorifilteret henter automatisk kategoriene fra artiklenes `category`-felt. Bruk samme skrivemåte for artikler i samme kategori. Leseren kan sortere etter nyeste, eldste eller tittel. Uten JavaScript vises fortsatt alle artiklene.

Alle JSON-filer i `content/blog/` blir tatt med ved bygging. Oppbevar utkast et annet sted, for eksempel i `content/drafts/` eller i en egen gren. Det er ikke en tidsstyrt publisering: en fremtidig dato holder ikke artikkelen tilbake.

Du kan endre tittel, tekst og bilde senere. Behold sluggen for å beholde adressen. Skal adressen endres, bør den gamle adressen få en videresending.

## Språket vi bruker

Varmt, enkelt og konkret. Skriv «du» og forklar én ting om gangen. Forklar nødvendige fagord i setningen der de brukes. Bruk «anslag» fremfor «estimat», «prøv en annen rente» fremfor «utforsk et scenario», og «slik fungerer det» fremfor interne beskrivelser av teknikken.

Vær presis om hva tallene viser, hvilke forutsetninger som gjelder og hva vi ikke vet. Unngå press, store løfter og påstander om at et bestemt lån passer for alle. Fagartikler med økonomiske råd, statistikk eller regler må ha kontrollerte, relevante kilder. Datoen skal si når innholdet faktisk ble publisert eller oppdatert.

## Bilder og design

Det første bildet er generert med bildegenerering: et rolig, fotorealistisk stilleben med lilla kalkulator, notatbok og penn, varme lyse toner og uten personer eller logo. Prompten ba om et nøkternt skandinavisk uttrykk for en kalkulatorguide. Originalen er bevart; optimaliserte kopier ligger i `public/images/blog/`.

Bildet brukes på bloggkortet og i artikkelen. `image.src` blir også artikkelbildet i `BlogPosting`. `image.share` brukes i Open Graph og Twitter-metadata. Kreditering vises under bildet. Alt-tekst beskriver motivet; bilde på bloggkortet har tom alt-tekst fordi lenken allerede har et navn.

Designet gjenbruker nettstedets skrifter og globale stiler. Bloggen har en egen, avgrenset fargepalett med `--fj-blog-*`, eksplisitt tekstfarge på overskrifter og tekst og lyse flater. Dette hindrer generelle fargenavn i å få en annen betydning i forhåndsvisningen. Kontrast må kontrolleres mot den faktiske bakgrunnen, også på knapper og lilla flater.

## Teknisk kontroll

Kjør `npm ci`, `npm run build` og `npm run test:blog`. Bygget lager ferdig HTML uten avhengighet av JavaScript for tekst, metadata, lenker eller JSON-LD. Vercel må bruke `npm run build` (med `postbuild`) og `cleanUrls` i `vercel.json`.

`Blog`, `BlogPosting`, `BreadcrumbList` og bildeinformasjon følger innholdet. Canonical bruker `https://fordelsjakten.no`, som resten av React-appen. Sitemap beholder eksisterende sider og legger til artiklene. Vercel-forhåndsvisninger får `noindex` hvis `VERCEL_ENV` er tilgjengelig og ikke er `production`.

Før produksjon: kontroller direkte artikkelinnlasting, ukjente artikkeladresser (404), Rich Results Test og bilde-/delingsvisning. Schema gir ikke garanti for utvidede søkeresultater. Bloggen laster ikke en ny analytics-tracker.

## Artikkelmoduler og metadata

`title` brukes som synlig tittel og `BlogPosting.headline`. Valgfrie `seoTitle`, `shareTitle` og `shareDescription` styrer henholdsvis sidetittel og deling (Open Graph/Twitter). `description` er metabeskrivelsen og teksten på kortet.

`summary` er en valgfri liste som vises som «Kort oppsummert». Bruk den til 2–3 hovedpoenger i lengre artikler. De sju nye fagartiklene har en synlig FAQ-seksjon. FAQPage genereres direkte fra spørsmålene og svarene i seksjonens innholdsblokker, slik at schema følger den endelige teksten. Dette er ingen garanti for utvidede søkeresultater.

Avsnitt støtter lenker skrevet som `[lenketekst](https://eksempel.no/side)` og lokale lenker som `[kalkulatoren](/)`. HTML blir ikke tolket. En seksjon kan ha `list` for kulepunkter før avsnittene. `sources` er en liste med `title` og `url`, og vises som en nøytral kildeliste nederst. Valgfri `cta` har `heading`, `text`, `label` og `href`.

Alle ni artikler ble publisert samlet 25. oktober 2026. Forhåndsvisningen viser alle artiklene og markerer fremtidige datoer som «Planlagt». Produksjonsbygget bruker dato i Europe/Oslo og lager bare sider, kort, sitemap og schema for artikler som har nådd publiseringsdatoen. Lenker til fremtidige blogginnlegg vises som vanlig tekst frem til målsiden finnes. Ved testing kan `BLOG_BUILD_DATE=ÅÅÅÅ-MM-DD` brukes; la dette være usatt i vanlig drift.

Datoavgrensningen er ikke en automatisk jobb: en statisk Vercel-side må bygges på nytt på publiseringsdagen før en artikkel med fremtidig dato blir synlig. Ingen planlagt produksjonsjobb eller deploy hook er aktivert. Sett opp en daglig ombygging før artikler planlegges frem i tid. `dateModified` settes lik `datePublished` ved førstegangspublisering, og endres etterpå bare ved reelle innholdsendringer.

For fremtidige utkast kan `publicationPending: true` og begge datoene `null` brukes. Da vises «Ikke publisert» i forhåndsvisningen, og produksjonsbygg stopper til datoene er satt og `publicationPending` fjernet. Behold publiseringsdatoen ved senere endringer, og oppdater bare `dateModified`.

Kildene til månedsbeløpsartikkelen ble kontrollert 20. oktober 2026 mot Forbrukerrådets to sjekklister og SpareBank 1s side om refinansiering av kredittkort. Artikkelbildet er levert av brukeren; webkopier er eksportert i 640/1200 px og delingsformat 1200 × 630 px.


## Innholdsblokker og påmelding

`sections[].blocks` støtter `paragraph`, `heading` (H3), `list` og `table`. Innholdsblokker rendres i rekkefølge. Bruk enten `blocks` eller `paragraphs` i en seksjon, ikke begge. Kilder samles som en nøytral liste nederst, samtidig som de beholder de synlige lenkene i teksten. Ikke legg inn vilkårlig HTML.

E-posthenvisninger bruker `/#epostpamelding`. Dette er en permanent tilgjengelig seksjon i React-forsiden, også uten å gå gjennom et kalkulatorresultat. Den bruker eksisterende `subscribe`-funksjon og `/api/subscribe`, som registrerer med status PENDING i den eksisterende e-postlisten. Ikke lenk direkte til API-et fra artikkelteksten. Ingen påstander om en bestemt utsendelsesfrekvens, lånetilbud eller automatisk tilsendt personlig beregning er lagt til i bloggtekstene.

Fordelsjakten har redaksjonelt ansvar. Fordelsdetektiven er forfatternavnet, representert som et redaksjonelt organisasjonsnavn i schema, ikke som en oppdiktet fagperson. Forklaringen finnes synlig på `/blogg#redaksjon`.

## Annonseblokker

En artikkel kan ha annonseblokker som egne innholdsblokker: `{"type": "promo", "id": "zensum"}`. Blokken settes inn i `sections[].blocks` der den skal vises.

- **Affiliate:** ID-ene er partnerne i `src/affiliates.json` (`uno-finans`, `motty`, `zensum`). Kalkulatorens tilbudsside bruker samme fil. Navn, lenke og renteeksempel er derfor alltid like på bloggen og i appen. Kortet bruker appens `affiliate-card`-stil, er merket «Annonse», har `rel="noopener noreferrer sponsored"` og viser renteeksempelet og en provisjonsopplysning.
- **Intern:** ID-ene står i `content/promos.json` (`kalkulator`, `epost`). De brukes for egne verktøy og e-postlisten.

Bygget stopper hvis
- artikkelen har mer enn to blokker (standardboksen «Klar for å prøve selv?» teller med),
- artikkelen har mer enn én affiliateblokk, eller noen i en artikkel med `"noAffiliate": true`,
- en blokk står i første seksjon, i «Ofte stilte spørsmål» eller rett ved en tabell eller en annen annonse,
- en partner mangler renteeksempel med effektiv rente, eller ID-en er ukjent.

Endres et renteeksempel, oppdateres det i `src/affiliates.json`. Annonsetekst holdes utenfor `articleBody` i schema. `refinansiering-med-betalingsanmerkning` har `noAffiliate`, fordi leserne der er i en sårbar situasjon.
