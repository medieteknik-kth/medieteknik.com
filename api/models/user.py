from api import db

relationship_table=db.Table('relationship_table',
                             db.Column('user_id', db.Integer,db.ForeignKey('user.id'), nullable=False),
                             db.Column('officials_post_id',db.Integer,db.ForeignKey('officials_post.id'),nullable=False),
                             db.PrimaryKeyConstraint('user_id', 'officials_post_id') )


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
    alumni = db.Column(db.Boolean)
    officials_posts = db.relationship('OfficialsPost', secondary=relationship_table, backref='users')

    def get_data(self):
        posts = []

        for post in self.officials_posts:
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
                "officials_post": posts,
                "alumni": self.alumni
                }


class OfficialsPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    officials_email = db.Column(db.String)
    committee_id = db.Column(db.Integer, db.ForeignKey('committee.id'))
    committee = db.relationship("Committee", back_populates = "posts")

    def get_data(self):
        return {
            "id": self.id,
            "name": self.name,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "officials_email": self.officials_email,
            "committee_id": self.committee.id
        }

class Committee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    posts = db.relationship("OfficialsPost", back_populates = "committee")

    def get_data(self):
        posts = [post.get_data() for post in self.posts]

        return {
            "id": self.id,
            "name": self.name,
            "posts": posts
        }
