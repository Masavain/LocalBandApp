import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row } from 'react-bootstrap'
import BandFeed from './BandFeed'
import Gallery from './Gallery'
import Discography from './Discography'
import { toggle } from './../reducers/toggleReducer'
import BandHeader from './BandHeader'

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

  return (

    <Grid fluid style={rowStyle}>
      <Row style={rowStyle}>
        <BandHeader band={props.band}/>
      </Row>
      <Row >
        <table className='multiborder'>
          <tr>
            <td style={{ width:'10px' }}></td>
            {/* &nbsp; */}
            <td style={props.toggleType === 0 ? activeStyle : inactiveStyle} onClick={() => toggleComponent(0)}>feed</td>
            <td style={props.toggleType === 1 ? activeStyle : inactiveStyle} onClick={() => toggleComponent(1)}>gallery</td>
            <td style={props.toggleType === 2 ? activeStyle : inactiveStyle} onClick={() => toggleComponent(2)}>discography</td>
            &nbsp;
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
    toggleType: state.toggle.type
  }
}

export default connect(
  mapStateToProps, { toggle }
)(Band)