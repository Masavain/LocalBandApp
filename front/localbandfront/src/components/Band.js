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
    borderBottom: '1px solid white',
    position:'relative'

  }
  const inactiveStyle = {
    left: '5px',
    padding: 5,
    borderBottom: '0px solid',
    position:'relative'
  }


  return (

    <Grid>
      <Row>
        <BandHeader band={props.band}/>
      </Row>
      <Row >

        <table className='multiborder'>
          <tr>
            &nbsp;
            <td style={props.toggleType === 0 ? activeStyle : inactiveStyle} onClick={() => toggleComponent(0)}>feed</td>
            <td style={props.toggleType === 1 ? activeStyle : inactiveStyle} onClick={() => toggleComponent(1)}>gallery</td>
            <td style={props.toggleType === 2 ? activeStyle : inactiveStyle} onClick={() => toggleComponent(2)}>discography</td>
            &nbsp;
          </tr>
        </table>
        <div className='eka'></div>
        <div className='toka'></div>
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