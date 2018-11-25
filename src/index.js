//Vendors
import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom'
import firebase from 'firebase'
import Loadable from 'react-loadable'

//Services
import './services/Firebase/config'
import MuiThemeProvider, { muiTheme } from './services/MaterialUi/config'
import Provider, { Store } from './services/Redux/config'
import registerServiceWorker from './services/ServiceWorker/config'

//Components
import './index.css'

//Dynamic Components
const Main = Loadable({
  loader: () => import('./components/Main/'),
  loading: () => null
})
const Login = Loadable({
  loader: () => import('./components/Login/'),
  loading: () => null
})

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: {
                from: props.location
              }
            }}
          />
        )
      }
    />
  )
}

function PublicRoute({ component: Component, authed, ...rest }) {
  return <Route {...rest} render={(props) => (authed === false ? <Component {...props} /> : <Redirect to="/" />)} />
}

class App extends React.Component {
  state = {
    authed: false,
    loading: true
  }
  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      // console.log(user);
      if (user) {
        this.setState({ authed: true, loading: false })
      } else {
        this.setState({ authed: false, loading: false })
      }
    })
  }

  //Methods
  render() {
    //Properties

    //Template
    return this.state.loading === true ? (
      <React.Fragment />
    ) : (
      <BrowserRouter>
        <Switch>
          <PublicRoute authed={this.state.authed} path="/login" component={Login} />
          <PublicRoute authed={this.state.authed} path="/register" component={Login} />
          <PrivateRoute authed={this.state.authed} exact={true} path="/" component={Main} />
          <PrivateRoute authed={this.state.authed} exact={true} path="/:id/" component={Main} />
          <PrivateRoute authed={this.state.authed} exact={true} path="/:id/bills" component={Main} />
          <PrivateRoute authed={this.state.authed} exact={true} path="/:id/bills/report" component={Main} />
          <PrivateRoute authed={this.state.authed} exact={true} path="/:id/income" component={Main} />
          <PrivateRoute authed={this.state.authed} exact={true} path="/:id/income/report" component={Main} />
          <PrivateRoute authed={this.state.authed} exact={true} path="/:id/expenses" component={Main} />
          <PrivateRoute authed={this.state.authed} exact={true} path="/:id/expenses/report" component={Main} />
          <PrivateRoute authed={this.state.authed} exact={true} path="/:id/budget" component={Main} />
          <PrivateRoute authed={this.state.authed} exact={true} path="/:id/report" component={Main} />
          <Route render={() => <h3>No Match 404</h3>} />
        </Switch>
      </BrowserRouter>
    )
  }
}

//Style
const LoadingCon = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 80px;
  height: 80px;
`

ReactDOM.render(
  <Provider store={Store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
