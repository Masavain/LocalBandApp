import React from 'react'
import { connect } from 'react-redux'
import { sign } from './../reducers/loginReducer'
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'

const JoinForm = (props) => {

  const submitSign = async ( event ) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    event.target.username.value = ''
    event.target.password.value = ''
    props.sign(username, password)
    props.history.push('/')
  }

  return (
    <div style={{ marginLeft: 10, marginRight: 10 }}>
      <h2>Sign</h2>
      <form onSubmit={submitSign}>
        <FormGroup>
          <ControlLabel>username:</ControlLabel>
          <FormControl
            type="text"
            name="username"
          />
          <ControlLabel>password:</ControlLabel>
          <FormControl
            type="password"
            name="password"
          />
          <Button bsStyle="success" type="submit">sign</Button>
        </FormGroup>
      </form>
    </div>
  )

}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(
  mapStateToProps, { sign }
)(JoinForm)