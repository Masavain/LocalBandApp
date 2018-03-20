import React from 'react'
import { connect } from 'react-redux'
import { addAbout, addBandcamp } from './../reducers/bandReducer'
import bandService from './../services/bands'


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

  const BCstyle = {
    border: 0,
    width: 350,
    height: 470
  }

  console.log('bcAlbumID', props.band.bcAlbumID, 'bctrackID', props.band.bcAlbumID)
  return (
    <div>
      <h3>{props.band.name}</h3>
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

      {props.band.bcURL
        ? <div>
          <form onSubmit={handleBandcampSubmit}>
            <div>edit bandcamp url<input type='text' name='bcurl' /></div>
          </form>
          <iframe title={props.band._id} style={BCstyle}
            src={src}
            seamless>
            <a href={props.band.bcURL}>Mustavalkofilmi by MEMO</a>
          </iframe>
        </div>
        : <div>
          <form onSubmit={handleBandcampSubmit}>
            <div>add bandcamp url<input type='text' name='bcurl' /></div>
          </form>
        </div>}
    </div>
  )
}


const mapStateToProps = (state) => {
  return {
    bands: state.bands,
    user: state.user,
  }
}
export default connect(
  mapStateToProps, { addAbout, addBandcamp }
)(Band)