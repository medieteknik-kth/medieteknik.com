from flask import jsonify
from flask_restful import Resource, reqparse

from api.models.committee_post import CommitteePostTerm

from datetime import datetime
from datetime import date

class OperationalYearsResource(Resource):
    def get(self):
        """
        Gets current and available operational years.
        ---
        tags:
            - Officials
        responses:
            200:
                description: OK
        """

        terms = CommitteePostTerm.query.distinct(CommitteePostTerm.start_date, CommitteePostTerm.end_date).group_by(CommitteePostTerm.start_date, CommitteePostTerm.end_date).all()
        years = []
        start = (1, 1)
        end = (7, 1)
        currentDate = datetime.today().date()
        current = str(currentDate.year - 1) + "/" + str(currentDate.year) if start <= (currentDate.month, currentDate.day) < end else str(currentDate.year) + "/" + str(currentDate.year + 1)
        for term in terms:
            for attr in ["start_date", "end_date"]:
                operationalYear = ""
                year = getattr(term,attr).date().year
                if start <= (getattr(term,attr).date().month, getattr(term,attr).date().day) < end:
                    operationalYear = str(year - 1) + "/" + str(year)
                else:
                    operationalYear = str(year) + "/" + str(year + 1)
                years.append(operationalYear) if operationalYear not in years else years
        years.sort(reverse=True)
        return jsonify({"current": current, "years": years})