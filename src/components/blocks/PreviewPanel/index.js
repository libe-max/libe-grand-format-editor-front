import React, { Component } from 'react'

export default class PreviewPanel extends Component {
  constructor () {
    super()
    this.c = 'grand-format-editor-preview-panel'
  }

  render () {
    const { c, props } = this
    const { longform } = props

    /* Assign classes */
    const classes = [c]

    return <div className={classes.join(' ')}>
      <div className={`${c}__longform`}>
        <pre>{JSON.stringify(longform, null, 2)}</pre>
      </div>
    </div>
  }
}
