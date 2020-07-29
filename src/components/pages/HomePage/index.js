import React, { Component } from 'react'
import { Link } from 'react-router-dom'

/*
 *   Home page component
 *   ------------------------------------------------------
 *
 *   DESCRIPTION
 *   Displays a list of all longforms sent by the server
 *
 *   PROPS
 *   ...routerStuff, longforms, emitJoinLobby,
 *   emitRequestAllLongforms, emitCreateNewLongform
 *
 */

class HomePage extends Component {

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  constructor (props) {
    super()
    this.c = 'grand-format-editor-home-page'
    this.handleCreateNewLongformButtonClick = this.handleCreateNewLongformButtonClick.bind(this)
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * DID MOUNT
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  componentDidMount () {
    this.props.emitJoinLobby()
    this.props.emitRequestAllLongforms()
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE CREATE NEW LONGFORM BUTTON CLICK
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleCreateNewLongformButtonClick (e) {
    this.props.emitCreateNewLongform()
  }
  
  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  render () {
    const { props, c } = this
    const { longforms } = props

    /* Assign classes */
    const classes = [c]

    /* Return */
    return <div className={classes.join(' ')}>
      <h1>Tous les formats</h1>
      <button onClick={this.handleCreateNewLongformButtonClick}>Créer un nouveau format</button>
      <ul>{
        longforms.map(longform => {
          return <li key={longform._id}>
            <Link to={`/edit/${longform._id}`}>{longform._id}</Link>
          </li>
        })
      }</ul>
    </div>
  }
}

export default HomePage
