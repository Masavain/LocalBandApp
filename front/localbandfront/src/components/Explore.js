import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'react-bootstrap'
import Filter from '../components/Filter'
import { Link } from 'react-router-dom'

const Explore = (props) => (
  <div>
    <Filter />
    <Table striped>
      <tbody>
        <tr>
          <td><b>name:</b></td>
          <td><b>genre:</b></td>
          <td><b>hometown:</b></td>
        </tr>
        {props.visibleBands.map(band =>
          <tr key={band._id}>
            {band.avatarUrl
              ? <td>
                <img src={band.avatarUrl} width="75" height="75" alt="thumbnail"/>
              </td>
              : <td>
                <img src='/default_band_icon.png' width="75" height="75" alt="default thumbnail"/>
              </td>}
            <td>
              <Link to={`/bands/${band._id}`}>{band.name}</Link>
            </td>
            <td>
              {band.genre}
            </td>
            <td>
              {band.hometown}
            </td>
          </tr>
        )}
      </tbody>
    </Table>

  </div>
)
const bandsToShow = (bands, filter) => {
  console.log(filter)
  const filteroity = bands.filter(function (band) {
    if (filter.filterType === 'name') {
      return band.name.toLowerCase().includes(filter.filter)
    }
    if (filter.filterType === 'genre') {
      return band.genre.toLowerCase().includes(filter.filter)
    }
    if (filter.filterType === 'hometown') {

      return band.hometown.toLowerCase().includes(filter.filter)
    } else {
      return band
    }
  })
  return filteroity.sort((a, b) => b.votes - a.votes)
}


const mapStateToProps = (state) => {
  return {
    bands: state.bands,
    user: state.user,
    visibleBands: bandsToShow(state.bands, state.filter)
  }
}

export default connect(
  mapStateToProps
)(Explore)