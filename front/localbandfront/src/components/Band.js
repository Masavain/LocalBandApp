import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import { updateBand } from './../reducers/bandReducer'
import bandService from './../services/bands'
import imageService from './../services/images'
import defaultBackground from './../nakemys_opa.jpg'

const Band = (props) => {
  const src = `https://bandcamp.com/EmbeddedPlayer/album=${props.band.bcAlbumID}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/track=${props.band.bcTrackID}/transparent=true/`

  const handleAboutSubmit = async (event) => {
    event.preventDefault()
    const newObject = { ...props.band, about: event.target.about.value }
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

  const handleBgSubmit = async (event) => {
    event.preventDefault()

    const file  = document.getElementById('bgImage').files[0]
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async function () {

      const result = reader.result.substr(reader.result.indexOf(',')+1, reader.result.length)
      const imgurFile = await imageService.postImgur( result )

      const image = { url: imgurFile.data.link, imageType: imgurFile.data.type, height: imgurFile.data.height,
        width: imgurFile.data.width, animated: imgurFile.data.animated,
        deleteHash: imgurFile.data.deletehash, size: imgurFile.data.size,
        type: 'background', bandId: props.band._id }

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
    border: 0,
    width: 350,
    height: 470
  }

  const emptydivStyle = {
    height: 250,
    backgroundColor: 'black',
    opacity: 0.5,
    padding: 20
  }

  const headerStyle = {
    marginTop: 0,
    backgroundImage: props.band.backgroundImage ? `url(${props.band.backgroundImage.url})`
      : `url(${defaultBackground})`,
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

  const ytId = props.band.youtubeID ? props.band.youtubeID : 'So6Qa_4QHYY'
  const ytUrli = `https://www.youtube.com/embed/${ytId}`
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
        <Col xs={4}>
          {props.band.avatar
            ? <div className="wrapper">
              <img src={props.band.avatar.url} width="300" height="300" alt="avatar"/>
              {props.user ?
                <div>
                  {props.band.user.name === props.user.name ?
                    <form className="button" onSubmit={handleAvatarSubmit}>
                      <input type="file" accept="image/*" id="imageFile" name="image"/>
                      <Button bsStyle="primary" bsSize='xsmall' type='submit'>edit avatar</Button>
                    </form>
                    : <div></div>}
                </div>
                : <div></div>}
            </div>
            : <div className="wrapper">
              <img src='/default_band_icon.png' width="300" height="300" alt="default avatar"/>
              {props.user ?
                <div>
                  {props.band.user.name === props.user.name ?
                    <form className="button" onSubmit={handleAvatarSubmit}>
                      <input type="file" accept="image/*" id="imageFile" name="image"/>
                      <Button bsStyle="primary" bsSize='xsmall' type='submit'>edit avatar</Button>
                    </form>
                    : <div></div>}
                </div>
                : <div></div>}
            </div>}
          <div>
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
          </div>
        </Col>
        <Col xsOffset={8}>
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
        <Col className={gridStyle} xs={4}>
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
)(Band)