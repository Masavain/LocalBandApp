import React from 'react'
import { connect } from 'react-redux'
import { Row } from 'react-bootstrap'

const Post = (props) => {
  let doc = new DOMParser().parseFromString(props.post.content, 'text/html')
  console.log(doc.body.innerHTML)
  const date = props.post.date.substring(0, 10)
  const time = props.post.date.substring(11, 16)
  return (
    <div style={{ paddingBottom: 50 }}>
      <h1 style={{ textAlign: 'center', padding: '50px', fontFamily: 'Courier' }}>{props.post.title}</h1>
      <p style={{ color: 'gray', textAlign: 'center' }}>{`posted: ${date}, ${time}`}</p>
      <img className="header-image" src={props.post.images[0].url} height="450" alt=" "/>
      <Row>
        <div style={{ padding:30, textAlign: 'center' }} dangerouslySetInnerHTML={{ __html:doc.body.innerHTML }}></div>
        <div style={{ padding:10, textAlign: 'center' }}>{props.post.author}, editor/admin</div>
      </Row>
    </div>

  )
}


const mapStateToProps = (state) => {
  return {
    posts: state.posts
  }
}

export default connect(
  mapStateToProps, null
)(Post)