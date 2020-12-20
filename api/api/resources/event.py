from flask import jsonify, request, make_response
from flask_restful import Resource
from sqlalchemy import or_, and_
from datetime import datetime
import json
import os

from api.function_library.image_functions import save_image
from api.resources.authentication import requires_auth

from api.db import db
from api.models.event import Event
from api.models.post_tag import PostTag

from api.resources.common import parseBoolean

SAVE_FOLDER = os.path.join(os.getcwd(), "api", "static", "events")
PATH = "static/events/"
ISO_DATE_DEF = "%Y-%m-%dT%H:%M:%S.%fZ"

class EventResource(Resource):
    def get(self, id):
      """
      Get the event with the provided ID
      ---
      tags:
          - Events
      parameters:
      - name: id
        in: path
        schema:
          type: integer
      responses:
          200:
            description: OK
      """
      event = Event.query.get(id)
      return jsonify(event.to_dict())
    @requires_auth
    def delete(self, id, user):
      """
      Delete the event with the given ID
      ---
      tags:
        - Events
      parameters:
      - name: id
        in: path
        schema:
          type: integer
      responses:
        200:
          description: OK
      """
      delete_event(id)
      return jsonify(message="event deleted!")

    @requires_auth
    def put(self, id, user):
      """
      Update an event
      ---
      tags:
        - Events
      parameters:
      - name: id
        in: path
        schema:
          type: integer
      - name: event
        in: body
        description: "You should always send an entire object. Modify the event object you want to update, and send it in the request.
        Date is an ISO-8601 string; if you change the date of an event, use Date.toISOString() to correctly format the string that you send to the backend."
        schema:
          type: object
          properties:
            id:
              type: integer
            title:
              type: string
            title_en:
              type: string
            date:
              type: string
            body:
              type: string
            body_en:
              type: string
            location:
              type: string
            committee_id:
              type: string
            tags:
              type: array
              items:
                type: integer
            facebook_link:
              type: string
      """  
      update_event(request, id)
      return jsonify(message="event updated!")

class EventListResource(Resource):
    def get(self):
        """
        Get a list of all events
        ---
        tags:
          - Events
        parameters:
        - name: committee_id
          in: query
          schema:
            type: integer
          example: 1
          description: Committee ID's can be found via the comittee endpoint
        - name: location
          in: query
          schema:
            type: string
          example: KTH campus
          description: The name of the location (we're not cool enough for GPS)
        - name: date
          in: query
          schema:
            type: string
          description:  ISO-8601 string
          example: 2020-02-09T14:44:44+0200
        produces:
          application/json
        responses:
          200:
            description: an array of event objects
        """
        events = get_events()
        return events
    @requires_auth
    def post(self, user):
        """
        Creates a new event with an optional image.
        ---
        tags:
            - Events
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
          description: The 'date' string is in ISO-8601 format. In JS, use Date.toISOString(). The end date defaults to 5 hours after the start date, if no argument is given
          schema:
            type: object
            properties:
              committee_id:
                type: integer
              date:
                type: string
              end_date:
                type: string
              facebook_link:
                type: string
              id:
                type: number
              title:
                type: string
              title_en:
                type: string
              body:
                type: string
              body_en:
                type: string
              tags:
                type: array
                items:
                    type: integer
              id:
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
        try: 
          if user.id:
            event = add_event(request, user.id)
        except Exception as error:
          return make_response(jsonify(success=False, error=str(error)), 403)

        return make_response(jsonify(success=True, id=event.id))



def get_events():
     #get query string params
    user_query = request.args.to_dict()
    #if the user supplied a query, filter

    if user_query:
        q = Event.query.filter_by(**user_query)
    else:
        #if user did not provide filter, just send all events
        scheduled_condition = [Event.scheduled_date <= datetime.now(), Event.scheduled_date == None]
        q = Event.query.filter(and_(Event.draft == False, or_(*scheduled_condition)))
    data = [Event.to_dict(res) for res in q]
    return jsonify(data)


def add_event(request, user_id):
    params = request.form
    e = Event(title=params["title"], event_date=datetime.strptime(params["date"], ISO_DATE_DEF), end_date=datetime.strptime(params["end_date"], ISO_DATE_DEF),
              body=params["body"], location=params["location"], committee_id=params["committee_id"], facebook_link=params["facebook_link"],
              body_en=params["body_en"], title_en=params["title_en"], user_id=user_id)

    add_cols(params, e)

    if "header_image" in request.files:
        image_name = save_image(request.files["header_image"], PATH, SAVE_FOLDER)
        e.header_image = image_name
    if params["tags"]:
        #tag the event
        tags = PostTag.query.filter(PostTag.id.in_(params["tags"])).all()
        for tag in tags:
            e.tags.append(tag)
    db.session.add(e)
    db.session.commit()
    return e

def delete_event(id):
    Event.query.filter(Event.eventId == id).delete()
    db.session.commit()

def update_event(request,id):
    params = request.json
    e = Event.query.filter(Event.eventId == id).first()
    e.body = params["body"]
    e.body_en = params["body_en"]
    e.title = params["title"]
    e.title_en = params["title_en"]
    e.date = datetime.strptime(params["date"], "%Y-%m-%dT%H:%M:%S%z")
    e.location = params["location"]
    e.committee_id = params["comittee_id"]
    e.facebook_link = params["facebook_link"]
    add_attr(e, params, "scheduled_date")
    add_attr(e, params, "draft")
    if params["tags"]:
        #tag the event
        tags = PostTag.query.filter(PostTag.id.in_(params["tags"])).all()
        for tag in tags:
            e.tags.append(tag)
    db.session.commit()

def add_cols(data, event):
    date_cols = ["scheduled_date"]
    boolean_cols = ["draft"]

    for col in dynamic_cols: 
        if data.get(col):
            setattr(event, col, data.get(col))

    for col in boolean_cols: 
      if data.get(col):
          setattr(post, col, parseBoolean(data.get(col)))

    for col in boolean_cols: 
      if data.get(col):
          setattr(event, col, bool(data.get(col)))