from flask import Flask, session, jsonify, request, redirect, Blueprint, send_file, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_cas import CAS, login_required
from flask_restful import Api

from flasgger import Swagger

from api.db import db

from api.resources.user import UserResource, UserListResource
from api.resources.committee import CommitteeResource, CommitteeListResource
from api.resources.committee_post import CommitteePostResource, CommitteePostListResource
from api.resources.document import DocumentResource, DocumentListResource, DocumentTagResource
from api.resources.menu import MenuItemResource, MenuResource
from api.resources.search import SearchResource
from api.resources.post import PostResource, PostAddResouce, PostListResource
from api.resources.post_tag import PostTagResource, PostTagAddResource, PostTagListResource
from api.resources.page import PageResource, PageListResource
from api.resources.officials import OfficialsResource
from api.resources.authentication import AuthenticationResource, CASResource
from api.resources.health import HealthResource


import os
import datetime

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///medieteknikdev.db')
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", "2kfueoVmpd0FBVFCJD0V")
app.config['CAS_SERVER'] = os.getenv("CAS_SERVER", "/")
app.config['CAS_LOGIN_ROUTE'] = os.getenv("CAS_LOGIN_ROUTE", "/login")
app.config['CAS_LOGOUT_ROUTE'] = os.getenv("CAS_LOGOUT_ROUTE", "/logout")
app.config['CAS_VALIDATE_ROUTE'] = os.getenv("CAS_VALIDATE_ROUTE", "/p3/serviceValidate")
app.config['CAS_AFTER_LOGIN'] = os.getenv("CAS_AFTER_LOGIN", "casresource")
os.makedirs(os.path.join(os.getcwd(), "static", "profiles"), exist_ok=True)
os.makedirs(os.path.join(os.getcwd(), "static", "posts"), exist_ok=True)

app.config['SWAGGER'] = {
    "title": "Medieteknik API",
    "description": None,
    "termsOfService": None,
    "version": "0.1.0",
    "openapi": "3.0.2",
    "uiversion": 3,
    "components": {
        "securitySchemes": {
            "authenticated": {
                "type": "apiKey",
                "in": "header",
                "name": "token"
            }
        },
    }
}

db.init_app(app)
CORS(app)
api = Api(app)
swagger = Swagger(app)

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

api.add_resource(PostListResource, "/posts")
api.add_resource(PostResource, "/posts/<id>")
api.add_resource(PostAddResouce, "/post")

api.add_resource(PostTagListResource, "/post_tags")
api.add_resource(PostTagResource, "/post_tags/<id>")
api.add_resource(PostTagAddResource, "/post_tag")

api.add_resource(PageListResource, "/pages")
api.add_resource(PageResource, "/pages/<id>")

api.add_resource(OfficialsResource, "/officials")

api.add_resource(HealthResource, "/health")

api.add_resource(AuthenticationResource, "/auth")
api.add_resource(CASResource, "/cas")

if app.debug:
    from api.models.user import User

    local_cas = Blueprint("cas", __name__)
    @local_cas.route("/login", methods=["GET", "POST"])
    def login():
        if request.method == 'POST':
            if User.query.filter_by(kth_id=request.form["username"]).first() != None:
                session["CAS_USERNAME"] = request.form["username"]

                return redirect(url_for(app.config['CAS_AFTER_LOGIN']))
            else:
                return "Ogiltigt användarnamn. Användarnamnet behöver vara ett giltigt KTH-ID (ex. u1xxxxxx)."
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
    
@app.route('/get_image')
def get_image():
    return send_file(request.args.get('path'), mimetype='image/png')

