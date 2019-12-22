from api import db

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
    alumni = db.Column(db.Boolean)
    committee_posts = db.relationship('CommitteePost', secondary=relationship_table, backref='users')

    def get_data_without_posts(self):
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
                "alumni": self.alumni
                }

    def get_data(self):
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

class Committee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    posts = db.relationship("CommitteePost", back_populates = "committee")
    logo = db.Column(db.String)
    header_image = db.Column(db.String)
    

    def get_data(self):
        posts = [post.get_data() for post in self.posts]

        return {
            "id": self.id,
            "name": self.name,
            "posts": posts
        }
