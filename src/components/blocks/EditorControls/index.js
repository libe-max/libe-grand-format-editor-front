import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class EditorControls extends Component {
  constructor () {
    super()
    this.c = 'grand-format-editor-editor-controls'
    this.handleBgClick = this.handleBgClick.bind(this)
    this.handlePreviewClick = this.handlePreviewClick.bind(this)
  }

  handlePreviewClick (e) {
    if (e.target === this.$preview) this.props.triggerPreviewMode()
  }

  handleBgClick (e) {
    if (e.target === this.$bg) this.props.triggerPreviewMode()
  }

  render () {
    const { c, state } = this

    /* Assign classes */
    const classes = [c]

    return <div
      ref={n => this.$bg = n}
      onClick={this.handleBgClick}
      className={classes.join(' ')}>
      <div className={`${c}__inner`}>
        <div className={`${c}__header`}>
          <Link to='/'><button>Home</button></Link>
          <strong>Titre</strong>
          <i>Status</i>
          <button
            ref={n => this.$preview = n}
            onClick={this.handlePreviewClick}>
            Preview
          </button>
        </div>
        EditorControls
      </div>
    </div>
  }
}
