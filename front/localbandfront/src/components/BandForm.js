import React from 'react'
import { connect } from 'react-redux'
import { creation } from './../reducers/bandReducer'
import { FormControl, Button, FormGroup, ControlLabel } from 'react-bootstrap'


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
        <FormGroup>
          <ControlLabel>Name: </ControlLabel>
          <FormControl
            type="text"
            name="name"
          />
          <ControlLabel>Genre: </ControlLabel>
          <FormControl
            type="text"
            name="genre"
          />
          <ControlLabel>Hometown: </ControlLabel>
          <FormControl
            type="text"
            name="hometown"
          />
          <ControlLabel>Starting year:</ControlLabel>
          <FormControl
            type="number"
            name="started"
          />
          <Button bsStyle="success" type="submit">Add</Button>
        </FormGroup>
      </form>
    </div>
  )


}

export default connect(
  null,
  { creation }
)(BandForm)