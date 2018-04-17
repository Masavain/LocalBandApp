import React from 'react'
import { initialization } from './reducers/bandReducer'
import { connect } from 'react-redux'
import Home from './components/Home'
import LoginForm from './components/LoginForm'
import Explore from './components/Explore'
import { initUser, logout } from './reducers/loginReducer'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import { Navbar, Nav, NavItem, Grid, Button } from 'react-bootstrap'
import ProfilePage from './components/ProfilePage'
import About from './components/About'
import JoinForm from './components/JoinForm'
import Band from './components/Band'
import Background from './nakemys.jpg'
import './App.css'

class App extends React.Component {
  componentWillMount = async () => {
    this.props.initialization()
    this.props.initUser()
  }

  logOut = async () => {
    this.props.logout()
  }

  render() {
    const style = {
      backgroundImage: `url(${Background})`,
      backgroundRepeat: 'repeat-x',
      backgroundColor: 'lightgray',
      height: '1000px'

    }
    const customStyle = {
      backgroundColor: 'white',
      marginTop: 58,
      height: '1000px',
      paddingLeft: 0,
      paddingRight: 0,
    }
    const navbarStyle = {
      borderBottom: 'solid',
      borderWidth: 2,
      height: '8%',
      position: 'absolute'
    }
    if(this.props.bands.length === 0) {
      return null
    }
    console.log('user:',this.props.user)
    const blogById = (id) => this.props.bands.find(b => b._id === id)

    return (
      <div style={style}>
        <Router>
          <div>
            <Navbar fixedTop inverse collapseOnSelect style={navbarStyle}>
              <Navbar.Header>
                <Navbar.Brand>
                  <Link to="/">Localbands App</Link>
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                <Nav pullLeft>
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

                </Nav>
                <Nav pullRight>
                  <NavItem>
                    {this.props.user
                      ?
                      <div>
                        <em>{this.props.user.username} logged in </em>
                      </div>
                      :<div>
                      </div>
                    }
                  </NavItem>
                  <NavItem>
                    {this.props.user
                      ? <div>
                        <Link to="/profile">Profile</Link>
                      </div>
                      : <div>
                        <Link to="/login"><Button bsStyle="success">Login</Button></Link>  &nbsp;
                      </div>
                    }
                  </NavItem>
                  <NavItem>
                    {this.props.user
                      ?
                      <div>
                        <Button bsStyle="danger" onClick={this.logOut}> log out</Button>
                      </div>
                      :<div>
                        <Link to="/join"><Button bsStyle="primary">Sign</Button></Link>
                      </div>
                    }
                  </NavItem>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            <Grid style={customStyle}>
              <Route exact path="/bands/:id" render={({ match }) => {
                return <Band band={blogById(match.params.id)} />}}
              />
              <Route exact path="/login" render={({ history }) => <LoginForm history={history}/>} />
              <Route exact path="/search" render={() => <Explore/>} />
              <Route exact path="/join" render={({ history }) => <JoinForm history={history}/>} />
              <Route exact path="/" render={() => <Home />} />
              <Route path="/profile" render={({ history }) => this.props.user ? <ProfilePage history={history} />: <Redirect to="/login" />} />
              <Route path="/about" render={() => <About />} />
            </Grid>
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
