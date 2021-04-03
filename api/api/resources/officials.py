from flask import jsonify, request
from flask_restful import Resource, reqparse
from sqlalchemy import and_, or_, desc

from api.models.user import User
from api.models.committee import Committee, CommitteeCategory
from api.models.committee_post import CommitteePost ,CommitteePostTerm

from datetime import datetime

class OfficialsResource(Resource):
    def get(self):
        """
        Gets officials with optional filters. If no filter is applied, all current officials are returned.
        ---
        tags:
            - Officials
        parameters:
        - name: atDate
          in: query
          schema:
            type: string
            format: date
        - name: forOperationalYear
          in: query
          description: In format YYYY/YYYY (ex. 2019/2020)
          schema:
            type: string
        - name: hyphenate
          in: query
          schema:
            type: boolean
        responses:
            200:
                description: OK
            400:
                description: Missing authentication token
            402:
                description: Not authenticated
        """

        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('perPage', 20, type=int)

        parser = reqparse.RequestParser()
        parser.add_argument('atDate', type=lambda x: datetime.strptime(x,'%Y-%m-%d'))
        parser.add_argument('forOperationalYear', type=str)
        parser.add_argument('hyphenate', type=bool)
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
                )).join(CommitteePost).join(Committee).join(CommitteeCategory).order_by(desc(CommitteeCategory.weight), desc(CommitteePost.weight)).paginate(page=page, per_page=per_page)
            else:
                return jsonify({"message": "Invalid input"})
        else:
            if date == None:
                date = datetime.now()


            terms = CommitteePostTerm.query.filter(CommitteePostTerm.post.has(CommitteePost.is_official == True)).filter(and_(CommitteePostTerm.start_date <= date, CommitteePostTerm.end_date >= date)).join(CommitteePost).join(Committee).join(CommitteeCategory).order_by(desc(CommitteeCategory.weight), desc(CommitteePost.weight)).paginate(page=page, per_page=per_page)
        data = []
        for term in terms.items:
            data.append({
                "startDate": term.start_date,
                "endDate": term.end_date,
                "post": term.post.to_dict_without_terms(hyphenate=(True if args.hyphenate != None else False)),
                "user": term.user.to_dict_without_terms()
            })

        return jsonify({"data": data, "totalCount": terms.total})
