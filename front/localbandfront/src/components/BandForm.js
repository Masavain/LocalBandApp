import React from 'react'
import { connect } from 'react-redux'
import { creation } from './../reducers/bandReducer'
import { Form, FormControl, Button, FormGroup, ControlLabel, Col, Row } from 'react-bootstrap'
import bandService from './../services/bands'

const BandForm = (props) => {
  const handleSubmit = async (event) => {
    event.preventDefault()
    const newBand = { name:event.target.name.value,
      genre: event.target.genre.value,
      hometown: event.target.hometown.value,
      started: event.target.started.value
    }
    const savedBand = await bandService.createNew(newBand)
    props.creation(savedBand)
    props.history.push(`/bands/${savedBand._id}`)
  }

  return (
    <Row style={{ width: '95%', left: '20px', margin:'20px', borderTop: 'solid 1px lightgrey', borderBottom: 'solid 1px lightgrey' }}>
      <h3>Add new band</h3>
      <Form horizontal onSubmit={handleSubmit} className='form-inline' style={{ marginBottom: 10 }}>
        <FormGroup className='form-group' bsSize='sm'>
          <Col className='input-label' componentClass={ControlLabel} xs={3}>Name: </Col>
          <Col className='input-label' xs={9}><FormControl
            type="text"
            name="name"
          /></Col>

          <Col className='input-label' componentClass={ControlLabel} xs={3}>Genre: </Col>
          <Col className='input-label' xs={9}><FormControl
            type="text"
            name="genre"
          /></Col>
          <Col className='input-label' componentClass={ControlLabel} xs={3}>Hometown: </Col>
          <Col className='input-label' xs={9}><FormControl
            type="text"
            name="hometown"
          /></Col>
          <Col className='input-label' componentClass={ControlLabel} xs={3}>Starting Year: </Col>
          <Col className='input-label' xs={9}><FormControl
            type="number"
            name="started"
          /></Col>
          <Col className='input-label' smOffset={5}><Button bsStyle="success" type="submit">Add</Button></Col>
        </FormGroup>
      </Form>
    </Row>
  )


}

export default connect(
  null,
  { creation }
)(BandForm)