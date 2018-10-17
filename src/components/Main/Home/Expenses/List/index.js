//Vendors
import React from 'react'
import styled from 'styled-components'
import Hammer from 'react-hammerjs'
import { withRouter } from 'react-router'
import firebase from 'firebase'

//Components
import ItemExpense from './itemExpense'
import Skeleton from '../../../../_global/Skeletons.js'
import Form from '../_Form/'

//Images

//functions
import fetchFirestoreGetAll from '../../../../../services/Firebase/functions/getAll.js' //type, propertyId, idname

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setExpenses } from '../_state/Expenses/actions'
import { setExpensePayments } from '../_state/ExpensePayments/actions'
import { setLocation } from '../../../../../services/Redux/Location/actions'
import { setProperties } from '../../../../../services/Redux/Properties/actions'
import { setProperty } from '../../../../../services/Redux/Property/actions'

//define actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setLocation,
      setExpenses,
      setExpensePayments,
      setProperties,
      setProperty
    },
    dispatch
  )
}
//Set global state to prop
function mapStateToProps(state) {
  return {
    Location: state.Location,
    Property: state.Property,
    Expenses: state.Expenses,
    ExpensePayments: state.ExpensePayments,
    Loading: state.Loading
  }
}

class Expenses extends React.Component {
  //initial state
  constructor(props) {
    super(props)
    this.state = {
      skeletons: '',
      loading: true,
      billsList: '',
      propertyId: '',
      formOpen: false,
      incomeData: '',
      type: ''
    }
  }

  //Methods
  componentWillMount() {
    let skeletons = []

    for (var i = 0; i < 6; i++) {
      skeletons.push(
        <Con loading={this.state.loading} key={Math.random()}>
          <Skeleton amount={4} />
        </Con>
      )
    }

    this.setState({ skeletons })
  }
  componentDidMount = async () => {
    let path = this.props.location.pathname.split('/')
    this.props.setLocation(`/${path[2]}`)
    if (document.querySelector('#content')) {
      document.querySelector('#content').scrollTop = 0
    }

    //Get Data
    //check onloine ony if no data locally

    if (this.props.Expenses.length === 0) {
      let expenses,
        expensePayments,
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

      expenses = await fetchFirestoreGetAll('expenses', urlProperty, 'expenseId')
      expensePayments = await fetchFirestoreGetAll('expensePayments', urlProperty, 'expensePaymentId')

      this.props.setExpenses(expenses)
      this.props.setExpensePayments(expensePayments)

      let currentDate = new Date(),
        expensesList = expenses.map((expense, index) => (
          <ItemExpense
            key={Math.random()}
            {...expense}
            date={currentDate}
            handleForm={(data) => this.setState({ formOpen: data.open, incomeData: data })}
          />
        ))

      this.setState({ loading: false, expensesList, propertyId: urlProperty })
    } else {
      //get data locally
      let currentDate = new Date(),
        expensesList = this.props.Expenses.map((expense, index) => (
          <ItemExpense
            key={Math.random()}
            {...expense}
            date={currentDate}
            handleForm={(data) => this.setState({ formOpen: data.open, incomeData: data })}
          />
        ))

      this.setState({ loading: false, expensesList })
    }
  }

  componentWillUpdate(nextProps, nextState) {
    //update only when store has been updated
    if (nextProps.Expenses !== this.props.Expenses) {
      let currentDate = new Date(),
        expensesList = nextProps.Expenses.map((expense, index) => (
          <ItemExpense
            key={Math.random()}
            {...expense}
            date={currentDate}
            handleForm={(data) => this.setState({ formOpen: data.open, incomeData: data })}
          />
        ))

      this.setState({ loading: false, expensesList })
    }
  }

  toIncome = () => {
    this.props.history.push(`/${this.props.Property.id}/income`)
    this.props.setLocation('/income')
  }

  render() {
    //Properties

    //Template
    return this.state.loading === true ? (
      <Hammer onSwipe={this.toIncome} direction="DIRECTION_RIGHT">
        <div
          style={{
            height: 'calc(100vh - 107px)'
          }}
        >
          <Wrapper Location={this.props.Location}>{this.state.skeletons}</Wrapper>
        </div>
      </Hammer>
    ) : (
      <Hammer onSwipe={this.toIncome} direction="DIRECTION_RIGHT">
        <div
          style={{
            height: 'calc(100vh - 107px)'
          }}
        >
          <Wrapper Location={this.props.Location}>{this.state.expensesList}</Wrapper>
          <Form
            dest="Update"
            title="Update Expense"
            open={this.state.formOpen}
            expenseId={this.state.incomeData.expenseId}
            category={this.state.incomeData.category}
            limit={this.state.incomeData.limit}
            handleFormOpen={(value) => this.setState({ formOpen: value })}
          />
        </div>
      </Hammer>
    )
  }
}

//Style
const Wrapper = styled.div`
  display: grid;
  grid-gap: 10px;
  margin-top: 10px;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: 1100px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`
const Con = styled.div`
  display: ${(props) => (props.loading === true ? 'block' : 'none')};
`
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Expenses))
