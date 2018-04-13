import React from 'react'
import { connect } from 'react-redux'
import bandService from './../services/bands'
import imageService from './../services/images'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import { updateBand } from './../reducers/bandReducer'
import { Link } from 'react-router-dom'
import BandHeader from './BandHeader'

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
  props.band.gallery.map(i =>
    console.log(i.url))
  console.log('gallery', props.band.gallery)
  return(
    <Grid>
      <Row>
        <BandHeader band={props.band}/>
      </Row>
      <Row>
        <Col>
          <Link to={`/bands/${props.band._id}`}>feed</Link> &nbsp;
          <Link to={`/bands/${props.band._id}/gallery`}>gallery</Link> &nbsp;
          <Link to={`/bands/${props.band._id}/discography`}>discography</Link>
        </Col>
      </Row>
      <Row>
        {props.band.gallery.length === 0 ?
          <div>
            <form onSubmit={handleGallerySubmit}>
              <input type="file" accept="image/*" id="galleryImage" name="image"/>
              <Button bsStyle="primary" bsSize='xsmall' type='submit'>add</Button>
            </form>
          </div>
          : <div>
            {props.band.gallery.map(image =>
              <img key={image._id} src={image.url} width="300" height="300" alt="galleryImage"/>
            )}
            <form onSubmit={handleGallerySubmit}>
              <input type="file" accept="image/*" id="galleryImage" name="image"/>
              <Button bsStyle="primary" bsSize='xsmall' type='submit'>add</Button>
            </form>
          </div>}
      </Row>
    </Grid>
  )
}

export default connect(
  null, { updateBand }
)(Gallery)