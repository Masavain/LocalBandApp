import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import DefaultBackground from './../nakemys.jpg'
import { Carousel } from 'react-responsive-carousel'
import { Link } from 'react-router-dom'

const BandCarousel = (props) => {
  return (
    <Row>
      <Col>
        <Carousel centerMode centerSlidePercentage={50} emulateTouch autoPlay showThumbs={false} showStatus={false} infiniteLoop useKeyboardArrows>
          {props.showcaseBands.map(b =>
            <div key={b._id}>
              <img className="carousel-image" height="400" src={b.backgroundImage ? b.backgroundImage.url : DefaultBackground} alt="ShuffleImages"/>
              <Link to={`/bands/${b._id}`} className="legend"><div style={{ fontSize:'140%' }}>{b.name}</div></Link>
            </div>)}
        </Carousel>
      </Col>
    </Row>
  )
}

const shuffleBands = (bands) => {
  const shuffle = bands
  var currentIndex = shuffle.length, temporaryValue, randomIndex

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    temporaryValue = shuffle[currentIndex]
    shuffle[currentIndex] = shuffle[randomIndex]
    shuffle[randomIndex] = temporaryValue
  }
  return shuffle.slice(0, 6)
}
const mapStateToProps = (state) => {
  return {
    bands: state.bands,
    user: state.user,
    showcaseBands: shuffleBands(state.bands),
  }
}

export default connect(
  mapStateToProps, null
)(BandCarousel)

