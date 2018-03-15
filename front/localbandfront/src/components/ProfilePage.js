import React from 'react'
import { connect } from 'react-redux'

const ProfilePage = (props) => {
  return(
    <div>
      <h3>{props.user}</h3>
      <div>
        {props.userbands.map(b =>
          <div key={b.id}>
            {b.name}
          </div>
        )}
      </div>
    </div>
  )
}

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
)(ProfilePage)
