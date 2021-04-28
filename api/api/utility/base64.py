from mimetypes import guess_extension
import base64
import tempfile
import os

def parse_b64(raw_data):
    data_arr = raw_data.split(',')
    metadata = data_arr[0]
    mimetype = metadata.split(';')[0].split(':')[1]
    extension = guess_extension(mimetype)
    data = data_arr[1].encode('utf-8')
    return base64.decodebytes(data), extension, mimetype
