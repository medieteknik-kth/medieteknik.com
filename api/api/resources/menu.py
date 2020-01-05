from flask import jsonify
from flask_restful import Resource

from api.models.menu import MenuItem

class MenuItemResource(Resource):
    def get(self, id):
        menu_item = MenuItem.query.get(id)
        return jsonify(menu_item.to_dict())

class MenuResource(Resource):
    def get(self):
        items = MenuItem.query.all()
        data = [item.to_dict() for item in items]
        return jsonify(data)