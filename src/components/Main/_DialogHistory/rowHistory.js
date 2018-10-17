//Vendors
import React from 'react'
import styled from 'styled-components'
import { TweenMax } from 'gsap'

//Components

//Images
import iconFile from '../../../images/icons/file.svg'
import iconCommnet from '../../../images/icons/comment.svg'

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { showSnackbar } from '../../../services/Redux/Snackbar/actions'
import { updateBillPayment } from '../Home/Bills/_state/BillPayments/actions'
import { updateIncomePayment } from '../Home/Income/_state/IncomePayments/actions'
import { updateExpensePayment } from '../Home/Expenses/_state/ExpensePayments/actions'
import { showAlert } from '../../../services/Redux/DialogAlert/actions'
import { setComment } from '../../../services/Redux/Comment/actions'

//define actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      showSnackbar,
      updateBillPayment,
      showAlert,
      updateIncomePayment,
      updateExpensePayment,
      setComment
    },
    dispatch
  )
}
//Set global state to prop

class Rowhistory extends React.Component {
  //initial state
  constructor(props) {
    super(props)
    this.state = {
      ...props,
      payee: props.payee || '',
      enable: false,
      pressTimer: '',
      file: true,
      newFile: ''
    }
  }

  //Methods
  componentWillMount() {
    if (typeof this.state.fileUrl === 'undefined') {
      this.setState({ fileUrl: '' })
    }
  }

  handleChange = (event) => {
    this.setState({ amount: event.target.value, enable: true })
  }
  handlePayee = (event) => {
    this.setState({ payee: event.target.value, enable: true })
  }
  handleNewfile = (event) => {
    this.setState({ newFile: event.target.value, enable: true })
  }

  update = (e) => {
    if ((this.state.enable === true && this.state.amount !== '') || this.state.payee !== '') {
      this.props.showSnackbar('Updating Payment...')

      //bill payment
      if (this.state.type === 'bill') {
        let data = {
          billPaymentId: this.state.billPaymentId,
          amount: this.state.amount
        }
        this.props.updateBillPayment(data)

        //bill income
      } else if (this.state.type === 'incomePayment') {
        let data = {
          incomePaymentId: this.state.incomePaymentId,
          amount: this.state.amount
        }
        this.props.updateIncomePayment(data)

        //bill expense
      } else if (this.state.type === 'expensePayment') {
        let data = {
          expensePaymentId: this.state.expensePaymentId,
          amount: this.state.amount,
          payee: this.state.payee
        }

        this.props.updateExpensePayment(data)
      }

      this.props.showSnackbar('Payment Updated')
      this.setState({ enable: false })
    } else {
      //focus on input for update
      this.props.showSnackbar('Edit Input First')
      let input = e.target.parentNode.childNodes[1].childNodes[1]
      input.focus()
    }
  }
  holdDown = (e) => {
    //prevent update button to trigger delete
    if (typeof e.target.dataset.true === 'undefined') {
      let node, data
      if (e.target.nodeName === 'DIV') {
        node = e.target
      } else {
        node = e.target.parentNode
      }

      this.setState({
        pressTimer: window.setTimeout(() => {
          node.setAttribute('id', 'targetHistoryRow')
          node.style.borderColor = 'red'

          if (this.state.type === 'bill') {
            data = {
              id: this.state.billPaymentId,
              status: true,
              message: 'Remove Payment?',
              type: 'billPayment'
            }
          } else if (this.state.type === 'income') {
            data = {
              id: this.state.incomeId,
              status: true,
              message: 'Remove Payment?',
              type: 'income'
            }
          } else if (this.state.type === 'incomePayment') {
            data = {
              id: this.state.incomePaymentId,
              status: true,
              message: 'Remove Payment?',
              type: 'incomePayment'
            }
          } else if (this.state.type === 'expensePayment') {
            data = {
              id: this.state.expensePaymentId,
              status: true,
              message: 'Remove Payment?',
              type: 'expensePayment'
            }
          }

          this.props.showAlert(data)
        }, 1000)
      })
    }
  }

