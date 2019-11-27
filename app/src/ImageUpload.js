// https://codepen.io/hartzis/pen/VvNGZP
import React from "react";
import "./componentsCSS/ImageUpload.css";

class ImageUpload extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        file: '',
        imagePreviewUrl: ''
      };
      this._handleImageChange = this._handleImageChange.bind(this);
    }

    /*_handleSubmit(e) {
      e.preventDefault();
      // TODO: do something with -> this.state.file
    }*/

    _handleImageChange(e) {
      e.preventDefault();

      let reader = new FileReader();
      let file = e.target.files[0];

      reader.onloadend = () => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result
        });
      }

      reader.readAsDataURL(file)
    }

    render() {
      let {imagePreviewUrl} = this.state;
      let $imagePreview = null;
      if (imagePreviewUrl) {
        $imagePreview = (<img className="imgPreview" src={imagePreviewUrl} />);
      }

      return (
        <div>
            <input type="file" onChange={this._handleImageChange} name={this.props.name} />
          {$imagePreview}
        </div>
      )
    }

  }

  export default ImageUpload;
