# FAS
Web-applikation för att administrera sektionens G Suite

![](https://github.com/Fysiksektionen/FAS/workflows/Unittests/badge.svg)

## Utveckling

Börja med att klona repot

`$ git clone https://github.com/Fysiksektionen/FAS.git`

Appen antar att du kör en mongo-databas på `mongodb://localhost:27017/`. Om du inte orkar installera mongodb
 så kan du köra följande kommando för att istället lagra saker i minnet. Detta är bara för att snabbt prototypa och ska inte köras i production.

 `$ export FAS_USE_DEV_MEMSTORE=true`

För att installera alla dependencies så kör du 

`npm run install-project`

Sedan kan hela appen köras i development mode (kompileras och uppdateras dynamiskt) genom

`npm run dev`

Kör endast `client/` med `npm run client` och endast `server/` med `npm run server`. 

### Exempel

Se de olika `package.json` filerna för fler tillgängliga scripts.

```
git clone https://github.com/Fysiksektionen/FAS.git
npm run install-project

npm run dev
```

### Tester

Kör testerna med `npm test`. Beroende på vilken mapp du befinner dig i så körs olika tester (närmaste `package.json` bestämmer). Alla tester körs om du är i rot-mappen, annars körs antingen alla `client/` tester eller alla `server/` tester.
