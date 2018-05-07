import React from 'react'
import { connect } from 'react-redux'
import { Row, FormControl, FormGroup, Col , Button, ControlLabel, Form, Table } from 'react-bootstrap'
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
    const newObject = { ...album, about: document.getElementById('newAbout').value }
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
    const about = document.getElementById('about').value
    const newAlbum = { name:event.target.name.value,
      year: event.target.year.value,
      about: about,
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
    <div style={{ padding: 10 }}>
      <Row>
        <Table>
          <tbody>
            {props.band.albums.map(album =>
              <tr style={{ height: 200, borderBottom: '1px solid lightgray' }} key={album._id}>
                {album.albumArt
                  ? <Col className="wrapper" sm={2}>
                    <div style={{ marginLeft: 15, position:'relative' }}><img src={album.albumArt.url} width="125" height="125" alt="thumbnail"/></div>
                    {bandMatchesLoggedUser ? <form style={{ position:'absolute' }} className="button" onSubmit={handleAlbumArtSubmit(album)}>
                      <input className="inputbutton" type="file" accept="image/*" id="imageFile" name="image"/>
                      <label htmlFor="imageFile">Choose image</label>
                      <Button bsStyle="primary" bsSize='xsmall' type='submit'>edit album art</Button>
                    </form> : <div></div>}
                  </Col>
                  :
                  <Col className="wrapper" sm={2} xs={12}>
                    <div style={{ marginLeft: 15, position:'relative' }}><img src='/default_album_icon.png' width="125" height="125" alt="default thumbnail"/></div>
                    {bandMatchesLoggedUser ? <form style={{ position:'absolute' }} className="button" onSubmit={handleAlbumArtSubmit(album)}>
                      <input className="inputbutton" type="file" accept="image/*" id="imageFile" name="image"/>
                      <label htmlFor="imageFile">Choose image</label>
                      <Button bsStyle="primary" bsSize='xsmall' type='submit'>edit album art</Button>
                    </form> : <div></div>}
                  </Col>
                }
                <Col style={{ paddingLeft: 40 }} className="wrapper" sm={3} xs={6}>
                  <div style={{ color: 'gray' }}>Title:</div>
                  <div>{album.name}</div>
                  <div>
                    <div style={{ color: 'gray' }}>Released:</div>
                    <div>{album.year}</div>
                    <div style={{ color: 'gray' }}>About:</div>
                    <div>{album.about}</div>
                    <div className="button" >
                      <form onSubmit={handleUpdateSubmit(album)}>
                        <textarea style={{ padding: 0, border: '1px solid lightgray', borderRadius: '3px' }} id='newAbout'></textarea>
                        <button className="page-button" style={{ position: 'relative' }} type="submit">edit about</button>
                      </form>
                    </div>

                  </div>
                </Col>
                {album.bcURL ?
                  <Col style={{ paddingLeft: 40 }} className="wrapper" sm={6} xs={11}>
                    <iframe  style={{ position: 'relative',border: 0,width: '100%',height: '120px' }}
                      title={album.bcAlbumID}
                      src={`https://bandcamp.com/EmbeddedPlayer/album=${album.bcAlbumID}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/`}
                      seamless>
                      <a href={album.bcURL}>embedded album</a>
                    </iframe>
                    {bandMatchesLoggedUser ? <div><form className="button" onSubmit={handleBandcampSubmit(album)}>
                      <div><input type='text' name='bcurl' /> change album url </div>
                    </form>&nbsp;<Button className="button" bsSize="sm" bsStyle="danger" onClick={deleteAlbum(album)}>x</Button></div> : <div></div>}
                  </Col>
                  : <Col  className="wrapper" >
                    {bandMatchesLoggedUser ? <form className="button" onSubmit={handleBandcampSubmit(album)}>
                      <div ><input type='text' name='bcurl'/> add bandcamp url </div>
                    </form> : <div></div>}
                  </Col>
                }
              </tr>)}

          </tbody>
        </Table>
      </Row>
      {bandMatchesLoggedUser ?
        <Row style={{ height: 40 }}>
          <Col xs={6} >
            <div className="wrapper">
              <div className="inputbutton" id="asd"></div>
              <label htmlFor="asd" style={{ position:'absolute', left: 35 }}>&#9660;</label>
              <div className="button">
                <Form horizontal style={{ padding: 30 }}onSubmit={albumFormSubmit} className='form-inline'>
                  <FormGroup className='form-group' bsSize='sm'>
                    <Col xs={4} xsOffset={2} className='input-label' componentClass={ControlLabel}>Title: </Col>
                    <Col xs={5} xsOffset={1} className='input-label'><FormControl style={{ marginBottom: 10 }}
                      type="text"
                      name="name"
                    /></Col>

                    <Col xs={4} xsOffset={2} className='input-label' componentClass={ControlLabel}>Release year: </Col>
                    <Col xs={5} xsOffset={1} className='input-label'><FormControl style={{ marginBottom: 10 }}
                      type="number"
                      name="year"
                    /></Col>
                    <Col xs={4} xsOffset={2} className='input-label' componentClass={ControlLabel}>Bandcamp album url: </Col>
                    <Col xs={3} xsOffset={1} className='input-label'><FormControl
                      type="text"
                      name="bcurl"
                    /></Col>
                    <Col xs={6} style={{ padding: 0, margin:0 }}>&nbsp;</Col>
                    <Col style={{ marginTop:10 }} xs={4} xsOffset={2} className='input-label' componentClass={ControlLabel}>About: </Col>
                    <Col xs={5} xsOffset={1} className='input-label'>
                      <textarea style={{ width: 142,padding: 0, border: '1px solid lightgray', borderRadius: '3px' }} id='about'></textarea></Col>
                    <Col xs={4} xsOffset={8} className='input-label' ><Button bsStyle="success" type="submit">Add new album</Button></Col>
                  </FormGroup>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
        : <div></div>}
    </div>
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