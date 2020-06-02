import React, { Component } from 'react'

/*
 *   Editor actions component
 *   ------------------------------------------------------
 *
 *   DESCRIPTION
 *   Displays longform publication actions
 *
 *   PROPS
 *   triggerEditionMode
 *
 */

export default class EditorActions extends Component {
  
  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  constructor () {
    super()
    this.c = 'grand-format-editor-editor-actions'
    this.handleEditClick = this.handleEditClick.bind(this)
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE EDIT CLICK
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleEditClick (e) {
    this.props.triggerEditionMode()
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  render () {
    const { c } = this
    
    /* Assign classes */
    const classes = [c]

    /* Return */
    return <div className={classes.join(' ')}>
      <button onClick={this.handleEditClick}>Edit</button>
      <button>Publish</button>
    </div>
  }
}
