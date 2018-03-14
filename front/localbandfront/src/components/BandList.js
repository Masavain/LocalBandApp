import React from 'react'
import { connect } from 'react-redux'

const BandList = (props) => (
  <div>
    <h2>Bands</h2>
    {props.bands.map(band =>
      <div key={band.id}>
        <div>
          {band.name}
        </div>
      </div>
    )}
  </div>
)

const mapStateToProps = (state) => {
  return {
    bands: state.bands
  }
}

export default connect(
  mapStateToProps
)(BandList)
