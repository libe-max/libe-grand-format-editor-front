import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom'
import SocketIoClient from 'socket.io-client'
import diff from 'changeset'
import HomePage from './components/pages/HomePage'
import EditorPage from './components/pages/EditorPage'
import Megaphone from './components/blocks/Megaphone'

class App extends Component {

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  constructor (props) {
    super(props)
    this.c = 'grand-format-editor'
    this.state = {
      longforms: [],
      local_changes: [],
      events: [],
      username: this.getUsernameCookie() || this.triggerChangeUserName()
    }
    // Methods
    this.getUsernameCookie = this.getUsernameCookie.bind(this)
    this.triggerChangeUserName = this.triggerChangeUserName.bind(this)
    this.getCurrentLongformViaId = this.getCurrentLongformViaId.bind(this)
    this.addBlockToLongformViaId = this.addBlockToLongformViaId.bind(this)
    this.storeLongformChangesViaId = this.storeLongformChangesViaId.bind(this)
    // WS emiters
    this.emitJoinRoom = this.emitJoinRoom.bind(this)
    this.emitChangeUsername = this.emitChangeUsername.bind(this)
    this.emitCreateNewLongform = this.emitCreateNewLongform.bind(this)
    this.emitRequestAllLongforms = this.emitRequestAllLongforms.bind(this)
    this.emitRequestLongform = this.emitRequestLongform.bind(this)
    this.emitPostMessage = this.emitPostMessage.bind(this)
    this.emitPostLongformEdition = this.emitPostLongformEdition.bind(this)
    // WS handlers
    this.handleAllLongforms = this.handleAllLongforms.bind(this)
    this.handleLongform = this.handleLongform.bind(this)
    this.handleUserJoinedRoom = this.handleUserJoinedRoom.bind(this)
    this.handleUserLeftRoom = this.handleUserLeftRoom.bind(this)
    this.handleUserChangedName = this.handleUserChangedName.bind(this)
    this.handleNewLongform = this.handleNewLongform.bind(this)
    this.handleYourNewLongform = this.handleYourNewLongform.bind(this)
    this.handleNewMessage = this.handleNewMessage.bind(this)
    this.handleYouLeftRoom = this.handleYouLeftRoom.bind(this)
    this.handleYouJoinedRoom = this.handleYouJoinedRoom.bind(this)
    this.handleYouChangedName = this.handleYouChangedName.bind(this)
    this.handleYourNewMessage = this.handleYourNewMessage.bind(this)
    this.handleYourFormEdition = this.handleYourFormEdition.bind(this)
    this.handleServerError = this.handleServerError.bind(this)
    // Listen to WS messages
    this.socket = new SocketIoClient()
    this.socket.on('USER JOINED ROOM', this.handleUserJoinedRoom)
    this.socket.on('USER LEFT ROOM', this.handleUserLeftRoom)
    this.socket.on('USER CHANGED NAME', this.handleUserChangedName)
    this.socket.on('NEW MESSAGE', this.handleNewMessage)
    this.socket.on('NEW LONGFORM', this.handleNewLongform)
    this.socket.on('YOUR NEW LONGFORM', this.handleYourNewLongform)
    this.socket.on('ALL LONGFORMS', this.handleAllLongforms)
    this.socket.on('LONGFORM', this.handleLongform)
    this.socket.on('YOU LEFT ROOM', this.handleYouLeftRoom)
    this.socket.on('YOU JOINED ROOM', this.handleYouJoinedRoom)
    this.socket.on('YOU CHANGED NAME', this.handleYouChangedName)
    this.socket.on('YOUR NEW MESSAGE', this.handleYourNewMessage)
    this.socket.on('YOUR FORM EDITION', this.handleYourFormEdition)
    this.socket.on('SERVER ERROR', this.handleServerError)
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * GET USERNAME COOKIE
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  getUsernameCookie () {
    const cookies = {}
    document.cookie.split(';').forEach(str => {
      const splStr = str.trim().split('=')
      if (splStr.length >= 2) cookies[splStr[0]] = splStr.slice(1).join('=')
    })
    return cookies.username
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * TRIGGER CHANGE USER NAME
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  triggerChangeUserName () {
    const username = prompt('Qui êtes vous ?')
    if (!username) return
    document.cookie = `username=${username};`
    this.setState({ username: username })
    this.emitChangeUsername(username)
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * TRIGGER CHANGE USER NAME
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  getCurrentLongformViaId (id) {
    const longform = this.state.longforms.find(longform => longform._id === id)
    if (!longform) return

    const localChanges = this.state.local_changes.find(changes => changes._id === id)
    if (!localChanges) return longform

    return localChanges.changes_list.reduce((acc, curr) => {
      return diff.apply(curr, acc)
    }, { ...longform })
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * ADD BLOCK TO LONGFORM
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  addBlockToLongformViaId (id) {
    console.log('add block', id)
    const longformWithLocalChanges = this.getCurrentLongformViaId(id)
    if (!longformWithLocalChanges) return
    const updatedLongform = {
      ...longformWithLocalChanges,
      blocks: longformWithLocalChanges.blocks
        ? [...longformWithLocalChanges.blocks, { id: Math.random().toString(36).slice(2) }]
        : [{ id: Math.random().toString(36).slice(2) }]
    }
    const changes = diff(longformWithLocalChanges, updatedLongform)
    this.storeLongformChangesViaId(id, changes)
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * STORE LONGFORM CHANGES VIA ID
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  storeLongformChangesViaId (id, changes) {
    const currentPosInLocalChanges = this.state.local_changes.findIndex(change => change._id === id)
    const currentLocalChanges = currentPosInLocalChanges > -1
      ? this.state.local_changes[currentPosInLocalChanges]
      : { _id: id, changes_list: [] }
    currentLocalChanges.changes_list.push(changes)
    this.setState(current => ({
      ...current,
      local_changes: currentPosInLocalChanges > -1
        ? [
          ...current.local_changes.slice(0, currentPosInLocalChanges),
          currentLocalChanges,
          ...current.local_changes.slice(currentPosInLocalChanges + 1)
        ]
        : [
          ...current.local_changes,
          currentLocalChanges
        ]
    }))
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * EMIT JOIN ROOM
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  emitJoinRoom (room) {
    if (!room) return
    const username = this.state.username
    const request = { username, room }
    console.log('JOIN ROOM', request)
    this.socket.emit('JOIN ROOM', request)
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * EMIT CHANGE USERNAME
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  emitChangeUsername (username) {
    document.cookie = `username=${username};`
    const request = { username }
    console.log('CHANGE USERNAME', request)
    this.socket.emit('CHANGE USERNAME', request)
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * EMIT CREATE NEW LONGFORM
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  emitCreateNewLongform () {
    console.log('CREATE NEW LONGFORM', {})
    this.socket.emit('CREATE NEW LONGFORM', {})
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * EMIT REQUEST ALL LONGFORMS
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  emitRequestAllLongforms () {
    console.log('REQUEST ALL LONGFORMS', {})
    this.socket.emit('REQUEST ALL LONGFORMS', {})
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * EMIT REQUEST LONGFORM
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  emitRequestLongform (id) {
    console.log('REQUEST LONGFORM', { id })
    this.socket.emit('REQUEST LONGFORM', { id })
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * EMIT POST MESSAGE
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  emitPostMessage (message) {
    const username = this.state.username
    const request = { username, message }
    console.log('POST MESSAGE', request)
    this.socket.emit('POST MESSAGE', request)
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * EMIT POST LONGFORM EDITION
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  emitPostLongformEdition (id, payload) {
    const username = this.state.username
    const request = { username, id, payload }
    console.log('POST LONGFORM EDITION', request)
    this.socket.emit('POST LONGFORM EDITION', request)
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE USER JOINED ROOM
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleUserJoinedRoom (payload) {
    console.log('> USER JOINED ROOM', payload)
    this.setState(current => ({
      ...current,
      events: [...current.events, {
        type: 'USER JOINED ROOM',
        received_on: Date.now(),
        payload
      }]
    }))
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE USER LEFT ROOM
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleUserLeftRoom (payload) {
    console.log('> USER LEFT ROOM', payload)
    this.setState(current => ({
      ...current,
      events: [...current.events, {
        type: 'USER LEFT ROOM',
        received_on: Date.now(),
        payload
      }]
    }))
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE USER CHANGED NAME
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleUserChangedName (payload) {
    console.log('> USER CHANGED NAME', payload)
    this.setState(current => ({
      ...current,
      events: [...current.events, {
        type: 'USER CHANGED NAME',
        received_on: Date.now(),
        payload
      }]
    }))
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE NEW LONGFORM
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleNewLongform (payload) {
    console.log('> NEW LONGFORM', payload)
    this.setState(current => ({
      ...current,
      longforms: [...current.longforms, payload.longform],
      events: [...current.events, {
        type: 'NEW LONGFORM',
        received_on: Date.now(),
        payload
      }]
    }))
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE YOUR NEW LONGFORM
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleYourNewLongform (payload) {
    console.log('> YOUR NEW LONGFORM', payload)
    this.setState(current => {
      this.$router.history.push(`/edit/${payload.longform._id}`)
      return {
        ...current,
        longforms: [...current.longforms, payload.longform],
        events: [...current.events, {
          type: 'NEW LONGFORM',
          received_on: Date.now(),
          payload
        }]
      }
    })
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE ALL LONGFORMS
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleAllLongforms (payload) {
    console.log('> ALL LONGFORMS', payload)
    const { longforms } = payload
    this.setState(current => ({
      ...current,
      longforms,
      events: [...current.events, {
        type: 'ALL LONGFORMS',
        received_on: Date.now(),
        payload
      }]
    }))
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE LONGFORM
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleLongform (payload) {
    console.log('> LONGFORM', payload)
    const { longform } = payload
    this.setState(current => {
      const indexOfLongform = current.longforms.findIndex(elt => elt._id === longform._id)
      if (indexOfLongform > -1) {
        return {
          ...current,
          longforms: [
            ...current.longforms.slice(0, indexOfLongform),
            longform,
            ...current.longforms.slice(indexOfLongform + 1)
          ],
          events: [...current.events, {
            type: 'LONGFORM',
            received_on: Date.now(),
            payload
          }]
        }
      } else {
        return {
          ...current,
          longforms: [...current.longforms, longform],
          events: [...current.events, {
            type: 'LONGFORM',
            received_on: Date.now()
          }]
        }
      }
    })
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE NEW MESSAGE
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleNewMessage (payload) {
    console.log('> NEW MESSAGE', payload)
    this.setState(current => ({
      ...current,
      events: [...current.events, {
        type: 'NEW MESSAGE',
        received_on: Date.now(),
        payload
      }]
    }))
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE YOU LEFT ROOM
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleYouLeftRoom (payload) {
    console.log('> YOU LEFT ROOM', payload)
    this.setState(current => ({
      ...current,
      events: [...current.events, {
        type: 'YOU LEFT ROOM',
        received_on: Date.now(),
        payload
      }]
    }))
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE YOU JOINED ROOM
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleYouJoinedRoom (payload) {
    console.log('> YOU JOINED ROOM', payload)
    this.setState(current => ({
      ...current,
      room: payload.room,
      events: [...current.events, {
        type: 'YOU JOINED ROOM',
        received_on: Date.now(),
        payload
      }]
    }))
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE YOU CHANGED NAME
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleYouChangedName (payload) {
    console.log('> YOU CHANGED NAME', payload)
    // [WIP] see here what happens with cookies and state
    this.setState(current => ({
      ...current,
      events: [...current.events, {
        type: 'YOU CHANGED NAME',
        received_on: Date.now(),
        payload
      }]
    }))
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE YOUR NEW MESSAGE
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleYourNewMessage (payload) {
    console.log('> YOUR NEW MESSAGE', payload)
    this.setState(current => ({
      ...current,
      events: [...current.events, {
        type: 'YOUR NEW MESSAGE',
        received_on: Date.now(),
        payload
      }]
    }))
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE YOUR FORM EDITION
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleYourFormEdition (payload) {
    console.log('> YOUR FORM EDITION', payload)
    this.setState(current => ({
      ...current,
      events: [...current.events, {
        type: 'YOUR FORM EDITION',
        received_on: Date.now(),
        payload
      }]
    }))
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * HANDLE SERVER ERROR
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleServerError (payload) {
    console.log('> SERVER ERROR', payload)
    this.setState(current => ({
      ...current,
      events: [...current.events, {
        type: 'SERVER ERROR',
        received_on: Date.now(),
        payload
      }]
    }))
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  render () {
    const { state, props, c } = this
    const { longforms, username } = state

    /* Assign classes */
    const classes = [c]

    return <div className={classes.join(' ')}>
      <Router ref={n => this.$router = n}>
        <Switch>
          <Route
            exact
            path='/'
            render={routerStuff => (
            <HomePage
              {...routerStuff}
              longforms={longforms}
              emitCreateNewLongform={this.emitCreateNewLongform}
              emitJoinLobby={() => this.emitJoinRoom('lobby')}
              emitRequestAllLongforms={this.emitRequestAllLongforms} />)} />
          <Route
            exact
            path='/edit/:id'
            render={routerStuff => <EditorPage
              {...routerStuff}
              longform={this.getCurrentLongformViaId(routerStuff.match.params.id)}
              addBlockToLongformViaId={this.addBlockToLongformViaId}
              emitJoinLongformRoom={() => this.emitJoinRoom(routerStuff.match.params.id)}
              emitRequestLongform={() => this.emitRequestLongform(routerStuff.match.params.id)} />
            } />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
        <Megaphone
          username={this.state.username}
          events={this.state.events}
          room={this.state.room}
          sendMessage={this.emitPostMessage}
          triggerChangeUserName={this.triggerChangeUserName} />
      </Router>
    </div>
  }
}

export default App
