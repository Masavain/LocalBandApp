import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'



const Home = (props) => {
  const style = {
    marginTop: 10,
    marginBottom: 10
  }
  const allBands = () => (

    <div>
      <h2>All Bands</h2>
      {props.bands.map(band =>
        <div key={`all-${band._id}`}>
          <div>
            <Link to={`/bands/${band._id}`}>{band.name}</Link>
          </div>
        </div>
      )}
      <div>
        <p style={style}>Showcase:
        <Link to={`/bands/${props.randomBand._id}`}>{props.randomBand.name}</Link>
        </p>

      </div>
    </div>
  )
  if (props.user === null) {
    return (allBands())
  } else {
    return(
      <div>
        {allBands()}
        <h2>My bands</h2>
        {props.userbands.map(b =>
          <div key={b._id}>
            <div>
              {b.name} {b.genre} {b.hometown}
            </div>
          </div>
        )}
      </div>
    )
  }

}

const randomBand = (bands) => {
  return bands[Math.floor(Math.random() * bands.length)]
}

const userBands = (bands, user) => {
  const bandsWithUsers = bands.filter(b => b.user !== undefined)
  console.log('bandswithusers', bandsWithUsers)
  console.log('user', user)
  if (user === null) {
    return null
  }
  return bandsWithUsers.filter(band =>
    band.user.username === user.username
  )
}

const mapStateToProps = (state) => {
  return {
    bands: state.bands,
    user: state.user,
    userbands: userBands(state.bands, state.user),
    randomBand: randomBand(state.bands)
  }
}

export default connect(
  mapStateToProps
)(Home)
