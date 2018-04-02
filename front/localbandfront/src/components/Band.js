import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import { addAbout, addBandcamp, addAvatar } from './../reducers/bandReducer'
import bandService from './../services/bands'
import imageService from './../services/images'


const Band = (props) => {
  const src = `https://bandcamp.com/EmbeddedPlayer/album=${props.band.bcAlbumID}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/track=${props.band.bcTrackID}/transparent=true/`

  const handleAboutSubmit = async (event) => {
    event.preventDefault()
    const newObject = { ...props.band, about: event.target.about.value }
    const updatedBand = await bandService.update(newObject._id, newObject)

    props.addAbout(updatedBand)
    window.location.reload()
  }
  const handleBandcampSubmit = async (event) => {
    event.preventDefault()
    const updatedBand = await bandService.postBC(props.band._id, { albumUrl: event.target.bcurl.value.toString() })
    props.addBandcamp(updatedBand)
    window.location.reload()
  }

  const handleAvatarUrlSubmit = async (event) => {
    event.preventDefault()
    const image = event.target.image.value
    const imgurUrl = await imageService.postImgur({ image })
    const updatedBand = await bandService.postAvatar(props.band._id, { avatarUrl: imgurUrl.data.link })
    props.addAvatar(updatedBand)
    console.log('avatarUrli: ',updatedBand.avatarUrl)
    window.location.reload()
  }

  const handleAvatarSubmit = async (event) => {
    event.preventDefault()
    const file  = document.getElementById('imageFile').files[0]
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async function () {
      const result = reader.result.substr(reader.result.indexOf(',')+1, reader.result.length)
      const imgurUrl = await imageService.postImgur( result )
      const updatedBand = await bandService.postAvatar(props.band._id, { avatarUrl: imgurUrl.data.link })
      props.addAvatar(updatedBand)
      window.location.reload()


    }
    reader.onerror = function (error) {
      console.log('Error: ', error)
    }
  }

  const BCstyle = {
    border: 0,
    width: 350,
    height: 470
  }

  console.log('bcAlbumID', props.band.bcAlbumID, 'bctrackID', props.band.bcAlbumID)
  return (
    <Grid>
      <Row>
        <h3>{props.band.name}</h3>
      </Row>
      <Row>
        <Col xs={6}>
          {props.band.avatarUrl
            ? <div>
              <img src={props.band.avatarUrl} width="300" height="300" alt="avatar"/>
            </div>
            : <div>
              <img src='/default_band_icon.png' width="300" height="300" alt="default avatar"/>
            </div>}
          {props.band.about
            ? <div>{props.band.about}
              <form onSubmit={handleAboutSubmit}>
                <div>edit about<input type='text' name='about' /></div>
              </form>
            </div>
            : <div>
              <form onSubmit={handleAboutSubmit}>
                <div>add about<input type='text' name='about' /></div>
              </form>
            </div>}
        </Col>
        <Col xsOffset={7}>
          {props.band.bcURL
            ? <div>
              <iframe title={props.band._id} style={BCstyle}
                src={src}
                seamless>
                <a href={props.band.bcURL}>asd</a>
              </iframe>
              <form onSubmit={handleBandcampSubmit}>
                <div>edit bandcamp url<input type='text' name='bcurl' /></div>
              </form>
            </div>
            : <div>
              <form onSubmit={handleBandcampSubmit}>
                <div>add bandcamp url<input type='text' name='bcurl' /></div>
              </form>
            </div>}
        </Col>
      </Row>
      <Row>
        <form onSubmit={handleAvatarUrlSubmit}>
          <div>
            avatar url:
            <input type="text" name="image"/>
          </div>
          <input type="submit" name="submit"/>
        </form>
        <form onSubmit={handleAvatarSubmit}>
          <div>
            avatar file:
            <input type="file" accept="image/*" id="imageFile" name="image"/>
          </div>
          <input type="submit" name="submit"/>
        </form>
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
  mapStateToProps, { addAbout, addBandcamp, addAvatar }
)(Band)