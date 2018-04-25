import React from 'react'
import { connect } from 'react-redux'
import { Grid , Row, FormControl, FormGroup, Col , Button, ControlLabel, Form, Table } from 'react-bootstrap'
import { updateBand } from './../reducers/bandReducer'
import albumService from './../services/albums'
import bandService from './../services/bands'
import imageService from './../services/images'

const Discography = (props) => {
  const handleBandcampSubmit = (album) => async (event) => {
    event.preventDefault()
    await albumService.postBC(album._id, { albumUrl: event.target.bcurl.value.toString() })
    const updatedBand = await bandService.getById(props.band._id)
    props.updateBand(updatedBand)
    window.location.reload()
  }
  const handleAlbumArtSubmit = (album) => async (event) => {
    event.preventDefault()

    const file  = document.getElementById('imageFile').files[0]
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async function () {

      const result = reader.result.substr(reader.result.indexOf(',')+1, reader.result.length)
      const imgurFile = await imageService.postImgur( result )

      const image = { url: imgurFile.data.link, imageType: imgurFile.data.type, height: imgurFile.data.height,
        width: imgurFile.data.width, animated: imgurFile.data.animated,
        deleteHash: imgurFile.data.deletehash, size: imgurFile.data.size,
        type: 'albumArt', albumId: album._id }

      await imageService.postAlbumArt(image)
      const updatedBand = await bandService.getById(props.band._id)
      props.updateBand(updatedBand)
      window.location.reload()

    }
    reader.onerror = function (error) {
      console.log('Error: ', error)
    }
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
    if (window.confirm(`Delete ${album.name}?`)) {
      await albumService.remove(album._id)
      const updatedBand = await bandService.getById(props.band._id)
      props.updateBand(updatedBand)
      window.location.reload()
    }

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
      <Row>
        <Table>
          <tbody>
            {props.band.albums.map(album =>
              <tr key={album._id}>
                {album.albumArt
                  ? <td style={{ width: 150 }} className="wrapper">
                    <div style={{ marginLeft: 15, position:'relative' }}><img src={album.albumArt.url} width="125" height="125" alt="thumbnail"/></div>
                    {bandMatchesLoggedUser ? <form style={{ position:'absolute' }} className="button" onSubmit={handleAlbumArtSubmit(album)}>
                      <input className="inputbutton" type="file" accept="image/*" id="imageFile" name="image"/>
                      <label htmlFor="imageFile">Choose image</label>
                      <Button bsStyle="primary" bsSize='xsmall' type='submit'>edit album art</Button>
                    </form> : <div></div>}
                  </td>
                  : <td className="wrapper">
                    <div style={{ position:'relative' }}><img src='/default_album_icon.png' width="125" height="125" alt="default thumbnail"/></div>
                    {bandMatchesLoggedUser ? <form style={{ position:'absolute' }} className="button" onSubmit={handleAlbumArtSubmit(album)}>
                      <input type="file" accept="image/*" id="imageFile" name="image"/>
                      <label htmlFor="imageFile">Choose image</label>
                      <Button bsStyle="primary" bsSize='xsmall' type='submit'>edit album art</Button>
                    </form> : <div></div>}
                  </td>}
                <td className="wrapper" style={{ width: '30%' }}>
                  Title: {album.name}
                  <div>
                    <div>Released: {album.year}</div>
                    <div>About: {album.about}</div>
                    <div className="button" >
                      <form onSubmit={handleUpdateSubmit(album)}>
                        <div><input type='text' name='about' /> edit about </div>
                      </form>
                    </div>

                  </div>
                </td>
                {album.bcURL ?
                  <td className="wrapper" style={{ position: 'relative', width: '400px' }}>
                    <iframe  style={{ position: 'relative',border: 0,width: '100%',height: '120px' }}
                      title={album.bcAlbumID}
                      src={`https://bandcamp.com/EmbeddedPlayer/album=${album.bcAlbumID}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/`}
                      seamless>
                      <a href={album.bcURL}>embedded album</a>
                    </iframe>
                    {bandMatchesLoggedUser ? <div><form className="button" onSubmit={handleBandcampSubmit(album)}>
                      <div><input type='text' name='bcurl' /> change album url </div>
                    </form>&nbsp;<Button className="button" bsSize="sm" bsStyle="danger" onClick={deleteAlbum(album)}>x</Button></div> : <div></div>}

                  </td>
                  : <td className="wrapper">
                    {bandMatchesLoggedUser ? <form className="button" onSubmit={handleBandcampSubmit(album)}>
                      <div ><input type='text' name='bcurl'/> add bandcamp url </div>
                    </form> : <div></div>}
                  </td>
                }
              </tr>)}

          </tbody>
        </Table>
      </Row>
      {bandMatchesLoggedUser ?
        <Row style={{ height: 40 }}>
          <Col sm={2} >
            <div className="wrapper">
              <div className="inputbutton" id="asd"></div>
              <label htmlFor="asd" style={{ position:'absolute' }}>&#9660;</label>
              <div className="button">
                <Form horizontal style={{ padding: 30 }}onSubmit={albumFormSubmit} className='form-inline'>
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
              </div>
            </div>
          </Col>
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