//Vendors
import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router'
import firebase from 'firebase'

//Components
import Timepicker from '../../../_global/TimePickerNew'
import Banner from './Banner'
import ExpenseItem from './ExpenseItem'

//Images

//Functions
import fetchFirestoreGetAll from '../../../../services/Firebase/functions/getAll.js' //type, propertyId, idname

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setProperty } from '../../../../services/Redux/Property/actions'
import { setExpenses } from '../Expenses/_state/Expenses/actions'
import { setExpensePayments } from '../Expenses/_state/ExpensePayments/actions'

//Actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setProperty,
      setExpenses,
      setExpensePayments
    },
    dispatch
  )
}
//Reducers
function mapStateToProps(state) {
  return {
    Bills: state.Bills,
    BillPayments: state.BillPayments,
    Expenses: state.Expenses,
    ExpensePayments: state.ExpensePayments,
    Income: state.Income,
    IncomePayments: state.IncomePayments,
    Property: state.Property
  }
}
//Dynamic Components

class Budget extends React.Component {
  //initial state
  constructor(props) {
    super(props)
    this.state = {
      ...props,
      filterMonth: '',
      filterYear: '',
      expenseList: '',
      loading: true,
      bannerTotal: 0,
      limitTotal: 0,
      budget: false
    }
  }

  //Methods
  async componentWillMount() {
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

    let d = new Date(),
      months = [
        'All',
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      // month = d.getMonth(),
      currentYear = d.getFullYear(),
      currentMonth = d.getMonth() + 1

    this.setState({ filterMonth: months[currentMonth], filterYear: currentYear })
  }
  async componentDidMount() {
    //if there are expense in store
    if (this.props.Expenses.length !== 0) {
      this.fetchExpenses(this.state.filterMonth, this.state.filterYear)
    } else {
      //if there are no expense in store
      let pathname = this.props.location.pathname.split('/'),
        urlProperty = pathname[1],
        expenses = await fetchFirestoreGetAll('expenses', urlProperty, 'expenseId'),
        expensePayments = await fetchFirestoreGetAll('expensePayments', urlProperty, 'expensePaymentId')

      this.props.setExpenses(expenses)
      this.props.setExpensePayments(expensePayments)

      this.fetchExpenses(this.state.filterMonth, this.state.filterYear)
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.filterMonth !== this.state.filterMonth || nextState.filterYear !== this.state.filterYear) {
      this.setState({ filterMonth: nextState.filterMonth, filterYear: nextState.filterYear })

      this.fetchExpenses(nextState.filterMonth, nextState.filterYear)
    }
  }

  fetchExpenses = async (month, year) => {
    //get expenses
    let bannerTotal = 0,
      expenseList = [],
      limitTotal = 0

    this.props.Expenses.map((expense) => {
      // console.log(expense.limit)
      //add all transactions from current date
      let data = {},
        payments,
        remaining,
        total = 0

      data.title = expense.category
      data.type = expense.type
      data.id = expense.expenseId

      // get expense payments
      payments = this.props.ExpensePayments.filter((payment) => expense.expenseId === payment.expenseId)
      // console.log(payments)

      //filter payments from current month
      payments = payments.filter((payment) => payment.month === month)
      // console.log(payments)

      //filter payments from current year
      payments = payments.filter((payment) => payment.year === year)
      // console.log(payments)

      //add pay limit
      data.limit = expense.limit
      if (expense.limit === '' || isNaN(data.limit) || data.limit === '' || typeof data.limit === 'undefined') {
        data.limit = 0
      }
      data.limit = parseInt(data.limit, 10)

      //add limits
      limitTotal = limitTotal + data.limit

      //add all payments
      payments.forEach((payment) => {
        total = total + parseInt(payment.amount, 10)
      })

      data.total = total
      //add total for banner
      // console.log(total)
      bannerTotal = bannerTotal + total
      // console.log(bannerTotal)
      // console.log(data)

      // create iteam tag
      //only if lmit is set
      if (data.limit !== 0) {
        remaining = data.limit - data.total
        expenseList.push(
          <ExpenseItem key={data.id} title={data.title} goal={data.limit} spent={data.total} remaining={remaining} />
        )
      }
      // console.log(bannerTotal)
      // console.log(limitTotal)
      if (limitTotal !== 0) {
        return this.setState({ expenseList, bannerTotal, limitTotal, budget: true })
      } else {
        return this.setState({ expenseList, bannerTotal: 0, limitTotal: 0, budget: false })
      }
    })
  }

  toHome = () => this.props.history.push('/' + this.props.Property.id + '/expenses')

  render() {
    //Properties
    // console.log(this.state.limitTotal)
    //Template
    return (
      <Wrapper>
        <TimepickerCon>
          <Timepicker
            setDate={(date) => this.setState({ filterMonth: date.month, filterYear: date.year })}
            setMonth={(month) => this.setState({ filterMonth: month })}
            setYear={(year) => this.setState({ filterYear: year })}
          />
        </TimepickerCon>

        <Banner total={this.state.bannerTotal} limitTotal={this.state.limitTotal} budget={this.state.budget} />

        <ListCon>{this.state.expenseList}</ListCon>
      </Wrapper>
    )
  }
}

//Style
const Wrapper = styled.div`
	height: 100%;
	width: 100%;
	top 0;
	right: 0;
	bottom: 0;
	left: 0;
	margin: auto;
	box-sizing: border-box;
	display: grid;
	grid-template-rows:  40px auto 1fr;
`

const TimepickerCon = styled.div`
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  @media (min-width: 600px) {
    margin-left: 0;
  }
`
const ListCon = styled.div`
  overflow-x: hidden;
  overflow-y: scroll;
  @media (min-width: 600px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, 290px);
    grid-template-rows: repeat(auto-fill, 82px);
  }
`
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Budget))
