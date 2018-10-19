//Vendors
import React from 'react'
import { withRouter } from 'react-router'
import firebase from 'firebase'
import styled from 'styled-components'
import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router-dom'

//Components
import NavBar from './_NavBar'
//Images

//functions
import fetchFirestoreGetAll from '../../../../services/Firebase/functions/getAll.js' //type, propertyId, idname

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setExpenses } from './_state/Expenses/actions'
import { setExpensePayments } from './_state/ExpensePayments/actions'
import { ToggleExpensesLoading } from './_state/Loading/actions'
import { setProperties } from '../../../../services/Redux/Properties/actions'
import { setProperty } from '../../../../services/Redux/Property/actions'

//define actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setExpenses,
      setExpensePayments,
      setProperties,
      setProperty,
      ToggleExpensesLoading
    },
    dispatch
  )
}

//Set global state to prop
function mapStateToProps(state) {
  return {
    Expenses: state.Expenses,
    ExpensePayments: state.ExpensePayments,
    Property: state.Property,
    Properties: state.Properties
  }
}

//Dynamic Components
const List = Loadable({
  loader: () => import('./List'),
  loading: () => null
})
const Report = Loadable({
  loader: () => import('./Report'),
  loading: () => null
})

class Expenses extends React.Component {
  //initial state
  constructor(props) {
    super(props)
    this.state = {
      ExpensesList: '',
      propertyId: ''
    }
  }

  //Methods

  componentDidMount = async () => {
    //Get Data
    //check onloine ony if no data locally
    if (this.props.Expenses.length === 0) {
      let Expenses,
        ExpensePayments,
        pathname = this.props.location.pathname.split('/'),
        urlProperty = pathname[1]

      if (urlProperty === '') {
        let propertiesData = await firebase
          .firestore()
          .collection('properties')
          .where('userId', '==', firebase.auth().currentUser.uid)
          .orderBy('addedDate')
          .limit(1)
          .get()

        let propertyId = propertiesData.docs[0].id,
          fetchedProperty = propertiesData.docs[0].data()

        //set property data
        let propertyData = fetchedProperty
        propertyData.id = propertyId
        this.props.setProperty(propertyData)

        //set property id
        urlProperty = propertyId
      } else {
        var docRef = await firebase
          .firestore()
          .collection('properties')
          .doc(urlProperty)
          .get()

        //set property data
        let propertyData = docRef.data()
        propertyData.id = urlProperty
        this.props.setProperty(propertyData)
      }

      Expenses = await fetchFirestoreGetAll('expenses', urlProperty, 'expenseId')
      ExpensePayments = await fetchFirestoreGetAll('expensePayments', urlProperty, 'expensePaymentId')

      // console.log(ExpensePayments);
      // console.log(Expenses);

      this.props.setExpenses(Expenses)
      this.props.setExpensePayments(ExpensePayments)
      this.props.ToggleExpensesLoading(false)
    } else {
      this.props.ToggleExpensesLoading(false)
    }
  }

  render() {
    //Properties

    //Template
    return (
      <Wrapper>
        <NavBar />
        <Content>
          <Switch>
            <Route exact={true} path="/" component={List} />
            <Route exact={true} path="/:id/" component={List} />
            <Route exact={true} path="/:id/expenses" component={List} />
            <Route exact={true} path="/:id/expenses/report" component={Report} />
          </Switch>
        </Content>
      </Wrapper>
    )
  }
}

//Style
const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
`
const Content = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
`
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Expenses)
)
