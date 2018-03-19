import React from 'react'
import { initialization } from './reducers/bandReducer'
import { connect } from 'react-redux'
import BandList from './components/BandList'
import LoginForm from './components/LoginForm'
import { initUser, logout } from './reducers/loginReducer'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import ProfilePage from './components/ProfilePage'
import About from './components/About'
import JoinForm from './components/JoinForm'
import Band from './components/Band'

class App extends React.Component {
  componentWillMount = async () => {
    this.props.initialization()
    this.props.initUser()
  }

  logOut = async () => {
    this.props.logout()
  }

  render() {
    if(this.props.bands.length === 0) {
      return null
    }
    console.log('user:',this.props.user)
    const blogById = (id) => this.props.bands.find(b => b._id === id)


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
                  <em>{this.props.user.username} logged in</em>
                  <button onClick={this.logOut}> log out</button>
                </div>
                : <div>
                  <Link to="/login">Login</Link>  &nbsp;
                  <Link to="/join">Join</Link>
                </div>
              }
            </div>
            <Route exact path="/bands/:id" render={({ match }) => {
              console.log('router match', match)
              console.log('blog by id', blogById(match.params.id))
              return <Band band={blogById(match.params.id)} />}}
            />
            <Route exact path="/login" render={({ history }) => <LoginForm history={history}/>} />
            <Route exact path="/join" render={({ history }) => <JoinForm history={history}/>} />
            <Route exact path="/" render={() => <BandList />} />
            <Route path="/profile" render={({ history }) => <ProfilePage history={history} />} />
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
