from api.db import db

from flask import jsonify, request
from flask_restful import Resource

from api.models.page import Page, PageRevision, PageRevisionType

class PageResource(Resource):
    def get(self, id):
        page = Page.query.get(id)
        return jsonify(page.to_dict())
    
    def put(self, id):
        page = Page.query.get(id)
        keys = request.json.keys()

        revision = PageRevision()
        revision.revision_type = PageRevisionType.edited
        
        if "title" in keys:
            revision.title = request.json["title"]
        if "content" in keys:
            revision.content = request.json["content"]
        if "published" in keys:
            revision.published = request.json["published"]

        page.revisions.append(revision)

        db.session.add(revision)
        db.session.commit()
    
    def delete(self, id):
        page = Page.query.id(id)
        revision = PageRevision()
        revision.revision_type = PageRevisionType.removed

        page.revisions.append(revision)
        db.session.add(revision)
        db.session.commit()


class PageListResource(Resource):
    def get(self):
        pages = Page.query.all()
        data = [page.to_dict() for page in pages]
        return jsonify(data)
    
    def put(self):
        page = Page()
        revision = PageRevision()
        revision.revision_type = PageRevisionType.created

        keys = request.json.keys()
        
        if "title" in keys:
            revision.title = request.json["title"]
        if "content" in keys:
            revision.content = request.json["content"]
        if "published" in keys:
            revision.published = request.json["published"]

        page.revisions.append(revision)

        db.session.add(revision)
        db.session.add(page)
        db.session.commit()