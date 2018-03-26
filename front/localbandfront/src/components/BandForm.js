import React from 'react'
import { connect } from 'react-redux'
import { creation } from './../reducers/bandReducer'
import { Form, Button } from 'react-bootstrap'


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
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Name</label>
          <input name='name' />
        </Form.Field>
        <Form.Field>
          <label>Genre</label>
          <input name='genre' />
        </Form.Field>
        <Form.Field>
          <label>Hometown</label>
          <input name='hometown' />
        </Form.Field>
        <Form.Field>
          <label>Starting year</label>
          <input name='started' />
        </Form.Field>
        <Button type='submit'>add</Button>
      </Form>
    </div>
  )

}

export default connect(
  null,
  { creation }
)(BandForm)