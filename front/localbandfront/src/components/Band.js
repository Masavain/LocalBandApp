import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import { addAbout, addBandcamp, addAvatar } from './../reducers/bandReducer'
import bandService from './../services/bands'
import imageService from './../services/images'
import defaultBackground from './../nakemys_opa.jpg'

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

  const handleBgSubmit = async (event) => {
    event.preventDefault()
    const file  = document.getElementById('bgImage').files[0]
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async function () {
      const result = reader.result.substr(reader.result.indexOf(',')+1, reader.result.length)
      const imgurUrl = await imageService.postImgur( result )
      const updatedBand = await bandService.postBackground(props.band._id, { backgroundUrl: imgurUrl.data.link })
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

  const emptydivStyle = {
  }
  const headerStyle = {
    marginTop: 0,
    backgroundImage: props.band.backgroundUrl ? `url(${props.band.backgroundUrl})` : `url(${defaultBackground})`,
    height: 250,
    backgroundSize:'cover',
    backgroundRepeat:   'no-repeat',
    backgroundPosition: 'center center'
  }
  const hThreeStyle = {
    marginLeft: 10,
    color: 'white',
  }

  const gridStyle = {
    padding: 10
  }

  return (
    <Grid>
      <Row className='wrapper' style={headerStyle}>
        <div style={emptydivStyle}>
          <Col>
            <h3 style={hThreeStyle}>{props.band.name}</h3>
          </Col>
          <Col className='pull-right'>
            {props.user ?
              <div>
                {props.band.user.name === props.user.name ?
                  <form className="button" onSubmit={handleBgSubmit}>
                    <input type="file" accept="image/*" id="bgImage" name="bgimage"></input>
                    <Button bsStyle="primary" bsSize='xsmall' type='submit'>edit background</Button>
                  </form>
                  :
                  <div>
                  </div>
                }
              </div>
              : <div>
              </div>
            }
          </Col>
        </div>
      </Row>
      <Row style={gridStyle}>
        <Col xs={6} className="wrapper">
          {props.band.avatarUrl
            ? <div>
              <img src={props.band.avatarUrl} width="300" height="300" alt="avatar"/>
              <form className="button" onSubmit={handleAvatarSubmit}>
                <input type="file" accept="image/*" id="imageFile" name="image"/>
                <Button bsStyle="primary" bsSize='xsmall' type='submit'>edit avatar</Button>
              </form>
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
      <Row style={gridStyle}>
        <form onSubmit={handleAvatarUrlSubmit}>
          <div>
            avatar url:
            <input type="text" name="image"/>
          </div>
          <input type="submit" name="submit"/>
        </form>
        <div >

        </div>
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