  holdUp = () => {
    clearTimeout(this.state.pressTimer)
  }
  openFile = () => {
    if (this.state.fileUrl) {
      window.open(this.state.fileUrl)
    }
  }
  openComment = () => {
    // console.log(this.state.comment);
    // this.props.setComment(this.state.comment)
    document.querySelector('#CommentViewText').innerHTML = this.state.comment

    let CommentDialogView = document.querySelector('#CommentDialogView')
    TweenMax.to(CommentDialogView, 0.2, { top: 0 })
  }
  render() {
    //Properties
    //  console.log(this.state)

    let type = window.location.pathname.split('/')[2]

    //Template
    return (
      <Wrapper
        file={this.state.fileUrl}
        onMouseDown={this.holdDown}
        onTouchStart={this.holdDown}
        onMouseUp={this.holdUp}
        onTouchEnd={this.holdUp}
      >
        <Payee typee={type} type="text" placeholder="Payee" value={this.state.payee} onChange={this.handlePayee} />

        <Row2>
          <Date>{this.state.date}</Date>

          <AmountInputCon>
            <span>$</span>
            <Input type="number" value={this.state.amount} onChange={this.handleChange} />
          </AmountInputCon>

          <FilesCon>
            <CommentIMG src={iconCommnet} alt="file" comment={this.state.comment} onClick={this.openComment} />

            <FileIMG
              src={iconFile}
              alt="file"
              file={this.state.fileUrl}
              comment={this.state.comment}
              onClick={this.openFile}
            />
          </FilesCon>
          <Update enable={this.state.enable} onClick={this.update} onMouseDown={this.update} data-true="data-true">
            UPDATE
          </Update>
        </Row2>
      </Wrapper>
    )
  }
}

//Style
const FilesCon = styled.div``
const Wrapper = styled.div`
  color: var(--colorBg);
  margin-bottom: 15px;
  background: white;
  box-sizing: border-box;
  margin-left: 2px;
  margin-right: 2px;
  max-width: 600px;
  height: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 10px;
`
const Payee = styled.input`
  display: ${(props) => (props.typee === 'expenses' ? 'block' : 'none')};
  overflow-x: scroll;
  line-height: 23px;
  padding: 0;
  caret-color: var(--colorMain);
  color: var(--colorBg);
  outline: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  min-width: 50px;
`

const Row2 = styled.div`
  display: grid;
  grid-template-columns: 90px auto minmax(auto, 45px) 70px};
  grid-template-rows: 25px;
  grid-column-gap: 5px;
  font-size: 14px;
`

const AmountInputCon = styled.span`
  height: 100%;
  span {
    line-height: 30px;
  }
`

const Date = styled.span`
  line-height: 30px;
  text-align: left;
`
const Update = styled.span`
  line-height: 30px;
  font-weight: bold;
  color: ${(props) => (props.enable === false ? 'var(--colorDisabled)' : 'var(--colorMain)')};
  cursor: ${(props) => (props.enable === false ? 'not-allowed' : 'pointer')};
  text-align: right;
`
const CommentIMG = styled.img`
  display: none;
  display: ${(props) => (props.comment !== '' && typeof props.comment !== 'undefined' ? 'inline' : 'none')};
  width: 20px;
  float: left;
  height: 100%;
`
const FileIMG = styled.img`
  height: 100%;
  display: ${(props) => (props.file !== '' ? 'inline' : 'none')};
  width: 20px;
  float: left;
  margin-left: ${(props) => (props.comment !== '' && typeof props.comment !== 'undefined' ? '5px' : 0)};
`
const Input = styled.input`
  width: 80px;
  outline: none;
  border: none;
  font-size: 16px;
  &:focus {
    outline: none;
  }
  @media (min-width: 600px) {
    width: 65px;
  }
`
export default connect(null, mapDispatchToProps)(Rowhistory)
