//Vendors
import React from 'react'
import styled, { keyframes } from 'styled-components'
import DatePicker from 'material-ui/DatePicker'
import { TweenMax } from 'gsap'
import firebase from 'firebase'
import { withRouter } from 'react-router'

//Components
import LinearProgress from 'material-ui/LinearProgress'

//Images
import IconHistory from '../../../../../images/icons/history.svg'
import IconDollar from '../../../../../images/icons/dollar.svg'
import IconAddFile from '../../../../../images/icons/addFile.svg'
import IconComment from '../../../../../images/icons/commentAdd.svg'
import IconEdit from '../../../../../images/icons/edit.svg'

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { insertExpensePayment } from '../_state/ExpensePayments/actions'
import { setDialogHistory } from '../../../../../services/Redux/Dialogues/actions'
import { showSnackbar } from '../../../../../services/Redux/Snackbar/actions'
import {
  showLoadingScreen,
  hideLoadingScreen
} from '../../../../../services/Redux/LoadingScreen/actions'
import { setComment } from '../../../../../services/Redux/Comment/actions'

//define actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setDialogHistory,
      showSnackbar,
      insertExpensePayment,
      setComment,
      showLoadingScreen,
      hideLoadingScreen
    },
    dispatch
  )
}
//Set global state to prop
function mapStateToProps(state) {
  return {
    ExpensePayments: state.ExpensePayments,
    Property: state.Property,
    Comment: state.Comment
  }
}
class ItemExpense extends React.Component {
  //initial state
  constructor(props) {
    super(props)

    this.state = {
      expenseId: props.expenseId,
      category: props.category,
      limit: props.limit || '',
      valueDate: props.date,
      newAmount: '',
      FileinputID: '',
      barCompleted: 0,
      barColor: '',
      totalSpent: 0,
      remaining: 0,
      inputPayee: ''
    }
  }

  //Methods
  componentWillUpdate(nextProps, nextState) {
    //update if expense added
    if (this.state.newAmount !== nextState.newAmount) {
      this.getData()
    }

    //update if expense removed
    if (
      this.props.ExpensePayments.length !== nextProps.ExpensePayments.length
    ) {
      this.getData()
    }
  }
  componentWillMount = () => {
    document.onkeydown = null
    this.getData()
  }

