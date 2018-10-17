//Vendors
import React from 'react'
import styled from 'styled-components'
import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router-dom'

//Components

//Images

//Functions

//Store
//import {bindActionCreators} from 'redux'
//import {connect} from 'react-redux'
//import {triggerAction} from './_state/actions'

//Actions

//Reducers

//Dynamic Components
const Bills = Loadable({
  loader: () => import('./Bills/'),
  loading: () => null
})

const Income = Loadable({
  loader: () => import('./Income/'),
  loading: () => null
})
const Expenses = Loadable({
  loader: () => import('./Expenses/'),
  loading: () => null
})
const Budget = Loadable({
  loader: () => import('./Budget/'),
  loading: () => null
})

const Report = Loadable({
  loader: () => import('./Report'),
  loading: () => null
})

class HomeIndex extends React.Component {
  render() {
    return (
      <Wrapper>
        <Switch>
          <Route exact={true} path="/" component={Bills} />
          <Route exact={true} path="/:id/" component={Bills} />
          <Route exact={true} path="/:id/bills" component={Bills} />
          <Route exact={true} path="/:id/bills/addBill" component={Bills} />
          <Route exact={true} path="/:id/bills/report" component={Bills} />
          <Route exact={true} path="/:id/income" component={Income} />
          <Route exact={true} path="/:id/income/addIncome" component={Income} />
          <Route exact={true} path="/:id/income/report" component={Income} />
          <Route exact={true} path="/:id/expenses" component={Expenses} />
          <Route exact={true} path="/:id/expenses/addExpense" component={Expenses} />
          <Route exact={true} path="/:id/expenses/report" component={Expenses} />
          <Route exact={true} path="/:id/budget" component={Budget} />
          <Route exact={true} path="/:id/report" component={Report} />
        </Switch>
      </Wrapper>
    )
  }
}

//Style
const Wrapper = styled.div`
  height: 100%;
`

//export default connect(mapStateToProps, mapDispatchToProps)(HomeIndex)
export default HomeIndex
