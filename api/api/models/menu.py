from api.db import db

class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    link_name = db.Column(db.String)
    link_nr = db.Column(db.String)

    def to_dict(self):
        return {"id": self.id,
                "title": self.title,
                "link_name": self.link_name,
                "link_nr": self.link_nr
                }