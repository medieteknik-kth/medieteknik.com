# How to: Storage

I utility/storage.py hittar du funktioner som du kan använda för att göra det lättare att ladda upp på Google Cloud. Dessa funktioner tar själva filen men också ibland en kategori så att filerna ligger mer organiserat i vår Google Cloud mapp. Om du t.ex. vill ladda upp bilder som du får från ett formulär med Flask request gör du så här:

```python
photos = request.files.getlist("photos")
if photos:
    for photo in photos:
        image_url = upload_album_photo(photo, "Albumnamn")
```

För att detta nu ska fungera på din egen dator behöver du autentisera emot Google Cloud. För att göra detta behöver du inloggningsuppgifter som du kan få från Jesper. Sen ska koden ovanför fungera!