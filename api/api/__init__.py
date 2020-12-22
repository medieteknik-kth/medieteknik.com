from flask import Flask, session, jsonify, request, redirect, Blueprint, send_file, url_for,send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_cas import CAS, login_required
from flask_restful import Api

from flasgger import Swagger

from api.db import db

from api.resources.user import UserResource, UserListResource
from api.resources.committee import CommitteeResource, CommitteeListResource, CommitteePostListWithCommitteeResource
from api.resources.committee_post import CommitteePostResource, CommitteePostListResource
from api.resources.document import DocumentResource, DocumentListResource, DocumentTagResource
from api.resources.search import SearchResource
from api.resources.post import PostResource, PostAddResouce, PostListResource
from api.resources.post_tag import PostTagResource, PostTagAddResource, PostTagListResource
from api.resources.page import PageResource, PageListResource
from api.resources.officials import OfficialsResource
from api.resources.operational_years import OperationalYearsResource
from api.resources.health import HealthResource
from api.resources.me import MeCommitteeResource
from api.resources.test import TestResource
from api.resources.album import AlbumListResource, AlbumResource
from api.resources.video import VideoResource, VideoListResource, VideoUploadTestResource
from api.resources.authentication import AuthenticationResource

from api.resources.event import EventResource, EventListResource

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
api.add_resource(CommitteePostListWithCommitteeResource, "/committees/<id>/posts")

api.add_resource(CommitteePostListResource, "/committee_posts")
api.add_resource(CommitteePostResource, "/committee_posts/<id>")

api.add_resource(DocumentListResource, "/documents")
api.add_resource(DocumentTagResource, "/document_tags")

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
api.add_resource(OperationalYearsResource, "/operational_years")

api.add_resource(EventListResource, "/events")
api.add_resource(EventResource, "/events/<id>")

api.add_resource(AlbumListResource, "/albums")
api.add_resource(AlbumResource, "/albums/<id>")

api.add_resource(VideoResource, "/video/<id>")
api.add_resource(VideoListResource, "/video")
api.add_resource(VideoUploadTestResource, "/video_upload")

api.add_resource(HealthResource, "/health")

api.add_resource(MeCommitteeResource, "/me/committees")
api.add_resource(AuthenticationResource, "/auth")
    
@app.route('/get_image')
def get_image():
    return send_file(request.args.get('path'), mimetype='image/png')

# serva sparade dokument
@app.route("/documents/<filename>")
def send_document(filename):
    DOCUMENT_FOLDER = os.path.join(os.getcwd(), "static", "documents")
    return send_from_directory(DOCUMENT_FOLDER, filename)

@app.route("/thumbnails/<filename>")
def send_thumbnail(filename):
    print(filename)
    THUMBNAIL_FOLDER = os.path.join(os.getcwd(), "static", "thumbnails")
    return send_from_directory(THUMBNAIL_FOLDER, filename)

