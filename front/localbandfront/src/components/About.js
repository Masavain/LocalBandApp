import React from 'react'
import { connect } from 'react-redux'

const About = () => {
  const style = {
    padding: 10
  }
  return(
    <div style={style}>
      <p>
    Lorem ipsum dolor sit amet, consectetur adipisci elit,
    sed eiusmod tempor incidunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquid ex ea commodi consequat.
    Quis aute iure reprehenderit in voluptate velit esse cillum
    dolore eu fugiat nulla pariatur. Excepteur sint obcaecat
    cupiditat non proident, sunt in culpa qui officia deserunt
    mollit anim id est laborum.
      </p>
    </div>
  )
}

export default connect(
)(About)