  getData = () => {
    //add payments of current month
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
      currentYear = d.getFullYear(),
      month = d.getMonth() + 1,
      currentMonth = months[month],
      data = {},
      payments,
      totalSpent = 0,
      remaining = 0,
      barColor = '#00c853'

    // get expense payments
    payments = this.props.ExpensePayments.filter(
      (payment) => this.state.expenseId === payment.expenseId
    )
    // console.log(payments)

    //filter payments from current month
    payments = payments.filter((payment) => payment.month === currentMonth)
    // console.log(payments)

    //filter payments from current year
    payments = payments.filter((payment) => payment.year === currentYear)
    // console.log(payments)

    //add pay limit
    data.limit = this.state.limit
    if (
      this.state.limit === '' ||
      isNaN(data.limit) ||
      data.limit === '' ||
      typeof data.limit === 'undefined'
    ) {
      data.limit = 0
    }
    data.limit = parseInt(data.limit, 10)

    //add all payments
    payments.forEach((payment) => {
      totalSpent = totalSpent + parseInt(payment.amount, 10)
    })

    //calculate progress bar
    let barCompleted = totalSpent * 100

    barCompleted = barCompleted / this.state.limit
    barCompleted = Math.floor(barCompleted)

    remaining = this.state.limit - totalSpent
    if (remaining <= 0) {
      remaining = 0
    }
    remaining = this.state.limit - totalSpent
    if (remaining <= 0) {
      remaining = 0
    }
    if (remaining <= 10) {
      barColor = '#EF6C00'
    }

    if (totalSpent > this.state.limit) {
      barColor = '#ff5252'
    }

    if (isNaN(barCompleted) === true) {
      barCompleted = 0
    }

    // console.log(barCompleted)
    this.setState({
      FileinputID: 'file' + Math.floor(Math.random() * 500 + 1),
      barCompleted,
      totalSpent,
      barColor,
      remaining
    })
  }
  submitPayment = (e) => {
    if (this.state.newAmount !== '') {
      this.props.showLoadingScreen('Adding expense payment...')

      let data = {},
        d = new Date(this.state.valueDate),
        month = d.getMonth(),
        months = [
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
        year = d.getFullYear(),
        day = d.getDate(),
        fileId = document.querySelector('#' + this.state.FileinputID),
        fileUrl = ''

      //upload  with file
      if (fileId.files.length !== 0) {
        let storageRef = firebase.storage().ref(),
          fileID = (((1 + Math.random()) * 0x10000) | 0)
            .toString(16)
            .substring(1),
          fileRef = storageRef.child('files/expenses/' + fileID),
          file = fileId.files[0]

        fileRef.put(file).then((snapshot) => {
          fileUrl = snapshot.downloadURL

          data.rand = Math.random()
          data.fileUrl = fileUrl
          data.fileID = fileID
          data.propertyId = this.props.Property.id
          data.expenseId = this.state.expenseId
          data.amount = this.state.newAmount
          data.timestamp = this.state.valueDate
          data.payee = this.state.inputPayee
          data.month = months[month]
          data.year = year
          data.date = data.month + ' ' + day
          data.comment = this.props.Comment

          //reset comment
          this.props.setComment('')

          //save online
          return firebase
            .firestore()
            .collection('expensePayments')
            .add(data)
            .then((value) => {
              data.expensePaymentId = value.id
              // console.log(data);
              //save store
              this.props.insertExpensePayment(data)

              this.props.hideLoadingScreen()
              this.props.showSnackbar('Payment Added')
              this.setState({ newAmount: '', inputPayee: '' })
            })
        })

        //upload  without file
      } else {
        data.rand = Math.random()
        data.fileUrl = fileUrl
        data.propertyId = this.props.Property.id
        data.expenseId = this.state.expenseId
        data.amount = this.state.newAmount
        data.timestamp = this.state.valueDate
        data.payee = this.state.inputPayee
        data.month = months[month]
        data.year = year
        data.date = data.month + ' ' + day
        data.comment = this.props.Comment

        //reset comment
        this.props.setComment('')

        //save online
        return firebase
          .firestore()
          .collection('expensePayments')
          .add(data)
          .then((value) => {
            data.expensePaymentId = value.id
            // console.log(data);
            //save store
            this.props.insertExpensePayment(data)

            this.props.hideLoadingScreen()
            this.props.showSnackbar('Payment Added')
            this.setState({ newAmount: '', inputPayee: '' })
          })
      }
    } else {
      this.props.showSnackbar('Please input amount first')
      let amountInput = e.target.parentNode.childNodes[1]
      amountInput.focus()

      let container = e.target.parentNode.parentNode
      container.scrollIntoView()
    }
  }

  showHistory = () => {
    let dialog = document.querySelector('#DialogHistory'),
      data = {
        expenseId: this.state.expenseId,
        type: 'expensePayment',
        category: this.state.category,
        rand: Math.random()
      }

    //set dialoge data
    this.props.setDialogHistory(data)

    //show history dialog
    TweenMax.to(dialog, 0.2, { top: 0 })

    //push into history for back button support to close
    this.props.history.push(`/${this.props.Property.id}/expenses`)

    window.onkeydown = (e) => {
      if (e.key === 'BrowserBack') {
        TweenMax.to(dialog, 0.2, { top: '100%' })
      }
    }
  }

  handleDateInput = (event, date) => {
    this.setState({ valueDate: date })
  }

  handleAmountInput = (event) => {
    this.setState({ newAmount: event.target.value })
  }
  handlePayee = (event) => {
    this.setState({ inputPayee: event.target.value })
  }

  setAmount = (e) => {
    this.setState({
      newAmount: this.state.amount || e
    })
  }

  openComment = () => {
    document.querySelector('#CommentViewText').innerHTML = ''

    let CommentDialog = document.querySelector('#CommentDialog')

    document.querySelector('#ExpenseComment').focus()

    TweenMax.to(CommentDialog, 0.2, { top: 0 })
  }
  openEdit = () => {
    // console.log(this.state)
    //set form values
    let data = {
      expenseId: this.state.expenseId,
      category: this.state.category,
      limit: this.state.limit,
      open: true
    }
    this.props.handleForm(data)
  }
  render() {
    //Properties
    //gett all payments from this expense
    let latestPayment = []

    let expensePayments = this.props.ExpensePayments.filter(
      (obj) => obj.expenseId === this.state.expenseId
    )

    if (expensePayments.length !== 0) {
      //sort payments by date
      latestPayment = expensePayments.sort(function(a, b) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })
    } else {
      latestPayment = [
        {
          amount: 0,
          date: 'none'
        }
      ]
    }

    //Template
    return (
      <Wrapper newAmount={this.state.newAmount}>
        <Row1>
          <Category>{this.state.category}</Category>
          <HistoryIcon
            src={IconHistory}
            alt="history icon"
            onClick={this.showHistory}
          />
          <HistoryIcon src={IconEdit} alt="edit icon" onClick={this.openEdit} />
        </Row1>
        <Provider>{this.state.provider}</Provider>
        <BudgetCon limit={this.state.limit}>
          <Spent>
            <span>
              Spent ${this.state.totalSpent.toLocaleString()}
              /$
              {this.state.limit.toLocaleString()} - Left:
            </span>
            <span> ${this.state.remaining.toLocaleString()}</span>
          </Spent>
          <LinearProgress
            style={{ zIndex: 0, marginTop: '11px' }}
            mode="determinate"
            value={this.state.barCompleted}
            color={this.state.barColor}
          />
        </BudgetCon>
        <LastPayment>
          Last Payment: $
          <span
            style={{
              borderBottom: '1px solid var(--colorBg)',
              cursor: 'pointer'
            }}
            onClick={() => this.setAmount(latestPayment[0].amount)}
          >
            {latestPayment[0].amount}
          </span>
          &nbsp;on {latestPayment[0].date}
        </LastPayment>

        <Payee
          type="text"
          placeholder="Payee"
          value={this.state.inputPayee}
          onChange={this.handlePayee}
        />

        <Container>
          <img src={IconDollar} alt="dolar icon" />
          <AmountInput
            type="number"
            placeholder="0.00"
            value={this.state.newAmount}
            onChange={this.handleAmountInput}
          />
          <img src={IconComment} alt="comment" onClick={this.openComment} />
          <Upload className="image-upload">
            <label htmlFor={this.state.FileinputID}>
              <img src={IconAddFile} alt="add file" />
            </label>
            <input id={this.state.FileinputID} type="file" />
          </Upload>
          <DatePicker
            id="DatePicker"
            value={this.state.valueDate}
            style={DatePickerStyle}
            textFieldStyle={DatePickerStyle.input}
            onChange={this.handleDateInput}
            underlineStyle={DatePickerStyle.underlineStyle}
          />
          <Pay newAmount={this.state.newAmount} onClick={this.submitPayment}>
            Submit
          </Pay>
        </Container>
      </Wrapper>
    )
  }
}

