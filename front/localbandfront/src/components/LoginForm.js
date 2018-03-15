import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { login, logout } from './../reducers/loginReducer'

class LoginForm extends React.Component {

  logOut = async () => {
    this.props.logout()
  }

  submitLogin = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    event.target.username.value = ''
    event.target.password.value = ''
    console.log(username, password)
    this.props.login(username, password)
  }

  render() {
    if (this.props.user === null) {
      return (
        <div>
          <h2>Login</h2>

          <form onSubmit={this.submitLogin}>
            <div>
                Username
              <input
                name="username"
              />
            </div>
            <div>
                Password
              <input
                type="password"
                name="password"
              />
            </div>
            <button type="submit">login</button>
          </form>

        </div>
      )
    } else {
      return (
        <div>
          {this.props.user}
          <button onClick={this.logOut}> log out</button>
        </div>
      )}
  }
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

export default connect(
  mapStateToProps, { login, logout }
)(LoginForm)