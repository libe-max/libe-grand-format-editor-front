import React, { Component } from 'react'
import EditorControls from '../../blocks/EditorControls'
import PreviewPanel from '../../blocks/PreviewPanel'
import EditorActions from '../../blocks/EditorActions'

/*
 *   Editor page component
 *   ------------------------------------------------------
 *
 *   DESCRIPTION
 *   Displays a preview of the longform, plus the edition
 *   panels
 *
 *   PROPS
 *   ...routerStuff, longform, emitJoinLongformRoom,
 *   emitRequestLongform
 *
 */

class EditorPage extends Component {
 
  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  constructor (props) {
    super()
    this.state = {
      mode: 'edition'
    }
    this.c = 'grand-format-editor-editor-page'
    this.triggerPreviewMode = this.triggerPreviewMode.bind(this)
    this.triggerEditionMode = this.triggerEditionMode.bind(this)
    props.emitJoinLongformRoom()
    props.emitRequestLongform()
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * TRIGGER PREVIEW MODE
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  triggerPreviewMode () {
    this.setState({ mode: 'preview' })
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * TRIGGER EDITION MODE
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  triggerEditionMode () {
    this.setState({ mode: 'edition' })
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  render () {
    const { state, props, c } = this
    const { longform } = props

    /* Assign classes */
    const classes = [c]
    if (state.mode === 'edition') classes.push(`${c}_edition-mode`)
    if (state.mode === 'preview') classes.push(`${c}_preview-mode`)

    /* Return */
    return <div className={classes.join(' ')}>
      <PreviewPanel longform={longform} />
      <EditorControls triggerPreviewMode={this.triggerPreviewMode} />
      <EditorActions triggerEditionMode={this.triggerEditionMode} />
    </div>
  }
}

export default EditorPage
