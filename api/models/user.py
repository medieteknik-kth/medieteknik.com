from api import db



relationship_table=db.Table('relationship_table', 
                             db.Column('user_id', db.Integer,db.ForeignKey('user.id'), nullable=False),
                             db.Column('officials_post_id',db.Integer,db.ForeignKey('officials_post.id'),nullable=False),
                             db.PrimaryKeyConstraint('user_id', 'officials_post_id') )


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String)
    profile_picture = db.Column(db.String)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    frack_name = db.Column(db.String)
    kth_year = db.Column(db.Integer)
    linkedin = db.Column(db.String)
    facebook = db.Column(db.String)
    officials_posts = db.relationship('OfficialsPost', secondary=relationship_table, backref='users')


class OfficialsPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    officials_email = db.Column(db.String)
    committee_id = db.Column(db.Integer, db.ForeignKey('committee.id'))
    committee = db.relationship("Committee", back_populates = "posts")

class Committee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    posts = db.relationship("OfficialsPost", back_populates = "committee")


    
