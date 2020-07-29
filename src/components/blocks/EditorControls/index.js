import React, { Component } from 'react'
import { Link } from 'react-router-dom'

/*
 *   Editor controls component
 *   ------------------------------------------------------
 *
 *   DESCRIPTION
 *   Displays the controls to edit the longform
 *
 *   PROPS
 *   longform, triggerPreviewMode, addBlockToLongform
 *
 */
 
export default class EditorControls extends Component {
  
  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  constructor () {
    super()
    this.c = 'grand-format-editor-editor-controls'
    this.handleBgClick = this.handleBgClick.bind(this)
    this.handlePreviewClick = this.handlePreviewClick.bind(this)
    this.handleAddBlockButtonClick = this.handleAddBlockButtonClick.bind(this)
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE PREVIEW CLICK
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handlePreviewClick (e) {
    if (e.target === this.$preview) this.props.triggerPreviewMode()
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE BG CLICK
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleBgClick (e) {
    if (e.target === this.$bg) this.props.triggerPreviewMode()
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE ADD BLOCK BUTTON
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleAddBlockButtonClick (e) {
    this.props.addBlockToLongform()
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  render () {
    const { c, state, props } = this
    const longform = props.longform || {}
    const blocks = longform.blocks || []

    /* Assign classes */
    const classes = [c]

    /* Return */
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
        <div>
          <div>{
            blocks.map(block => <div>
              <input type='text' />
            </div>)
          }</div>
          <button onClick={this.handleAddBlockButtonClick}>
            Add block
          </button>
        </div>
      </div>
    </div>
  }
}
