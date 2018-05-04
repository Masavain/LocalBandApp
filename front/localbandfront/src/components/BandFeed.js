import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Button, FormGroup, ControlLabel, FormControl  } from 'react-bootstrap'
import { updateBand } from './../reducers/bandReducer'
import { setDate, clearDate } from './../reducers/dateReducer'
import bandService from './../services/bands'
import imageService from './../services/images'
import concertService from './../services/concerts'
import InstagramEmbed from 'react-instagram-embed'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'

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
  const handleIGPostSubmit = async (event) => {
    event.preventDefault()
    const newObject = { ...props.band, instagramPostURL: event.target.instagramPostURL.value }
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
  const handleEventSubmit = async (event) => {
    event.preventDefault()
    const name = event.target.name.value
    const place = event.target.place.value
    const date = props.date
    const newObject = { name, place, date,
      about: document.getElementById('concertAbout').value, bandId: props.band._id }
    await concertService.createNew(newObject)
    const updatedBand = await bandService.getById(props.band._id)
    props.updateBand(updatedBand)
    props.clearDate()
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
        <Col lg={4} md={4} sm={5} xs={12} className="wrapper"
          style={{ paddingTop: 0, paddingRight:0, paddingLeft: 35, position:'center' }}>
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
            {props.band.instagramUsername ? <a href={`https://www.instagram.com/${props.band.instagramUsername}`}>@{props.band.instagramUsername}</a> : (props.band.instagramPostURL ? <div>Add your Instagram username</div> : <div></div>)}&nbsp;
            {bandMatchesLoggedUser ?
              <form className="button" style={{ paddingBottom: 0 }} onSubmit={handleIGSubmit}>
                <div style={{ paddingBottom: 0 }}>edit Instagram username</div>
                <input style={{ paddingBottom: 0 }} type='text' name='instagramUsername'/>
              </form> : <div></div>}
          </div>
        </Col>
        <Col lg={3} md={3} sm={3} xs={8} style={{ paddingLeft: 35 }}>
          <div className="wrapper">
            <div style={{ color: 'gray' }}>Genre:</div>
            <div>{props.band.genre ? (props.band.genre.map(g => `${g}, `)) : ''}</div>
            {bandMatchesLoggedUser ?
              <form className="button" onSubmit={handleGenreSubmit}>
                <div>edit genre, separate by comma</div><input type='text' name='genre'/>
              </form> : <div></div>}
          </div>
          <div className="wrapper">
            <div style={{ color: 'gray' }}>Started:</div>
            <div>{props.band.started ? props.band.started : ''}</div>
            {bandMatchesLoggedUser ?
              <form className="button" onSubmit={handleStartedSubmit}>
                <div>edit starting year</div><input type='number' name='started'/>
              </form> : <div></div>}
          </div>
          <div className="wrapper">
            <div style={{ color: 'gray' }}>Location:</div>
            <div>{props.band.hometown ? props.band.hometown : ''}</div>
            {bandMatchesLoggedUser ?
              <form className="button" onSubmit={handleHometownSubmit}>
                <div>edit genre</div><input type='text' name='hometown'/>
              </form> : <div></div>}
          </div>
          <div className="wrapper">
            <div style={{ color: 'gray' }}>About:</div>
            <div>{props.band.about ? props.band.about : ''}</div>
            {bandMatchesLoggedUser ?
              <form style={{ width: '100px' }} className="button" onSubmit={handleAboutSubmit}>
                <div >edit about</div>
                <textarea style={{ padding: 0 }} id='about'></textarea>
                <button className="page-button" style={{ position: 'relative' }} type="submit">edit</button>
              </form> : <div></div>}
          </div>
          <div className="wrapper">
            <div>{props.band.facebookURL ? <a href={props.band.facebookURL}>Facebook</a> : (props.band.facebookURL ? <div>Add a link to your bands Facebook</div> : <div></div>)}</div>
            {bandMatchesLoggedUser ?
              <form className="button" onSubmit={handleFBSubmit}>
                <div>edit Facebook url</div><input type='text' name='facebookURL'/>
              </form> : <div></div>}
          </div>
        </Col>
        <Col lg={4} md={4} sm={12} xs={12} style={{ paddingLeft: 35 }}>
          <div className="wrapper">
            <div>{props.band.instagramPostURL ?
              <InstagramEmbed
                url={props.band.instagramPostURL}
                maxWidth={320}
                hideCaption={true}
                containerTagName='div'
                protocol=''
                onLoading={() => {}}
                onSuccess={() => {}}
                onAfterRender={() => {}}
                onFailure={() => {}}
              /> : (props.band.instagramPostURL ? <div>Add a link to an Instagram photo you would like others to see</div> : <div></div>)}</div>
            {bandMatchesLoggedUser ?
              <form className="button" onSubmit={handleIGPostSubmit}>
                <div>edit Instagram post url</div><input type='text' name='instagramPostURL'/>
              </form> : <div></div>}
          </div>
        </Col>
      </Row>

      <Row style={{ position:'relative', borderTop: '1px solid lightgray', margin:15, width: '98.5%', marginBottom: 20, padding: 5 }}>
        <h2>LISTEN  /  WATCH</h2>
        <Col xs={12} sm={8} md={5} lg={4} style={{ paddingTop: 20, paddingLeft:0 }}>
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
                  <div>Add a Bandcamp album url you want others to see and hear
                  <input type='text' name='bcurl' /></div>
                </form>
                : <div></div>}
            </div>}
        </Col>
        <Col xs={12} sm={8} md={8} lg={5} style={{ paddingTop: 20, paddingLeft:0 }}>
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
                <div>Add a YouTube url you want others to see and hear<input type='text' name='yturl' /></div>
              </form>: <div></div> } </div>}
        </Col>
      </Row>
      <Row style={{ position:'relative', borderTop: '1px solid lightgray', margin:15, width: '98.5%', marginBottom: 20, padding: 5 }}>
        <h2>UPCOMING EVENTS/CONCERTS</h2>
        {props.band.concerts.map(c => <div key={c._id}>{c.name}</div>)}
        {bandMatchesLoggedUser ?
          <div className="wrapper"><div className="inputbutton" id="eventButton"></div>
            <label htmlFor="eventButton" style={{ position:'absolute', marginBottom: 30, padding:5  }}>+ ADD NEW EVENT</label>
            <form className="button" onSubmit={handleEventSubmit} style={{ marginTop: 30 }}>
              <FormGroup>
                <ControlLabel>Event name:</ControlLabel>
                <FormControl
                  type="text"
                  name="name"
                  style={{ width:'110%' }}
                />
                <ControlLabel>Date: </ControlLabel>
                <DayPickerInput id="date" name="date"
                  onDayChange={(day) => props.setDate(day)}
                  dayPickerProps={{
                    todayButton: 'Today',
                  }}
                />
                <ControlLabel>Venue/City:</ControlLabel>
                <FormControl
                  type="text"
                  name="place"
                  style={{ width:'110%' }}
                />
                <ControlLabel>About:</ControlLabel>
                <textarea style={{ padding: 0, width:'110%', border: '1px solid lightgray', borderRadius: '3px' }} id='concertAbout'></textarea>
                <Button bsStyle="success" type="submit">submit</Button>
              </FormGroup>
            </form>
          </div>
          : <div></div>}
      </Row>
    </Grid>
  )
}

const mapStateToProps = (state) => {
  return {
    bands: state.bands,
    user: state.user,
    date: state.date
  }
}
export default connect(
  mapStateToProps, { updateBand, setDate, clearDate }
)(BandFeed)