import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import BandFeed from './BandFeed'
import Gallery from './Gallery'
import Discography from './Discography'
import { toggle } from './../reducers/toggleReducer'
import BandHeader from './BandHeader'

const Band = (props) => {
  const componentByToggle = () => {
    console.log('toggle:', props.toggleType)
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
  const toggleComponent = (toggle) => {
    props.toggle(toggle)
  }
  const activeStyle ={
    padding: 8,
    borderTop: '1px solid lightgrey',
    borderLeft: '1px solid lightgrey',
    borderRight: '1px solid lightgrey',
    borderRadius: '200',
  }
  const inactiveStyle = {
    left: '5px',
    padding: 5,
    borderBottom: '0px solid',
  }
  let width1 = null
  let width2 = null
  if (props.toggleType === 0) {
    width1 = '870px'
    width2 = '5px'
  }
  if (props.toggleType === 1) {
    width1 = '820px'
    width2 = '42px'
  }
  if (props.toggleType === 2) {
    width1 = '732px'
    width2 = '93px'
  }

  const bottomBorder = {
    borderBottom: '1px solid lightgrey',
    width: width1,
    position:'absolute',
    bottom:'0px',
    right:'0px',
  }

  const bottomBorder2 = {
    borderBottom:'1px solid lightgrey',
    width: width2,
    position:'absolute',
    bottom:'0px',
    left:'0px'
  }

  return (

    <Grid>
      <Row>
        <BandHeader band={props.band}/>
      </Row>
      <Row className='multiborder'>

        <table >
          <tr>
            &nbsp;
            <td style={props.toggleType === 0 ? activeStyle : inactiveStyle} onClick={() => toggleComponent(0)}>feed</td>
            <td style={props.toggleType === 1 ? activeStyle : inactiveStyle} onClick={() => toggleComponent(1)}>gallery</td>
            <td style={props.toggleType === 2 ? activeStyle : inactiveStyle} onClick={() => toggleComponent(2)}>discography</td>
          </tr>
        </table>
        <div style={bottomBorder}></div>
        <div style={bottomBorder2}></div>
      </Row>
      <Row>
        {componentByToggle()}
      </Row>
    </Grid>

  )
}


const mapStateToProps = (state) => {
  return {
    toggleType: state.toggle.type
  }
}

export default connect(
  mapStateToProps, { toggle }
)(Band)