import React from 'react'
import { connect } from 'react-redux'
// import bandService from './../services/bands'
// import imageService from './../services/images'
import { Grid, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { updateBand } from './../reducers/bandReducer'
import BandHeader from './BandHeader'

const Discography = (props) => {
  return(
    <Grid>
      <Row>
        <BandHeader band={props.band}/>
      </Row>
      <Row>
        <Col>
          <Link to={`/bands/${props.band._id}`}>feed</Link> &nbsp;
          <Link to={`/bands/${props.band._id}/gallery`}>gallery</Link> &nbsp;
          <Link to={`/bands/${props.band._id}/discography`}>discography</Link>
        </Col>
      </Row>
    </Grid>
  )
}

export default connect(
  null, { updateBand }
)(Discography)