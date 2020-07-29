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
 *   emitRequestLongform, addBlockToLongformViaId
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
    this.addBlockToLongform = this.addBlockToLongform.bind(this)
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * DID MOUNT
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  componentDidMount () {
    this.props.emitJoinLongformRoom()
    this.props.emitRequestLongform()
    this.setState({ mode: 'loading' })
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * DID UPDATE
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  componentDidUpdate () {
    if (this.state.mode === 'loading' && this.props.longform) {
      this.setState({ mode: 'edition' })
    }
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
   * ADD BLOCK TO LONGFORM
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  addBlockToLongform () {
    const id = this.props.longform._id
    if (!id) return
    return this.props.addBlockToLongformViaId(id)
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
    if (state.mode === 'loading') classes.push(`${c}_loading-mode`)
    if (state.mode === 'edition') classes.push(`${c}_edition-mode`)
    if (state.mode === 'preview') classes.push(`${c}_preview-mode`)

    /* Return */
    if (state.mode === 'loading') return <div>Loading...</div>
    return <div className={classes.join(' ')}>
      <PreviewPanel longform={longform} />
      <EditorControls
        longform={longform}
        addBlockToLongform={this.addBlockToLongform}
        triggerPreviewMode={this.triggerPreviewMode} />
      <EditorActions triggerEditionMode={this.triggerEditionMode} />
    </div>
  }
}

export default EditorPage
