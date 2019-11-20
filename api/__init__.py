from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://medieteknik:rgb@db/medieteknikdev'
db = SQLAlchemy(app)

@app.route("/create_all")
def route_create_all():
    from api.models.user import User, Committee, OfficialsPost, relationship_table
    db.drop_all()
    db.create_all()

    from api.models.document_models import Document, Tag, DocumentTags
    db.drop_all()
    db.create_all()

    doc = Document()
    doc.title = "PROTOKOLLLLLA IN DET HÄR"

    tag = Tag()
    tag.title = "styrelsen"
    tag.tagId = 2

    doctag = DocumentTags()
    doctag.itemId = doc.itemId
    doctag.tagId = tag.tagId
    doc.tags.append(doctag)

    tag2 = Tag()
    tag2.title = "testy"
    tag2.tagId = 3

    doctag2 = DocumentTags()
    doctag2.itemId = doc.itemId
    doctag2.tagId = tag2.tagId
    doc.tags.append(doctag2)

    db.session.add(doc)
    db.session.add(tag)
    db.session.add(tag2)
    db.session.add(doctag)
    db.session.add(doctag2)


    user = User()
    user.email = "jeslundq@kth.se"
    user.first_name = "Jespeer"
    user.last_name = "Lundqvist"
    user.frack_name = "Joppe"
    user.kth_year = 2016
    user.facebook = "https://www.facebook.com/jesperlndqvist"
    user.linkedin = "https://www.linkedin.com/in/jesper-lundqvist-63a47a126/"
    user.profile_picture = "/default.png"
    user.profile_picture = False

    committee1 = Committee()
    committee1.name = "MKMKMKMKHÄSTEN HETER FÖL"
    officialspost1 = OfficialsPost()
    officialspost1.name= "haaj"
    user.officials_posts.append(officialspost1)

    officialspost2 = OfficialsPost()
    officialspost2.name= "val"
    officialspost2.committee=committee1
    user.officials_posts.append(officialspost2)

    officialspost1.committee = committee1

    db.session.add(user)
    db.session.add(committee1)
    db.session.add(officialspost1)
    db.session.add(officialspost2)
    db.session.commit()

    return "klar"



from api import routes