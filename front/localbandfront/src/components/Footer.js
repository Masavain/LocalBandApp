import React from 'react'
import { connect } from 'react-redux'
const Footer = (props) => {
  return(<div fluid style={{ width: 'auto', height: '150px', backgroundColor: 'gray', textAlign: 'center', padding: 20 }}>
    <div>LocalBands App 2018</div>
    <div><a className="link" href='https://github.com/Masavain/LocalBandApp'>GitHub</a></div>
    <div>created by Matti Vainionpää</div>
  </div>)
}

export default connect(
  null,
  null
)(Footer)
