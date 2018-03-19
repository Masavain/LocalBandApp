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

  if (props.band.about) {
    return(
      <div>
        <h3>{props.band.name}</h3>
        <div>{props.band.about}</div>
        <form onSubmit={handleAboutSubmit}>
          <div>edit about<input name='about' /></div>
        </form>
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