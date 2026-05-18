// =============================================================
// eksempel-artikkel.js
//
// SLIK LAGER DU EN NY ARTIKKEL:
// 1. Kopier denne filen
// 2. Gi den nytt navn, f.eks. “nominell-vs-effektiv-rente.js”
// 3. Fyll inn alle feltene nedenfor
// 4. Importer og bruk den i App.js eller i en Route
//
// LESETID: Tell antall ord i seksjoner.avsnitt, del på 200.
// DATOER:  datoISO og datoEndretISO er maskinlesbare (YYYY-MM-DD).
//          dato er visningsdatoen leseren ser.
// =============================================================

export const artikkel = {

// — SEO –––––––––––––––––––––––––
tittel: ‘Kan du refinansiere med betalingsanmerkning?’,
// Maks 155 tegn — lokk til klikk med nøkkelord
metaBeskrivelse: ‘En betalingsanmerkning stopper deg ikke alltid. Her er hva du faktisk kan gjøre — og hvilke banker som vurderer deg uansett.’,
// Kan avvike fra metaBeskrivelse — optimalisert for deling
ogBeskrivelse: ‘Har du betalingsanmerkning? Her er hva du faktisk kan gjøre med lånet ditt.’,
// URL-slug — kun små bokstaver og bindestrek, ingen æøå
slug: ‘refinansiering-med-betalingsanmerkning’,

// — ARTIKKELINFO ––––––––––––––––––––
kategori: ‘Refinansiering’,
dato: ‘Mai 2026’,          // Visningsdato
datoISO: ‘2026-05-18’,     // Publiseringsdato — maskinlesbar
datoEndretISO: ‘2026-05-18’, // Oppdater denne hver gang du endrer artikkelen
// Beregn: antall ord ÷ 200 (avrund opp)
lesetid: 4,

// — BILDE ———————————————–
// Legg bildet i /public/bilder/ i repoet ditt
bilde: {
src: ‘/bilder/refinansiering-betalingsanmerkning.jpg’,
// Beskriv hva som er på bildet — ikke skriv “bilde av”
alt: ‘Person som ser på lånepairer på en laptop’,
width: 720,
height: 400,
},

// — INNHOLD ———————————————
// Start gjerne med et konkret tall — det stopper scrolling
ingress: ‘Nordmenn med forbrukslån betaler i snitt 3 400 kr for mye i renter hvert år. En betalingsanmerkning gjør det vanskeligere å refinansiere — men det er ikke umulig. Her er hva du faktisk kan gjøre.’,

// 3–5 punkter med det viktigste — folk scroller, ikke leser
høydepunkter: [
‘Noen banker vurderer søknader selv med anmerkning’,
‘Sikret refinansiering via eiendom gir bedre sjanser’,
‘Anmerkningen slettes automatisk når gjelden er betalt’,
‘Kalkulatoren viser hva du kan spare månedlig’,
],

// — SEKSJONER —————————————––
// Første H2 bør inneholde hovedkeyword.
// Maks 3–4 setninger per avsnitt.
// Sekundær CTA vises etter seksjon 2 (index 1).
// Primær CTA (kalkulator) vises etter seksjon 3 (index 2).
seksjoner: [
{
tittel: ‘Hva er egentlig en betalingsanmerkning?’,
avsnitt: [
‘En betalingsanmerkning registreres når du ikke betaler en regning etter at inkasso og rettslige skritt er tatt. Den vises i kredittsjekken din og påvirker muligheten til å få lån.’,
‘Det viktige å vite er at anmerkningen ikke varer evig — og at situasjonen din ikke er fastlåst.’,
],
// Faktaboks er valgfri — bruk til definisjoner eller tips
faktaboks: {
tittel: ‘💡 Visste du?’,
tekst: ‘Betalingsanmerkningen slettes automatisk innen 4 år, eller umiddelbart når kravet er innfridd og kreditor melder fra til registeret.’,
},
// Tallkort er valgfri — bruk til å sammenligne to tall
tallkort: null,
},
{
tittel: ‘Hva koster en høy rente deg over tid?’,
avsnitt: [
‘På et lån på 200 000 kr over 5 år er forskjellen mellom 15 % og 8 % effektiv rente over 40 000 kr i sparte rentekostnader.’,
‘Det er penger du faktisk kan beholde — og grunnen til at det alltid er verdt å sjekke om du kan få bedre vilkår.’,
],
faktaboks: null,
// Tallkort: alltid to kort side om side
tallkort: [
{ tall: ‘~15%’, label: ‘Typisk rente med anmerkning’ },
{ tall: ‘~8%’,  label: ‘Mulig rente etter refinansiering’ },
],
},
{
tittel: ‘Hva kan du gjøre nå?’,
avsnitt: [
‘Det første steget er å få oversikt over hva du faktisk betaler i dag. Mange er overrasket over hvor mye de kan spare bare ved å søke om refinansiering.’,
‘Bruk kalkulatoren nedenfor — den viser deg svaret på under ett minutt, uten registrering.’,
],
faktaboks: null,
tallkort: null,
},
],

// — CTA-HIERARKI ––––––––––––––––––––
// Velg én sekundær CTA — se kommentar øverst i ArticleLayout.js
// ‘epost’     → støtteordnings- og tips-artikler
// ‘affiliate’ → refinansierings- og renteartikler
// ‘produkt’   → artikler der produktet ditt er direkte relevant
sekundaerCTA: ‘affiliate’,

// — AFFILIATE —————————————––
// Kun relevant når sekundaerCTA === ‘affiliate’
// JURIDISK: Alle felt i priseksempel er påkrevd av finansavtaleforskriften.
// Hent tallene fra Orion Media / partneren din før publisering.
affiliate: {
navn: ‘Uno Finans’,
beskrivelse: ‘Uno Finans er en av få banker som vurderer søknader selv med betalingsanmerkning. De er kjent for rask behandling og tydelig kommunikasjon.’,
lenke: ‘DIN-ORION-AFFILIATE-LENKE-HER’,
priseksempel: {
lånebeløp: ‘150 000 kr’,
nedbetalingstid: ‘5 år’,
nominellRente: ‘10,9 %’,
effektivRente: ‘13,76 %’,
termingebyr: ‘45 kr’,
etableringsgebyr: ‘995 kr’,
månedligKostnad: ‘3 246 kr’,
totalt: ‘195 755 kr’,
},
},

// — PRODUKT ———————————————
// Kun relevant når sekundaerCTA === ‘produkt’
produkt: null,
// Eksempel på utfylt produktobjekt:
// produkt: {
//   ikon: ‘📋’,
//   navn: ‘Refinansieringsguiden’,
//   beskrivelse: ‘Steg-for-steg guide til å refinansiere smartere.’,
//   lenke: ‘https://gumroad.com/l/ditt-produkt’,
//   pris: ‘99 kr’,
// },

// — FAQ ———————————————––
// VIKTIG: Kopier spørsmål/svar nøyaktig — de injiseres også i FAQ Schema
// Skriv spørsmål slik folk faktisk søker dem på Google
faq: [
{
spørsmål: ‘Kan jeg refinansiere lån med betalingsanmerkning?’,
svar: ‘Ja, det er mulig. Noen banker spesialiserer seg på kunder med betalingsanmerkning, særlig om du kan stille sikkerhet i eiendom. Bruk kalkulatoren vår for å se hva du kan spare.’,
},
{
spørsmål: ‘Hvor lenge varer en betalingsanmerkning?’,
svar: ‘En betalingsanmerkning varer i inntil 4 år, men slettes umiddelbart når du betaler det opprinnelige kravet og kreditor melder fra til Brønnøysund.’,
},
{
spørsmål: ‘Hva er forskjellen på nominell og effektiv rente?’,
svar: ‘Nominell rente er grunnrenten uten gebyrer. Effektiv rente inkluderer alle gebyrer og gir det reelle bildet av hva lånet koster deg. Sammenlign alltid effektiv rente.’,
},
],

// — RELATERTE ARTIKLER –––––––––––––––––
// 2–4 artikler — peker til andre sider på fordelsjakten.no
relaterte: [
{
kategori: ‘Renter’,
tittel: ‘Nominell vs. effektiv rente — hva er forskjellen?’,
slug: ‘nominell-vs-effektiv-rente’,
},
{
kategori: ‘Kredittscore’,
tittel: ‘Slik øker du kredittscoren din raskt’,
slug: ‘slik-oker-du-kredittscoren’,
},
{
kategori: ‘Refinansiering’,
tittel: ‘Når lønner det seg å refinansiere?’,
slug: ‘nar-lonner-refinansiering-seg’,
},
{
kategori: ‘Støtteordninger’,
tittel: ‘Disse fradragene glemmer de fleste’,
slug: ‘skattefradrag-du-glemmer’,
},
],

// — BRØDSMULESTI ––––––––––––––––––––
// Vises mellom “Artikler” og artikkeltittelen
breadcrumb: [
{ navn: ‘Refinansiering’, slug: ‘refinansiering’ },
],
};