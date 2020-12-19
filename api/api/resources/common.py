def parseBoolean(string):
    d = {'true': True, 'false': False}
    return d.get(string, string)