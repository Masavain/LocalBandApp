import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Grid, Row, Col } from 'react-bootstrap'
import BandCarousel from './BandCarousel'
import AdminControl from './AdminControl'
import { Carousel } from 'react-responsive-carousel'

const Home = (props) => {
  console.log(props.posts)
  return(
    <Grid>
      {(props.user ? (props.user.role === 'admin') ? <AdminControl /> : <div></div> :  <div></div>)}
      <Row>
        <Col>
          <Carousel centerMode centerSlidePercentage={50} swipeable={false} showThumbs={false} showStatus={false} showIndicators={false}>
            <div>
              <img className="carousel-image" height="500" src={props.mainPost.images[0].url} alt="MainPost"/>
              <Link to={`/post/${props.mainPost._id}`} className="legend"><div style={{ fontSize: '200%' }}>{props.mainPost.title}</div></Link>
            </div>
          </Carousel>
        </Col>
        <Col>
          <Carousel centerMode centerSlidePercentage={50} emulateTouch autoPlay showThumbs={false} showStatus={false} infiniteLoop useKeyboardArrows>
            <div>
              <img className="carousel-image" height="500" src={props.posts[0].images[0].url} alt="PostPic"/>
              <Link to={`/post/${props.posts[0]._id}`} className="legend"><div style={{ fontSize: '200%' }}>{props.posts[0].title}</div></Link>
            </div>
            <div>
              <img className="carousel-image" height="500" src={props.posts[1].images[0].url} alt="PostPic"/>
              <Link to={`/post/${props.posts[1]._id}`} className="legend"><div style={{ fontSize: '200%' }}>{props.posts[1].title}</div></Link>
            </div>
            <div>
              <img className="carousel-image" height="500" src={props.posts[2].images[0].url} alt="PostPic"/>
              <Link to={`/post/${props.posts[2]._id}`} className="legend"><div style={{ fontSize: '200%' }}>{props.posts[2].title}</div></Link>
            </div>
          </Carousel>
        </Col>
      </Row>
      <div style={{ fontSize: '200%', textAlign: 'center', padding: 5, marginTop: 50,   }}>DISCOVER</div>
      <BandCarousel/>
    </Grid>
  )
}

const userBands = (bands, user) => {
  const bandsWithUsers = bands.filter(b => b.user !== undefined)
  console.log('user', user)
  if (user === null) {
    return null
  }
  return bandsWithUsers.filter(band =>
    band.user.username === user.username
  )
}
const getPosts = (posts) => {
  posts.sort(function(a, b) {
    var c = new Date(a.date)
    var d = new Date(b.date)
    return d-c
  })
  const found = posts.find(function(post) {
    return (post.importance === 1)
  })
  return posts.filter(p => p._id !== found._id)
}
const mainPost = (posts) => {
  const found = posts.find(function(post) {
    return (post.importance === 1)
  })
  return found
}

const mapStateToProps = (state) => {
  return {
    bands: state.bands,
    user: state.user,
    userbands: userBands(state.bands, state.user),
    posts: getPosts(state.posts),
    mainPost: mainPost(state.posts),
    notif: state.notification
  }
}

export default connect(
  mapStateToProps
)(Home)
