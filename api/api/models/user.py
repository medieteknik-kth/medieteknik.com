from api.db import db

from api.models.committee import Committee


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    kth_id = db.Column(db.String, unique=True)
    email = db.Column(db.String)
    profile_picture = db.Column(
        db.String, default="static/profiles/default.png")
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    frack_name = db.Column(db.String)
    kth_year = db.Column(db.Integer)
    linkedin = db.Column(db.String)
    facebook = db.Column(db.String)
    alumni = db.Column(db.Boolean, default=False)
    post_terms = db.relationship("CommitteePostTerm", back_populates="user")

    def to_dict(self):
        terms = []

        for term in self.post_terms:
            terms.append({"post": term.post.to_dict(),
                          "startDate": term.start_date,
                          "endDate": term.end_date})

        return {"id": self.id,
                "email": self.email,
                "kthId": self.kth_id,
                "profilePicture": self.profile_picture,
                "firstName": self.first_name,
                "lastName": self.last_name,
                "frackName": self.frack_name,
                "kthYear": self.kth_year,
                "linkedin": self.linkedin,
                "facebook": self.facebook,
                "committePostTerms": terms,
                "alumni": self.alumni
                }
    
    def to_dict_without_terms(self):
        return {"id": self.id,
                "email": self.email,
                "kthId": self.kth_id,
                "profilePicture": self.profile_picture,
                "firstName": self.first_name,
                "lastName": self.last_name,
                "frackName": self.frack_name,
                "kthYear": self.kth_year,
                "linkedin": self.linkedin,
                "facebook": self.facebook,
                "alumni": self.alumni
                }
