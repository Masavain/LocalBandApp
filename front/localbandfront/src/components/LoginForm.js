import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { login } from './../reducers/loginReducer'

class LoginForm extends React.Component {

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
          <div>
            logout
          </div>
        </div>

      )
    }

}


LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default connect(
  null, { login }
)(LoginForm)