//Vendors
import React from 'react'
import styled, { keyframes } from 'styled-components'
import DatePicker from 'material-ui/DatePicker'
import { TweenMax } from 'gsap'
import firebase from 'firebase'
import { withRouter } from 'react-router'

//Components

//Images
import IconHistory from '../../../../../images/icons/history.svg'
import IconDollar from '../../../../../images/icons/dollar.svg'
import IconEdit from '../../../../../images/icons/edit.svg'
import IconAddFile from '../../../../../images/icons/addFile.svg'

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { insertBillPayment } from '../_state/BillPayments/actions'
import { setDialogHistory } from '../../../../../services/Redux/Dialogues/actions'
import { showSnackbar } from '../../../../../services/Redux/Snackbar/actions'
import {
  showLoadingScreen,
  hideLoadingScreen
} from '../../../../../services/Redux/LoadingScreen/actions'

//define actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setDialogHistory,
      showSnackbar,
      insertBillPayment,
      showLoadingScreen,
      hideLoadingScreen
    },
    dispatch
  )
}
//Set global state to prop
function mapStateToProps(state) {
  return { BillPayments: state.BillPayments, Property: state.Property }
}
class ItemBill extends React.Component {
  //initial state
  constructor(props) {
    super(props)
    this.state = {
      billId: props.billId,
      name: props.name,
      provider: props.provider,
      dueDate: props.dueDate || '',
      valueDate: props.date,
      newAmount: '',
      focus: false,
      FileinputID: 'itemBillFileUpload'
    }
  }

  //Methods
  componentWillMount = () => {
    document.onkeydown = null
  }

  submitPayment = async (e) => {
    if (this.state.newAmount !== '') {
      this.props.showLoadingScreen('Adding bill payment...')

      let fileEl = document.querySelector('#' + this.state.FileinputID)
      let file = fileEl.files[0] || false
      let fileID = false
      let fileUrl = false

      // Check If file exists
      if (file) {
        let storageRef = firebase.storage().ref()
        fileID = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        let fileRef = storageRef.child('files/bills/' + fileID)
        let snapshot = await fileRef.put(file)
        fileUrl = await snapshot.ref.getDownloadURL()
      }

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
        day = d.getDate()

      data.rand = Math.random()
      data.propertyId = this.props.Property.id
      data.billId = this.state.billId
      data.amount = this.state.newAmount
      data.timestamp = this.state.valueDate
      data.month = months[month]
      data.year = year
      data.date = data.month + ' ' + day
      data.fileUrl = fileUrl
      data.fileID = fileID

      //save online
      return firebase
        .firestore()
        .collection('billPayments')
        .add(data)
        .then((value) => {
          data.billPaymentId = value.id
          // console.log(data);
          //save store
          this.props.insertBillPayment(data)

          this.props.hideLoadingScreen()
          this.props.showSnackbar('Payment Added')
          this.setState({ newAmount: '', focus: false })
        })
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
        billId: this.state.billId,
        type: 'bill',
        name: this.state.name,
        provider: this.state.provider,
        dueDate: this.state.dueDate,
        rand: Math.random()
      }

    //set dialoge data
    this.props.setDialogHistory(data)

    //show history dialog
    TweenMax.to(dialog, 0.2, { top: 0 })

    //push into history for back button support to close
    this.props.history.push(`/${this.props.Property.id}/bills`)

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

  setAmount = (e) => {
    this.setState({
      newAmount: this.state.amount || e
    })
  }

  openEdit = () => {
    // console.log(this.state)
    //set form values
    let data = {
      billId: this.state.billId,
      name: this.state.name,
      provider: this.state.provider,
      dueDate: this.state.dueDate,
      type: 'Update',
      open: true
    }
    this.props.handleForm(data)
  }
  render() {
    //Properties

    //gett all payments from this bill
    let latestPayment = []

    let billPayments = this.props.BillPayments.filter(
      (obj) => obj.billId === this.state.billId
    )

    if (billPayments.length !== 0) {
      //sort payments by date
      latestPayment = billPayments.sort(function(a, b) {
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
      <Wrapper newAmount={this.state.newAmount} focus={this.state.focus}>
        <Row1>
          <Name>{this.state.name}</Name>
          <HistoryIcon
            src={IconHistory}
            alt="history icon"
            onClick={this.showHistory}
          />
          <HistoryIcon src={IconEdit} alt="edit icon" onClick={this.openEdit} />
        </Row1>
        <Provider>{this.state.provider}</Provider>
        <DueDate DueDate={this.state.dueDate}>
          Due Date: {this.state.dueDate}
        </DueDate>
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

        <Container>
          <img src={IconDollar} alt="dolar icon" />
          <AmountInput
            type="number"
            placeholder="0.00"
            value={this.state.newAmount}
            onChange={this.handleAmountInput}
            onFocus={this.handleFocus}
          />
          <DatePicker
            id="DatePicker"
            value={this.state.valueDate}
            style={DatePickerStyle}
            textFieldStyle={DatePickerStyle.input}
            onChange={this.handleDateInput}
            underlineStyle={DatePickerStyle.underlineStyle}
          />
          <Upload className="image-upload">
            <label htmlFor={this.state.FileinputID}>
              <img src={IconAddFile} alt="add file" />
            </label>
            <input id={this.state.FileinputID} type="file" />
          </Upload>
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
const Name = styled.p`
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
const DueDate = styled.p`
  display: ${(props) => (props.DueDate === '' ? 'none' : 'block')};
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
const Container = styled.div`
  display: grid;
  grid-template-columns: 10px 1fr 90px 30px 60px;
  grid-column-gap: 10px;
  box-sizing: border-box;
  height: 23px;

  img:nth-child(1) {
    transform: translateX(-4px);
  }

  img {
    width: 18px;
    cursor: pointer;
    height: 100%;
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
  border-radius: 2px;
  line-height: 23px;
  padding: 0;
  font-size: 16px;
  color: var(--colorBg);
`

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
  border-radius: 2px;
  line-height: 23px; 
`
const Upload = styled.div`
  transform: translateX(4px);
  justify-self: center;
`

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ItemBill)
)
