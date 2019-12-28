from api.db import db

class CommitteePost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    officials_email = db.Column(db.String)
    committee_id = db.Column(db.Integer, db.ForeignKey('committee.id'))
    committee = db.relationship("Committee", back_populates = "posts")
    official_post = db.Column(db.Boolean)

    def get_data(self):
        users = [user.get_data() for user in self.users]

        return {
            "id": self.id,
            "name": self.name,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "officials_email": self.officials_email,
            "committee_id": self.committee.id,
            "users": users
        }
