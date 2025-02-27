import React from 'react'
import { connect } from 'react-redux'
import { Table, Row, Col } from 'react-bootstrap'
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
    if (props.numberOfPages === 1) {
      buttons.push(<div></div>)
      return buttons
    }
    for (i = 0; i < props.numberOfPages; i++) {
      const j = i
      if (j === props.pageIndex) {
        buttons.push(<button className="page-button-active" onClick={() => pageChange(j)}>{`${j*10}-${(j*10)+10}`}</button>)
      } else {
        buttons.push(<button className="page-button" onClick={() => pageChange(j)}>{`${j*10}-${(j*10)+10}`}</button>)
      }

    }
    return buttons
  }

  return(
    <div style={{ marginTop: 10, marginBottom: 10 , paddingLeft: 0, paddingRight: 0  }}>
      <Row style={{ paddingLeft: 10, paddingRight: 10  }}>
        <Col sm={10}>
          <Filter />
        </Col>
        <Col xs={10}>
          <div>{props.numberOfPages > 0 ? 'page: ' : ''}
            {pageButtons()}
          </div>
        </Col>
      </Row>

      <Table striped>
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
                {band.genre.join(', ')}
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
}
const bandsToShow = (bands, filter, filterType, pageIndex) => {
  const filteroity = bands.filter(function (band) {
    if (filterType === 'name') {
      return band.name.toLowerCase().includes(filter.toLowerCase())
    }
    if (filterType === 'genre') {
      return band.genre.some(function(element) {
        return element.toLowerCase().includes(filter.toLowerCase())
      })
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
      return band.genre.some(function(element) {
        return element.toLowerCase().includes(filter.toLowerCase())
      })
    }
    if (filterType === 'hometown') {
      return band.hometown.toLowerCase().includes(filter.toLowerCase())
    } else {
      return band
    }
  })
  return Math.ceil(filteroity.length/10)
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