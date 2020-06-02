import React, { Component } from 'react'

/*
 *   Preview panel component
 *   ------------------------------------------------------
 *
 *   DESCRIPTION
 *   Displays the current longform
 *
 *   PROPS
 *   longform
 *
 */

export default class PreviewPanel extends Component {
 
  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  constructor () {
    super()
    this.c = 'grand-format-editor-preview-panel'
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  render () {
    const { c, props } = this
    const { longform } = props

    /* Assign classes */
    const classes = [c]

    /* Return */
    return <div className={classes.join(' ')}>
      <div className={`${c}__longform`}>
        <pre>{JSON.stringify(longform, null, 2)}</pre>
      </div>
    </div>
  }
}
