// https://codepen.io/hartzis/pen/VvNGZP
import React from 'react';
import './ImageUpload.css';

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imagePreviewUrl: '',
    };
    this._handleImageChange = this._handleImageChange.bind(this);
  }

  /* _handleSubmit(e) {
      e.preventDefault();
      // TODO: do something with -> this.state.file
    } */

  _handleImageChange(e) {
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file,
        imagePreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(file);
  }

  render() {
    const { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img className="imgPreview" src={imagePreviewUrl} alt="Preview" />);
    }

    return (
      <div className='image-upload'>
        <input type="file" onChange={this._handleImageChange} name={this.props.name} />
        {$imagePreview}
      </div>
    );
  }
}

export default ImageUpload;
