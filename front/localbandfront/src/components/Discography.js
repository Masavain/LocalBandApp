import React from 'react'
import { connect } from 'react-redux'
import { Grid , Row, FormControl, FormGroup, Col , Button, ControlLabel, Form, Table } from 'react-bootstrap'
import { updateBand } from './../reducers/bandReducer'
import albumService from './../services/albums'
import bandService from './../services/bands'

const Discography = (props) => {
  const handleBandcampSubmit = (album) => async (event) => {
    event.preventDefault()
    await albumService.postBC(album._id, { albumUrl: event.target.bcurl.value.toString() })
    const updatedBand = await bandService.getById(props.band._id)
    props.updateBand(updatedBand)
    window.location.reload()
  }
  const handleUpdateSubmit = (album) => async event => {
    event.preventDefault()
    const newObject = { ...album, about: event.target.about.value }
    console.log(newObject)
    await albumService.update(newObject._id, newObject)
    const updatedBand = await bandService.getById(props.band._id)
    props.updateBand(updatedBand)
    window.location.reload()
  }
  const deleteAlbum = (album) => async event => {
    event.preventDefault()
    await albumService.remove(album._id)
    const updatedBand = await bandService.getById(props.band._id)
    props.updateBand(updatedBand)
    window.location.reload()
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
    window.location.reload()
  }
  const bandMatchesLoggedUser = (props.user ? (props.band.user.name === props.user.name) ? true : false : false)
  return(
    <Grid>

      <Table>
        <tbody className="wrapper">
          {props.band.albums.map(album =>
            <tr key={album._id}><td style={{ width: '30%' }}>
              {album.name}
              <div>
                <div>Released: {album.year}</div>
                <div>About: {album.about}</div>
                <div className="button" >
                  <form  onSubmit={handleUpdateSubmit(album)}>
                    <div ><input type='text' name='about' /> edit about </div>
                  </form>
                </div>

              </div>
            </td>
            {album.bcURL ?
              <td style={{ position: 'relative', width: '400px' }}>
                <iframe  style={{ position: 'relative',border: 0,width: '100%',height: '120px' }}
                  src={`https://bandcamp.com/EmbeddedPlayer/album=${album.bcAlbumID}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/`}
                  seamless>
                  <a href={album.bcURL}>embedded album</a>
                </iframe>
                {bandMatchesLoggedUser ? <form className="button" onSubmit={handleBandcampSubmit(album)}>
                  <div ><input type='text' name='bcurl' /> change album url </div>
                </form> : <div></div>}

              </td>
              : <td>
                {bandMatchesLoggedUser ? <form className="button" onSubmit={handleBandcampSubmit(album)}>
                  <div ><input type='text' name='bcurl' /> add bandcamp url </div>
                </form> : <div></div>}
              </td>
            }
            <td style={{ position: 'relative', width: '45px' }}>
              <Button className="button" bsSize="sm" bsStyle="danger" onClick={deleteAlbum(album)}>x</Button>
            </td>
            </tr>)}

        </tbody>
      </Table>
      {bandMatchesLoggedUser ?
        <Row>
          <Form horizontal onSubmit={albumFormSubmit} className='form-inline'>
            <FormGroup className='form-group' bsSize='sm'>
              <Col xsOffset={2} className='input-label' componentClass={ControlLabel}>Title: </Col>
              <Col xsOffset={2} className='input-label'><FormControl
                type="text"
                name="name"
              /></Col>

              <Col xsOffset={2} className='input-label' componentClass={ControlLabel}>Release year: </Col>
              <Col xsOffset={2} className='input-label'><FormControl
                type="number"
                name="year"
              /></Col>
              <Col xsOffset={2} className='input-label' componentClass={ControlLabel}>About: </Col>
              <Col xsOffset={2} className='input-label'><FormControl
                type="text"
                name="about"
              /></Col>
              <Col xsOffset={2} className='input-label' componentClass={ControlLabel} >Bandcamp url: </Col>
              <Col xsOffset={2} className='input-label'><FormControl
                type="text"
                name="bcurl"
              /></Col>
              <Col xsOffset={2} className='input-label' ><Button bsStyle="success" type="submit">Add new album</Button></Col>
            </FormGroup>
          </Form>
        </Row>
        : <div></div>}

    </Grid>
  )
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}
export default connect(
  mapStateToProps, { updateBand }
)(Discography)