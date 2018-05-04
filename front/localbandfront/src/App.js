import React from 'react'
import { initialization } from './reducers/bandReducer'
import { initializePosts } from './reducers/postReducer'
import { connect } from 'react-redux'
import Home from './components/Home'
import LoginForm from './components/LoginForm'
import Explore from './components/Explore'
import { initUser, logout } from './reducers/loginReducer'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import { Navbar, Nav, NavItem, Grid, Button, Alert } from 'react-bootstrap'
import ProfilePage from './components/ProfilePage'
import About from './components/About'
import JoinForm from './components/JoinForm'
import Band from './components/Band'
import Post from './components/Post'
import { notify } from './reducers/notificationReducer'
import './App.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import Footer from './components/Footer'

class App extends React.Component {
  componentWillMount = async () => {
    this.props.initializePosts()
    this.props.initialization()
    this.props.initUser()
  }

  logOut = async () => {
    this.props.logout()
    this.props.notify('Logged out', 4)
  }

  render() {
    if (this.props.bands.length === 0) {
      return null
    }
    const blogById = (id) => this.props.bands.find(b => b._id === id)
    const postById = (id) => this.props.posts.find(p => p._id === id)

    window.onscroll = function () {
      var mynav = document.getElementsByClassName('nav')
      mynav[2].classList.add('scroll')
      var mynavbuttons = document.getElementsByClassName('nav-button')
      if (document.body.scrollTop >= 70 || document.documentElement.scrollTop >= 70) {
        mynav[0].classList.add('scroll')
        let i
        for (i = 0; i < mynavbuttons.length; i++) {
          mynavbuttons[i].classList.add('scroll-button')
        }

      } else {
        mynav[0].classList.remove('scroll')
        let i
        for (i = 0; i < mynavbuttons.length; i++) {
          mynavbuttons[i].classList.remove('scroll-button')
        }

      }
    }
    return (
      <div className="app">
        <Grid style={{ padding: 0, backgroundColor: '#c1c1c1', height: 'inherit' }}>
          <Router>
            <div style={{ padding: 0, backgroundColor: '#c1c1c1', height: 'inherit' }}>
              <Navbar style={{ width: '100%' }} className="nav" fixedTop collapseOnSelect>
                <Navbar.Header>
                  <Navbar.Brand>
                    <Link to="/"><div style={{ padding: 2 }}>Localbands App</div></Link>
                  </Navbar.Brand>
                  <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                  <Nav pullLeft className="nav-empty">
                    <NavItem href="#">
                      <div>
                        <Link className="link" to="/">HOME</Link>
                      </div>
                    </NavItem>
                    <NavItem href="#">
                      <div>
                        <Link className="link" to="/search">EXPLORE</Link>
                      </div>
                    </NavItem>
                    <NavItem href="#">
                      <div>
                        <Link className="link" to="/about">ABOUT</Link>
                      </div>
                    </NavItem>
                  </Nav>
                  <Nav pullRight>
                    <NavItem>
                      {this.props.user
                        ?
                        <div>
                          <em>{this.props.user.username} logged in </em>
                        </div>
                        : <div>
                        </div>
                      }
                    </NavItem>
                    <NavItem>
                      {this.props.user
                        ? <div>
                          <Link className="link" to="/profile">Profile</Link>
                        </div>
                        : <div>
                          <Link to="/login"><Button className="nav-button" bsSize="sm" bsStyle="success">Login</Button></Link>  &nbsp;
                        </div>
                      }
                    </NavItem>
                    <NavItem>
                      {this.props.user
                        ?
                        <div>
                          <Button className="nav-button" bsSize="sm" bsStyle="danger" onClick={this.logOut}> log out</Button>
                        </div>
                        : <div>
                          <Link to="/join"><Button className="nav-button" bsSize="sm" bsStyle="primary">Sign</Button></Link>
                        </div>
                      }
                    </NavItem>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
              <Alert className={`${this.props.notif.visible ? 'fav-alert' : 'fav-alert-hidden'}`} style={{ fontSize: 20, position: 'absolute', left: 500, padding: 4, marginTop: 10, width: '25%' }} bsStyle="info">
                {this.props.notif.message}
              </Alert>
              <Grid style={
                { backgroundColor: 'white',
                  marginTop: 58,
                  height: 'auto',
                  width: 'inherit',
                  paddingLeft: 0,
                  paddingRight: 0, }}>
                <Route exact path="/bands/:id" render={({ match }) => {
                  return <Band band={blogById(match.params.id)} />
                }}
                />
                <Route exact path="/post/:id" render={({ match }) => {
                  return <Post post={postById(match.params.id)} />
                }}
                />
                <Route exact path="/login" render={({ history }) => <LoginForm history={history} />} />
                <Route exact path="/search" render={() => <Explore />} />
                <Route exact path="/join" render={({ history }) => <JoinForm history={history} />} />
                <Route exact path="/" render={() => <Home />} />
                <Route path="/profile" render={({ history }) => this.props.user ? <ProfilePage history={history} /> : <Redirect to="/login" />} />
                <Route path="/about" render={() => <About />} />
              </Grid>
            </div>
          </Router>
        </Grid>
        <Footer/>
      </div >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    bands: state.bands,
    user: state.user,
    posts: state.posts,
    notif: state.notification
  }
}

export default connect(
  mapStateToProps,
  { initialization, initUser, initializePosts, logout, notify }
)(App)
