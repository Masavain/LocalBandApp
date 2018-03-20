import React from 'react'
import { connect } from 'react-redux'
import { addAbout } from './../reducers/bandReducer'
import bandService from './../services/bands'


const Band = (props) => {
  const handleAboutSubmit = async (event) => {
    event.preventDefault()
    const newObject = { ...props.band, about: event.target.about.value }
    const updatedBand = await bandService.update(newObject._id, newObject)
    props.addAbout(updatedBand)
    window.location.reload()
  }
  const BCstyle = {
    border: 0,
    width: 350,
    height: 470
  }




  if (props.band.about) {

    return(
      <div>
        <h3>{props.band.name}</h3>
        <div>{props.band.about}</div>
        <form onSubmit={handleAboutSubmit}>
          <div>edit about<input name='about' /></div>
        </form>

        <iframe title={props.band._id} style={BCstyle}
          src="https://bandcamp.com/EmbeddedPlayer/album=398010334/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/track=1347202632/transparent=true/"
          seamless>
          <a href="http://memobandfin.bandcamp.com/album/mustavalkofilmi">Mustavalkofilmi by MEMO</a>
        </iframe>

      </div>
    )
  } else {
    return(
      <div>
        <h3>{props.band.name}</h3>
        <form onSubmit={handleAboutSubmit}>
          <div>about<input name='about' /></div>
        </form>

      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    bands: state.bands,
    user: state.user,
  }
}
export default connect(
  mapStateToProps, { addAbout }
)(Band)