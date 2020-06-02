import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom'
import SocketIoClient from 'socket.io-client'
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
      events: [],
      username: null
    }
    
    this.getUsernameCookie = this.getUsernameCookie.bind(this)
    this.upgradeChangesToNewLongformEdition = this.upgradeChangesToNewLongformEdition.bind(this)
    this.triggerChangeUserName = this.triggerChangeUserName.bind(this)
    this.emitJoinRoom = this.emitJoinRoom.bind(this)
    this.emitChangeUsername = this.emitChangeUsername.bind(this)
    this.emitRequestAllLongforms = this.emitRequestAllLongforms.bind(this)
    this.emitRequestLongform = this.emitRequestLongform.bind(this)
    this.emitPostMessage = this.emitPostMessage.bind(this)
    this.emitPostLongformEdition = this.emitPostLongformEdition.bind(this)
    this.handleAllLongforms = this.handleAllLongforms.bind(this)
    this.handleLongform = this.handleLongform.bind(this)
    this.handleUserJoinedRoom = this.handleUserJoinedRoom.bind(this)
    this.handleUserLeftRoom = this.handleUserLeftRoom.bind(this)
    this.handleUserChangedName = this.handleUserChangedName.bind(this)
    this.handleNewMessage = this.handleNewMessage.bind(this)
    this.handleYouLeftRoom = this.handleYouLeftRoom.bind(this)
    this.handleYouJoinedRoom = this.handleYouJoinedRoom.bind(this)
    this.handleYouChangedName = this.handleYouChangedName.bind(this)
    this.handleYourNewMessage = this.handleYourNewMessage.bind(this)
    this.handleYourFormEdition = this.handleYourFormEdition.bind(this)
    
    this.socket = new SocketIoClient()
    this.socket.on('USER JOINED ROOM', this.handleUserJoinedRoom)
    this.socket.on('USER LEFT ROOM', this.handleUserLeftRoom)
    this.socket.on('USER CHANGED NAME', this.handleUserChangedName)
    this.socket.on('NEW MESSAGE', this.handleNewMessage)

    this.socket.on('ALL LONGFORMS', this.handleAllLongforms)
    this.socket.on('LONGFORM', this.handleLongform)
    this.socket.on('YOU LEFT ROOM', this.handleYouLeftRoom)
    this.socket.on('YOU JOINED ROOM', this.handleYouJoinedRoom)
    this.socket.on('YOU CHANGED NAME', this.handleYouChangedName)
    this.socket.on('YOUR NEW MESSAGE', this.handleYourNewMessage)
    this.socket.on('YOUR FORM EDITION', this.handleYourFormEdition)
  }

  componentDidMount () {
    const username = this.getUsernameCookie() || this.triggerChangeUserName()
    this.setState({ username })
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
   * UPGRADE CHANGES TO NEW LONGFORM EDITION
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  upgradeChangesToNewLongformEdition (longform) {
    return longform
  }

  /* * * * * * * * * * * * * * * * * * * * * * *
   *
   * UPGRADE CHANGES TO NEW LONGFORM EDITION
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
   * HANDLE ALL LONGFORMS
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  handleAllLongforms (payload) {
    console.log('> ALL LONGFORMS', payload)
    const { longforms } = payload
    const newLongforms = longforms.map(longform => this.upgradeChangesToNewLongformEdition(longform))
    this.setState(current => ({
      ...current,
      longforms: newLongforms,
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
   * RENDER
   *
   * * * * * * * * * * * * * * * * * * * * * * */
  render () {
    const { state, props, c } = this
    const { longforms, username } = state

    /* Assign classes */
    const classes = [c]

    return <div className={classes.join(' ')}>
      <Router>
        <Switch>
          <Route path='/' exact render={routerStuff => (
            <HomePage
              {...routerStuff}
              longforms={longforms}
              emitJoinLobby={() => this.emitJoinRoom('home')}
              emitRequestAllLongforms={this.emitRequestAllLongforms} />)} />
          <Route path='/edit/:id' exact render={routerStuff => (
            <EditorPage
              {...routerStuff}
              longform={longforms.find(longform => longform._id === routerStuff.match.params.id)}
              emitJoinLongformRoom={() => this.emitJoinRoom(routerStuff.match.params.id)}
              emitRequestLongform={() => this.emitRequestLongform(routerStuff.match.params.id)} />)} />
          <Route
            render={() => <Redirect to="/" />} />
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
