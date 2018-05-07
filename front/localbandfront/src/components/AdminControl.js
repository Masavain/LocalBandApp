import React from 'react'
import { connect } from 'react-redux'
import { FormControl, FormGroup, ControlLabel, Button } from 'react-bootstrap'
import { postCreation, postUpdate } from './../reducers/postReducer'
import postService from '.././services/posts'
import imageService from '.././services/images'
import { toggleIsOpen }from '../reducers/toggleReducer'

const AdminControl = (props) => {
  const handleNewPost = async (event) => {
    event.preventDefault()
    const newObject = {
      content: document.getElementById('content').value,
      title: event.target.title.value,
      author: event.target.author.value
    }
    const file  = document.getElementById('postImage').files[0]
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async function () {
      const savedPost = await postService.createNew(newObject)
      const result = reader.result.substr(reader.result.indexOf(',')+1, reader.result.length)
      const imgurFile = await imageService.postImgur( result )
      const image = { url: imgurFile.data.link, imageType: imgurFile.data.type, height: imgurFile.data.height,
        width: imgurFile.data.width, animated: imgurFile.data.animated,
        deleteHash: imgurFile.data.deletehash, size: imgurFile.data.size,
        type: 'headImage', postId: savedPost.id }

      await imageService.postHeadArt(image)
      props.postCreation(savedPost)
      window.location.reload()
    }
    reader.onerror = function (error) {
      console.log('Error: ', error)
    }

  }
  const toggleFormToggle = (event) => {
    event.preventDefault()
    props.toggleIsOpen()
  }
  return (
    <div>
      {props.toggle.isOpen ? <form onSubmit={handleNewPost}>
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
          <FormControl
            id="postImage"
            accept="image/*"
            type="file"
            label="HeadImage"
          />
          <Button bsStyle="success" type="submit">post</Button>
        </FormGroup>

      </form>
        : <div></div>}
      <button onClick={toggleFormToggle}>toggle admin control</button>
    </div>
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
  mapStateToProps, { postUpdate, postCreation, toggleIsOpen }
)(AdminControl)
