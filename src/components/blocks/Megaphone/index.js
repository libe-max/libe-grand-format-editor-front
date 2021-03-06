import React, { Component } from 'react'

/*
 *   Megaphone component
 *   ------------------------------------------------------
 *
 *   DESCRIPTION
 *   Displays the incoming and outcoming messages
 *
 *   PROPS
 *   username, events, room, sendMessage,
 *   triggerChangeUserName
 *
 */
 
class Megaphone extends Component {

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  constructor (props) {
    super()
    this.state = {
      is_opened: false,
      last_opened: 0
    }
    this.c = 'grand-format-editor-megaphone'
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.handleOpenButtonClick = this.handleOpenButtonClick.bind(this)
    this.handleCloseButtonClick = this.handleCloseButtonClick.bind(this)
    this.handleTextareaChange = this.handleTextareaChange.bind(this)
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE SEND MESSAGE
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleSendMessage (e) {
    const message = this.$textarea.value
    if (!message) return
    this.sendMessage(message)
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE OPEN BUTTON CLICK
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleOpenButtonClick (e) {
    this.setState({ is_opened: true })
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE CLOSE BUTTON CLICJ
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleCloseButtonClick (e) {
    this.setState({
      is_opened: false,
      last_opened: Date.now()
    })
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE TEXTAREA CHANGE
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleTextareaChange (e) {
    const message = this.$textarea.value
    if (e.key !== 'Enter' || !message) return
    e.preventDefault()
    this.sendMessage(message)
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * SEND MESSAGE
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  sendMessage (message) {
    this.$textarea.value = ''
    this.props.sendMessage(message)
  }
  
  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  render () {
    const { state, props, c } = this
    const { username, triggerChangeUserName, events, room } = props

    /* Inner logic */
    const nbNotifications = events.filter(event => {
      return event.received_on >= state.last_opened
    }).length
    
    /* Assign classes */
    const classes = [c]
    if (state.is_opened) classes.push(`${c}_is-opened`)
    if (!state.is_opened && nbNotifications) classes.push(`${c}_has-notifications`)

    /* Return */
    return <div className={classes.join(' ')}>
      <div className={`${c}__inner`}>
        <button
          onClick={this.handleOpenButtonClick}
          className={`${c}__open-button`}>
          icon
        </button>
        <div className={`${c}__notification`}>{nbNotifications}</div>
        <div className={`${c}__head`}>
          <div className={`${c}__room-name`}>{room}</div>
          <button
            onClick={this.handleCloseButtonClick}
            className={`${c}__close-panel`}>
            V
          </button>
        </div>
        <div className={`${c}__messages`}>{events
          .sort((a, b) => a.received_on - b.received_on)
          .map(event => event.type === 'ALL LONGFORMS'
            ? <p key={event.received_on}><i>Data in</i></p>
            : event.type === 'LONGFORM'
            ? <p key={event.received_on}><i>Data in</i></p>
            : event.type === 'USER JOINED ROOM'
            ? <p key={event.received_on}><i>{event.payload.username} a rejoint {event.payload.room}</i></p>
            : event.type === 'USER LEFT ROOM'
            ? <p key={event.received_on}><i>{event.payload.username} a quitté {event.payload.room}</i></p>
            : event.type === 'USER CHANGED NAME'
            ? <p key={event.received_on}><i>{event.payload.pUsername} s'appelle maintenant {event.payload.username}</i></p>
            : event.type === 'NEW MESSAGE'
            ? <p key={event.received_on}><strong>{event.payload.username} :</strong> {event.payload.message}</p>
            : event.type === 'YOU LEFT ROOM'
            ? <p key={event.received_on}><i>Vous avez quitté {event.payload.room}</i></p>
            : event.type === 'YOU JOINED ROOM'
            ? <p key={event.received_on}><i>Vous avez rejoint {event.payload.room}</i></p>
            : event.type === 'YOU CHANGED NAME'
            ? <p key={event.received_on}><i>Vous vous appelez maintenant {event.payload.username}</i></p>
            : event.type === 'YOUR NEW MESSAGE'
            ? <p key={event.received_on}><strong>Vous :</strong> {event.payload.message}</p>
            : event.type === 'YOUR FORM EDITION'
            ? <p key={event.received_on}>Vos modifications ont été sauvegardées</p>
            : event.type === 'SERVER ERROR'
            ? <p key={event.received_on}>Le serveur a répondu une erreur : {event.payload.message}</p>
            : <p key={Math.random()}>Message inconnu, erreur.</p>
          )
        }</div>
        <button
          onClick={triggerChangeUserName}
          className={`${c}__identity`}>
          Vous êtes connecté en tant que {username}
        </button>
        <div className={`${c}__expression`}>
          <textarea
            ref={n => this.$textarea = n}
            onKeyPress={this.handleTextareaChange} />
          <button onClick={this.handleSendMessage}>›</button>
        </div>
        <button className={`${c}__secondary-button`}>
          Ouvrir
        </button>
      </div>
    </div>
  }
}

export default Megaphone
