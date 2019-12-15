# FAS
Web-applikation för att administrera sektionens G Suite

![](https://github.com/Fysiksektionen/FAS/workflows/Unittests/badge.svg)

## Utveckling

Börja med att klona repot

`$ git clone https://github.com/Fysiksektionen/FAS.git`

För att installera alla dependencies så kör du 

`npm run install-project`

För att bygga typescript-filerna i `server/` så används `npm run build-server` i projektets rot-mapp (eller `npm run build-ts` i `server/` mappen). Motsvarande `npm run build-client` finns för att bygga klienten. Kort så kan du bygga båda två med `npm run build` i rot-mappen.

Sedan kan hela appen köras i development mode (frontend uppdateras dynamiskt) genom

`npm run dev`

Kör endast `client/` med `npm run client` och endast `server/` med `npm run server`. 

**VIKTIGT**: Du måste kompilera om ts-filerna för att `server/` ska uppdateras. För att slippa göra detta manuellt hela tiden finns `npm run watch-ts`.

### Exempel

Se de olika `package.json` filerna för fler tillgängliga scripts.

```
git clone https://github.com/Fysiksektionen/FAS.git
npm run install-project

# bara servern behöver byggas för att köras i development mode
npm run build-server
npm run dev
```

### Tester

Kör testerna med `npm test`. Beroende på vilken mapp du befinner dig i så körs olika tester (närmaste `package.json` bestämmer). Alla tester körs om du är i rot-mappen, annars körs antingen alla `client/` tester eller alla `server/` tester.
