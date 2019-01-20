//Vendors
import React from 'react'
import styled from 'styled-components'
import firebase from 'firebase'
//Components

//Images
import LoginBGDesktop from '../../images/backgrounds/login-desktop.png'
import Logo from '../../images/icons/logo.svg'

class Login extends React.Component {
  //initial state
  constructor(props) {
    super(props)
    this.state = {
      type: this.props.location.pathname,
      email: '',
      password: '',
      submitText: '',
      questionText: '',
      enable: false,
      error: false,
      errorMessage: ''
    }
  }

  //Methods
  componentWillMount = () => {
    window.onkeydown = (e) => {
      if (e.key === 'Enter') {
        this.submitForm()
      }
      if (e.key === 'BrowserBack') {
        if (this.props.location.pathname === '/login') {
          this.setState({ type: '/register', submitText: 'LOGIN', questionText: 'Register?' })
        } else if (this.props.location.pathname === '/register') {
          this.setState({ type: '/login', submitText: 'REGISTER', questionText: 'Log In?' })
        }
      } else if (e.key === 'BrowserForward') {
        if (this.props.location.pathname === '/login') {
          this.setState({ type: '/register', submitText: 'LOGIN', questionText: 'Register?' })
        } else if (this.props.location.pathname === '/register') {
          this.setState({ type: '/login', submitText: 'REGISTER', questionText: 'Log In?' })
        }
      }
    }
    if (this.props.location.pathname === '/login') {
      this.setState({ submitText: 'LOGIN', questionText: 'Register?' })
    } else if (this.props.location.pathname === '/register') {
      this.setState({ submitText: 'REGISTER', questionText: 'Log In?' })
    }
  }
  // componentWillUnmount = () => {
  //   window.removeEventListener("keydown", false)
  // }

  handleEmail = (e) => {
    this.setState({ email: e.target.value })
  }

  handlePassword = (e) => {
    this.setState({ password: e.target.value })
  }
  navigate = () => {
    if (this.state.type === '/login') {
      this.props.history.push('register')
      this.setState({ type: '/register', submitText: 'REGISTER', questionText: 'Log in?' })
    } else if (this.state.type === '/register') {
      this.props.history.push('login')
      this.setState({ type: '/login', submitText: 'LOGIN', questionText: 'Register?' })
    }
  }

  submitForm = () => {
    if (this.state.email && this.state.password !== '') {
      this.setState({ submitText: 'Loading.' })

      //Login
      if (this.state.type === '/login') {
        firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          .then(() => {
            firebase
              .auth()
              .signInWithEmailAndPassword(this.state.email, this.state.password)
              .then(() => {
                this.props.history.push('/')
              })
              .catch((error) => {
                this.setState({ error: true, errorMessage: error.message, submitText: 'Try Again' })
              })
          })
      } else if (this.state.type === '/register') {
        //Register
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then(() => {
            this.props.history.push('/')
          })
          .catch((error) => {
            this.setState({ error: true, errorMessage: error.message, submitText: 'Try Again' })
          })
      }
    }
  }
  render() {
    //Properties
    //Template
    return (
      <Wrapper>
        <Overlay />

        <Content>
          <LogoIMG src={Logo} alt="logo" />
          <Title>iLandlord</Title>
          <ErrorMessage error={this.state.error}>{this.state.errorMessage}</ErrorMessage>
          <Input type="email" placeholder="email" value={this.state.email} onChange={this.handleEmail} />
          <Input type="password" placeholder="password" value={this.state.password} onChange={this.handlePassword} />
          <SubmitButton
            type="button"
            enable={{
              email: this.state.email,
              password: this.state.password
            }}
            onClick={this.submitForm}
          >
            {this.state.submitText}
          </SubmitButton>
          <Footer onClick={this.navigate}>{this.state.questionText}</Footer>
        </Content>
      </Wrapper>
    )
  }
}

//Style
const Wrapper = styled.div`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;

  @media (max-height: 400px) {
    position: inherit;
  }

  @media (min-width: 600px) {
    height: 100vh;
    background-image: url(${LoginBGDesktop});
    background-size: cover;
    background-repeat: no-repeat;
    position: fixed;
    top: 0;
    left: 0;
  }
`

const Overlay = styled.div`
  height: 100%;
  width: 100%;
  background-color: rgba(18, 55, 84, 1);
  position: fixed;
  z-index: 1;
  @media (min-width: 600px) {
    display: none;
  }
`

const Content = styled.form`
  position: relative;
  z-index: 2;
  padding: 50px;
  box-sizing: border-box;

  @media (max-height: 400px) {
    padding-top: 20px;
  }

  @media (min-width: 600px) {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
    background: white;
    position: fixed;
    max-width: 400px;
    height: 520px;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border-radius: 8px;
  }
`
const LogoIMG = styled.img`
  width: 80px;
  display: block;
  margin: 0 auto;
`
const Title = styled.h2`
  text-align: center;
  color: white;
  margin-bottom: 20px;
  @media (min-width: 600px) {
    margin-bottom: 60px;
    color: var(--colorBg);
  }
`
const ErrorMessage = styled.p`
  color: rgba(255, 82, 82, 1);
  text-align: center;
  font-weight: bold;
  display: ${(props) => (props.error ? 'block' : 'none')};
`
const Input = styled.input`
  font-size: 16px;
  padding: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 200px;
  display: block;
  margin: 0 auto;
  outline: none;
  border: none;
  margin-bottom: 20px;
  border-radius: 50px;

  &:focus {
    outline: none;
  }
  @media (min-width: 600px) {
    border: 1px solid lightgrey;
  }
`

const SubmitButton = styled.button`
  font-size: 16px;
  letter-spacing: 0px;
  user-select: none;
  padding-left: 16px;
  padding-right: 16px;
  color: rgb(255, 255, 255);
  outline: none;
  border: none;
  width: 88px;
  height: 46px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  font-weight: bold;
  display: block;
  margin: 0 auto;
  margin-bottom: 30px;
  box-sizing: border-box;
  border-radius: 50px;
  width: auto;
  background: ${(props) => (props.enable.email !== '' ? 'var(--colorMain)' : 'var(--colorDisabled) !important')};

  background: ${(props) => (props.enable.password !== '' ? 'var(--colorMain)' : 'var(--colorDisabled)')};
`
const Footer = styled.p`
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  font-size: 16px;
  text-decoration: underline;
  color: white;
  @media (min-width: 600px) {
    color: var(--colorBg);
  }
`
export default Login
