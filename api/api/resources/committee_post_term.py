from flask import jsonify, request
from flask_restful import Resource
from sqlalchemy import desc

from api.db import db

from api.models.committee_post import CommitteePostTerm

from api.resources.authentication import requires_auth
from datetime import datetime

class CommitteePostTermResource(Resource):
    def get(self, id):
        term = CommitteePostTerm.query.get(id)
        return jsonify(term.to_dict())

    @requires_auth
    def delete(self, id, user):
        term = CommitteePostTerm.query.filter_by(id=id).first_or_404()
        db.session.delete(term)
        db.session.commit()
        return jsonify({"message": "ok"})

    @requires_auth
    def put(self, id, user):
        term = CommitteePostTerm.query.filter_by(id=id).first_or_404()
        data = request.json

        if data.get("user"):
            term.user_id = data.get("user").get("id")
        if data.get("post"):
            term.post_id = data.get("post").get("id")
        if data.get("startDate"):
            term.start_date = datetime.strptime(data.get('startDate'), "%Y-%m-%d")
        if data.get("endDate"):
            term.end_date = datetime.strptime(data.get('endDate'), "%Y-%m-%d")

        db.session.commit()
        return jsonify(term.to_dict())

class CommitteePostTermListResource(Resource):
    def get(self):
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('perPage', None, type=int)

        q = CommitteePostTerm.query.order_by(desc(CommitteePostTerm.start_date))

        if per_page is not None:
            paginated_query = q.paginate(page=page, per_page=per_page)
            documents = [CommitteePostTerm.to_dict(res) for res in paginated_query.items]
            count = paginated_query.total
        else:
            documents = [CommitteePostTerm.to_dict(res) for res in q.all()]
            count = q.count()

        return jsonify({"data": documents, "totalCount": count})

    @requires_auth
    def post(self, user):
        data = request.json

        if data.get("user") and data.get("post") and data.get("startDate") and data.get("endDate"):
            term = CommitteePostTerm()
            term.post_id = data.get("post").get("id")
            term.user_id = data.get("user").get("id")
            term.start_date = datetime.strptime(data.get('startDate'), "%Y-%m-%d")
            term.end_date = datetime.strptime(data.get('endDate'), "%Y-%m-%d")
            db.session.add(term)
            db.session.commit()
            return jsonify(term.to_dict())
        else:
            return {"message": "Invalid request"}, 400
