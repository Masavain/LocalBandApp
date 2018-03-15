import React from 'react'
import { initialization } from './reducers/bandReducer'
import { connect } from 'react-redux'
import BandList from './components/BandList'
import LoginForm from './components/LoginForm'
import { logout } from './reducers/loginReducer'

class App extends React.Component {
  componentWillMount = async () => {
    this.props.initialization()
  }

  logOut = async () => {
    this.props.logout()
  }

  render() {


    return (
      <div>
        <h1>LocalBands app</h1>
        <LoginForm />
        <button onClick={this.logOut}> log out</button>
        <BandList />
      </div>
    )
  }
}

export default connect(
  null,
  { initialization, logout }
)(App)
