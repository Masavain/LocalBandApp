import React from 'react'
import { connect } from 'react-redux'
import bandService from './../services/bands'
import imageService from './../services/images'
import { Row, Button, Col, Grid } from 'react-bootstrap'
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
  const deleteImage = (id) => async event => {
    event.preventDefault()
    if (window.confirm('Delete image?')) {
      const img = await imageService.getByIdFull(id)
      await imageService.remove(id)
      await imageService.removeImgur(img.deleteHash)
      const updatedBand = await bandService.getById(props.band._id)
      props.updateBand(updatedBand)
      window.location.reload()
    }

  }

  const imgStyle = {
    backgroundColor: 'black',
    objectFit: 'scale-down',
    overflow: 'hidden',
    marginRight: 8,
  }
  const bandMatchesLoggedUser = (props.user ? (props.band.user.name === props.user.name) ? true : false : false)

  return(
    <Grid>
      <Row>
        {props.band.gallery.length === 0 ?
          <div>
          </div>
          : <div style={{ display: 'inline' }}>
            {props.band.gallery.map(image =>
              <Col xs={11} xsOffset={1} smOffset={0} sm={5} md={4} lg={3} key={image._id} className="wrapper" style={{ marginRight: 1  }}>
                <img src={image.url} style={imgStyle} onClick={() => props.openFromIndex(props.band.gallery.indexOf(image))} width="290" height="290" alt="galleryImage"/>
                {bandMatchesLoggedUser
                  ? <Button style={{ position:'absolute', zIndex: 99, marginTop: 280, bottom: 5,left: 15, backgroundColor:'transparent', color:'#ff99fa' }} className="button" bsSize="xs" bsStyle="" onClick={deleteImage(image._id)}>X</Button>
                  : <div></div>}
              </Col>
            )}
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
      <Row>
        {bandMatchesLoggedUser ? <div style={{ margin: 50 }}><form onSubmit={handleGallerySubmit}>
          <input type="file" className="inputbutton" accept="image/*" id="galleryImage" name="image"/>
          <label htmlFor="galleryImage">Choose image</label>&nbsp;
          <Button bsStyle="primary" bsSize='xsmall' type='submit'>add</Button>
        </form></div> : <div></div>}
      </Row>
    </Grid>
  )
}
const mapStateToProps = (state) => {
  return {
    photoIndex: state.toggle.photoIndex,
    isOpen: state.toggle.isOpen,
    user: state.user
  }
}

export default connect(
  mapStateToProps, { updateBand, initiatePhotoIndex, setPhotoIndex, toggleIsOpen, toggle,openFromIndex }
)(Gallery)