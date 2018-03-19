import React from 'react'
import { connect } from 'react-redux'
import { addAbout } from './../reducers/bandReducer'
import bandService from './../services/bands'

const Band = (props) => {

  const bandById = props.bands.find(band => band._id === props.id)

  console.log(props.id)
  console.log(props.bands)
  const handleAboutSubmit = async (event) => {
    event.preventDefault()
    const newObject = { ...bandById, about: event.target.about.value }
    const updatedBand = await bandService.update(newObject._id, newObject)
    props.addAbout(updatedBand)
    window.location.reload()
  }

  if (bandById.about) {
    return(
      <div>
        <h3>{bandById.name}</h3>
        <div>{bandById.about}</div>

      </div>
    )
  } else {
    return(
      <div>
        <h3>{bandById.name}</h3>
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