import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import { updateBand } from './../reducers/bandReducer'
import bandService from './../services/bands'
import imageService from './../services/images'
import defaultBackground from './../nakemys_opa.jpg'

const BandHeader = (props) => {

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
  const bandMatchesLoggedUser = (props.user ? (props.band.user.name === props.user.name) ? true : false : false)
  return(
    <Grid>
      <Row className='wrapper' style={headerStyle}>
        <div style={emptydivStyle}>
          <Col>
            <h3 style={hThreeStyle}>{props.band.name.toUpperCase()}</h3>
          </Col>
          <Col className='pull-right'>
            {bandMatchesLoggedUser ?
              <form className="button" onSubmit={handleBgSubmit}>
                <input className="inputbutton" type="file" accept="image/*" id="bgImage" name="bgimage"></input>
                <label htmlFor="bgImage">Choose image</label>	&nbsp;
                <Button bsStyle="primary" bsSize='xsmall' type='submit'>edit background</Button>
              </form>
              :
              <div>
              </div>
            }

          </Col>
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
  mapStateToProps, { updateBand }
)(BandHeader)