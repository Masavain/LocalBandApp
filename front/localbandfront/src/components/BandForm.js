import React from 'react'
import { connect } from 'react-redux'
import { creation } from './../reducers/bandReducer'


const BandForm = (props) => {
  const handleSubmit = async (event) => {
    event.preventDefault()
    const newBand = { name:event.target.name.value,
      genre: event.target.genre.value,
      hometown: event.target.hometown.value,
      started: event.target.started.value
    }
    props.creation(newBand)
    props.history.push('/')
  }

  return (
    <div>
      <h2>add new band</h2>
      <form onSubmit={handleSubmit}>
        <div>Name<input name='name' /></div>
        <div>Genre<input name='genre' /></div>
        <div>Hometown<input name='hometown' /></div>
        <div>Starting year<input name='started' /></div>
        <button type="submit">add</button>
      </form>
    </div>
  )

}

export default connect(
  null,
  { creation }
)(BandForm)