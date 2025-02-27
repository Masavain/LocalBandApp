import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { login } from './../reducers/loginReducer'
import { FormControl, FormGroup, ControlLabel, Button } from 'react-bootstrap'
import { notify } from './../reducers/notificationReducer'

const LoginForm = (props) => {

  const submitLogin = async ( event ) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    event.target.username.value = ''
    event.target.password.value = ''
    props.login(username, password)
    props.notify('Logged in', 5)
    props.history.push('/')
  }

  return (
    <div style={{ marginLeft: 10, marginRight: 10 }}>
      <h2>Login</h2>
      <form onSubmit={submitLogin}>
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
          <Button style={{ marginTop: 5 }} bsStyle="success" type="submit">login</Button>
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

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}
LoginForm.defaultProps = {
  username:'',
  password:''
}

export default connect(
  mapStateToProps, { login, notify }
)(LoginForm)