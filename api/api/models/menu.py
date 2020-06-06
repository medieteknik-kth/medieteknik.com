from api.db import db

class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    href = db.Column(db.String)
    menu_id = db.Column(db.Integer, db.ForeignKey('menu.id'))
    menu = db.relationship("Menu", back_populates="items")

    def to_dict(self):
        return {"id": self.id,
                "title": self.title,
                "href": self.href
                }

class Menu(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    items = db.relationship("MenuItem", back_populates="menu")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "items": [item.to_dict() for item in self.items]
        }