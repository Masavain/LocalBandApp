import React from 'react'
import { initialization } from './reducers/bandReducer'
import { connect } from 'react-redux'
import BandList from './components/BandList'

class App extends React.Component {
  componentWillMount = async () => {
    this.props.initialization()
  }

  render() {
    return (
      <div>
        <h1>LocalBands app</h1>
        <BandList />
      </div>
    )
  }
}

export default connect(
  null,
  { initialization }
)(App)
