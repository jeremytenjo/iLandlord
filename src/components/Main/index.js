//Vendors
import React from 'react'
import styled from 'styled-components'
import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router-dom'
import { TweenMax } from 'gsap'

//Components
import Topbar from './_topBar'
import DialogHistory from './_DialogHistory'
import Snackbar from './_snackbar'
import Comment from './_comment'
import CommentView from './_commentView'
import LoadingScreen from './_loadingScreen'
import BottomNav from './_BottomNav/'
import DialogAlert from './_DialogAlert'

//Dynamic Components
const Home = Loadable({
  loader: () => import('./Home'),
  loading: () => null
})

class Main extends React.Component {
  //Methods
  componentWillMount() {
    //if user is offline show snackbar
    window.onoffline = () => {
      let snackbar = document.querySelector('#snackbar')
      snackbar.childNodes[0].innerHTML = 'You are Offline'
      TweenMax.to(snackbar, 0.2, {
        // delay: .5,
        bottom: '70px'
      })
      TweenMax.to(snackbar, 0.2, { delay: 2, bottom: '-50px' })
    }
  }
  componentDidMount() {
    //show add to homescren dialog
    window.addEventListener('beforeinstallprompt', function(e) {
      e.userChoice.then(function(choiceResult) {
        // console.log(choiceResult.outcome)
      })
    })
  }
  render() {
    //Properties
    //Template
    return (
      <Wrapper>
        <Header>
          <Topbar />
        </Header>
        <Content id="content">
          <Switch>
            <Route exact={true} path="/" component={Home} />
            <Route exact={true} path="/:id/" component={Home} />
            <Route exact={true} path="/:id/bills" component={Home} />
            <Route exact={true} path="/:id/bills/addBill" component={Home} />
            <Route exact={true} path="/:id/bills/report" component={Home} />
            <Route exact={true} path="/:id/income" component={Home} />
            <Route exact={true} path="/:id/income/addIncome" component={Home} />
            <Route exact={true} path="/:id/income/report" component={Home} />
            <Route exact={true} path="/:id/expenses" component={Home} />
            <Route exact={true} path="/:id/expenses/addExpense" component={Home} />
            <Route exact={true} path="/:id/expenses/report" component={Home} />
            <Route exact={true} path="/:id/budget" component={Home} />
            <Route exact={true} path="/:id/report" component={Home} />
            <Route path="/error" render={() => <h3>No Match 404</h3>} />
          </Switch>
        </Content>

        <BottomNav />

        <LoadingScreen />
        <DialogHistory />
        <Snackbar />
        <Comment />
        <CommentView />
        <DialogAlert />
      </Wrapper>
    )
  }
}

//Style
const Wrapper = styled.div`
  background-repeat: no-repeat;
  background-image: linear-gradient(to top, #1e3c72 0%, #1e3c72 1%, #2a5298 100%);
  background-size: 100%;
  background-position: center;
  background-attachment: fixed;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: grid;
  height: 100%;
  grid-template-rows: 50px 1fr 50px;
`
const Header = styled.div`
  height: 50px;
`
const Content = styled.div`
  padding: 10px;
  padding-top: 0;
  padding-bottom: 0;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
`

export default Main
