
import os
from werkzeug.utils import secure_filename
import uuid

def save_image(image, path, save_folder):
    """
    save an image file to disk
    function written by @Ella-Klara, with minor modification to work in more cases
    @param image: a file object of type JPEG or PNG
    @param path: the file path for saving the image
    @returns filename: the filename for the saved image (uuid string)
    """
    local_path = ""
    
    ALLOWED_EXTENTIONS = [".png", ".jpg", ".jpeg"]
    original_filename, extension = os.path.splitext(secure_filename(image.filename))
    filename = str(uuid.uuid4()) + extension
    if extension in ALLOWED_EXTENTIONS:
        result_path = os.path.join(path, filename)
        local_path = os.path.join(save_folder, filename)
        image.save(local_path)
        return result_path
    else:
        raise "you can only upload .png or .jpg-files."