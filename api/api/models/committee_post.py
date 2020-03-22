from api.db import db

class CommitteePost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    officials_email = db.Column(db.String)
    committee_id = db.Column(db.Integer, db.ForeignKey('committee.id'))
    committee = db.relationship("Committee", back_populates = "posts")
    is_official = db.Column(db.Boolean)
    terms = db.relationship("CommitteePostTerm", back_populates="post")

    def new_term(self, start_date, end_date):
        term = CommitteePostTerm()
        term.post = self
        term.start_date = start_date
        term.end_date = end_date
        return term
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.officials_email,
            "committeeId": self.committee_id,
            "isOfficial": self.is_official
        }

class CommitteePostTerm(db.Model):
    __tablename__ = "committee_post_term"
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('committee_post.id'))
    post = db.relationship("CommitteePost", back_populates="terms")
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship("User", back_populates="post_terms")