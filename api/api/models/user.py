from api.db import db

from api.models.committee_post import CommitteePost
from api.models.committee import Committee

relationship_table=db.Table('relationship_table',
                             db.Column('user_id', db.Integer,db.ForeignKey('user.id'), nullable=False),
                             db.Column('committee_post_id',db.Integer,db.ForeignKey('committee_post.id'),nullable=False),
                             db.PrimaryKeyConstraint('user_id', 'committee_post_id') )


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    kth_id = db.Column(db.String, unique=True)
    email = db.Column(db.String)
    profile_picture = db.Column(db.String, default="/static/profiles/default.png")
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    frack_name = db.Column(db.String)
    kth_year = db.Column(db.Integer)
    linkedin = db.Column(db.String)
    facebook = db.Column(db.String)
    alumni = db.Column(db.Boolean, default=False)
    committee_posts = db.relationship('CommitteePost', secondary=relationship_table, backref='users')

    def to_dict(self):
        posts = []

        for post in self.committee_posts:
            posts.append({"name": post.name, "committee": post.committee.name})

        return {"id": self.id,
                "email": self.email,
                "kth_id": self.kth_id,
                "profile_picture": self.profile_picture,
                "first_name": self.first_name,
                "last_name": self.last_name,
                "frack_name": self.frack_name,
                "kth_year": self.kth_year,
                "linkedin": self.linkedin,
                "facebook": self.facebook,
                "committee_post": posts,
                "alumni": self.alumni
                }



