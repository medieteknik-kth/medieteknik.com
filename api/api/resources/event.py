from flask import jsonify, request
from flask_restful import Resource
from datetime import datetime
import json

from api.function_library.image_functions import save_image
from api.resources.authentication import requires_auth

from api.db import db
from api.models.event import Event
from api.models.post_tag import PostTag

PATH = "static/events/"
ISO_DATE_DEF = "%Y-%m-%dT%H:%M:%S.%fZ"

class EventResource(Resource):
    def get(self, id):
        event = Event.query.get(id)
        return jsonify(event.to_dict())
    @requires_auth
    def delete(self, id):
        delete_event(id)
        return jsonify(message="event deleted!")

    @requires_auth
    def put(self, id):
        
        update_event(request, id)
        return jsonify(message="event updated!")

class EventListResource(Resource):
    def get(self):
        events = get_events()
        return jsonify({"events": events})
    @requires_auth
    def post(self):
        """
        Creates a new event with an optional image.
        ---
        tags:
            - Event
        consumes:
            mutipart/form-data
        security:
            - authenticated: []
        parameters:
        - name: header_image
          in: body
          schema:
            type: file
        - name: data
          in: body
          description: The 'date' string is in ISO-8601 format. In JS, use Date.toISOString()
          schema:
            type: object
            properties:
              committee_id:
                type: integer
              date:
                type: string
              fb_link:
                type: string
              event_id:
                type: number
              title:
                type: string
              "description":
                type: string
              tags:
                type: array
                items:
                    type: integer
              event_id:
                type: integer
              location:
                type: string

        
        responses:
            200:
                description: OK
            400:
                description: Missing authentication token
            402:
                description: Not authenticated
        """
        add_event(request)
        return jsonify(message="event added!")



def get_events():
     #get query string params
    user_query = request.args.to_dict()
    print(user_query)
    #if the user supplied a query, filter
    if user_query:
        
        q = Event.query.filter_by(**user_query)
    else:
        #if user did not provide filter, just send all events
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
