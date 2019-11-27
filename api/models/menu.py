from api import db

class Menu(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    link_name = db.Column(db.string)
    link_nr = db.Column(db.string)

    def get_data(self):
        return {"id": self.id,
                "title": self.title,
                "link_name": self.link_name,
                "link_nr": self.link_nr
                }