//Animation
const toGreen = keyframes`
  from {
    border: 2px solid white;
  }

  to {
    border: 2px solid var(--colorMain);
  }
`

//Style
const Wrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 10px;
  border: 2px solid white;
  display: grid;
  grid-gap: 5px;
  &:hover {
    animation: ${toGreen} 0.2s linear forwards;
  }
`
const Row1 = styled.div`
  display: grid;
  grid-template-columns: 1fr 18px 18px;
  grid-gap: 10px;
  height: 18px;
`

const Category = styled.p`
  color: var(--colorBg);
  font-weight: 600;
  font-size: 16px;
  margin: 0;
  line-height: 18px;
`
const HistoryIcon = styled.img`
  width: 18px;
  cursor: pointer;
  height: 100%;
`
const Provider = styled.p`
  color: var(--colorBg);
  margin: 0;
  font-size: 14px;
  line-height: 17px;
`

const LastPayment = styled.p`
  color: var(--colorBg);
  margin: 0;
  font-size: 14px;
  line-height: 17px;
`
const BudgetCon = styled.div`
  display: ${(props) =>
    props.limit === '' || props.limit === 0
      ? 'none' || props.limit === false
      : 'grid'};
  grid-template-columns: 190px 1fr;
  grid-gap: 5px;
`
const Container = styled.div`
  display: grid;
  grid-template-columns: 10px 1fr 30px 30px 90px 60px;
  grid-column-gap: 10px;
  box-sizing: border-box;
  padding-top: 5px;
  margin-bottom: 5px;
  height: 23px;

  img:nth-child(1) {
    transform: translateX(-4px);
  }

  img {
    width: 18px;
    cursor: pointer;
    height: 100%;
    display: block;
    margin: 0 auto;
  }

  input {
    caret-color: var(--colorMain);
    color: var(--colorBg);
    outline: none;
    border: none;
    font-size: 16px;
    width: 100%;
  }
`

const AmountInput = styled.input`
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border-radius: 10px;
  line-height: 23px;
  padding: 0;
  font-size: 16px;
  color: var(--colorBg);
  font-weight: 400;
`
const Payee = AmountInput.extend`
caret-color: var(--colorMain);
    color: var(--colorBg);
    outline: none;
    border: none;
    font-size: 16px;
    width: 160px;
  font-weight: bold;
    
  }`

const DatePickerStyle = {
  boxShadow: ' 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  borderRadius: '2px',
  boxSizing: 'border-box',
  paddingLeft: '5px',
  paddingRight: '5px',
  height: 'auto',
  cursor: 'pointer',
  input: {
    height: 'auto',
    cursor: 'pointer',
    width: 'auto'
  },
  underlineStyle: {
    display: 'none'
  }
}
const Pay = styled.p`
  text-align: center;
  color: ${(props) =>
    props.newAmount === '' ? 'var(--colorDisabled)' : 'var(--colorMain)'};
  font-weight: bold;
  margin: 0;
  cursor: ${(props) => (props.newAmount === '' ? 'not-allowed' : 'pointer')};
  box-shadow: ${(props) =>
    props.newAmount === ''
      ? 'none'
      : ' 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'};
  border-radius: 10px;
  line-height: 23px;
`

const Upload = styled.div`
  transform: translateX(4px);
`
const Spent = styled.div`
  margin-bottom: 5px;
  span:nth-child(1) {
    color: var(--colorBg);
    font-size: 14px;
    margin: 0;
  }
  span:nth-child(2) {
    color: var(--colorBg);
    font-size: 14px;
    margin: 0;
  }
  span:nth-child(3) {
    color: var(--colorBg);
    font-size: 14px;
    margin: 0;
  }

  span:nth-child(4) {
    color: var(--colorBg);
    font-size: 14px;
    margin: 0;
  }
`
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ItemExpense)
)
