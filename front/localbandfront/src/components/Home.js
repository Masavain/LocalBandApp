import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Grid, Row, Col } from 'react-bootstrap'
import BandCarousel from './BandCarousel'
import AdminControl from './AdminControl'

const Home = (props) => {
  return(
    <Grid >
      {(props.user ? (props.user.role === 'admin') ? <AdminControl /> : <div></div> :  <div></div>)}
      <Row>
        <Col xs={7} >
          <h2>All Bands</h2>
          {props.bands.map(band =>
            <div key={`all-${band._id}`}>
              <div>
                <Link to={`/bands/${band._id}`}>{band.name}</Link>
              </div>
            </div>
          )}
        </Col>
      </Row>
      <BandCarousel/>
    </Grid>
  )
}

const randomBand = (bands) => {
  return bands[Math.floor(Math.random() * bands.length)]
}

const userBands = (bands, user) => {
  const bandsWithUsers = bands.filter(b => b.user !== undefined)
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
