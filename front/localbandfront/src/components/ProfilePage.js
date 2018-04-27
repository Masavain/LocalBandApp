import React from 'react'
import { connect } from 'react-redux'
import BandForm from './BandForm'
import { Link } from 'react-router-dom'
import { Grid, Button, Table } from 'react-bootstrap'
import bandService from './../services/bands'

const ProfilePage = (props) => {
  const deleteBand = (band) => async event => {
    if (window.confirm(`Are you sure you want to delete ${band.name}?`)) {
      event.preventDefault()
      await bandService.remove(band._id)
      window.location.reload()
    }

  }

  return (
    <Grid>
      <h3>Profile: {props.user && props.user.username}</h3>
      <Table style={{ width: '20%' }}>
        <tbody>
          {props.userbands.map(b =>
            <tr key={b._id} className="wrapper">
              <td style={{ position: 'relative' }}><Link to={`/bands/${b._id}`} >{b.name}&nbsp;
              </Link></td>
              <td style={{ position: 'relative' }}><Button className="button" bsSize="xs" bsStyle="danger" onClick={deleteBand(b)}>&#9747;</Button></td>
            </tr>
          )}
        </tbody>
      </Table>
      <h2>Favourites:</h2>
      <div>{props.favBands.map(b => <Link key={b._id} to={`/bands/${b._id}`} >{b.name}&nbsp;</Link>)}</div>
      <BandForm history={props.history} />
    </Grid>
  )
}

const userBands = (bands, user) => {
  const bandsWithUsers = bands.filter(b => b.user !== undefined)
  return bandsWithUsers.filter(band => band.user.username === user.username)
}
const favs = (bands, ids) => {
  const favBands = bands.filter(b => ids.includes(b._id))
  return favBands
}


const mapStateToProps = (state) => {
  return {
    bands: state.bands,
    user: state.user,
    userbands: userBands(state.bands, state.user),
    favBands: favs(state.bands, state.user.favBands)
  }
}

export default connect(
  mapStateToProps
)(ProfilePage)
