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
5. Sett `datePublished` til den faktiske publiseringsdatoen. Ved senere innholdsendringer beholder du denne datoen og oppdaterer bare `dateModified`. Begge har formatet `2026-10-17`. Begge artiklene er klargjort med avtalt lanseringsdato 21. oktober 2026.
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

`summary` er en valgfri liste som vises som «Kort oppsummert». Bruk den til 2–3 hovedpoenger i lengre artikler. FAQ anbefales først når den svarer på egne spørsmål, utover det artikkelen allerede forklarer; ingen FAQ-modul eller FAQ-schema er lagt til nå.

Avsnitt støtter lenker skrevet som `[lenketekst](https://eksempel.no/side)` og lokale lenker som `[kalkulatoren](/)`. HTML blir ikke tolket. En seksjon kan ha `list` for kulepunkter før avsnittene. `sources` er en liste med `title` og `url`, og vises som en nøytral kildeliste nederst. Valgfri `cta` har `heading`, `text`, `label` og `href`.

Begge artiklene har avtalt lanseringsdato 21. oktober 2026, med `datePublished` og `dateModified` satt til `2026-10-21`. Datoen må endres dersom lanseringen flyttes. Den fremtidige datoen hindrer ikke publisering; sammenslåing og produksjonspublisering avventer fortsatt godkjenning.

For fremtidige utkast kan `publicationPending: true` og begge datoene `null` brukes. Da vises «Ikke publisert» i forhåndsvisningen, og produksjonsbygg stopper til datoene er satt og `publicationPending` fjernet. Behold publiseringsdatoen ved senere endringer, og oppdater bare `dateModified`.

Kildene til månedsbeløpsartikkelen ble kontrollert 20. oktober 2026 mot Forbrukerrådets to sjekklister og SpareBank 1s side om refinansiering av kredittkort. Artikkelbildet er levert av brukeren; webkopier er eksportert i 640/1200 px og delingsformat 1200 × 630 px.
