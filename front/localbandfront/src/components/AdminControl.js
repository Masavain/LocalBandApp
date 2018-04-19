import React from 'react'
import { connect } from 'react-redux'

const AdminControl = (props) => {
  const handleNewPost = () => {

  }

  return (
    <form >
      <textarea id="content" form="post-form"></textarea>
      <button onClick={() => handleNewPost()}></button>
    </form>
  )
}


const mapStateToProps = (state) => {
  return {
    bands: state.bands,
    user: state.user,
    toggle: state.toggle,
  }
}

export default connect(
  mapStateToProps
)(AdminControl)
