from flask import jsonify, request
from flask_restful import Resource
from datetime import datetime
import json

from api.function_library.image_functions import save_image
from api.resources.authentication import requires_auth

from api.db import db
from api.models.event import Event
from api.models.post_tag import PostTag

class EventResource(Resource):
    def get(self, id):
        """
        Returns an event with the corresponding ID (if it exists).
        ---
        tags:
            -Events
        parameters:
            -name: id
            in: query
            schema:
                type: Integer
            responses:
                200: 
                    description:OK
        """
        event = Event.query.get(id)
        return jsonify(event.to_dict())
    @requires_auth
    def delete(self, id):
        """
        Deletes the event with the given ID
        ---
        tags:
            -Events
        security:
            Authenticated: []

        parameters:
            -name: id
            in: query
            schema:
                type: Integer
            responses:
                200:
                description: OK
        """
        delete_event(id)
        return jsonify(message="event deleted!")

    @requires_auth
    def put(self, id):
        """
        Updates the event with the given ID
        ---
        tags:
            -Events
        security:
            Authenticated:[]
        
        parameters:
            -name: id
            in: query
            schema:
                type: Integer
            -name: event
            in:body
            schema:
                type: object
                properties:
                    committee_id:
                        type: number
                    date:
                        type: String
                        description: use Date.toISOString() for correct formatting
                    description:
                        type: String
                    facebook_link:
                        type:String
                        description: Link to the facebook event associated with this event
                    id:
                        type:Integer
                        description: the event ID
                    location: 
                        type:String
                    title:
                        type: String
                    tags:
                        type: Array[Integer]
        responses:
            200:
                description: OK
            400:
                description: missing authentication token
            402: 
                description: Not authenticated
        """
        update_event(request, id)
        return jsonify(message="event updated!")

class EventListResource(Resource):
    def get(self):
        """
        Get a list of all events
        ---
        tags:
            -Events
        responses:
            200:
                description: OK
        """
        events = get_events()
        return jsonify({"events": events})
    @requires_auth
    def post(self):
        """
        Creates a new event
        ---
        tags:
            -Events
        security:
            Authenticated:[]

        requestBody:
            multipart/form-data:
                schema:
                 type: object
                 properties:
                    data:
                    type: object
                    properties:
                        committee_id:
                            type: number
                        date:
                            type: String
                            description: use Date.toISOString() for correct formatting
                        description:
                            type: String
                        facebook_link:
                            type:String
                            description: Link to the facebook event associated with this event
                        id:
                            type:Integer
                            description: the event ID
                        location: 
                            type:String
                        title:
                            type: String
                        tags:
                            type: Array[Integer]
                    header-image:
                        type:file
                        
        parameters:
            -name: id
            in: query
            schema:
                type: Integer
        responses:
            200:
                description: OK
            400:
                description: missing authentication token
            402: 
                description: Not authenticated
        """
        add_event(request)
        return jsonify(message="event added!")



def get_events():
    #TODO: implement filtering based on different attributes
    #For now, we just get all events
    q = Event.query.all()
    return [Event.to_dict(res) for res in q]


def add_event(request):
    params = json.loads(request.form.get('data'))
    e = Event(title=params["title"], date=datetime.strptime(params["date"], ISO_DATE_DEF),
              description=params["description"], location=params["location"], committee_id=params["committee_id"], facebook_link=params["facebook_link"])
    if "header_image" in request.files:
        image_name = save_image(request.files["header_image"], PATH)
        e.header_image = image_name
    if params["tags"]:
        #tag the event
        tags = PostTag.query.filter(PostTag.id.in_(params["tags"])).all()
        for tag in tags:
            e.tags.append(tag)
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
    e.committee_id = params["comittee_id"]
    e.facebook_link = params["facebook_link"]
    if params["tags"]:
        #tag the event
        tags = PostTag.query.filter(PostTag.id.in_(params["tags"])).all()
        for tag in tags:
            e.tags.append(tag)
    db.session.commit()
