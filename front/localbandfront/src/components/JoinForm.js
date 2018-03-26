import React from 'react'
import { connect } from 'react-redux'
import { sign } from './../reducers/loginReducer'
import { Form, Button } from 'react-bootstrap'

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
      <Form onSubmit={submitSign}>
        <Form.Field>
          <label>Username</label>
          <input name='username' />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input type='password' name='password' />
        </Form.Field>
        <Button type="submit">login</Button>
      </Form>
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