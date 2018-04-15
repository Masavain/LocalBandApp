import React from 'react'
import { connect } from 'react-redux'
import { Grid , Row, FormControl, FormGroup, Col , Button, ControlLabel, Form } from 'react-bootstrap'
import { updateBand } from './../reducers/bandReducer'
import albumService from './../services/albums'
import bandService from './../services/bands'

const Discography = (props) => {
  const handleBandcampSubmit = async (event) => {
    // event.preventDefault()
    // const updatedAlbum = await bandService.postBC(props.band._id, { albumUrl: event.target.bcurl.value.toString() })
    // props.updateBand(updatedBand)
    // window.location.reload()
  }

  const albumFormSubmit = async (event) => {
    event.preventDefault()
    console.log('name', event.target.name.value)

    const newAlbum = { name:event.target.name.value,
      year: event.target.year.value,
      about: event.target.about.value,
      bandId: props.band._id,
      bcURL: event.target.bcurl.value
    }
    const createdAlbum = await albumService.createNew(newAlbum)
    if (newAlbum.bcURL) {
      await albumService.postBC(createdAlbum._id, { albumUrl: newAlbum.bcURL })
    }
    const updatedBand = await bandService.getById(props.band._id)
    props.updateBand(updatedBand)
    // window.location.reload()
  }
  console.log(props.band.albums)
  return(
    <Grid>
      <div>
        {props.band.albums.map(album =>
          <div key={album._id}><p>{album.name}</p>
            {album.bcURL ?
              <iframe  style={{ position: 'relative',border: 0,width: '100%',height: '120px' }}
                src={`https://bandcamp.com/EmbeddedPlayer/album=${album.bcAlbumID}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/`}
                seamless>
                <a href={album.bcURL}>embedded album</a>
              </iframe>

              : <div>
              </div>
            }
          </div>)}
      </div>

      <Row>
        <Form horizontal onSubmit={albumFormSubmit} className='form-inline'>
          <FormGroup className='form-group' bsSize='sm'>
            <Col className='input-label' componentClass={ControlLabel} xs={3}>Title: </Col>
            <Col className='input-label' xs={9}><FormControl
              type="text"
              name="name"
            /></Col>

            <Col className='input-label' componentClass={ControlLabel} xs={3}>Release year: </Col>
            <Col className='input-label' xs={9}><FormControl
              type="number"
              name="year"
            /></Col>
            <Col className='input-label' componentClass={ControlLabel} xs={3}>About: </Col>
            <Col className='input-label' xs={9}><FormControl
              type="text"
              name="about"
            /></Col>
            <Col className='input-label' componentClass={ControlLabel} xs={3}>Bandcamp url: </Col>
            <Col className='input-label' xs={9}><FormControl
              type="text"
              name="bcurl"
            /></Col>
            <Col className='input-label' smOffset={5}><Button bsStyle="success" type="submit">Add</Button></Col>
          </FormGroup>
        </Form>
      </Row>
    </Grid>
  )
}

export default connect(
  null, { updateBand }
)(Discography)