from api import db


class Event(db.Model):
    __tablename__ = "event"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    dateTime = db.Column(db.DateTime())
    description = db.Column(db.Text)
    group = db.Column(db.String(255)) #OBS: ersätt med relation till nämnd när den modellen finns :)
    place = db.Column(db.String(255)) #TODO: besluta hur vi vill hantera den här: GPS-koordinater eller sträng?

    def toDict(self):
        return {
            "id": self.id,
            "name":self.name,
            "datetime":self.dateTime,
            "description":self.description
        }