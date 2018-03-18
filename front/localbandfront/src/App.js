import React from 'react'
import { initialization } from './reducers/bandReducer'
import { connect } from 'react-redux'
import BandList from './components/BandList'
import LoginForm from './components/LoginForm'
import { initUser, logout } from './reducers/loginReducer'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import ProfilePage from './components/ProfilePage'
import About from './components/About'

class App extends React.Component {
  componentWillMount = async () => {
    this.props.initialization()
    this.props.initUser()
  }

  logOut = async () => {
    this.props.logout()
  }

  render() {
    return (
      <div>
        <h1>LocalBands app</h1>

        <Router>
          <div>
            <div>
              <Link to="/">home</Link> &nbsp;

              <Link to="/about">about</Link> &nbsp;
              {this.props.user
                ? <div>
                  <Link to="/profile">profile</Link> &nbsp;
                  <em>{this.props.user} logged in</em>
                  <button onClick={this.logOut}> log out</button>
                </div>
                : <Link to="/login">login</Link>
              }
            </div>
            <Route exact path="/login" render={({ history }) => <LoginForm history={history}/>} />
            <Route exact path="/" render={() => <BandList />} />
            <Route path="/profile" render={() => <ProfilePage />} />
            <Route path="/about" render={() => <About />} />
          </div>
        </Router>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    bands: state.bands,
    user: state.user,
  }
}

export default connect(
  mapStateToProps,
  { initialization, initUser, logout }
)(App)
