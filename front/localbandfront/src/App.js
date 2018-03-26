import React from 'react'
import { initialization } from './reducers/bandReducer'
import { connect } from 'react-redux'
import Home from './components/Home'
import LoginForm from './components/LoginForm'
import Explore from './components/Explore'
import { initUser, logout } from './reducers/loginReducer'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
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
      <div className="container">
        <Router>
          <div>
            <Navbar inverse collapseOnSelect>
              <Navbar.Header>
                <Navbar.Brand>
              LocalBands app
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                <Nav>
                  <NavItem href="#">
                    <div>
                      <Link to="/">Home</Link>
                    </div>
                  </NavItem>
                  <NavItem href="#">
                    <div>
                      <Link to="/search">Explore</Link>
                    </div>
                  </NavItem>
                  <NavItem href="#">
                    <div>
                      <Link to="/about">About</Link>
                    </div>
                  </NavItem>
                  <NavItem>
                    {this.props.user
                      ? <div>
                        <Link to="/profile">Profile</Link>
                      </div>
                      : <div>
                        <Link to="/login">Login</Link>  &nbsp;
                      </div>
                    }
                  </NavItem>
                  <NavItem>
                    {this.props.user
                      ? <div>
                        <em>{this.props.user.username} logged in</em>
                        <button onClick={this.logOut}> log out</button>
                      </div>
                      :<div>
                        <Link to="/join">Join</Link>
                      </div>
                    }
                  </NavItem>

                </Nav>
              </Navbar.Collapse>
            </Navbar>

            <Route exact path="/bands/:id" render={({ match }) => {
              return <Band band={blogById(match.params.id)} />}}
            />
            <Route exact path="/login" render={({ history }) => <LoginForm history={history}/>} />
            <Route exact path="/search" render={() => <Explore/>} />
            <Route exact path="/join" render={({ history }) => <JoinForm history={history}/>} />
            <Route exact path="/" render={() => <Home />} />
            <Route path="/profile" render={({ history }) => this.props.user ? <ProfilePage history={history} />: <Redirect to="/login" />} />
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
