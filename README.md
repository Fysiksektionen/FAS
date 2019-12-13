# namndadmin
Web-applikation för att administrera sektionens G Suite

## Utveckling

Börja med att klona repot

`$ git clone https://github.com/Fysiksektionen/namndadmin.git`

För att installera alla dependencies så körs

`npm install`

Kompilera alla typescript filer genom

`npm run build-ts` (kör `npm run watch-ts` för att bygga medan du skriver kod)

För att köra servern i development mode körs sedan 

`npm start`

Nu körs servern på `http://localhost:3000`.

### Tester

Kör tester med `npm run test` eller `npm run test-watch` för livekörning när du uppdaterar testkoden.