//Vendors
import React from 'react'
import styled from 'styled-components'
import firebase from 'firebase'
import { withRouter } from 'react-router'

//Components
import Bills from '../Bills/Report/'
import Income from '../Income/Report/'
import Expense from '../Expenses/Report/'
import TimePicker from '../../../_global/TimePicker2'

//functions
import fetchFirestoreGetAll from '../../../../services/Firebase/functions/getAll.js' //type, propertyId, idname

import { transitionType } from '../../../../services/Transitions/transitions.consts'

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setProperty } from '../../../../services/Redux/Property/actions'
import { setBills } from '../Bills/_state/Bills/actions'
import { setBillPayments } from '../Bills/_state/BillPayments/actions'
import { ToggleBillsLoading } from '../Bills/_state/Loading/actions'
import { setExpenses } from '../Expenses/_state/Expenses/actions'
import { setExpensePayments } from '../Expenses/_state/ExpensePayments/actions'
import { ToggleExpensesLoading } from '../Expenses/_state/Loading/actions'
import { setIncomes } from '../Income/_state/Income/actions'
import { setIncomePayments } from '../Income/_state/IncomePayments/actions'
import { ToggleIncomeLoading } from '../Income/_state/IncomeLoading/actions'

//define actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setProperty,
      setBills,
      setBillPayments,
      ToggleBillsLoading,
      setExpenses,
      setExpensePayments,
      ToggleExpensesLoading,
      setIncomes,
      setIncomePayments,
      ToggleIncomeLoading
    },
    dispatch
  )
}

//Set global state to prop
function mapStateToProps(state) {
  return {
    Property: state.Property,
    Bills: state.Bills,
    BillPayments: state.BillPayments,
    Expenses: state.Expenses,
    ExpensePayments: state.ExpensePayments,
    Income: state.Income,
    IncomePayments: state.IncomePayments
  }
}

class Report extends React.Component {
  //Methods
  async componentWillMount() {
    //if mobile take to bills
    if (window.innerWidth <= 1200) {
      console.log(this.props.Property.id)

      if (this.props.Property.id) {
        this.props.history.push(`/${this.props.Property.id}/bills`)
      } else {
        this.props.history.push(`/`)
      }

      //if desktop load all
    } else {
      let pathname = this.props.location.pathname.split('/'),
        urlProperty = pathname[1]

      //if no peroperty id in state use url
      if (this.props.Property.length === 0) {
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

      //get bills only if state empty
      if (
        this.props.Bills.length === 0 ||
        this.props.BillPayments.length === 0
      ) {
        let bills = await fetchFirestoreGetAll(
            'bills',
            this.props.Property.id,
            'billId'
          ),
          billPayments = await fetchFirestoreGetAll(
            'billPayments',
            this.props.Property.id
          )
        this.props.setBills(bills)
        this.props.setBillPayments(billPayments)
        this.props.ToggleBillsLoading(false)
      }

      //get incomes only if state empty
      if (
        this.props.Income.length === 0 ||
        this.props.IncomePayments.length === 0
      ) {
        let incomes = await fetchFirestoreGetAll(
            'incomes',
            this.props.Property.id,
            'incomeId'
          ),
          incomePayments = await fetchFirestoreGetAll(
            'incomePayments',
            this.props.Property.id,
            'incomePaymentId'
          )
        this.props.setIncomes(incomes)
        this.props.setIncomePayments(incomePayments)
        this.props.ToggleIncomeLoading(false)
      }

      //get expenses only if state empty
      if (
        this.props.Expenses.length === 0 ||
        this.props.ExpensePayments.length === 0
      ) {
        let expenses = await fetchFirestoreGetAll(
            'expenses',
            this.props.Property.id,
            'expenseId'
          ),
          expensePayments = await fetchFirestoreGetAll(
            'expensePayments',
            this.props.Property.id,
            'expensePaymentId'
          )
        this.props.setExpenses(expenses)
        this.props.setExpensePayments(expensePayments)
        this.props.ToggleExpensesLoading(false)
      }
    }
  }

  componentDidMount() {
    //add event listener -  wehn less than 1200px redirect
    window.onresize = () => {
      if (window.innerWidth <= 1200) {
        this.props.history.push(`/`)
      }
    }
  }

  componentWillUnmount() {
    //Remove event listener -  wehn less than 1200px redirect
    window.onresize = null
  }
  render() {
    //Properties

    //Template
    return (
      <Wrapper className={transitionType}>
        <TimepickerCon>
          <TimePicker source="report" />
        </TimepickerCon>
        <Links>
          <Par>Bills</Par>
          <Par>Income</Par>
          <Par>Expenses</Par>
        </Links>
        <Content>
          <div>
            <Bills hideTimePicker={true} />
          </div>

          <div>
            <Income hideTimePicker={true} />
          </div>

          <div>
            <Expense hideTimePicker={true} />
          </div>
        </Content>
      </Wrapper>
    )
  }
}

//Style
const Wrapper = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 60px 30px 1fr;
`

const TimepickerCon = styled.div`
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`

const Links = styled.div`
height: 100%;
width: 100%;
display: grid;
grid-template-columns: 1fr 1fr 1fr;
color: white;
box-sizing: border-box;
margin: 0 auto;
max-width: 1300px;

p {
	background: #1f3a67;
	border-radius: 10px;
	position: relative;
	z-index: -2;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
	grid-template-rows: 280px auto 60px;
	margin-top: 15px;
	font-weight: bold;
	margin: 0;
	font-size: 15px;
	text-align: center;
	height: 27px;
	cursor: pointer;
	box-sizing: border-box;
	letter-spacing: 1px;
	color: white;
	max-width: 400px;
	width: 400px;
	margin: 0 auto;
	line-height: 30px;

@media (min-width: 900px) {
border-bottom: none !important;
cursor: auto !important;
font-size: 16px;
 }
}
 }
 `
const Par = styled.p`
  border-bottom: ${(props) =>
    props.show === true ? '3px var(--colorMain) solid' : 'none'};
`
const Content = styled.div`
  height: auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  color: white;
  box-sizing: border-box;
  margin: 0 auto;
  max-width: 1300px;
`

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Report)
)
