import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Button, Alert } from 'react-bootstrap'
import BandFeed from './BandFeed'
import Gallery from './Gallery'
import Discography from './Discography'
import { toggle } from './../reducers/toggleReducer'
import { updateUser } from './../reducers/loginReducer'
import BandHeader from './BandHeader'
import userService from './../services/users'
import { notify } from './../reducers/notificationReducer'

const Band = (props) => {
  const componentByToggle = () => {
    if (props.toggleType === 0) {
      return(<BandFeed band={props.band}/>)
    }
    if (props.toggleType === 1) {
      return(<Gallery band={props.band}/>)
    }
    if (props.toggleType === 2) {
      return(<Discography band={props.band}/>)
    }
  }
  const handleFavorite = async (event) => {
    event.preventDefault()
    const findUser = await userService.getById(props.user.id)
    const favBands = findUser.favBands.concat(props.band)
    const newObject = { ...findUser, favBands  }
    await userService.update(newObject.id, newObject)
    props.notify('Added to favorites', 4)
    props.updateUser(favBands)
  }
  const handleUnFavorite = async (event) => {
    event.preventDefault()
    const findUser = await userService.getById(props.user.id)
    const favBands = findUser.favBands.filter(b => b._id !== props.band._id)
    const newObject = { ...findUser, favBands  }
    await userService.update(newObject.id, newObject)
    props.notify('Removed from favorites', 4)
    props.updateUser(favBands)
  }

  const toggleComponent = (toggle) => {
    props.toggle(toggle)
  }
  const activeStyle ={
    padding: 8,
    borderTop: '1px solid lightgrey',
    borderLeft: '1px solid lightgrey',
    borderRight: '1px solid lightgrey',
    borderBottom: '1px solid white',
    position:'relative',
    width: '100px'

  }
  const inactiveStyle = {
    left: '5px',
    padding: 5,
    borderBottom: '0px solid',
    position:'relative',
    width: '100px'
  }
  const rowStyle = {
    paddingLeft: 0,
    paddingRight: 0
  }
  const bandMatchesLoggedUser = (props.user ? (props.band.user.name === props.user.name) ? true : false : false)
  const bandIsFavourited = (props.user ? (props.favBandIds.includes(props.band._id)) ? true : false : false)
  return (

    <Grid fluid style={rowStyle}>
      <Row style={rowStyle}>
        <BandHeader band={props.band}/>
        <Alert className={`${props.notif.visible ? 'fav-alert' : 'fav-alert-hidden'}`} style={{ position:'absolute', left: 500, padding: 4, width: '25%', fontSize:20 }} bsStyle="success">
          {props.notif.message}
        </Alert>
      </Row>
      <Row >

        <table className='multiborder'>
          <tr>
            <td style={{ width:'10px' }}></td>
            <td style={props.toggleType === 0 ? activeStyle : inactiveStyle} onClick={() => toggleComponent(0)}>FEED</td>
            <td style={props.toggleType === 1 ? activeStyle : inactiveStyle} onClick={() => toggleComponent(1)}>GALLERY</td>
            <td style={props.toggleType === 2 ? activeStyle : inactiveStyle} onClick={() => toggleComponent(2)}>DISCOGRAPHY</td>
            <td style={{ width:'500px' }}></td>
            {(props.user) ?
              (bandMatchesLoggedUser)
                ? <td></td>
                : (bandIsFavourited)
                  ? <td><Button className="fav-button" style={{ backgroundColor: '#ff99fa' }} onClick={handleUnFavorite}>&#9825;</Button></td>
                  : <td><Button className="fav-button" onClick={handleFavorite}>&#9825;</Button></td>
              : <td></td>
            }
          </tr>
        </table>

      </Row>
      <Row>
        {componentByToggle()}
      </Row>
      <div className='bottom-border'></div>
    </Grid>

  )
}

const favbandids = (user) => {
  if (user) {
    const mapped = user.favBands.map(b => b._id)
    return mapped
  }
  return null
}

const mapStateToProps = (state) => {
  return {
    toggleType: state.toggle.type,
    user: state.user,
    favBandIds: favbandids(state.user),
    notif: state.notification
  }
}

export default connect(
  mapStateToProps, { toggle, updateUser, notify }
)(Band)