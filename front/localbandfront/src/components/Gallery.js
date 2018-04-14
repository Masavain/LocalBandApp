import React from 'react'
import { connect } from 'react-redux'
import bandService from './../services/bands'
import imageService from './../services/images'
import { Grid, Row, Button } from 'react-bootstrap'
import { updateBand } from './../reducers/bandReducer'
import { initiatePhotoIndex, setPhotoIndex, toggleIsOpen, toggle, openFromIndex } from './../reducers/toggleReducer'
import Lightbox from 'react-image-lightbox'

const Gallery = (props) => {
  const handleGallerySubmit = async (event) => {
    event.preventDefault()

    const file  = document.getElementById('galleryImage').files[0]
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async function () {

      const result = reader.result.substr(reader.result.indexOf(',')+1, reader.result.length)
      const imgurFile = await imageService.postImgur( result )

      const image = { url: imgurFile.data.link, imageType: imgurFile.data.type, height: imgurFile.data.height,
        width: imgurFile.data.width, animated: imgurFile.data.animated,
        deleteHash: imgurFile.data.deletehash, size: imgurFile.data.size,
        type: 'gallery', bandId: props.band._id }

      await imageService.postImage(image)
      const updatedBand = await bandService.getById(props.band._id)
      props.updateBand(updatedBand)
      window.location.reload()
    }
    reader.onerror = function (error) {
      console.log('Error: ', error)
    }
  }
  const galleryStyle = {
    display: 'block',
    marginLeft: '35px',
    marginright: '35px',
  }
  return(
    <Grid>
      <Row>
        {props.band.gallery.length === 0 ?
          <div>
            <form onSubmit={handleGallerySubmit}>
              <input type="file" accept="image/*" id="galleryImage" name="image"/>
              <Button bsStyle="primary" bsSize='xsmall' type='submit'>add</Button>
            </form>
          </div>
          : <div style={galleryStyle}>
            {props.band.gallery.map(image =>
              <img key={image._id} src={image.url} onClick={() => props.openFromIndex(props.band.gallery.indexOf(image))} width="300" height="300" alt="galleryImage"/>
            )}
            <form onSubmit={handleGallerySubmit}>
              <input type="file" accept="image/*" id="galleryImage" name="image"/>
              <Button bsStyle="primary" bsSize='xsmall' type='submit'>add</Button>
            </form>
            {props.isOpen && (
              <Lightbox
                mainSrc={props.band.gallery[props.photoIndex].url}
                nextSrc={props.band.gallery[(props.photoIndex + 1) % props.band.gallery.length].url}
                prevSrc={props.band.gallery[(props.photoIndex + props.band.gallery.length - 1) % props.band.gallery.length].url}
                onCloseRequest={() => props.toggleIsOpen()}
                onMovePrevRequest={() =>
                  props.setPhotoIndex((props.photoIndex + props.band.gallery.length - 1) % props.band.gallery.length)}
                onMoveNextRequest={() =>
                  props.setPhotoIndex((props.photoIndex + 1) % props.band.gallery.length)
                }
              />
            )}
          </div>}
      </Row>
    </Grid>
  )
}
const mapStateToProps = (state) => {
  return {
    photoIndex: state.toggle.photoIndex,
    isOpen: state.toggle.isOpen
  }
}

export default connect(
  mapStateToProps, { updateBand, initiatePhotoIndex, setPhotoIndex, toggleIsOpen, toggle,openFromIndex }
)(Gallery)