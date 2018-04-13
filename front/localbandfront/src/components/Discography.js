import React from 'react'
import { connect } from 'react-redux'
// import bandService from './../services/bands'
// import imageService from './../services/images'
import { Grid, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { updateBand } from './../reducers/bandReducer'

const Discography = (props) => {
  return(
    <Grid>
      {props.band.name}
    </Grid>
  )
}

export default connect(
  null, { updateBand }
)(Discography)