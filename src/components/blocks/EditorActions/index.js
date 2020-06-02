import React, { Component } from 'react'

export default class EditorActions extends Component {
  constructor () {
    super()
    this.c = 'grand-format-editor-editor-actions'
    this.handleEditClick = this.handleEditClick.bind(this)
  }

  handleEditClick (e) {
    this.props.triggerEditionMode()
  }

  render () {
    const { c } = this
    
    /* Assign classes */
    const classes = [c]

    return <div className={classes.join(' ')}>
      <button onClick={this.handleEditClick}>Edit</button>
      <button>Publish</button>
    </div>
  }
}