if app.debug:
    @app.route("/create_all")
    def route_create_all():
        from api.models.user import User, Committee
        from api.models.committee import CommitteeCategory
        from api.models.committee_post import CommitteePost#, CommitteePostTerm
        from api.models.document import Document, Tag, DocumentTags
        from api.models.post import Post
        from api.models.page import Page, PageRevision, PageRevisionType
        from api.models.post_tag import PostTag
        from api.models.image import Image
        from api.models.album import Album
        from api.models.video import Video

        from api.models.event import Event

        db.drop_all()
        db.create_all()


        def create_committee_category(name, weight, email=""):
            committee_category = CommitteeCategory()
            committee_category.title = name
            committee_category.weight = weight
            committee_category.email = email
            db.session.add(committee_category)
            return committee_category

        def create_committee(name, logo_name, has_banner = False, category= None):
            committee = Committee()
            committee.name = name
            committee.logo = "/static/committees/" + logo_name + ".png"
            committee.category = category
            if has_banner:
                committee.header_image = "/static/committee_banners/" + logo_name + ".jpg"
            db.session.add(committee)
            return committee
        
        def create_post(committee, post_name, email = ""):
            post = CommitteePost()
            post.name = post_name
            post.committee = committee
            post.is_official = True
            post.officials_email = email
            db.session.add(post)
            return post

        def create_official(first_name, last_name, post, follows_operational_year, picture_name = None):
            user = User()
            user.first_name = first_name
            user.last_name = last_name

            if picture_name != None:
                user.profile_picture = "/static/profiles/" + picture_name + ".jpg"

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


        styrelsen =  create_committee_category("Styrelsen", 7, "styrelsen@medieteknik.com")
        valberedningen = create_committee_category("Valberedningen", 6, "val@medieteknik.com")
        utbildning = create_committee_category("Studienämnden", 5)
        naringsliv = create_committee_category("Näringsliv och Kommunikation", 4)
        studiesocialt = create_committee_category("Studiesocialt", 3)
        fanborgen = create_committee_category("Fanborgen", 2)
        revisorerna = create_committee_category("Revisorerna", 1)

        mkm = create_committee("Medias Klubbmästeri", "mkm", True, category=studiesocialt)
        kbm = create_post(mkm, "Klubbmästare")
        create_official("Hilda", "Robertsson", kbm, True, "Hilda")
        create_official("Amalia", "Berglöf", kbm, True, "Amalia")

        styrelsen = create_committee("Styrelsen", "styrelsen", True, category=styrelsen)
        create_official("Oliver", "Kamruzzaman", create_post(styrelsen, "Ordförande", "ordf@medieteknik.com"), True, "Oliver")
        create_official("My", "Andersson", create_post(styrelsen, "Vice Ordförande"), False, "My")
        sandra = create_official("Sandra", "Larsson", create_post(styrelsen, "Kassör"), True, "Sandra")
        jessie = create_official("Jessie", "Liu", create_post(styrelsen, "Sekreterare"), False, "Jessie")
        create_official("Lina", "Bengtsson", create_post(styrelsen, "Ledamot för Utbildningsfrågor"), True, "Lina")
        create_official("Samuel", "Kraft", create_post(styrelsen, "Ledamot för Studiesocialt"), True, "kraft")
        create_official("Hanna", "Bjarre", create_post(styrelsen, "Ledamot för Näringsliv- och kommunikation"), True, "Hanna")

        create_official("Moa", "Engquist", create_post(create_committee("Jubileet", "jubileet", True, category=studiesocialt), "Jubelgeneral"), True, "Moa")
        create_official("Johanna", "Nilsen", create_post(create_committee("METAdorerna", "metadorerna", category=studiesocialt), "Sektionslokalsansvarig"), True, "Johanna_N")
        create_official("Johanna", "Simfors", create_post(create_committee("Spexmästeriet", "spexm", category=studiesocialt), "Spexmästare"), True, "Johanna_S")
        create_official("Samuel", "Kraft", create_post(create_committee("Sånglederiet", "sanglederiet", category=studiesocialt), "Öfversångledare"), False, "kraft")
        create_official("Edvin", "Hedenström", create_post(create_committee("Medielabbet", "medielabbet", category=studiesocialt), "Medielabbets Ordförande"), True)
        fotogruppsansvarig = create_post(create_committee("Fotogruppen", "fotogruppen", category=studiesocialt), "Fotogruppsansvarig")
        create_official("Andreas", "Wingqvist", create_post(create_committee("Idrottsnämnden", "idrottsnamnden", category=studiesocialt), "Idrottsnämndsordförande"), True, "Andreas")
        create_official("Martin", "Neihoff", create_post(create_committee("Qulturnämnden", "qn", category=studiesocialt), "Qulturnämndsordförande"), False, "Hoffe")
        
        mtgn = create_committee("Mottagningen", "mtgn", True, category=studiesocialt)
        oph = create_post(mtgn, "Öfverphös")
        create_official("Kajsa", "Saare", oph, False, "Kajsa")
        add_post_to_user(sandra, oph, False)
        create_official("Gabriella", "Dalman", oph, False)
        
        create_official("Amanda", "Brundin", create_post(create_committee("Matlaget", "matlaget", category=studiesocialt), "Mästerkocken"), True, "Amanda_A")
        create_official("Oskar", "Svanström", create_post(create_committee("Ljud- och ljustekniker", "medieteknik", category=studiesocialt), "Ljud- och ljustekniker"), True, "Oskar")
        
        are = create_committee("spÅre", "medieteknik", category=studiesocialt)
        ursparare = create_post(are, "UrSpårare")
        create_official("John", "Brink", ursparare, True, "John")
        erik = create_official("Erik", "Meurk", ursparare, True, "Erik")
        simon = create_official("Simon", "Sundström", ursparare, True, "Simon")

        add_post_to_user(erik, create_post(create_committee("Kommunikationsnämnden", "komn", category=naringsliv), "Kommunikatör"), True)

        nlgordf = create_post(create_committee("Näringslivsgruppen", "nlg", category=naringsliv), "Näringslivsansvarig")
        create_official("Johanna", "Iivanainen", nlgordf, True, "Johanna_I")
        create_official("Anna", "Gustavsson", nlgordf, True)

        branchdagen = create_post(create_committee("Medias Branschdag", "mbd", category=naringsliv), "Projektledare för Branschdagen")
        rasmus = create_official("Rasmus", "Rudling", branchdagen, True, "Rasmus")
        ellaklara = create_official("Ella Klara", "Westerlund", branchdagen, True, "Ella_Klara")

        webmaster = create_post(create_committee("Webmaster", "medieteknik", category=naringsliv), "Webmaster")
        webmaster.officials_email = "webmaster@medieteknik.com"
        joppe = create_official("Jesper", "Lundqvist", webmaster, False)
        
        studie = create_committee("Studienämnden", "studienamnden", category=utbildning)
        create_official("Sofia", "Lundin Ziegler", create_post(studie, "Studienämndsordförande"), True, "Sofia_L")
        create_official("Amanda", "Andrén", create_post(studie, "Programansvarig student"), False, "Amanda_A")
        create_official("Nina", "Nokelainen", create_post(studie, "Studerandeskyddsombud"), True, "Nina")
        create_official("Christoffer", "Vikström", create_post(studie, "Jämlikhets- och mångfaldsombud"), True)
        add_post_to_user(simon, create_post(create_committee("Internationella nämnden", "medieteknik", category=utbildning), "Internationell Samordnare"), True)
        
        val = create_committee("Valberedningen", "valberedningen", category=valberedningen)
        create_official("Mimmi", "Andreasson", create_post(val, "Valberedningens Ordförande"), True, "Mimmi")
        valberedare = create_post(val, "Valberedare")
        create_official("Anja", "Studic", valberedare, True)
        create_official("Nathalie", "Lock", valberedare, True, "Nathalie")
        create_official("Alex", "Modee", valberedare, True)
        create_official("Emma", "Hagrot", valberedare, False, "Emma")
        create_official("Anna", "Eckernäs", valberedare, False)
        create_official("Saga", "Palmér", valberedare, False, "Saga")

        revisor = create_post(create_committee("Revisorerna", "medieteknik", category=revisorerna), "Revisor")
        kristina = create_official("Kristina", "Andersson", revisor, True)
        create_official("Mahmoud", "Sherzad", revisor, True, "Mood")

        fanborg = create_post(create_committee("Fanborgen", "medieteknik", category=fanborgen), "Fanbärare")
        create_official("Sofia", "Blomgren", fanborg, True, "Sofia_B")
        create_official("Emil", "Erlandsson", fanborg, True, "Emil")


        joppe.email = "jeslundq@kth.se"
        joppe.kth_id = "u1veo32n"
        joppe.first_name = "Jesper"
        joppe.last_name = "Lundqvist"
        joppe.frack_name = "Joppe"
        joppe.kth_year = 2016
        joppe.profile_picture = "/static/profiles/Jesper.jpg"
        joppe.facebook = "https://www.facebook.com/jesperlndqvist"
        joppe.linkedin = "https://www.linkedin.com/in/jesper-lundqvist-63a47a126/"
        joppe.is_admin = True

        mikaela = User()
        mikaela.email = "migarde@kth.se"
        mikaela.kth_id = "u1w37ayy"
        mikaela.first_name = "Mikaela"
        mikaela.last_name = "Gärde"
        mikaela.frack_name = "Mickan"
        mikaela.profile_picture = "/static/profiles/Mikaela.jpg"
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
        committee1.description = "Vi bygger sektionens nästa hemsida."
        committee1.instagram_url = "https://www.instagram.com/medieteknik_kth/"
        committee1.facebook_url = "https://www.instagram.com/medieteknik_kth/"
        committee1.category = naringsliv

        committee2 = Committee()
        committee2.name = "Mottagningen"

        post = CommitteePost()
        post.name = "Projektledare för Hemsidan"
        post.committee = committee1
        post.is_official = True
        post.officials_email = "projekthemsidan@medieteknik.com"
        term1 = post.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31))
        
        post2 = CommitteePost()
        post2.name = "Utvecklare"
        post2.committee = committee1
        post2.is_official = False

        post3 = CommitteePost()
        post3.name = "Designer"
        post3.committee = committee1
        post3.is_official = False

        mikaela.post_terms.append(post3.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31)))
        rasmus.post_terms.append(post2.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31)))
        mina.post_terms.append(post2.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31)))
        fredrik.post_terms.append(post2.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31)))
        jessie.post_terms.append(post3.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31)))
        kristina.post_terms.append(post2.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31)))
        albin.post_terms.append(post2.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31)))
        ellaklara.post_terms.append(post2.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 12, 31)))

        mikaela.post_terms.append(fotogruppsansvarig.new_term(datetime.datetime(2019, 7, 1), datetime.datetime(2020, 6, 30)))

        joppe.post_terms.append(term1)
        
        page = Page()
        page.slug = "hemsideprojektet"
        page_revision1 = PageRevision()
        page_revision1.image = "https://i.imgur.com/tcfosOQ.jpg"
        page_revision1.title_sv = "Hemsideprojektet"
        page_revision1.content_sv = "{\"ops\":[{\"insert\":\"Sektionens hemsida b\u00f6rjar bli gammal. Vi kommer ge hemsidan, och sektionen, en v\u00e4lbeh\u00f6vd makeover s\u00e5 att vi som pluggar medieteknik kan f\u00e5 mer nytta av hemsidan. Den nya hemsidan kommer samla all information om allt som h\u00e4nder p\u00e5 sektionen. Alla event, alla ans\u00f6kningsperioder, ska l\u00e4tt g\u00e5 att hitta p\u00e5 den nya sidan.\\nDen kommer naturligtvis ocks\u00e5 vara v\u00e4ldigt snygg, kolla bara runt hur det ser ut hittills! Vi \u00e4r ju trots allt medietekniker, vi gillar snygga saker, s\u00e5 d\u00e5 ska v\u00e5r sektion s\u00e5 klart vara den snyggaste p\u00e5 KTH.\\n\"},{\"attributes\":{\"link\":\"https://github.com/medieteknik-kth/medieteknik.com\"},\"insert\":\"All v\u00e5r kod finns p\u00e5 Github!\"},{\"insert\":\"\\n\"}]}"
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
        doc.title = "Stadgar"
        doc.fileName = "https://storage.googleapis.com/medieteknik-static/documents/2019-02-19%20Stadgar.pdf"
        doc.uploadedBy = "Oliver Kamruzzaman"
        doc.thumbnail = "https://storage.googleapis.com/medieteknik-static/document_thumbnails/stadgar.png"

        doc2 = Document()
        doc2.title = "Beta-SM Handlingar"
        doc2.fileName = "beta-sm.pdf"
        doc2.uploadedBy = "Oliver Kamruzzaman"
        doc2.thumbnail = "beta-sm.png"

        tag = Tag()
        tag.title = "Handlingar"

        tag2 = Tag()
        tag2.title = "Annar"

        db.session.add(doc)
        db.session.add(doc2)
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
        post.body = "{\"ops\":[{\"insert\":\"Sektionen f\u00f6r Medieteknik finns till f\u00f6r studenter vid medieteknikprogrammet p\u00e5 KTH. Dess fr\u00e4msta syfte \u00e4r att uppfylla studenternas behov under studietiden, p\u00e5verka v\u00e5r utbildning, se till att finnas f\u00f6r dig som student och sedan minska tr\u00f6skeln ut i arbetslivet.\\nArbetet p\u00e5 sektionen sker utefter de fyra grundstenarna,\u00a0\"},{\"attributes\":{\"bold\":true},\"insert\":\"\u00f6ppenhet\"},{\"insert\":\",\u00a0\"},{\"attributes\":{\"bold\":true},\"insert\":\"samh\u00f6righet\"},{\"insert\":\",\u00a0\"},{\"attributes\":{\"bold\":true},\"insert\":\"erk\u00e4nnande\"},{\"insert\":\"\u00a0och\u00a0\"},{\"attributes\":{\"bold\":true},\"insert\":\"utveckling\"},{\"insert\":\"\u00a0f\u00f6r att skapa en milj\u00f6 d\u00e4r m\u00e4nniskor trivs och utvecklas. N\u00e4ra anknytning till mediebranschen och dess akt\u00f6rer ska dels hj\u00e4lpa studenterna under studietiden men ocks\u00e5 ge dem m\u00f6jligheter till f\u00f6retagskontakter och ett n\u00e4tverk som f\u00f6renklar steget ut i n\u00e4ringslivet.\\nV\u00e4lkommen!\\n\"}]}"
        post.committee_id = 1

        
        post_tag = PostTag()
        post_tag.title = "ansökan"
        post.tags.append(post_tag)
        
        db.session.add(post)


        post = Post()
        post.title = "Kom på torsdagspub!"
        post.title_en = "Come to the thursday pub!"
        post.body = "{\"ops\":[{\"insert\":\"Sektionen f\u00f6r Medieteknik finns till f\u00f6r studenter vid medieteknikprogrammet p\u00e5 KTH. Dess fr\u00e4msta syfte \u00e4r att uppfylla studenternas behov under studietiden, p\u00e5verka v\u00e5r utbildning, se till att finnas f\u00f6r dig som student och sedan minska tr\u00f6skeln ut i arbetslivet.\\nArbetet p\u00e5 sektionen sker utefter de fyra grundstenarna,\u00a0\"},{\"attributes\":{\"bold\":true},\"insert\":\"\u00f6ppenhet\"},{\"insert\":\",\u00a0\"},{\"attributes\":{\"bold\":true},\"insert\":\"samh\u00f6righet\"},{\"insert\":\",\u00a0\"},{\"attributes\":{\"bold\":true},\"insert\":\"erk\u00e4nnande\"},{\"insert\":\"\u00a0och\u00a0\"},{\"attributes\":{\"bold\":true},\"insert\":\"utveckling\"},{\"insert\":\"\u00a0f\u00f6r att skapa en milj\u00f6 d\u00e4r m\u00e4nniskor trivs och utvecklas. N\u00e4ra anknytning till mediebranschen och dess akt\u00f6rer ska dels hj\u00e4lpa studenterna under studietiden men ocks\u00e5 ge dem m\u00f6jligheter till f\u00f6retagskontakter och ett n\u00e4tverk som f\u00f6renklar steget ut i n\u00e4ringslivet.\\nV\u00e4lkommen!\\n\"}]}"
        post.header_image = "static/posts/21af3945-035f-4195-8729-c815536c3312.png"
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

        def create_page(name, slug, content, image = None):
            page = Page()
            page.slug = slug
            rev = PageRevision()
            rev.title_sv = name
            rev.content_sv = content

            if image != None:
                rev.image = image

            rev.author = joppe
            rev.revision_type = PageRevisionType.created
            rev.published = True

            page.revisions.append(rev)

            db.session.add(page)
        
        create_page("Vad är Medieteknik?", "medieteknik", "{\"ops\":[{\"insert\":\"Vad \u00e4r Medieteknik?\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"},{\"insert\":\"Sektionen f\u00f6r Medieteknik finns till f\u00f6r studenter vid medieteknikprogrammet p\u00e5 KTH. Dess fr\u00e4msta syfte \u00e4r att uppfylla studenternas behov under studietiden, p\u00e5verka v\u00e5r utbildning, se till att finnas f\u00f6r dig som student och sedan minska tr\u00f6skeln ut i arbetslivet.\\nArbetet p\u00e5 sektionen sker utefter de fyra grundstenarna,\u00a0\"},{\"attributes\":{\"bold\":true},\"insert\":\"\u00f6ppenhet\"},{\"insert\":\",\u00a0\"},{\"attributes\":{\"bold\":true},\"insert\":\"samh\u00f6righet\"},{\"insert\":\",\u00a0\"},{\"attributes\":{\"bold\":true},\"insert\":\"erk\u00e4nnande\"},{\"insert\":\"\u00a0och\u00a0\"},{\"attributes\":{\"bold\":true},\"insert\":\"utveckling\"},{\"insert\":\"\u00a0f\u00f6r att skapa en milj\u00f6 d\u00e4r m\u00e4nniskor trivs och utvecklas. N\u00e4ra anknytning till mediebranschen och dess akt\u00f6rer ska dels hj\u00e4lpa studenterna under studietiden men ocks\u00e5 ge dem m\u00f6jligheter till f\u00f6retagskontakter och ett n\u00e4tverk som f\u00f6renklar steget ut i n\u00e4ringslivet.\\nV\u00e4lkommen!\\n\"}]}")
        create_page("Studenträtt", "studentratt", "{\"ops\":[{\"insert\":\"Studentr\u00e4tt\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"},{\"insert\":\"Om du under din tid p\u00e5 KTH blir utsatt f\u00f6r n\u00e5gon form av diskriminering, trakasserier eller kr\u00e4nkande s\u00e4rbehandling finns sektionen och k\u00e5ren h\u00e4r f\u00f6r att hj\u00e4lpa till. I det bifogade dokumentet om studentr\u00e4tt finns information och kontaktuppgifter.\u00a0\\nF\u00f6r fr\u00e5gor g\u00e4llande studentr\u00e4tt, kontakta sektionens J\u00e4mst\u00e4lldhets- och m\u00e5ngfaldsombud p\u00e5\u00a0\"},{\"attributes\":{\"color\":\"#c4a616\",\"link\":\"mailto:jamo@medieteknik.com\"},\"insert\":\"jamo@medieteknik.com\"},{\"insert\":\".\\n\"}]}")
        create_page("Kurser", "kurser", "{\"ops\":[{\"insert\":\"Kurser\"},{\"attributes\":{\"header\":2},\"insert\":\"\\n\"},{\"insert\":\"Utbildningens f\u00f6rsta tre \u00e5r (180 h\u00f6gskolepo\u00e4ng) \u00e4r p\u00e5 grundniv\u00e5 och inleds med obligatoriska kurser.\\nUtbildningen \u00e4r uppbyggd s\u00e5 att den studerande efter tre \u00e5rs kurser har m\u00f6jlighet att ans\u00f6ka om att ta ut en teknologie kandidatexamen. Studenten kan d\u00e4refter forts\u00e4tta studierna p\u00e5 det p\u00e5b\u00f6rjade civilingenj\u00f6rsprogrammet, forts\u00e4tta p\u00e5 ett magister- eller masterprogram p\u00e5 KTH eller ett annat universitet i Sverige eller utomlands eller att p\u00e5b\u00f6rja arbeta en yrkeskarri\u00e4r.\\nUtbildningen \u00e4r tv\u00e4rvetenskaplig och fokuserar p\u00e5 hur m\u00e4nsklig kommunikation st\u00f6ds av teknik. F\u00f6rutom matematik och fysik l\u00e4ser du kurser om den teknik som anv\u00e4nds f\u00f6r att producera och konsumera olika typer av media och medieinneh\u00e5ll, fr\u00e5n video och ljud till tryck och mobila medier. Du l\u00e4ser \u00e4ven om spel, visualisering, interaktion och sociala medier.\u00a0\\n\"},{\"attributes\":{\"color\":\"#c4a616\",\"link\":\"http://www.kth.se/student/kurser/program/CMETE\"},\"insert\":\"H\u00e4r hittar du utbildningsplaner f\u00f6r varje kull.\"},{\"insert\":\"\\n\"}]}")
        create_page("Masterprogram", "masterprogram", "{\"ops\":[{\"insert\":\"Masterprogram\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"},{\"insert\":\"De tv\u00e5 avslutande \u00e5ren (120 h\u00f6gskolepo\u00e4ng) l\u00e4ser studenten det valda masterprogrammet.\\nMasterprogrammet kan inneh\u00e5lla flera sp\u00e5r och kurser \u00e4r huvudsakligen p\u00e5 avancerad niv\u00e5. Utbildningen leder till s\u00e5v\u00e4l civilingenj\u00f6rsexamen som masterexamen.\u00a0\\nF\u00f6r varje \u00e5r presenteras en lista \u00f6ver vilka masterprogram du kan v\u00e4lja. F\u00f6r vissa masterprogram f\u00f6rekommer krav p\u00e5 vilka sp\u00e5r eller valfria kurser som l\u00e4ses.\\nMer information om masterprogrammen hittas\u00a0\"},{\"attributes\":{\"color\":\"#c4a616\",\"link\":\"https://www.kth.se/student/program/masterprogram?programme=media\"},\"insert\":\"h\u00e4r\"},{\"insert\":\".\\n\"}]}")
        create_page("Utlandsstudier", "utlandsstudier", "{\"ops\":[{\"insert\":\"Utlandsstudier\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"},{\"insert\":\"KTH samarbetar med flera av de b\u00e4sta tekniska universiteten v\u00e4rlden \u00f6ver. Detta inneb\u00e4r att du som student p\u00e5 KTH kan l\u00e4sa en del av din utbildning i exempelvis Singapore, Frankrike eller Indien. Under 2011 l\u00e4ste 520 KTH-studenter utomlands.\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"UTLANDSSTUDIER GER V\u00c4RDEFULL ERFARENHET\"},{\"insert\":\"\\nFr\u00e4msta anledningen till att KTH vill att s\u00e5 m\u00e5nga som m\u00f6jligt ska l\u00e4sa utomlands \u00e4r att framtida arbetsgivare s\u00f6ker personer med utlandserfarenhet och spr\u00e5kkunskaper. Utlandserfarenhet g\u00f6r dig helt enkelt mer eftertraktad p\u00e5 arbetsmarknaden!\\nUtlandsstudierna ska vara en del av din utbildning p\u00e5 KTH och studietiden beh\u00f6ver inte bli f\u00f6rl\u00e4ngd.\\nKTH erbjuder olika former av utlandsstudier:\\nUtbyte vid ett partneruniversitet\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"Kandidat- eller examensarbete utomlands\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"Dubbeldiplom\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"Sommarkurser\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"iLEAD - Entrepren\u00f6rskap vid National University of Singapore (kombination av praktik och kurser)\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"KTH \u00d6PPNAR D\u00d6RRAR\"},{\"insert\":\"\\nTack vare att KTH \u00e4r ett v\u00e4lk\u00e4nt och popul\u00e4rt universitet utomlands finns det ett brett utbud av utbytesavtal att v\u00e4lja bland f\u00f6r dig som student. KTH samarbetar med de b\u00e4sta universiteten i Europa och med framst\u00e5ende universitet v\u00e4rlden \u00f6ver. Som utbytesstudent beh\u00f6ver du inte betala n\u00e5gon terminsavgift.\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"DET B\u00c4STA S\u00c4TTET ATT F\u00d6RB\u00c4TTRA DINA CHANSER P\u00c5 ARBETSMARKNADEN\"},{\"insert\":\"\\nDe flesta arbetsgivare v\u00e4rderar internationell erfarenhet och spr\u00e5kkunskaper mycket h\u00f6gt. Utlandsstudier ger dig b\u00e5de akademiska och personliga meriter, g\u00f6r ditt CV mer attraktivt och dig sj\u00e4lv mer konkurrenskraftig.\\nUngef\u00e4r var tredje student som tar examen fr\u00e5n KTH har studerat utomlands vid n\u00e5got av KTH:s partneruniversitet eller gjort examensarbete utomlands. \u00d6ver 60% av de f\u00e4rdiga civilingenj\u00f6rererna som studerat utomlands uppger att det har hj\u00e4lpt dem till ett b\u00e4ttre jobb.\\n\"},{\"attributes\":{\"italic\":true},\"insert\":\"Utan spr\u00e5kkunskaperna hade jag inte kommit ifr\u00e5ga f\u00f6r alla de uppdrag jag f\u00e5tt. Det \u00e4r fortfarande ovanligt med tekniska kunskaper tillsammans med spr\u00e5kkunskaper.\"},{\"attributes\":{\"blockquote\":true},\"insert\":\"\\n\"},{\"insert\":\"Utbytesstudent vid Ecole Polytechnique, utdrag ur reseber\u00e4ttelse\\n\"},{\"attributes\":{\"italic\":true},\"insert\":\"Imperial College London har till stor del internationella studenter fr\u00e5n hela v\u00e4rlden, vilket bidrog till att jag under \u00e5ret fick ta del av flera kulturer och skaffade mig ett internationellt kontaktn\u00e4t.\"},{\"attributes\":{\"blockquote\":true},\"insert\":\"\\n\"},{\"insert\":\"Utbytesstudent vid Imperial College, utdrag ur reseber\u00e4ttelse\\n\"},{\"attributes\":{\"color\":\"#c4a616\",\"link\":\"http://www.kth.se/student/program/utlandsstudier\"},\"insert\":\"L\u00e4s mer om utbytesstudier h\u00e4r\"},{\"insert\":\"\\n\"}]}")
        create_page("Studievägledning", "studievagledning", "{\"ops\":[{\"insert\":\"Studiev\u00e4gledning\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"},{\"insert\":\"Lena Smedenborn \u00e4r studiev\u00e4gledare f\u00f6r studenter p\u00e5 civilingenj\u00f6rsprogrammet i medieteknik. Du kan v\u00e4nda dig till henne om du har fr\u00e5gor om bland annat studieplanering, kursval, studievanor och studieteknik eller \u00e5terupptag av studier efter studieuppeh\u00e5ll.\\nDrop-in tider:\\nTisdag & torsdag 12.30-14.30, bes\u00f6ksadress: Rum 1430, Lindstedtsv\u00e4gen 3, plan 4.\u00a0\\nE-post:\u00a0\"},{\"attributes\":{\"color\":\"#c4a616\",\"link\":\"mailto:svl-media@kth.se\"},\"insert\":\"svl-media@kth.se\"},{\"insert\":\"\\n\"}]}")
        create_page("Samarbete", "samarbete", "{\"ops\":[{\"insert\":\"Sektionen f\u00f6r Medieteknik arbetar aktivt f\u00f6r att v\u00e4va samman medieteknikstudenter med n\u00e4ringslivet genom att skapa en n\u00e4rhet mellan medlemmarna och branschledande akt\u00f6rer. Vi \u00e4r ingenj\u00f6rer med en kreativ sida. P\u00e5 medieteknik \u00e5terfinns programmerare och entrepren\u00f6rer i samma individer vilket resulterar i att medietekniker ofta fungerar som en l\u00e4nk mellan aff\u00e4rsdelen och utvecklingsdelen p\u00e5 f\u00f6retag.\u00a0\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Vill ditt f\u00f6retag n\u00e5 ut till medietekniker?\"},{\"insert\":\"\u00a0Tveka inte att h\u00f6ra av dig till v\u00e5r N\u00e4ringslivsgrupp,\u00a0\"},{\"attributes\":{\"color\":\"#c4a616\",\"link\":\"http://www.medieteknik.com/naringsliv/naringsliv@medieteknik.com%E2%80%9D\"},\"insert\":\"naringsliv@medieteknik.com\"},{\"insert\":\". Vi hj\u00e4lper er med allt fr\u00e5n marknadsf\u00f6ring till skr\u00e4ddarsydda l\u00f6sningar f\u00f6r att ditt f\u00f6retag ska synas mot v\u00e5ra studenter!\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Vill ditt f\u00f6retag medverka v\u00e5r branschdag?\"},{\"insert\":\"\u00a0Tveka inte att kontakta v\u00e5r Branschdagsgrupp,\u00a0\"},{\"attributes\":{\"color\":\"#c4a616\",\"link\":\"http://www.medieteknik.com/naringsliv/branschdag@medieteknik.com%E2%80%9D\"},\"insert\":\"branschdag@medieteknik.com\"},{\"insert\":\". Vi anordnar en arbetsmarknadsm\u00e4ssa \u00e5rligen f\u00f6r att integrera f\u00f6retag och alumni med v\u00e5ra studenter! L\u00e4s mer p\u00e5\u00a0\"},{\"attributes\":{\"color\":\"#c4a616\",\"link\":\"http://www.mediasbranschdag.com/\"},\"insert\":\"http://www.mediasbranschdag.com\"},{\"insert\":\".\\n\"}]}")
        create_page("Annonsering", "annonsering", "{\"ops\":[{\"insert\":\"Annonsering\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"},{\"insert\":\"Vi erbjuder tv\u00e5 typer av annonser, en banner och en nyhetsannons. Annonseringstiden \u00e4r 1 vecka f\u00f6r b\u00e5da typerna.\\nBanner\"},{\"attributes\":{\"header\":2},\"insert\":\"\\n\"},{\"insert\":\"En banner syns endast p\u00e5\u00a0\"},{\"attributes\":{\"color\":\"#c4a616\",\"link\":\"http://www.medieteknik.com/\"},\"insert\":\"www.medieteknik.com\"},{\"insert\":\"s startsida som dessutom l\u00e4nkas till valfri url som ni v\u00e4ljer. Se placeringen av banners nedan:\\n\"},{\"attributes\":{\"height\":\"201\",\"width\":\"600\"},\"insert\":{\"image\":\"http://www.medieteknik.com/sites/default/files/styles/large/public/banner.png?itok=e9mPB-ym\"}},{\"insert\":\"\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Info:\"},{\"insert\":\"\u00a0Syns p\u00e5 startsidan, tillsammans med flera andra annonser i en slideshow.\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Dimensioner:\"},{\"insert\":\"\u00a01080x350\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Tid:\"},{\"insert\":\"\u00a07 dagar.\\nNyhetsannons\"},{\"attributes\":{\"header\":2},\"insert\":\"\\n\"},{\"insert\":\"En nyhetsannons syns i v\u00e5ra olika nyhetsfl\u00f6den. Dvs. p\u00e5 startsidan, under \\\"Nyheter & Event\\\" samt under de nyhetskategorier som er annons kategoriseras under. Annonsen \u00e4r dessutom klistrad h\u00f6gst upp i alla fl\u00f6den s\u00e5 att den ej efter en viss tid hamnar l\u00e4ngre ner i fl\u00f6det (den undg\u00e5r sorteringen p\u00e5 datum). Annonsen \u00e4r precis som en vanlig nyhet, dvs. att den f\u00e5r en egen nyhetssida d\u00e4r man kan l\u00e4sa hela annonsen. Exempel p\u00e5 nyhetsannons:\\n\"},{\"attributes\":{\"height\":\"297\",\"width\":\"600\"},\"insert\":{\"image\":\"http://www.medieteknik.com/sites/default/files/styles/large/public/nyhetsannons.png?itok=X9v0YMrD\"}},{\"insert\":\"\\nExempel p\u00e5 en nyhetsannons sida:\\n\"},{\"attributes\":{\"height\":\"958\",\"width\":\"600\"},\"insert\":{\"image\":\"http://www.medieteknik.com/sites/default/files/styles/large/public/annons-sida.png?itok=3uCHOGlL\"}},{\"insert\":\"\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Info:\"},{\"insert\":\"\u00a0Syns i olika nyhetsfl\u00f6den samt p\u00e5 egen sida.\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Bild:\u00a0\"},{\"insert\":\"700x350 (inget krav p\u00e5 bild)\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Obligatoriska f\u00e4lt:\u00a0\"},{\"insert\":\"Inledning (max 300 tecken), Br\u00f6dtext.\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Valfria f\u00e4lt:\"},{\"insert\":\"\u00a0Dokument, L\u00e4nk\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Tid:\"},{\"insert\":\"\u00a07 dagar.\\n\u00c4r du intresserad?\"},{\"attributes\":{\"header\":2},\"insert\":\"\\n\"},{\"insert\":\"Om du vill veta mer eller best\u00e4lla, kontakta v\u00e5r kommunikat\u00f6r via v\u00e5rt\u00a0\"},{\"attributes\":{\"color\":\"#c4a616\",\"link\":\"http://www.medieteknik.com/kontakt/kontaktinformation\"},\"insert\":\"kontaktformul\u00e4r\"},{\"insert\":\"\u00a0eller via\u00a0\"},{\"attributes\":{\"color\":\"#c4a616\",\"link\":\"mailto:naringsliv@medieteknik.com\"},\"insert\":\"naringsliv@medieteknik.com\"},{\"insert\":\"\\n\"}]}")
        create_page("Styrelsen", "{\"ops\":[{\"insert\":\"Styrelsen\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Styrelsen \u00e4r sektionens strategiska motor och h\u00f6gsta verkst\u00e4llande organ.\"},{\"insert\":\"I Styrelsen sitter Ordf\u00f6rande, Vice ordf\u00f6rande, Sekreterare och Kass\u00f6r, samt tre ledam\u00f6ter med olika fokusomr\u00e5den, f\u00f6r att utveckla sektionens verksamhet genom att lyssna till medlemmarna och jobba f\u00f6r sektionens b\u00e4sta.\\nStyrelsen tr\u00e4ffas regelbundet och samordnar sektionens verksamhet genom att \u00f6versiktligt hantera studiebevakningen, n\u00e4ringslivsfr\u00e5gor och f\u00f6reningsverksamheten genom alla n\u00e4mndordf\u00f6randen, som rapporterar inf\u00f6r styrelsem\u00f6ten. Beslut kring vad som ska diskuteras och avhandlas p\u00e5 sektionsm\u00f6ten tas ocks\u00e5 av Styrelsen som d\u00e4r igenom har det yttersta ansvaret och m\u00f6jligheten att p\u00e5verka sektionen. Sektionsm\u00f6ten \u00e4r de m\u00f6ten d\u00e4r alla som \u00e4r sektionsmedlemmar kan p\u00e5verka vad sektionen ska arbeta med och fokusera p\u00e5. Det g\u00f6r sektionsm\u00f6tena till sektionens h\u00f6gsta beslutande organ. P\u00e5verkan kan g\u00f6ras genom anpassning av styrdokument, utredningar och genom att utveckla handlingsplaner.\\nTveka inte att kontakta oss f\u00f6r fr\u00e5gor och funderingar! Vill du n\u00e5 oss alla kan du g\u00f6ra det p\u00e5\u00a0\"},{\"attributes\":{\"color\":\"#c4a616\",\"link\":\"mailto:styrelsen@medieteknik.com\"},\"insert\":\"styrelsen@medieteknik.com\"},{\"insert\":\"\\n\"}]}", "/static/committee_banners/styrelsen.jpg")
        create_page("Bokningar", "bokningar", "{\"ops\":[{\"attributes\":{\"color\":\"#2b2b2b\"},\"insert\":\"I kalendern nedan kan du se vilka datum som v\u00e5r sektionslokal META \u00e4r bokad eller ledig. META bokas vanligtvis hela kv\u00e4llar och syns i schemat som de bl\u00e5a bokningarna. M\u00f6tesrummet bokas vanligtvis timvis och syns i schemat som de gr\u00f6na bokningarna.\u00a0\"},{\"insert\":\"\\n\\n\"},{\"attributes\":{\"color\":\"#2b2b2b\"},\"insert\":\"\u00c4r du intresserad av att boka META eller M\u00f6tesrummet?\"},{\"insert\":\"\\n\"},{\"attributes\":{\"color\":\"#2b2b2b\"},\"insert\":\"G\u00e5 in p\u00e5\u00a0\"},{\"attributes\":{\"color\":\"#c4a616\",\"link\":\"https://bokning.datasektionen.se/\"},\"insert\":\"https://bokning.datasektionen.se/\"},{\"attributes\":{\"color\":\"#2b2b2b\"},\"insert\":\"\u00a0eller via den gamla l\u00e4nken\u00a0\"},{\"attributes\":{\"color\":\"#c4a616\",\"link\":\"http://datasektionen.se/sektionen/lokalbokning\"},\"insert\":\"http://datasektionen.se/sektionen/lokalbokning\"},{\"attributes\":{\"color\":\"#2b2b2b\"},\"insert\":\".\u00a0\"},{\"insert\":\"\\n\"},{\"attributes\":{\"color\":\"#2b2b2b\"},\"insert\":\"Har du n\u00e5gra fr\u00e5gor om bokningen eller om META? Kontakta sektionslokalansvarig via\u00a0\"},{\"attributes\":{\"color\":\"#c4a616\",\"link\":\"mailto:lokalbokning@d.kth.se\"},\"insert\":\"lokalbokning@d.kth.se\"},{\"attributes\":{\"color\":\"#2b2b2b\"},\"insert\":\". Mailen g\u00e5r till b\u00e5de Konglig Lokalchef (Data) och Sektionslokalsansvarige (Media), men det kommer antagligen vara sektionslokalansvarig som svarar er.\u00a0\"},{\"insert\":\"\\n\\n\"},{\"attributes\":{\"height\":\"600\",\"width\":\"800\"},\"insert\":{\"video\":\"https://calendar.google.com/calendar/embed?title=Bokningschema%20f%C3%B6r%20META%20och%20M%C3%B6tesrummet&height=600&wkst=2&hl=sv&bgcolor=%23FFFFFF&src=6a5rem0bbkrh5rber7a2sdpp48%40group.calendar.google.com&color=%232952A3&src=k3dk0up940aaib3v44mc2eje90%40group.calendar.google.com&color=%230D7813&ctz=Europe%2FStockholm\"}},{\"insert\":\"\\n\"}]}")

        db.session.add(post)

        event1 = Event()
        event1.title= "Camping"
        event1.title_en = "Camping"
        event1.body = "{\"ops\":[{\"insert\":\"Sektionen f\u00f6r Medieteknik finns till f\u00f6r studenter vid medieteknikprogrammet p\u00e5 KTH. Dess fr\u00e4msta syfte \u00e4r att uppfylla studenternas behov under studietiden, p\u00e5verka v\u00e5r utbildning, se till att finnas f\u00f6r dig som student och sedan minska tr\u00f6skeln ut i arbetslivet.\\nArbetet p\u00e5 sektionen sker utefter de fyra grundstenarna,\u00a0\"},{\"attributes\":{\"bold\":true},\"insert\":\"\u00f6ppenhet\"},{\"insert\":\",\u00a0\"},{\"attributes\":{\"bold\":true},\"insert\":\"samh\u00f6righet\"},{\"insert\":\",\u00a0\"},{\"attributes\":{\"bold\":true},\"insert\":\"erk\u00e4nnande\"},{\"insert\":\"\u00a0och\u00a0\"},{\"attributes\":{\"bold\":true},\"insert\":\"utveckling\"},{\"insert\":\"\u00a0f\u00f6r att skapa en milj\u00f6 d\u00e4r m\u00e4nniskor trivs och utvecklas. N\u00e4ra anknytning till mediebranschen och dess akt\u00f6rer ska dels hj\u00e4lpa studenterna under studietiden men ocks\u00e5 ge dem m\u00f6jligheter till f\u00f6retagskontakter och ett n\u00e4tverk som f\u00f6renklar steget ut i n\u00e4ringslivet.\\nV\u00e4lkommen!\\n\"}]}"
        event1.location="Bergshamra"
        event1.committee=committee1
        event1.facebook_link = "https://www.facebook.com/events/284688576033658/"
        event1.user_id = 1

        post_tag2 = PostTag()
        post_tag2.title = "fezt"

        event1.tags.append(post_tag)
        event1.tags.append(post_tag2)

        video = Video()
        video.title = "ÖPH19 nØg 2020"
        video.mux_asset_id = "dUL5m2XRKGPMTR00QO8Zb01K301TzLK2rG3sRoIL1wE01iM"
        video.mux_playback_id = "PBWvfG00TEdPoObmNUQE9Rtyp3uYvdMFA02bW01AkjvVyY"
        video.requires_login = False

        video2 = Video()
        video2.title = "ÖPH19 nØg 2020"
        video2.mux_asset_id = "dUL5m2XRKGPMTR00QO8Zb01K301TzLK2rG3sRoIL1wE01iM"
        video2.mux_playback_id = "PBWvfG00TEdPoObmNUQE9Rtyp3uYvdMFA02bW01AkjvVyY"
        video2.requires_login = False

        image1 = Image()
        image1.url = "https://storage.googleapis.com/medieteknik-static/albums/Test/623911aa-c719-4167-a1cc-ca1f0884a784.jpg"
        image2 = Image()
        image2.url = "https://storage.googleapis.com/medieteknik-static/albums/Test/9804d088-c331-4154-9f6e-6c480357d1e0.jpg"
        image3 = Image()
        image3.url = "https://storage.googleapis.com/medieteknik-static/albums/Test/623911aa-c719-4167-a1cc-ca1f0884a784.jpg"
        image4 = Image()
        image4.url = "https://storage.googleapis.com/medieteknik-static/albums/Test/9804d088-c331-4154-9f6e-6c480357d1e0.jpg"

        album1 = Album()
        album1.title = "Album"
        album1.videos.append(video)
        album1.videos.append(video2)
        album1.images.append(image1)
        album1.images.append(image2)
        album1.images.append(image3)
        album1.images.append(image4)

        db.session.add(video)
        db.session.add(album1)

        db.session.add(event1)

        album2 = Album()
        album2.title = "Homepage Slideshow"
        
        landing_image1 = Image()
        landing_image1.url = "https://storage.googleapis.com/medieteknik-static/albums/Test/623911aa-c719-4167-a1cc-ca1f0884a784.jpg"
        landing_image2 = Image()
        landing_image2.url = "https://storage.googleapis.com/medieteknik-static/albums/Test/9804d088-c331-4154-9f6e-6c480357d1e0.jpg"
        landing_image3 = Image()
        landing_image3.url = "https://storage.googleapis.com/medieteknik-static/albums/Test/623911aa-c719-4167-a1cc-ca1f0884a784.jpg"
        landing_image4 = Image()
        landing_image4.url = "https://storage.googleapis.com/medieteknik-static/albums/Test/9804d088-c331-4154-9f6e-6c480357d1e0.jpg"

        album2.images.append(landing_image1)
        album2.images.append(landing_image2)
        album2.images.append(landing_image3)
        album2.images.append(landing_image4)
        db.session.add(album2)

        db.session.commit()

        return "klar"
