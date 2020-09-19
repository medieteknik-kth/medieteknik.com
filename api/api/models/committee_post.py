from api.db import db
from sqlalchemy import and_

from datetime import datetime
import re

class CommitteePost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    officials_email = db.Column(db.String)
    committee_id = db.Column(db.Integer, db.ForeignKey('committee.id'))
    committee = db.relationship("Committee", back_populates = "posts")
    is_official = db.Column(db.Boolean)
    terms = db.relationship("CommitteePostTerm", back_populates="post")
    weight = db.Column(db.Integer, default=1)

    def soft_hyphenate(self, name):
        words = ["ansvarig", "skyddsombud", "ordförande", "frågor", "ombud", "ledare"]
        hyphenated = name
        for word in words: 
            hyphenated = hyphenated.replace(word, "&#173;" + word, 1)
        return hyphenated

    def current_terms(self):
        date = datetime.now()
        terms = CommitteePostTerm.query.filter(CommitteePostTerm.post_id == self.id).filter(and_(CommitteePostTerm.start_date <= date, CommitteePostTerm.end_date >= date)).all()

        return terms

    def new_term(self, start_date, end_date):
        term = CommitteePostTerm()
        term.post = self
        term.start_date = start_date
        term.end_date = end_date
        return term
    
    def to_dict(self):
        terms = []
        for term in self.current_terms():
            terms.append({
                "id": term.id,
                "startDate": term.start_date,
                "endDate": term.end_date,
                "user": term.user.to_dict_without_terms()
            })

        return {
            "id": self.id,
            "name": self.name,
            "email": self.officials_email,
            "committeeId": self.committee_id,
            "committeeCategory": self.committee.category.to_dict(),
            "isOfficial": self.is_official,
            "currentTerms": terms,
            "weight": self.weight
        }
    
    def to_dict_without_terms(self, hyphenate=False):
        return {
            "id": self.id,
            "name": self.soft_hyphenate(self.name) if hyphenate else self.name,
            "email": self.officials_email,
            "committeeId": self.committee_id,
            "committeeCategory": self.committee.category.to_dict(),
            "isOfficial": self.is_official,
            "weight": self.weight
        }

    def to_dict_with_all_terms(self):
        terms = []
        current_terms = self.current_terms()
        for term in self.terms:
            terms.append({
                "id": term.id,
                "startDate": term.start_date,
                "endDate": term.end_date,
                "user": term.user.to_dict_without_terms(),
                "current": term in current_terms
            })

        return {
            "id": self.id,
            "name": self.name,
            "email": self.officials_email,
            "committeeId": self.committee_id,
            "committeeCategory": self.committee.category.to_dict(),
            "isOfficial": self.is_official,
            "terms": terms,
            "weight": self.weight
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