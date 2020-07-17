# FAS
Webbapplikation för administrering av sektionens G Suite.

![](https://github.com/Fysiksektionen/FAS/workflows/Unittests/badge.svg)

## Installation
Klona ner repot och installera alla dependencies:

```
git clone https://github.com/Fysiksektionen/FAS.git
npm run install-project
```

## Utveckling
Appen antar att du kör en Mongo-databas på `mongodb://localhost:27017/`. Om du inte orkar installera mongodb
så kan du köra följande kommando för att istället lagra saker i minnet (ska ej användas i produktion).

`export FAS_USE_DEV_MEMSTORE=true`

### Dev
Appen kompileras och uppdateras dynamiskt. React serveras separat på localhost:3000.  
```
npm run dev
```

För fler tillgängliga skript, se de olika `package-json`-filerna.

### Staging
Kör production lokalt. React byggs separat och servas sedan av backend på `localhost:8080`.
```
npm run build-client
npm run staging
```

## Production
Kör production med inloggning mot login.kth.se.
```
npm run build-client
npm run pro
```

## Tester

Kör testerna med `npm test`. Beroende på vilken mapp du befinner dig i så körs olika tester (närmaste `package.json` bestämmer). Alla tester körs om du är i rot-mappen, annars körs antingen alla `client/` tester eller alla `server/` tester.
