import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import { updateBand } from './../reducers/bandReducer'
import bandService from './../services/bands'
import imageService from './../services/images'

const BandFeed = (props) => {

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
  const handleFBSubmit = async (event) => {
    event.preventDefault()
    const newObject = { ...props.band, facebookURL: event.target.facebookURL.value }
    const updatedBand = await bandService.update(newObject._id, newObject)
    props.updateBand(updatedBand)
    window.location.reload()
  }
  const handleIGSubmit = async (event) => {
    event.preventDefault()
    const newObject = { ...props.band, instagramUsername: event.target.instagramUsername.value }
    const updatedBand = await bandService.update(newObject._id, newObject)
    props.updateBand(updatedBand)
    window.location.reload()
  }
  const handleHometownSubmit = async (event) => {
    event.preventDefault()
    const newObject = { ...props.band, hometown: event.target.hometown.value }
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
  const src = `https://bandcamp.com/EmbeddedPlayer/album=${props.band.bcAlbumID}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/track=${props.band.bcTrackID}/transparent=true/`
  const ytId = props.band.youtubeID ? props.band.youtubeID : 'So6Qa_4QHYY'
  const ytUrli = `https://www.youtube.com/embed/${ytId}?autoplay=0`
  const bandMatchesLoggedUser = (props.user ? (props.band.user.name === props.user.name) ? true : false : false)

  return(
    <Grid >
      <Row>
        <Col sm={4} xs={3} className="wrapper" style={{ paddingTop: 0, paddingRight:350, paddingBottom:50,
          marginLeft: 15, paddingLeft: 45, overflof: 'auto', position:'center',
          marginRight: 50 }}>
          {props.band.avatar
            ? <div className="wrapper" style={{ position: 'relative' }}>
              <img src={props.band.avatar.url} width="300" height="300" alt="avatar"/>
            </div>
            : <div className="wrapper" style={{ position: 'relative' }}>
              <img src='/default_band_icon.png' width="300" height="300" alt="default avatar"/>
            </div>}
          {bandMatchesLoggedUser ?
            <div style={{ position: 'absolute', width:'100%', padding: 50, paddingBottom: 0, top: '210px'  }}>
              <form style={{ width: 200 }} className="button" onSubmit={handleAvatarSubmit}>
                <input className="inputbutton" type="file" accept="image/*" id="imageFile" name="image"/>
                <label htmlFor="imageFile">Choose image</label>&nbsp;
                <Button bsStyle="primary" bsSize='xsmall' type='submit'>edit avatar</Button>
              </form>
            </div>
            : <div></div>}
          <div style={{ paddingTop: 15, paddingLeft: 100 }} className="wrapper">
            {props.band.instagramUsername ? <a href={`https://www.instagram.com/${props.band.instagramUsername}`}>@{props.band.instagramUsername}</a> : <div>Add your Instagram username</div>}
            {bandMatchesLoggedUser ?
              <form className="button" onSubmit={handleIGSubmit}>
                <div>edit Instagram username</div><input type='text' name='instagramUsername'/>
              </form> : <div></div>}
          </div>
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
            <div>Hometown: {props.band.hometown ? props.band.hometown : ''}</div>
            {bandMatchesLoggedUser ?
              <form className="button" onSubmit={handleHometownSubmit}>
                <div>edit genre</div><input type='text' name='hometown'/>
              </form> : <div></div>}
          </div>
          <div className="wrapper">
            <div>About: {props.band.about ? props.band.about : ''}</div>
            {bandMatchesLoggedUser ?
              <form className="button" onSubmit={handleAboutSubmit}>
                <div>edit about</div>
                <textarea style={{ padding: 10 }} id='about'></textarea>
                <button className="page-button" style={{ position: 'absolute', bottom:-5, left:15 }} type="submit">edit</button>
              </form> : <div></div>}
          </div>
          <div className="wrapper">
            <div>{props.band.facebookURL ? <a href={props.band.facebookURL}>Facebook</a> : <div>Add a link to your bands Facebook</div>}</div>
            {bandMatchesLoggedUser ?
              <form className="button" onSubmit={handleFBSubmit}>
                <div>edit Facebook url</div><input type='text' name='facebookURL'/>
              </form> : <div></div>}
          </div>
        </Col>
      </Row>

      <Row style={{ position:'relative', borderTop: '1px solid lightgray', margin:15, width: '98.5%', marginBottom: 20, padding: 5 }}>
        <Col sm={4} xs={3}>
          {props.band.bcURL
            ? <div className="wrapper">
              <iframe title={props.band._id} style={BCstyle}
                src={src}
                seamless>
                <a href={props.band.bcURL}>asd</a>
              </iframe>
              {bandMatchesLoggedUser ?
                <form className="button" onSubmit={handleBandcampSubmit}>
                  <div>edit bandcamp url<input type='text' name='bcurl' /></div>
                </form>
                : <div></div>}
            </div>
            : <div>
              {bandMatchesLoggedUser ?
                <form onSubmit={handleBandcampSubmit}>
                  <div>Paste a Bandcamp album url you want others to see and hear
                  <input type='text' name='bcurl' /></div>
                </form>
                : <div></div>}
            </div>}
        </Col>
        <Col xs={3}>
          {props.band.youtubeID
            ? <div className="wrapper">
              <iframe title="youtube" id="ytplayer" type="text/html" width="640" height="360"
                src={ytUrli}
                frameBorder="0"></iframe>
              {bandMatchesLoggedUser ? <form className="button" onSubmit={handleYoutubeSubmit}>
                <div>edit YouTube url<input type='text' name='yturl' /></div>
              </form>: <div></div> }
            </div>

            : <div>
              {bandMatchesLoggedUser ? <form onSubmit={handleYoutubeSubmit}>
                <div>Paste a YouTube url you want others to see and hear<input type='text' name='yturl' /></div>
              </form>: <div></div> } </div>}

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