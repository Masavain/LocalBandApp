import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { login } from './../reducers/loginReducer'
import { FormControl, FormGroup, ControlLabel, Button } from 'react-bootstrap'

const LoginForm = (props) => {

  const submitLogin = async ( event ) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    event.target.username.value = ''
    event.target.password.value = ''
    props.login(username, password)
    props.history.push('/')
  }

  return (
    <div>
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
          <Button bsStyle="success" type="submit">login</Button>
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
  mapStateToProps, { login }
)(LoginForm)