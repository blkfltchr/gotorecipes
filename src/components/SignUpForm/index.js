import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withFirebase } from '../Firebase'
import { withRouter } from 'react-router-dom'

/* recompose is used to organize your higher-order component */

import { compose } from 'recompose'

/* Route strings imported */

import * as ROUTES from '../../constants/routes'

const { LANDING } = ROUTES

const INITIAL_STATE = {
  name: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null
}

class SignUpForm extends Component {
  constructor (props) {
    super(props)

    this.state = { ...INITIAL_STATE }
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onSubmit = event => {
    event.preventDefault()

    const {
      name,
      email,
      passwordOne
    } = this.state

    /* Using the Firbase API to enable a user to sign up */

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        /*
        If a user is created with Firebase's Authentication API,
        then the user will be created with Firebase's realtime
        database.
        */

        const userId = authUser.user.uid

        this.props.firebase
          .user(userId)
          .set({
            name,
            email
          })
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE })
        this.props.history.push(LANDING)
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  render () {
    const {
      name,
      email,
      passwordOne,
      passwordTwo,
      error
    } = this.state

    const isInvalid =
      name === '' ||
      email === '' ||
      passwordOne === '' ||
      passwordOne !== passwordTwo

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name='name'
          value={name}
          onChange={this.onChange}
          type='text'
          placeholder='Full Name'
        />
        <input
          name='email'
          value={email}
          onChange={this.onChange}
          type='text'
          placeholder='Email'
        />
        <input
          name='passwordOne'
          value={passwordOne}
          onChange={this.onChange}
          type='password'
          placeholder='Password'
        />
        <input
          name='passwordTwo'
          value={passwordTwo}
          onChange={this.onChange}
          type='password'
          placeholder='Confirm Password'
        />
        <button
          disabled={isInvalid}
          type='submit'>
          Sign Up
        </button>
        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

SignUpForm.propTypes = {
  firebase: PropTypes.shape({
    doCreateUserWithEmailAndPassword: PropTypes.func,
    user: PropTypes.func,
    recipes: PropTypes.func
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  })
}

export default compose(
  withRouter,
  withFirebase)(SignUpForm)