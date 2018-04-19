import React from 'react'
import { connect } from 'react-redux'
import { Row } from 'react-bootstrap'
import DefaultBackground from './../nakemys.jpg'
import { Carousel } from 'react-responsive-carousel'

const BandCarousel = (props) => {
  return (
    <Row>
      <Carousel style={{ position: 'relative' }} width="100%" autoplay showThumbs={false} infiniteLoop useKeyboardArrows>
        {props.showcaseBands.map(b =>
          <div key={b._id}>
            <img src={b.backgroundImage ? b.backgroundImage.url : DefaultBackground} />
            <p className="legend">{b.name}</p>
          </div>)}

      </Carousel>
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

