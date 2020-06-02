import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class HomePage extends Component {
  constructor (props) {
    super()
    this.c = 'grand-format-editor-home-page'
  }

  componentDidMount () {
    this.props.emitJoinLobby()
    this.props.emitRequestAllLongforms()
  }
  
  render () {
    const { props, c } = this
    const { longforms } = props

    /* Assign classes */
    const classes = [c]

    return <div className={classes.join(' ')}>
      <h1>Tous les formats</h1>
      <button>Créer un nouveau format</button>
      <ul>{
        longforms.map(longform => {
          return <li>
            <Link to={`/edit/${longform._id}`}>{longform._id}</Link>
          </li>
        })
      }</ul>
    </div>
  }
}

export default HomePage
