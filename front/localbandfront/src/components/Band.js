import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Button } from 'react-bootstrap'
import BandFeed from './BandFeed'
import Gallery from './Gallery'
import Discography from './Discography'
import { toggle } from './../reducers/toggleReducer'
import BandHeader from './BandHeader'
import userService from './../services/users'

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
    const favBands = findUser.favBands.concat(props.band._id)
    const newObject = { ...findUser, favBands  }
    await userService.update(newObject.id, newObject)
    window.location.reload()
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
  return (

    <Grid fluid style={rowStyle}>
      <Row style={rowStyle}>
        <BandHeader band={props.band}/>
      </Row>
      <Row >
        <table className='multiborder'>
          <tr>
            <td style={{ width:'10px' }}></td>
            <td style={props.toggleType === 0 ? activeStyle : inactiveStyle} onClick={() => toggleComponent(0)}>FEED</td>
            <td style={props.toggleType === 1 ? activeStyle : inactiveStyle} onClick={() => toggleComponent(1)}>GALLERY</td>
            <td style={props.toggleType === 2 ? activeStyle : inactiveStyle} onClick={() => toggleComponent(2)}>DISCOGRAPHY</td>
            <td style={{ width:'500px' }}></td>
            {bandMatchesLoggedUser ? <tr></tr> : <td ><Button onClick={handleFavorite}>fav</Button></td> }
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

const mapStateToProps = (state) => {
  return {
    toggleType: state.toggle.type,
    user: state.user,
  }
}

export default connect(
  mapStateToProps, { toggle }
)(Band)