import React from 'react'
import { initialization } from './reducers/bandReducer'
import { connect } from 'react-redux'
import BandList from './components/BandList'
import LoginForm from './components/LoginForm'
import { initUser } from './reducers/loginReducer'

class App extends React.Component {
  componentWillMount = async () => {
    this.props.initialization()
    this.props.initUser()
  }

  render() {

    return (
      <div>
        <h1>LocalBands app</h1>
        <LoginForm />
        <BandList />
      </div>
    )
  }
}

export default connect(
  null,
  { initialization, initUser }
)(App)
