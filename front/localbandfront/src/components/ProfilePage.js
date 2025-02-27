import React from 'react'
import { connect } from 'react-redux'
import BandForm from './BandForm'
import { Link } from 'react-router-dom'
import { Row, Button, Col, Table } from 'react-bootstrap'
import bandService from './../services/bands'
import userService from './../services/users'
import imageService from './../services/images'
import { notify } from './../reducers/notificationReducer'
import { updateUser } from './../reducers/loginReducer'

const ProfilePage = (props) => {
  const deleteAlbumArts = (albums) => {
    const promises = albums.map(async (a) => {
      if (a.albumArt) {
        const oldArt = await imageService.getByIdFull(a.albumArt._id)
        return {
          deleted: await imageService.removeImgur(oldArt.deleteHash)
        }
      } else {
        return null
      }
    })
    return Promise.all(promises)
  }
  const deleteBand = (band) => async (event) => {
    if (window.confirm(`Are you sure you want to delete ${band.name}?`)) {
      event.preventDefault()
      if (band.albums) {
        deleteAlbumArts(band.albums)
      }
      if (band.avatar) {
        const oldAvatar = await imageService.getByIdFull(band.avatar._id)
        await imageService.removeImgur(oldAvatar.deleteHash)
      }
      if (band.backgroundImage) {
        const oldBG = await imageService.getByIdFull(band.backgroundImage._id)
        await imageService.removeImgur(oldBG.deleteHash)
      }

      await bandService.remove(band._id)
      window.location.reload()
    }
  }
  const handleUnFavourite = (band) => async (event) => {
    if (window.confirm(`Are you sure you want to remove ${band.name} from your favourites?`)) {
      event.preventDefault()
      const findUser = await userService.getById(props.user.id)
      const favBands = findUser.favBands.filter(b => b._id !== band._id)
      const newObject = { ...findUser, favBands  }
      await userService.update(newObject.id, newObject)
      props.notify(`${band.name} removed from favorites`, 4)
      props.updateUser(favBands)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Profile: {props.user && props.user.username}</h3>
      <Row>
        <Col xs={6} md={3} style={{ margin: 10, border: '1px solid gray' }}>
          <h2>My bands:</h2>
          <Table striped hover style={{ border: '1px solid lightgray' }}>
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
        </Col>
        <Col xs={6} md={3} style={{ margin: 10, border: '1px solid gray' }}>
          <h2>Favourites:</h2>
          <Table striped hover style={{ border: '1px solid lightgray' }}>
            <tbody>
              {props.favBands.map(b =>
                <tr key={b._id} className="wrapper">
                  <td><Link to={`/bands/${b._id}`} >{b.name}&nbsp;</Link></td>
                  <td style={{ position: 'relative' }}><Button className="button" bsSize="xs" bsStyle="warning" onClick={handleUnFavourite(b)}>&#9747;</Button></td>
                </tr>)}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <BandForm history={props.history}/>
      </Row>
    </div>
  )
}

const userBands = (bands, user) => {
  const bandsWithUsers = bands.filter(b => b.user !== undefined)
  return bandsWithUsers.filter(band => band.user.username === user.username)
}



const mapStateToProps = (state) => {
  return {
    bands: state.bands,
    user: state.user,
    userbands: userBands(state.bands, state.user),
    favBands: state.user.favBands
  }
}

export default connect(
  mapStateToProps, { notify, updateUser }
)(ProfilePage)
