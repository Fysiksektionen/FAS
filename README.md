# FAS
Web-applikation för att administrera sektionens G Suite

![](https://github.com/Fysiksektionen/FAS/workflows/Unittests/badge.svg)

## Utveckling

Börja med att klona repot

`$ git clone https://github.com/Fysiksektionen/FAS.git`

För att installera alla dependencies så måste du tyvärr just nu köra `npm install` separat i både `client/` och `server/`.


### Backend

För att köra backend servern så kompileras alla typescript filer genom

`npm run build-ts` (kör `npm run watch-ts` för att bygga medan du skriver kod)

För att köra servern i development mode körs sedan 

`npm start`

Nu körs servern på `http://localhost:8080`.

### Frontend

För att köra frontend react klienten så körs bara `npm start` i mappen `client/`. Nu körs servern på `http://localhost:3000`

### Tester

Kör tester med `npm test` i antingen `client/` eller `server/` beroende på vilka tester du vill köra.
Se motsvarande `package.json` för att se fler tillgängliga npm scripts.