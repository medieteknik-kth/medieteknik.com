from flask import jsonify, request
from flask_restful import Resource

import json

from api.models.event import Event

class EventResource(Resource):
    def get(self, id):
        event = Event.query.get(id)
        return jsonify(event.to_dict())

    def put(self):
        add_event(request)
        return jsonify(message="event added!")

class EventListResource(Resource):
    def get(self):
        events = get_events()
        return jsonify({"events": events})



def get_events():
    #TODO: implement filtering based on different attributes
    #For now, we just get all events
    q = Event.query.all()
    return [Event.to_dict(res) for res in q]


def add_event(request):
    params = json.loads(request.json["body"])
    e = Event(title=params["title"], date=params["date"], description=params["description"], location=params["location"])
    db.session.add(e)
    db.session.commit()


    