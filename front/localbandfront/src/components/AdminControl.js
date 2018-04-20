import React from 'react'
import { connect } from 'react-redux'
import { Grid, FormControl, FormGroup, ControlLabel, Button } from 'react-bootstrap'
import { postCreation, postUpdate } from './../reducers/postReducer'
import postService from '.././services/posts'

const AdminControl = (props) => {
  const handleNewPost = async (event) => {
    event.preventDefault()
    const newObject = {
      content: document.getElementById('content').value,
      title: event.target.title.value,
      author: event.target.author.value
    }
    const savedPost = await postService.createNew(newObject)
    props.postCreation(savedPost)
    window.location.reload()
  }

  return (
    <Grid>
      <form onSubmit={handleNewPost}>
        <FormGroup>
          <ControlLabel>title:</ControlLabel>
          <FormControl
            type="text"
            name="title"
          />
          <ControlLabel>author:</ControlLabel>
          <FormControl
            type="text"
            name="author"
          />
          <ControlLabel>content:</ControlLabel>
          <FormControl id="content" componentClass="textarea" />
          <Button bsStyle="success" type="submit">post</Button>
        </FormGroup>
      </form>
    </Grid>
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
  mapStateToProps, { postUpdate, postCreation }
)(AdminControl)
