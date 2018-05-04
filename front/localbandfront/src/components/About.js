import React from 'react'
import { connect } from 'react-redux'

const About = () => {
  const style = {
    padding: 30,
    height: '1000px'
  }
  return(
    <div style={style}>
      <p>
        {`Welcome to LocalBands web app, a sort-of social media for new, uprising, 
      underground bands and music nerds who want to find out about and share said bands and 
      their music. I created the app as a part of the FullStack web app design module 
      in the University of Helsinki in the spring of 2018. An integral part of 
      the project was to pick a subject-matter that was significant for me and also 
      so I could have a platform to satisfy my need to write and talk about music that I love.`}</p>

      <p>{`Every user can create a profile to manage their favorites and to create 
      band-specific pages for each of their musical projects and.
      I decided to give the users a possibility to embed Bandcamp and YouTube 
      urls as I feel they are few of the most important 
      platforms for music sharing these days. An added Spotify-player is next in line. 
      Bands can also make an image gallery with album art and/or photos from live shows as
      well as a discography list of releases with info and a Bandcamp link.
      `}
      </p>
      <p>{'LocalBands is totally free to use and there are no ads.'}
      </p>
    </div>
  )
}

export default connect(
)(About)