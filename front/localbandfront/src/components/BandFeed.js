import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import { updateBand } from './../reducers/bandReducer'
import bandService from './../services/bands'
import imageService from './../services/images'

const BandFeed = (props) => {
  const src = `https://bandcamp.com/EmbeddedPlayer/album=${props.band.bcAlbumID}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/track=${props.band.bcTrackID}/transparent=true/`

  const handleGenreSubmit = async (event) => {
    event.preventDefault()
    const newObject = { ...props.band, genre: event.target.genre.value }
    const updatedBand = await bandService.update(newObject._id, newObject)
    props.updateBand(updatedBand)
    window.location.reload()
  }
  const handleStartedSubmit = async (event) => {
    event.preventDefault()
    const newObject = { ...props.band, started: event.target.started.value }
    const updatedBand = await bandService.update(newObject._id, newObject)
    props.updateBand(updatedBand)
    window.location.reload()
  }
  const handleAboutSubmit = async (event) => {
    event.preventDefault()
    const about = document.getElementById('about').value
    const newObject = { ...props.band, about  }
    const updatedBand = await bandService.update(newObject._id, newObject)
    props.updateBand(updatedBand)
    window.location.reload()
  }

  const handleBandcampSubmit = async (event) => {
    event.preventDefault()
    const updatedBand = await bandService.postBC(props.band._id, { albumUrl: event.target.bcurl.value.toString() })
    props.updateBand(updatedBand)
    window.location.reload()
  }

  const handleAvatarSubmit = async (event) => {
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
        type: 'avatar', bandId: props.band._id }

      await imageService.postImage(image)
      const updatedBand = await bandService.getById(props.band._id)
      props.updateBand(updatedBand)
      window.location.reload()

    }
    reader.onerror = function (error) {
      console.log('Error: ', error)
    }
  }
  const handleYoutubeSubmit = async (event) => {
    event.preventDefault()
    console.log(event.target.yturl.value.toString())
    const id = event.target.yturl.value.toString().substr(32, 43)
    console.log(id)
    const updatedBand = await bandService.postYT(props.band._id, { youtubeID: id })
    props.updateBand(updatedBand)
    window.location.reload()
  }

  const BCstyle = {
    position: 'relative',
    border: 0,
    width: 350,
    height: 470
  }
  const gridStyle = {
    padding: 10
  }

  const ytId = props.band.youtubeID ? props.band.youtubeID : 'So6Qa_4QHYY'
  const ytUrli = `https://www.youtube.com/embed/${ytId}?autoplay=0`
  const bandMatchesLoggedUser = (props.user ? (props.band.user.name === props.user.name) ? true : false : false)


  return(
    <Grid>
      <Row style={gridStyle}>
        <Col sm={3} xs={3} style={{ marginRight: 100 }}>
          {props.band.avatar
            ? <div className="wrapper">
              <img src={props.band.avatar.url} width="300" height="300" alt="avatar"/>
              {bandMatchesLoggedUser ?
                <div style={{ position: 'absolute', padding: 5, top: '250px' }}><form className="button" onSubmit={handleAvatarSubmit}>
                  <input className="inputbutton" type="file" accept="image/*" id="imageFile" name="image"/>
                  <label htmlFor="imageFile">Choose an image</label>
                  <Button bsStyle="primary" bsSize='xsmall' type='submit'>edit avatar</Button>
                </form></div>
                : <div></div>}
            </div>
            : <div className="wrapper" style={{ position: 'relative' }}>
              <img src='/default_band_icon.png' width="300" height="300" alt="default avatar"/>
              {bandMatchesLoggedUser ?
                <div style={{ position: 'absolute', padding: 5, top: '250px' }}>
                  <form className="button" onSubmit={handleAvatarSubmit}>
                    <input className="inputbutton" type="file" accept="image/*" id="imageFile" name="image"/>
                    <label htmlFor="imageFile">Choose an image</label>
                    <Button bsStyle="primary" bsSize='xsmall' type='submit'>edit avatar</Button>
                  </form>
                </div>
                : <div></div>}
            </div>}
        </Col>
        <Col md={4} sm={3} style={{ marginRight: 100, padding: 10 }}>
          <div className="wrapper">
            <div>Genre: {props.band.genre ? props.band.genre : ''}</div>
            {bandMatchesLoggedUser ?
              <form className="button" onSubmit={handleGenreSubmit}>
                <div>edit genre</div><input type='text' name='genre'/>
              </form> : <div></div>}
          </div>
          <div className="wrapper">
            <div>Started: {props.band.started ? props.band.started : ''}</div>
            {bandMatchesLoggedUser ?
              <form className="button" onSubmit={handleStartedSubmit}>
                <div>edit starting year</div><input type='number' name='started'/>
              </form> : <div></div>}
          </div>
          <div className="wrapper">
            <div>About: {props.band.about ? props.band.about : ''}</div>
            {bandMatchesLoggedUser ?
              <form className="button" onSubmit={handleAboutSubmit}>
                <div>edit about</div>
                <textarea id='about'></textarea>
                <input type="submit"/>
              </form> : <div></div>}
          </div>
        </Col>


      </Row>
      <Row>
        <Col md={3} xs={3}>
          {props.band.bcURL
            ? <div>
              <iframe title={props.band._id} style={BCstyle}
                src={src}
                seamless>
                <a href={props.band.bcURL}>asd</a>
              </iframe>
              {bandMatchesLoggedUser ?
                <form onSubmit={handleBandcampSubmit}>
                  <div>edit bandcamp url<input type='text' name='bcurl' /></div>
                </form>
                : <div></div>}
            </div>
            : <div>
              {bandMatchesLoggedUser ?
                <form onSubmit={handleBandcampSubmit}>
                  <div>add bandcamp url<input type='text' name='bcurl' /></div>
                </form>
                : <div></div>}
            </div>}
        </Col>
      </Row>
      <Row>
        <Col className={gridStyle} xs={3}>
          <iframe title="youtube" id="ytplayer" type="text/html" width="640" height="360"
            src={ytUrli}
            frameBorder="0"></iframe>
          <div>
            <form onSubmit={handleYoutubeSubmit}>
              <div>add youtube url<input type='text' name='yturl' /></div>
            </form>
          </div>
        </Col>
      </Row>
    </Grid>
  )
}

const mapStateToProps = (state) => {
  return {
    bands: state.bands,
    user: state.user,
  }
}
export default connect(
  mapStateToProps, { updateBand }
)(BandFeed)