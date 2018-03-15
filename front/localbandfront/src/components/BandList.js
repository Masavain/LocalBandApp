import React from 'react'
import { connect } from 'react-redux'

const BandList = (props) => (
  <div>
    <h2>All Bands</h2>
    {props.bands.map(band =>
      <div key={band.id}>
        <div>
          {band.name} {band.genre} {band.hometown}
        </div>
      </div>
    )}
    <h2>My bands</h2>
    {props.userbands.map(b =>
      <div key={b.id}>
        <div>
          {b.name} {b.genre} {b.hometown}
        </div>
      </div>
    )}
  </div>
)
const userBands = (bands, user) => {
  const bandsWithUsers = bands.filter(b => b.user !== undefined)
  return bandsWithUsers.filter(band => band.user.username === user)
}

const mapStateToProps = (state) => {
  return {
    bands: state.bands,
    user: state.user,
    userbands: userBands(state.bands, state.user)
  }
}

export default connect(
  mapStateToProps
)(BandList)
