import React from 'react'
import { initialization } from './reducers/bandReducer'
import { connect } from 'react-redux'
import BandList from './components/BandList'
import LoginForm from './components/LoginForm'
import { initUser } from './reducers/loginReducer'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import ProfilePage from './components/ProfilePage'
import About from './components/About'

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
        <Router>
          <div>
            <div>
              <Link to="/">home</Link> &nbsp;
              <Link to="/profile">profile</Link> &nbsp;
              <Link to="/about">about</Link>
            </div>
            <Route exact path="/" render={() => <BandList />} />
            <Route path="/profile" render={() => <ProfilePage />} />
            <Route path="/about" render={() => <About />} />
          </div>
        </Router>
      </div>
    )
  }
}

export default connect(
  null,
  { initialization, initUser }
)(App)
