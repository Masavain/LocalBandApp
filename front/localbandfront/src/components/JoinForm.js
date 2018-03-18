import React from 'react'
import { connect } from 'react-redux'
import { sign } from './../reducers/loginReducer'

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
    <div>
      <h2>Sign</h2>
      <form onSubmit={submitSign}>
        <div>
              Username
          <input name="username"/>
        </div>
        <div>
              Password
          <input type="password" name="password"/>
        </div>
        <button type="submit">login</button>
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