from flask import jsonify
from flask_restful import Resource

from sqlalchemy import or_

from api.models.user import User
from api.models.document import Document
from api.models.committee import Committee
from api.models.committee_post import CommitteePost

class SearchResource(Resource):
    def get(self, search_term):
        search_str = "%"+search_term+"%"
        user_conds = [User.kth_id.ilike(search_str), User.email.ilike(search_str), User.first_name.ilike(search_str), 
                    User.last_name.ilike(search_str), User.frack_name.ilike(search_str)]
        com_conds = [Committee.name.ilike(search_str)]
        post_conds = [CommitteePost.name.ilike(search_str)]
        doc_conds = [Document.title.ilike(search_str)]

        users = User.query.filter(or_(*user_conds)).all()
        committees = Committee.query.filter(or_(*com_conds)).all()
        posts = CommitteePost.query.filter(or_(*post_conds)).all()
        docs = Document.query.filter(or_(*doc_conds)).all()

        data = {"users": [user.to_dict() for user in users], "commitees": [committee.to_dict() for committee in committees],
            "posts": [post.to_dict() for post in posts], "documents": [doc.to_dict() for doc in docs]}
        
        return jsonify(data)