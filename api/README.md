# How to: Backend

## Begrepp
* REST API
    * Ett sätt för olika frontends att kommunicera med backenden
* Model
    * En datastruktur i databasen
    * Exempelvis ett nyhetsinlägg
* Resource
    * APIet består av olika resurser och här ligger koden som styr vad som händer vid de olika resurserna.

## Filer och filstruktur
* `api/__init__.py`
    * Det är här programmet startar och initierar alla nödvändiga objekt och variabler
* `api/db.py`
    * Liten fil som initierar databasen
* `api/models`
    * Innehåller alla modeller
* `api/resources`
    * Innehåller alla resurser
* `static`
    * Innehåller statiska filer
    * Exempelvis profilbilder som laddats upp

## Riktlinjer
* Vi följer [PEP-8 standarden](https://www.python.org/dev/peps/pep-0008/) för Python vilket innebär att koden ska formateras på ett speciellt sätt. Om alla följer samma standard blir koden fin och läsbar för alla. Det finns plugins till många textredigerare (ex. VS Code) som kan formatera koden automatiskt.

* Ingen logik ska hända i modellerna. Det innebär att modellerna ska bara hålla koll på variabler och inget mer. Logiken ska ske i resource-filerna.

## Bygga nya resurser
För att lägga till en ny resurs skapar du en fil i `resources`-mappen. Du kan kopiera innehållet från en annan resurs så har du en bra grund. En resurs kan ha lite olika metoder beroende på vad du vill att den ska kunna göra. Dessa är bland annat `get`, `delete` och `put`.

För att registrera en resurs behöver du lägga till den i `__init__.py`. Se till att importera rätt resurs högst upp i filen och så använder du `api.add_resource()` för att lägga till resursen.

Mer info om hur resurser funkar hittar ni på [Flask-RESTful's hemsida](https://flask-restful.readthedocs.io/en/latest/quickstart.html).

## Bygga nya modeller
Ifall ni vill skapa en modell som ska lagras i databasen skapar ni en ny fil i `models`-mappen. Här går det också bra att kopiera från en annan modell så har ni en bra grund. Varje variabel i modellen behöver veta vad den är för typ, dvs. om det är en siffra, ett datum eller något annat.

När ni har en ny modell behöver ni skapa den i databasen. Detta gör ni enklast genom att starta servern och gå in på http://localhost:5000/create_all. Detta rensar databasen och skapar nya tabeller efter alla modeller.

Ni kan läsa mer om hur SQL-alchemy och modeller funkar [här](https://flask-sqlalchemy.palletsprojects.com/en/2.x/quickstart/) och [här](https://hackersandslackers.com/database-queries-sqlalchemy-orm/).

## Endpoints
Nedan följer en lista på API:ts endpoints, vilken funktionalitet de har, och hur data de förväntar sig/returnerar ser ut
1. ### /documents
    Detta endpoint hanterar dokument (plural), samt uppladdning av nya dokument, och har följande metoder:
    * GET: returnerar en lista på alla dokument som just nu finns i databasen, i form av en lista med JSON-objekt. ett typiskt svar ser ut så här:
        ```json
            documents:[
                {
                    "date": "2020-04-06 16:35:23.935665",
                    "filename":"abc123.pdf",
                    "itemId":"1",
                    "tags":[	
                            0,
                            1
                    ],
                    "thumbnail":"parrot.gif",
                    "title":"PROTOKOLLLLLA IN DET HÄR"
                }
            ]
        ```
        OBS att `tags` är en lista med databas-ID:n för olika taggar. Jag rekommenderar att du hämtar taggar separat från rätt endpoint

    * POST: laddar upp ett dokument, med automatisk genererad thumbnail på servern. Servern förväntar sig `multipart/form-data` här, med följande fält:
        * tags: ett json-objekt som innehåller *minst en* array med tag-ID:n, t.ex:
        ```json
        {"0": [0,1,2,3]}
        ``` 
        alla taggar måste självklart redan finnas i databasen, vi lägger inte till taggar dynamiskt.

        * file: ett filobjekt. detta kommer ligga i mappen `static/documents` på servern

        * thumbnail: en `.png` som visar dokumentets första sida. Frontenden förväntas generera denna.

        * title: det filnamn som kommer visas på frontenden OBS att `title ≠ filename` av kollisionsundvikningsskäl.

2. ### documents_tags
    * GET: returnerar en lista med JSON-objekt som representerar taggar i databasen. Ett typiskt svar ser ut såhär:
        ```json
        [
            {
                "tagId":1,
                "title":"styrelsen"
            }
        ]
        ```
    där `tagId` är taggens ID (key) i databasen, och `title` är dess namn.

3. ### documents/<filename>
    * GET: returnerar en fil från `static/documents`.  `<filename>` är namnet (inte titeln!) på filen du vill hämta

4. ### thumbnails/<filename>
    * GET: samma som 3), fast en bild istället.
