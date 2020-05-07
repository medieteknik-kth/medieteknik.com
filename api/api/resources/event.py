from flask import jsonify, request
from flask_restful import Resource
from datetime import datetime
import json


from api.db import db
from api.models.event import Event

class EventResource(Resource):
    def get(self, id):
        event = Event.query.get(id)
        return jsonify(event.to_dict())

    def delete(self, id):
        delete_event(id)
        return jsonify(message="event deleted!")

    def put(self, id):
        update_event(request, id)
        return jsonify(message="event updated!")

class EventListResource(Resource):
    def get(self):
        events = get_events()
        return jsonify({"events": events})
    
    def post(self):
        add_event(request)
        return jsonify(message="event added!")



def get_events():
    #TODO: implement filtering based on different attributes
    #For now, we just get all events
    q = Event.query.all()
    return [Event.to_dict(res) for res in q]


def add_event(request):
    params = request.json
    e = Event(title=params["title"], date=datetime.strptime(params["date"], "%Y-%m-%dT%H:%M:%S%z"), description=params["description"], location=params["location"])
    db.session.add(e)
    db.session.commit()

def delete_event(id):
    Event.query.filter(Event.eventId == id).delete()
    db.session.commit()

def update_event(request,id):
    params = request.json
    e = Event.query.filter(Event.eventId == id).first()
    e.description = params["description"]
    e.title = params["title"]
    e.date = datetime.strptime(params["date"], "%Y-%m-%dT%H:%M:%S%z")
    e.location = params["location"]
    db.session.commit()