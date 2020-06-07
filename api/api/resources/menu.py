from flask import jsonify
from flask_restful import Resource

from api.models.menu import Menu, MenuItem

class MenuItemResource(Resource):
    def get(self, id):
        menu = Menu.query.get(id)
        return jsonify(menu.to_dict())

class MenuResource(Resource):
    def get(self):
        menus = Menu.query.all()
        data = [menu.to_dict() for menu in menus]
        return jsonify(data)