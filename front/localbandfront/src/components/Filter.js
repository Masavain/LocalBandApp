import React from 'react'
import { connect } from 'react-redux'
import { filterChange, filtertypeChange } from './../reducers/toggleReducer'
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap'

class Filter extends React.Component {
  changeFilter = (event) => {
    event.preventDefault()
    this.props.filterChange(event.target.value)
  }
  changeFiltertype = (event) => {
    event.preventDefault()
    this.props.filtertypeChange(event.target.value)
  }
  render() {
    const style = {
      position: 'relative',
      marginBottom: 10,
      marginLeft: 10,
      marginRight: 100
    }


    return(
      <div style={style}>
        <form className='form-inline'>
          <FormGroup className='form-group' controlId="formControlsSelect">
            <FormControl className='input-group'
              type="text"
              name="filter"
              onChange={this.changeFilter}/>{' '}
            <ControlLabel>Filter by</ControlLabel>{'  '}
            <FormControl componentClass="select" placeholder="name" onChange={this.changeFiltertype}>
              <option value="name">name</option>
              <option value="genre">genre</option>
              <option value="hometown">hometown</option>
            </FormControl>
          </FormGroup>
        </form>
      </div>
    )
  }
}

export default connect(
  null,
  { filterChange, filtertypeChange }
)(Filter)