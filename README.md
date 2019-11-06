# How to: Hemsidan

## Ifall ni använder Windows


1. Ladda ner och installera [Docker Toolbox](https://github.com/docker/toolbox/releases).
2. Starta VirtualBox och uppdatera den till senaste versionen (den fås inte med i Toolbox)
3. Starta om datorn
4. Starta VirtualBox
5. Starta Docker Quickstart Terminal (kolla vilken IP-adress som står högst upp! det är denna som ni går in på )
6. Gå in i mappen med alla filer för hemsidan.
7. Kör:
````
docker-compose up --build
````
8. Efter att den laddat ner allt som krävs kommer servern slutligen vara startad! Ni kan nu nå hemsidan i er webbläsare på <ip-adressen som stod högst upp i Docker Quickstart Terminal>:3000 och <samma IP-adress>:5000 för API:t.


## Ifall ni använder något annat än Windows

1. Ladda ner och installera [Docker Desktop](https://www.docker.com/products/docker-desktop). Ni kanske måste göra ett konto.
2. Gå in i terminalen och kör:
````
docker-compose up --build
````
5. När allt laddats ner kan ni nå hemsidan i er webbläsare på localhost:3000 och localhost:5000 för API:t.
