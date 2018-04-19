import React from 'react'
import { connect } from 'react-redux'
import { Table, Grid, Row, Col } from 'react-bootstrap'
import Filter from '../components/Filter'
import { Link } from 'react-router-dom'
import { changePageIndex } from '../reducers/toggleReducer'

const Explore = (props) => {
  const pageChange = (pageNmbr) => {
    props.changePageIndex(pageNmbr)
  }
  const pageButtons = () => {
    var i
    var buttons = []
    for (i = 0; i < props.numberOfPages; i++) {
      const j = i
      buttons.push(<button onClick={() => pageChange(j)}>{`${j}-${j+10}`}</button>)
    }
    return buttons
  }

  return(
    <Grid style={{ marginTop: 10, marginBottom: 10 , paddingLeft: 0, paddingRight: 0  }}>
      <Row style={{ paddingLeft: 10, paddingRight: 10  }}>
        <Col sm={10}>
          <Filter />
        </Col>
        <Col>
          <div>{props.numberOfPages > 0 ? 'page: ' : ''}
            {pageButtons()}
          </div>
        </Col>
      </Row>

      <Table fluid striped>
        <tbody>
          <tr>
            <td></td>
            <td><b>name:</b></td>
            <td><b>genre:</b></td>
            <td><b>hometown:</b></td>
          </tr>
          {props.visibleBands.map(band =>
            <tr key={band._id}>
              {band.avatar
                ? <td>
                  <img src={band.avatar.url} width="75" height="75" alt="thumbnail"/>
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
    </Grid>
  )
}
const bandsToShow = (bands, filter, filterType, pageIndex) => {
  const filteroity = bands.filter(function (band) {
    if (filterType === 'name') {
      return band.name.toLowerCase().includes(filter.toLowerCase())
    }
    if (filterType === 'genre') {
      return band.genre.toLowerCase().includes(filter.toLowerCase())
    }
    if (filterType === 'hometown') {
      return band.hometown.toLowerCase().includes(filter.toLowerCase())
    } else {
      return band
    }
  })
  return filteroity.sort().slice((pageIndex*10),(pageIndex*10)+10)
}

const numOfPages = (bands, filter, filterType) => {
  const filteroity = bands.filter(function (band) {
    if (filterType === 'name') {
      return band.name.toLowerCase().includes(filter.toLowerCase())
    }
    if (filterType === 'genre') {
      return band.genre.toLowerCase().includes(filter.toLowerCase())
    }
    if (filterType === 'hometown') {
      return band.hometown.toLowerCase().includes(filter.toLowerCase())
    } else {
      return band
    }
  })
  return Math.round(filteroity.length/10)
}


const mapStateToProps = (state) => {
  return {
    bands: state.bands,
    user: state.user,
    visibleBands: bandsToShow(state.bands, state.toggle.filter, state.toggle.filterType, state.toggle.pageIndex),
    pageIndex: state.toggle.pageIndex,
    numberOfPages: numOfPages(state.bands, state.toggle.filter, state.toggle.filterType, state.toggle.pageIndex)
  }
}

export default connect(
  mapStateToProps, { changePageIndex }
)(Explore)