from flask import jsonify
from flask_restful import Resource, reqparse
from sqlalchemy import and_, or_

from api.models.user import User
from api.models.committee_post import CommitteePost, CommitteePostTerm

from datetime import datetime

class OfficialsResource(Resource):
    def get(self):
        # users = User.query.all()
        # data = [user.to_dict() for user in users]
        # return jsonify(data)

        parser = reqparse.RequestParser()
        parser.add_argument('atDate', type=lambda x: datetime.strptime(x,'%Y-%m-%d'))
        parser.add_argument('forOperationalYear', type=str)
        args = parser.parse_args()
        date = args.atDate

        terms = []

        if args.forOperationalYear != None:
            years = args.forOperationalYear.split("/")
            if len(years) == 2 and years[0].isdigit() and years[1].isdigit() and int(years[0])+1 == int(years[1]):
                start_date_year = datetime(int(years[0]), 7, 1, 0, 0)
                end_date_year = datetime(int(years[1]), 6, 30, 23, 59, 59)

                terms = CommitteePostTerm.query.filter(CommitteePostTerm.post.has(CommitteePost.is_official == True)).filter(
                or_(
                    and_(CommitteePostTerm.start_date >= start_date_year, CommitteePostTerm.start_date <= end_date_year),
                    and_(CommitteePostTerm.end_date >= start_date_year, CommitteePostTerm.end_date <= end_date_year),
                    and_(CommitteePostTerm.start_date <= start_date_year, CommitteePostTerm.end_date >= end_date_year)
                )).all()
            else:
                return jsonify({"message": "Invalid input"})
        else:
            if date == None:
                date = datetime.now()

            terms = CommitteePostTerm.query.filter(CommitteePostTerm.post.has(CommitteePost.is_official == True)).filter(and_(CommitteePostTerm.start_date <= date, CommitteePostTerm.end_date >= date)).all()

        data = {}
        for term in terms:
            if term.post.category not in data:
                data[term.post.category] = []

            data[term.post.category].append({
                "startDate": term.start_date,
                "endDate": term.end_date,
                "post": term.post.to_dict_without_terms(),
                "user": term.user.to_dict_without_terms()
            })
        
        return jsonify(data)