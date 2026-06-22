# 82-0 — Bygg den perfekte NBA-femmeren

Et gratis, nettleserbasert basketspill inspirert av [38-0-0](https://38-0-0.com).
Bygg din drømme-startfemmer ved å spinne for ekte NBA-lag og sesonger, draft
én spiller per posisjon, og se om laget ditt kan gå **82-0** gjennom en hel
grunnserie.

## Slik spiller du

1. **Velg modus**
   - **Classic** — fulle stats og overall-rating er synlige.
   - **Expert** — rating og stats er skjult, du drafter på ren kunnskap.
2. **Velg oppstilling** — Tradisjonell (PG/SG/SF/PF/C), Small Ball eller Twin Towers.
3. **Spinn** for å trekke et tilfeldig lag og en sesong.
4. **Draft én spiller** fra den troppen inn i en ledig posisjon.
5. Gjenta i **5 runder** til femmeren er komplett.
6. Få din projiserte **82-kampers rekord** og se hvilket nivå laget havner på.

## Slik beregnes rekorden

Hver spiller har attributtene `INS` (innspill), `OUT` (skyting), `PLY`
(pasningsspill), `REB`, `DEF`, `ATH` og en samlet `OVR`. Når en spiller
plasseres i en posisjon, ganges OVR med en *position fit*-faktor (1.0 for
naturlig posisjon, lavere jo lenger unna). Lagets snittrating mappes så til
antall seire via en logistisk kurve — en feilfri 82-0 krever eliterating
(96+) i hver posisjon.

## Kjøre lokalt

Det er en ren statisk side uten byggesteg. Enten:

- Åpne `index.html` direkte i nettleseren, **eller**
- Start en lokal server (anbefalt):

```bash
# Python 3
python -m http.server 8000
# åpne deretter http://localhost:8000
```

## Filstruktur

```
index.html        # markup + tekst
css/styles.css    # mørkt, NBA-inspirert tema
js/data.js        # datasett med ikoniske lag-sesonger og spillere
js/app.js         # spillogikk (spinn, draft, projeksjon)
```

## Ansvarsfraskrivelse

82-0 er et uoffisielt fanspill, ikke tilknyttet eller godkjent av NBA eller
noen klubb. Spillerrating er subjektive «for moro skyld»-verdier, ikke en
simulering. Kun for underholdning.
