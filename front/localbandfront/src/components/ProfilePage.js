import React from 'react'
import { connect } from 'react-redux'
import BandForm from './BandForm'
import { Link } from 'react-router-dom'

const ProfilePage = (props) => {
  return(
    <div>
      <h3>{props.user && props.user.username}</h3>
      <div>
        {props.userbands.map(b =>
          <div key={b._id}>
            <Link to={`/bands/${b._id}`}>{b.name}</Link>
          </div>
        )}
      </div>
      <BandForm history={props.history}/>
    </div>
  )
}

const userBands = (bands, user) => {
  const bandsWithUsers = bands.filter(b => b.user !== undefined)
  return bandsWithUsers.filter(band => band.user.username === user.username)
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