@app.route("/create_all")
def route_create_all():
    from api.models.user import User, Committee
    from api.models.committee_post import CommitteePost#, CommitteePostTerm
    from api.models.document import Document, Tag, DocumentTags
    from api.models.post import Post
    from api.models.page import Page, PageRevision, PageRevisionType
    from api.models.post_tag import PostTag
    db.drop_all()
    db.create_all()

    def create_committee(name):
        committee = Committee()
        committee.name = name
        db.session.add(committee)
        return committee
    
    def create_post(committee, post_name, category):
        post = CommitteePost()
        post.name = post_name
        post.committee = committee
        post.is_official = True
        post.category = category
        db.session.add(post)
        return post

    def create_official(first_name, last_name, post, follows_operational_year):
        user = User()
        user.first_name = first_name
        user.last_name = last_name
        if follows_operational_year:
            user.post_terms.append(post.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2021, 6, 30)))
        else:
            user.post_terms.append(post.new_term(datetime.datetime(2019, 1, 1), datetime.datetime(2020, 12, 31)))
        db.session.add(user)
        return user

    def add_post_to_user(user, post, follows_operational_year):
        if follows_operational_year:
            user.post_terms.append(post.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2021, 6, 30)))
        else:
            user.post_terms.append(post.new_term(datetime.datetime(2019, 1, 1), datetime.datetime(2020, 12, 31)))

    mkm = create_committee("Medias Klubbmästeri")
    kbm = create_post(mkm, "Klubbmästare", "Studiesocialt")
    create_official("Hilda", "Robertsson", kbm, True)
    create_official("Amalia", "Berglöf", kbm, True)

    styrelsen = create_committee("Styrelsen")
    create_official("Oliver", "Kamruzzaman", create_post(styrelsen, "Ordförande", "Styrelsen"), True)
    create_official("My", "Andersson", create_post(styrelsen, "Vice Ordförande", "Styrelsen"), False)
    sandra = create_official("Sandra", "Larsson", create_post(styrelsen, "Kassör", "Styrelsen"), True)
    jessie = create_official("Jessie", "Liu", create_post(styrelsen, "Sekreterare", "Styrelsen"), False)
    create_official("Lina", "Bengtsson", create_post(styrelsen, "Ledamot för Utbildningsfrågor", "Styrelsen"), True)
    create_official("Samuel", "Kraft", create_post(styrelsen, "Ledamot för Studiesocialt", "Styrelsen"), True)
    create_official("Hanna", "Bjarre", create_post(styrelsen, "Ledamot för Näringsliv- och kommunikation", "Styrelsen"), True)

    create_official("Moa", "Engquist", create_post(create_committee("Jubileet"), "Jubelgeneral", "Studiesocialt"), True)
    create_official("Johanna", "Nilsen", create_post(create_committee("METAdorerna"), "Sektionslokalsansvarig", "Studiesocialt"), True)
    create_official("Johanna", "Simfors", create_post(create_committee("Spexmästeriet"), "Spexmästare", "Studiesocialt"), True)
    create_official("Samuel", "Kraft", create_post(create_committee("Sånglederiet"), "Öfversångledare", "Studiesocialt"), False)
    create_official("Edvin", "Hedenström", create_post(create_committee("Medielabbet"), "Medielabbets Ordförande", "Studiesocialt"), True)
    fotogruppsansvarig = create_post(create_committee("Fotogruppen"), "Fotogruppsansvarig", "Studiesocialt")
    create_official("Andreas", "Wingqvist", create_post(create_committee("Idrottsnämnden"), "Idrottsnämndsordförande", "Studiesocialt"), True)
    create_official("Martin", "Neihoff", create_post(create_committee("Qulturnämnden"), "Qulturnämndsordförande", "Studiesocialt"), False)
    
    mtgn = create_committee("Mottagningen")
    oph = create_post(mtgn, "Öfverphös", "Studiesocialt")
    create_official("Kajsa", "Saare", oph, False)
    add_post_to_user(sandra, oph, False)
    create_official("Gabriella", "Dalman", oph, False)
    
    create_official("Amanda", "Brundin", create_post(create_committee("Matlaget"), "Mästerkocken", "Studiesocialt"), True)
    create_official("Oskar", "Svanström", create_post(create_committee("Ljud- och ljustekniker"), "Ljud- och ljustekniker", "Studiesocialt"), True)
    
    are = create_committee("spÅre")
    ursparare = create_post(are, "UrSpårare", "Studiesocialt")
    create_official("John", "Brink", ursparare, True)
    erik = create_official("Erik", "Meurk", ursparare, True)
    simon = create_official("Simon", "Sundström", ursparare, True)

    add_post_to_user(erik, create_post(create_committee("Kommunikationsnämnden"), "Kommunikatör", "Näringsliv- och kommunikation"), True)

    nlgordf = create_post(create_committee("Näringslivsgruppen"), "Näringslivsansvarig", "Näringsliv- och kommunikation")
    create_official("Johanna", "Iivanainen", nlgordf, True)
    create_official("Anna", "Gustavsson", nlgordf, True)

    branchdagen = create_post(create_committee("Medias Branschdag"), "Projektledare för Branschdagen", "Näringsliv- och kommunikation")
    rasmus = create_official("Rasmus", "Rudling", branchdagen, True)
    ellaklara = create_official("Ella Klara", "Westerlund", branchdagen, True)

    joppe = create_official("Jesper", "Lundqvist", create_post(create_committee("Webmaster"), "Webmaster", "Näringsliv- och kommunikation"), False)
    
    studie = create_committee("Studienämnden")
    create_official("Sofia", "Lundin Ziegler", create_post(studie, "Studienämndsordförande", "Utbildning"), True)
    create_official("Amanda", "Andrén", create_post(studie, "Programansvarig student", "Utbildning"), False)
    create_official("Nina", "Nokelainen", create_post(studie, "Studerandeskyddsombud", "Utbildning"), True)
    create_official("Christoffer", "Vikström", create_post(studie, "Jämlikhets- och mångfaldsombud", "Utbildning"), True)
    add_post_to_user(simon, create_post(create_committee("Internationell Samordnare"), "Internationella nämnden", "Utbildning"), True)
    
    val = create_committee("Valberedningen")
    create_official("Mimmi", "Andreasson", create_post(val, "Valberedningens Ordförande", "Valberedningen"), True)
    valberedare = create_post(val, "Valberedare", "Valberedningen")
    create_official("Anja", "Studic", valberedare, True)
    create_official("Nathalie", "Lock", valberedare, True)
    create_official("Alex", "Modee", valberedare, True)
    create_official("Emma", "Hagrot", valberedare, False)
    create_official("Anna", "Eckernäs", valberedare, False)
    create_official("Saga", "Palmér", valberedare, False)

    revisor = create_post(create_committee("Revisorerna"), "Revisor", "Revisorerna")
    kristina = create_official("Kristina", "Andersson", revisor, True)
    create_official("Mahmoud", "Sherzad", revisor, True)

    fanborg = create_post(create_committee("Fanborgen"), "Fanbärare", "Fanborgen")
    create_official("Sofia", "Blomgren", fanborg, True)
    create_official("Emil", "Erlandsson", fanborg, True)


    joppe.email = "jeslundq@kth.se"
    joppe.kth_id = "u1veo32n"
    joppe.first_name = "Jesper"
    joppe.last_name = "Lundqvist"
    joppe.frack_name = "Joppe"
    joppe.kth_year = 2016
    joppe.facebook = "https://www.facebook.com/jesperlndqvist"
    joppe.linkedin = "https://www.linkedin.com/in/jesper-lundqvist-63a47a126/"

    mikaela = User()
    mikaela.email = "migarde@kth.se"
    mikaela.kth_id = "u1w37ayy"
    mikaela.first_name = "Mikaela"
    mikaela.last_name = "Gärde"
    mikaela.frack_name = "Mickan"
    mikaela.kth_year = 2018

    rasmus.email = "rrudling@kth.se"
    rasmus.kth_id = "u1dgt6op"
    rasmus.first_name = "Rasmus"
    rasmus.last_name = "Rudling"
    rasmus.frack_name = "Rasmus"
    rasmus.kth_year = 2017

    mina = User()
    mina.email = "minata@kth.se"
    mina.kth_id = "u1dyjin1"
    mina.first_name = "Mina"
    mina.last_name = "Tavakoli"
    mina.kth_year = 2016

    fredrik = User()
    fredrik.email = "flundkvi@kth.se"
    fredrik.kth_id = "u16en6op"
    fredrik.first_name = "Fredrik"
    fredrik.last_name = "Lundkvist"
    fredrik.frack_name = "Foppe"
    fredrik.kth_year = 2016

    jessie.email = "jessieli@kth.se"
    jessie.kth_id = "u1nv9g8f"
    jessie.first_name = "Jessie"
    jessie.last_name = "Liu"
    jessie.kth_year = 2018

    kristina.email = "kan2@kth.se"
    kristina.kth_id = "u166gwua"
    kristina.first_name = "Kristina"
    kristina.last_name = "Andersson"
    kristina.frack_name = "Kristina"
    kristina.kth_year = 2017
    
    albin = User()
    albin.email = "agyllang@kth.se"
    albin.kth_id = "u1euay4u"
    albin.first_name = "Albin"
    albin.last_name = "Matson Gyllang"
    albin.kth_year = 2017

    ellaklara.email = "ekwe@kth.se"
    ellaklara.kth_id = "u1a6m9eb"
    ellaklara.first_name = "Ella Klara"
    ellaklara.last_name = "Westerlund"
    ellaklara.kth_year = 2017

    committee1 = Committee()
    committee1.name = "Hemsideprojektet"
    committee1.logo = "https://i.imgur.com/29xtEWZ.png"
    committee1.header_image = "https://i.imgur.com/h6jxbaR.jpg"
    committee1.description = "Vi bygger sektionens nästa hemsida."
    committee1.instagram_url = "https://www.instagram.com/medieteknik_kth/"

    committee2 = Committee()
    committee2.name = "Mottagningen"

    post = CommitteePost()
    post.name = "Projektledare för Hemsidan"
    post.committee = committee1
    post.is_official = True
    post.category = "Näringsliv- och kommunikation"
    term1 = post.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31))
    
    post2 = CommitteePost()
    post2.committee = committee1
    post2.is_official = False
    mikaela.post_terms.append(post2.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31)))
    rasmus.post_terms.append(post2.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31)))
    mina.post_terms.append(post2.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31)))
    fredrik.post_terms.append(post2.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31)))
    jessie.post_terms.append(post2.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31)))
    kristina.post_terms.append(post2.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31)))
    albin.post_terms.append(post2.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31)))
    ellaklara.post_terms.append(post2.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31)))

    mikaela.post_terms.append(fotogruppsansvarig.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 6, 30)))

    joppe.post_terms.append(term1)
    
    page = Page()
    page_revision1 = PageRevision()
    page_revision1.title = "Rubrik"
    page_revision1.content = "{\"ops\":[{\"insert\":\"Vi bygger sektionens nya hemsida\"},{\"attributes\":{\"header\":2},\"insert\":\"\\n\"},{\"insert\":\"Sektionens hemsida b\u00f6rjar bli gammal. Vi kommer ge hemsidan, och sektionen, en v\u00e4lbeh\u00f6vd makeover s\u00e5 att vi som pluggar medieteknik kan f\u00e5 mer nytta av hemsidan. Den nya hemsidan kommer samla all information om allt som h\u00e4nder p\u00e5 sektionen. Alla event, alla ans\u00f6kningsperioder, ska l\u00e4tt g\u00e5 att hitta p\u00e5 den nya sidan.\\nDen kommer naturligtvis ocks\u00e5 vara v\u00e4ldigt snygg, kolla bara runt hur det ser ut hittills! Vi \u00e4r ju trots allt medietekniker, vi gillar snygga saker, s\u00e5 d\u00e5 ska v\u00e5r sektion s\u00e5 klart vara den snyggaste p\u00e5 KTH.\\n\"},{\"attributes\":{\"link\":\"https://github.com/medieteknik-kth/medieteknik.com\"},\"insert\":\"All v\u00e5r kod finns p\u00e5 Github!\"},{\"insert\":\"\\n\"}]}"
    page_revision1.author = joppe
    page_revision1.revision_type = PageRevisionType.created
    page_revision1.published = True

    page.revisions.append(page_revision1)

    committee1.page = page

    db.session.add(joppe)
    db.session.add(mikaela)
    db.session.add(rasmus)
    db.session.add(mina)
    db.session.add(fredrik)
    db.session.add(jessie)
    db.session.add(kristina)
    db.session.add(albin)
    db.session.add(ellaklara)

    db.session.add(committee1)
    db.session.add(post)
    db.session.add(page_revision1)
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

    post = Post()
    post.title = "Folk söker folk"
    post.title_en = "People are looking for people"
    post.user_id = mikaela.id
    post.body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus, ante at tristique accumsan, tellus nulla consequat nisl, quis mollis quam arcu vel urna. Proin eleifend augue ante, malesuada porta libero ullamcorper vel. Mauris quis diam augue. Integer consectetur justo lorem, vitae consectetur lectus laoreet ac. Sed vel accumsan nulla, et laoreet justo. Sed porttitor dui nec nisi aliquam, elementum sagittis velit molestie. Nam rhoncus nibh neque, eget scelerisque quam sollicitudin ut. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus eget dictum diam. Phasellus gravida dui et nunc finibus, ut feugiat nisi pulvinar. Nulla egestas, lorem vitae elementum sodales, diam mauris dictum sapien, in luctus velit lorem nec ante. \
    Proin facilisis augue nibh, vitae placerat metus rhoncus at. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisi a mauris elementum imperdiet ac in velit. Curabitur scelerisque, justo id molestie molestie, augue elit elementum orci, vitae fringilla turpis magna vitae nisl. Vestibulum id suscipit felis, vel bibendum tortor. Mauris porta tortor lorem, eget feugiat enim bibendum laoreet. Cras lacinia at massa sed scelerisque. Curabitur porta tristique suscipit. Etiam interdum lacus id cursus porttitor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. \
    Morbi sed metus aliquam, sollicitudin arcu sed, feugiat nunc. Duis libero nisi, ornare ac finibus eu, placerat vitae elit. Nulla convallis feugiat placerat. Sed fringilla, arcu sit amet condimentum gravida, tortor lorem aliquet nulla, id sagittis elit erat at libero. Suspendisse laoreet orci vitae risus pretium, in auctor neque mattis. Aliquam erat volutpat. Vivamus in lacus in arcu eleifend molestie. Sed elit dui, malesuada nec erat vel, commodo porta metus. In tempor iaculis tortor, sed finibus risus dignissim ac. Etiam tortor diam, euismod vel arcu ac, convallis finibus nulla. Morbi orci turpis, dapibus et bibendum a, pretium id velit. Curabitur molestie purus vel ex porttitor finibus. Nunc sodales facilisis orci, quis facilisis nisl malesuada quis. \
    Sed bibendum pharetra vehicula. In erat eros, facilisis sed viverra vulputate, mollis a odio. Donec tempor purus fermentum neque ullamcorper, non consequat nisl pellentesque. Nulla velit odio, gravida ac ex et, sollicitudin rhoncus libero. Nam ultricies eleifend eros. Nunc rhoncus tellus at augue semper ullamcorper. Nullam malesuada tellus ac lorem molestie tristique. Ut mattis eros in neque molestie, a rhoncus felis rhoncus. Vestibulum erat velit, convallis sit amet mattis eget, faucibus ac mauris. Integer imperdiet diam at quam tristique, ut dapibus dui hendrerit. Aenean commodo vitae enim ac blandit."
    post.body_en ="Lorem ipsum in English."
    post.committee_id = 1

    
    post_tag = PostTag()
    post_tag.title = "ansökan"
    post.tags.append(post_tag)
    
    db.session.add(post)

    post = Post()
    post.title = "Kom på torsdagspub!"
    post.title_en = "Come to the thursday pub!"
    post.body = "En lite kortare text."
    post.body_en ="A bit shorter text."
    post.header_image = "/static/posts/21af3945-035f-4195-8729-c815536c3312.png"
    post.user_id = joppe.id
    
    post_tag = PostTag()
    post_tag.title = "pub"
    post.tags.append(post_tag)

    post_tag = PostTag()
    post_tag.title = "kul"
    post.tags.append(post_tag)

    post_tag = PostTag()
    post_tag.title = "fler"
    post.tags.append(post_tag)

    post_tag = PostTag()
    post_tag.title = "taggar"
    post.tags.append(post_tag)

    post_tag = PostTag()
    post_tag.title = "enjättejättelångtagg"
    post.tags.append(post_tag)
    
    db.session.add(post)
    db.session.commit()

    return "klar"
