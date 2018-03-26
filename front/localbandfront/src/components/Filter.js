import React from 'react'
import { connect } from 'react-redux'
import { filterChange, filtertypeChange } from './../reducers/filterReducer'
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
      marginBottom: 10
    }

    return(
      <div style={style}>
        <FormGroup controlId="formControlsSelect">
          <FormControl
            type="text"
            name="filter"
            onChange={this.changeFilter}/>
          <ControlLabel>Filter by</ControlLabel>
          <FormControl componentClass="select" placeholder="name" onChange={this.changeFiltertype}>
            <option value="name">name</option>
            <option value="hometown">hometown</option>
            <option value="genre">genre</option>
          </FormControl>
        </FormGroup>
      </div>

    )
  }
}

export default connect(
  null,
  { filterChange, filtertypeChange }
)(Filter)