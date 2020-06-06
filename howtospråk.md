# How to: Språk

## Hur kan jag se till att texten på hemsidan finns på både svenska och engelska?
Då kan du använda LocaleText! Det gör du genom att importera:
```jsx
import { LocaleText } from '../../Contexts/LocaleContext';
```
Sedan kan du hämta en fras genom att ange phrase med dess *path*. Koden nedan kommer att ge tillbaka texten "Taggar" eller "Tags" beroende på vilket språk användaren har valt.
```jsx
<LocaleText phrase='feed/tags'/>
```
För att lägga till en fras gör du det i Data/language.json. Du kan nesta den hur du vill. Vissa fraser kanske passar bättre under *common* medan andra kanske är specifik för en sida och platsar bättre där. I exemplet ovan hämtas tags-frasen från gruppen feed som se ut såhär:
```jsx
    "feed": {
        "header": {
            "se": "Inlägg & Event",
            "en": "Posts & Events"
        },
        "tags": {
            "se": "Taggar",
            "en": "Tags"
        },
        "post": {
            "go_back": {
                "se": "Tillbaka till flödet",
                "en": "Back to feed"
            }
        }
    }
```
För att nå go_back ovan måste du alltså gå ännu längre ner.
```jsx
    <LocaleText phrase='feed/post/go_back'/>
```
När du lägger till en fras måste den ha en svensk och en engelsk text som formateras enligt nedan:
```jsx
"phrase": 
    {
        "se": "Text på svenska",
        "en": "Text in English"
    }
```
Försök undvika att formatera texten i language.json (t.ex. bara versaler) utan gör hellre det i css. Se även till att kolla i filen om en fras redan finns innan du lägger till den.