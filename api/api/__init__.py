from flask import Flask, session, jsonify, request, redirect, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_cas import CAS, login_required
from flask_restful import Api

from api.db import db

from api.resources.user import UserResource, UserListResource
from api.resources.committee import CommitteeResource, CommitteeListResource
from api.resources.committee_post import CommitteePostResource, CommitteePostListResource
from api.resources.document import DocumentResource, DocumentListResource, DocumentTagResource
from api.resources.menu import MenuItemResource, MenuResource
from api.resources.search import SearchResource
from api.resources.page import PageResource, PageListResource

import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///medieteknikdev.db')
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", "2kfueoVmpd0FBVFCJD0V")
app.config['CAS_SERVER'] = os.getenv("CAS_SERVER", "/")
app.config['CAS_LOGIN_ROUTE'] = os.getenv("CAS_LOGIN_ROUTE", "/login")
app.config['CAS_LOGOUT_ROUTE'] = os.getenv("CAS_LOGOUT_ROUTE", "/logout")
app.config['CAS_VALIDATE_ROUTE'] = os.getenv("CAS_VALIDATE_ROUTE", "/p3/serviceValidate")
app.config['CAS_AFTER_LOGIN'] = os.getenv("CAS_AFTER_LOGIN", "/")
os.makedirs(os.path.join(os.getcwd(), "static", "profiles"), exist_ok=True)

db.init_app(app)
CORS(app)
api = Api(app)

api.add_resource(UserListResource, "/users")
api.add_resource(UserResource, "/users/<id>")

api.add_resource(CommitteeListResource, "/committees")
api.add_resource(CommitteeResource, "/committees/<id>")

api.add_resource(CommitteePostListResource, "/committee_posts")
api.add_resource(CommitteePostResource, "/committee_posts/<id>")

api.add_resource(DocumentListResource, "/documents")
api.add_resource(DocumentResource, "/documents/<id>")
api.add_resource(DocumentTagResource, "/document_tags")

api.add_resource(MenuResource, "/menus")
api.add_resource(MenuItemResource, "/menus/<id>")

api.add_resource(SearchResource, "/search/<search_term>")

api.add_resource(PageListResource, "/pages")
api.add_resource(PageResource, "/pages/<id>")

if app.debug:
    local_cas = Blueprint("cas", __name__)
    @local_cas.route("/login", methods=["GET", "POST"])
    def login():
        if request.method == 'POST':
            session["CAS_USERNAME"] = request.form["username"]

            if request.args.get('service'):
                return redirect(request.args.get('service'))

            return jsonify(success=True)
        else:
            return "<form method='POST'><input placeholder='användarnamn' name='username'></input><input type='submit' /></form>"

    @local_cas.route('/logout')
    def logout():
        if "CAS_USERNAME" in session:
            session.pop("CAS_USERNAME")

        if request.args.get('service'):
            return redirect(request.args.get('service'))

        return jsonify(success=True)
    
    app.register_blueprint(local_cas)
else:
    CAS(app)

@app.route("/authtest")
@login_required
def auth_test():
    return "Du är inloggad som " + str(session["CAS_USERNAME"])

@app.route("/create_all")
def route_create_all():
    from api.models.user import User, Committee, CommitteePost, relationship_table
    from api.models.document import Document, Tag, DocumentTags
    from api.models.page import Page, PageRevision, PageRevisionType
    db.drop_all()
    db.create_all()


    user1 = User()
    user1.email = "jeslundq@kth.se"
    user1.kth_id = "joppe"
    user1.first_name = "Jesper"
    user1.last_name = "Lundqvist"
    user1.frack_name = "Joppe"
    user1.kth_year = 2016
    user1.facebook = "https://www.facebook.com/jesperlndqvist"
    user1.linkedin = "https://www.linkedin.com/in/jesper-lundqvist-63a47a126/"

    user2 = User()
    user2.email = "medieteknik@medieteknik.com"
    user2.kth_id = "test2"
    user2.first_name = "Media"
    user2.last_name = "Mediansson"
    user2.frack_name = "Media"
    user2.kth_year = 2000

    user3 = User()
    user3.email = "medieteknik@medieteknik.com"
    user3.kth_id = "test"
    user3.first_name = "Media2"
    user3.last_name = "Mediansson"
    user3.frack_name = "Media"
    user3.kth_year = 2000

    committee1 = Committee()
    committee1.name = "Hemsideprojektet"
    committee1.logo = "https://i.imgur.com/29xtEWZ.png"
    committee1.header_image = "https://i.imgur.com/h6jxbaR.jpg"
    committee1.description = "Vi bygger sektionens nästa hemsida."
    committee1.instagram_url = "https://www.instagram.com/medieteknik_kth/"

    CommitteePost1 = CommitteePost()
    CommitteePost1.name= "Projektledare för Hemsidan"
    user1.committee_posts.append(CommitteePost1)

    committee2 = Committee()
    committee2.name = "Mottagningen"
    committee2.logo = "http://www.medieteknik.com/sites/default/files/styles/700_width/public/mottagningen_1.png?itok=PDy_0qSI"
    committee_post2 = CommitteePost()
    committee_post2.name = "Öfverphös"
    committee_post2.officials_email = "oph@medieteknik.com"
    committee_post2.committee = committee2
    user1.committee_posts.append(committee_post2)
    user2.committee_posts.append(committee_post2)

    CommitteePost1.committee = committee1

    page = Page()
    page_revision1 = PageRevision()
    page_revision1.title = "Rubrik"
    page_revision1.content = "<p>tjenare</p>"
    page_revision1.author = user1
    page_revision1.revision_type = PageRevisionType.created
    page_revision1.published = False

    page_revision2 = PageRevision()
    page_revision2.title = "Rubriken"
    page_revision2.content = "<p>hallå</p>"
    page_revision2.author = user2
    page_revision2.revision_type = PageRevisionType.edited
    page_revision2.published = True

    page.revisions.append(page_revision1)
    page.revisions.append(page_revision2)

    committee1.page = page

    db.session.add(user1)
    db.session.add(user2)
    db.session.add(user3)
    db.session.add(committee1)
    db.session.add(CommitteePost1)
    db.session.add(page_revision1)
    db.session.add(page_revision2)
    db.session.add(page)

    doc = Document()
    doc.title = "PROTOKOLLLLLA IN DET HÄR"
    doc.fileName = "abc123.pdf"
    doc.uploadedBy = "Joppe"
    

    tag = Tag()
    tag.title = "styrelsen"

    tag2 = Tag()
    tag2.title = "annat"
    

    db.session.add(doc)
    db.session.add(tag)
    db.session.add(tag2)
    db.session.commit()
    doctag = DocumentTags()
    doctag.itemId = doc.itemId
    doctag.tagId = tag.tagId
    db.session.add(doctag)

    db.session.commit()

    return "klar"
