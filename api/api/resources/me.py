
from flask import jsonify, request
from flask_restful import Resource
from sqlalchemy import and_

from api.models.committee_post import CommitteePostTerm
from api.resources.authentication import requires_auth
from datetime import datetime

class MeCommitteeResource(Resource):
    @requires_auth
    def get(self, user):
        """
        Get the logged in user's committees
        ---
        tags:
            - Me
        security:
            - authenticated: []
        responses:
            200:
                description: OK
            400:
                description: Missing authentication token
            402:
                description: Not authenticated
            404:
                description: Invalid user
        """
        user_committees = [term.post.committee.to_dict() for term in user.post_terms.filter(and_(CommitteePostTerm.start_date < datetime.now(), datetime.now() < CommitteePostTerm.end_date))]
        return jsonify(user_committees)