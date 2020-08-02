import React from 'react';
import './YellowDocumentUpload.scss';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

// --- PDF-extra ---
import { Document, Page, pdfjs } from 'react-pdf';
import { useEffect } from 'react';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const YellowDocumentUpload = props => {
  const [file, setFile] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const _handleDocumentChange = (e) => {
    e.preventDefault()

    const fileReader = new FileReader();
    const uploadedDocument = e.target.files[0];

    e.target.value = "";

    fileReader.readAsArrayBuffer(uploadedDocument);

    fileReader.onloadend = () => {
        let typedArray = new Uint8Array(fileReader.result);
        let pdfHandle = pdfjs.getDocument(typedArray);

        pdfHandle.promise
                .then(pdf => {
                    pdf.getPage(1)
                        .then(firstPage => {
                            let thumbnailCanvas = document.createElement('canvas');
                            let context = thumbnailCanvas.getContext("2d");
                            let viewport = firstPage.getViewport(3); // getViewport(scale, angle)
                            thumbnailCanvas.width = viewport.width;
                            thumbnailCanvas.height = viewport.height;

                            const renderContext = {
                                canvasContext: context,
                                viewport: viewport
                            }

                            let renderPageTask = firstPage.render(renderContext);

                            renderPageTask.promise
                                .then(() => {
                                    const thumbnailImage = thumbnailCanvas.toDataURL();
                                    setPreviewUrl(thumbnailImage);
                                    setFile(uploadedDocument);
                                    props.onChange(uploadedDocument, thumbnailImage)
                                })
                        })
                })
    }
};

  const _clearDocument = () => {
    setFile('');
    setPreviewUrl('');
  };

    useEffect(() => {
        _clearDocument()
    }, [props.clearFormCounter])

  return (
    <div className='yellow-document-upload'>
      <div
        className='document-upload-box'
        style={{ backgroundImage: `url('${previewUrl}')` }}
      >
        {file ? (
          <div className='cancel-document-upload'>
            <label for='file-upload'></label>
            <span>
              <FontAwesomeIcon
                size='2x'
                icon={faTimes}
                color='#f0c900'
                onClick={_clearDocument}
              />
            </span>
          </div>
        ) : (
          <label for='file-upload'>
            <FontAwesomeIcon size='2x' icon={faPlus} color='#f0c900' />
          </label>
        )}
      </div>

      <input
        id='file-upload'
        type='file'
        onChange={_handleDocumentChange}
      />
    </div>
  );
};

export default YellowDocumentUpload;
