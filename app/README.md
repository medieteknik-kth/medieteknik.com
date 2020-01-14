# How to: Frontend

## Begrepp
* API
    * Ett gränssnitt för att kommunicera med backenden
* Component
    * En komponent i gränssnittet
    * Komponenter är ofta uppbyggda av flera andra komponenter
    * Gör oftast en specifik sak, exempelvis att visa ett nyhetsinlägg eller en del av menyn

## Filer och filstruktur
* `package.json`
    * Innehåller bland annat en lista av alla externa paket vi använder
* `public`
    * Innehåller statiska filer som alltid ska synas
    * Ifall en fil tillhör en komponent ska filen alltid ligga där istället
* `src/App.jsx`
    * Rot-komponenten, alltså komponenten som är överst i hiarkin
    * Innehåller en router som visar rätt komponent efter vilken sida som användaren är inne på
* `src/Components`
    * Innehåller mappar med alla komponenter
* `src/Common`
    * Innehåller komponenter och filer som används av hela sidan.
    * Exempelvis en standardtypografi och formulär
* `src/Utility`
    * Innehåller nyttiga filer som kan användas i flera olika delar av projektet
    * Inte komponenter
* `src/Utility/Api.js`
    * En liten klass som gör det enkelt att använda APIet.

## Riktlinjer
Eftersom att Javascript är ett programmeringsspråk som har väldigt få regler följer vi [Airbnb's standard](https://github.com/airbnb/javascript) för att formatera koden. Det finns plugins till många textredigerare (ex. VS Code) som kan formatera koden automatiskt och ge varningar när något ser fel ut.

Komponenter ska vara så små som möjligt och helst bara göra en väldigt specifik sak. Detta gör det möjligt att återanvända komponenter och gör även koden mer läsbar.

## How to: API
För att göra det enkelt att använda APIet i komponenter finns filen `Utility/Api.js`. Här är ett enkelt exempel på hur den funkar:
```jsx
// Importera API-filen
import Api from '../../Utility/Api.js'

// Hämtar alla nämnder
Api.Committees.GetAll().then((data) => {
    // Om det gick bra att hämta nämnder
}).catch((error) => {
    // Om det gick dåligt
})
```

Om ni istället vill hämta en specifik nämnd finns det också `Api.Committees.GetById(id)`. Det går också att byta ut `Committees` med andra resurser. En lista av alla resurser och metoder som går att använda på dem finns i `Api.js`-filen.

## Bygga nya komponenter
För att skapa en ny komponent så skapar ni en ny `.jsx`-fil med ett passande namn. Lägg denna i en lämplig mapp eller skapa en ny mapp om det inte redan finns det. För att göra det enklare kan ni kopiera innehållet från en existerande komponent så har ni en bra grund. Kolla också gärna exemplet nedan.

Eftersom att vi vill använda modern React så ska alla komponenter vara skrivna med React Hooks. Vissa tutorials och guider på internet använder dock det gamla systemet, men använd gärna Hooks i så hög utsträckning som möjligt.

### Exempel på komponent med React Hooks
Här kommer ett enkelt exempel på en komponent skriven med React Hooks. Denna ska visa ett enkelt formulär.
```jsx
import React, { useState, useEffect } from 'react';

// Importera eventuella CSS-filer eller bilder som tillhör komponenten här

export default function NameForm() {
  // Skapar en state variabel som heter name med värdet "Median". Variabeln går att ändras med funktionen setName()
  const [name, setName] = useState("Median");

  useEffect(() => {
    // Denna funktion anropas varje gång komponenten ändras
  });

  return (
    <form>
      <input
        type="text"
        value={name} // Värdet av formuläret är alltid värdet av name
        onChange={event => setName(event.target.value)} // När användaren ändrar i formuläret så ska name också uppdateras 
      />
    </form>
  );
}
```

Högst upp ser ni en variabel som skapas med state. State innebär att när variablen uppdateras så kommer hela komponenten uppdateras också, vilket innebär att informationen i komponenten alltid är aktuell. I detta fall sätts "Median" som värdet vid start.

För att skapa fler variabler så är det bara att lägga till fler rader som ser ut på samma sätt. Så exempelvis en state variabel som räknar något:
```jsx
const [count, setCount] = useState(10);
```

Ni ser också funktionen useEffect som kommer kallas varje gång komponentens state ändras. Om man bara vill att useEffect ska anropas vid start (exempelvis när ni använder APIet) så ser det ut så här:
```jsx
useEffect(() => {
  // kod som bara körs i början
}, []); // <- Skillnaden är []
```