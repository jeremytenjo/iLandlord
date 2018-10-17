//Vendors
import React from 'react'
import firebase from 'firebase'
import styled from 'styled-components'

//Components
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import FullscreenDialog from 'material-ui-fullscreen-dialog'

//Images

//Functions

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { showLoadingScreen } from '../../../../../services/Redux/LoadingScreen/actions'
import { hideLoadingScreen } from '../../../../../services/Redux/LoadingScreen/actions'
import { insertExpense, renameExpense } from '../_state/Expenses/actions.js'
import { showSnackbar } from '../../../../../services/Redux/Snackbar/actions'
import { showAlert } from '../../../../../services/Redux/DialogAlert/actions'

//Actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      showLoadingScreen,
      hideLoadingScreen,
      insertExpense,
      showSnackbar,
      showAlert,
      renameExpense
    },
    dispatch
  )
}

//Reducers

//Dynamic Components

class Form extends React.Component {
  //initial state
  constructor(props) {
    super(props)
    this.state = {
      ...props,
      expenseId: props.expenseId || '',
      inputCategory: props.category || '',
      inputLimit: props.type || '',
      errorMessage: '',
      size: 'mobile'
    }
  }

  //Methods
  componentWillMount() {
    let size,
      intViewportWidth = window.innerWidth

    //set dialogue size
    if (intViewportWidth <= 600) {
      size = 'mobile'
    } else {
      size = 'desktop'
    }
    this.setState({ size })
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextProps.open !== this.state.open) {
      this.setState({
        open: nextProps.open,
        expenseId: nextProps.expenseId,
        inputCategory: nextProps.category || '',
        inputLimit: nextProps.limit || ''
      })
    }
  }

  handleClose = () => {
    this.setState({ inputCategory: '', inputLimit: '', errorMessage: '' })
    this.props.handleFormOpen(false)
  }

  handleCategory = (e) => this.setState({ inputCategory: e.target.value, errorMessage: '' })

  handleLimit = (e) => this.setState({ inputLimit: e.target.value })

  submitForm = (e) => {
    e.preventDefault()

    if (this.state.inputCategory !== '') {
      switch (this.state.dest) {
        case 'Create':
          this.createExpense()
          break
        case 'Update':
          this.updateExpense()
          break
        default:
          console.log('Please set a dest')
      }
    } else {
      this.setState({ errorMessage: 'This field is required' })
    }
  }
  createExpense = async () => {
    this.props.handleFormOpen(false)
    this.props.showLoadingScreen('Adding Expense')

    let path = window.location.pathname.split('/'),
      currentData = {
        category: this.state.inputCategory,
        limit: this.state.inputLimit,
        propertyId: path[1]
      }

    let newExpenseData = await firebase
      .firestore()
      .collection('expenses')
      .add(currentData)

    let data = {
      expenseId: newExpenseData.id,
      category: currentData.category,
      limit: currentData.limit
    }

    this.props.insertExpense(data)
    this.props.hideLoadingScreen()

    this.props.showSnackbar('Expense Added')
  }
  updateExpense = () => {
    if (this.state.inputCategory !== '') {
      this.props.showLoadingScreen('Updating Expense')
      let data = {
        expenseId: this.state.expenseId,
        category: this.state.inputCategory,
        limit: this.state.inputLimit
      }

      this.props.renameExpense(data)
      this.props.hideLoadingScreen()
      this.props.showSnackbar('Update Successful')
      this.props.handleFormOpen(false)
    } else {
      this.setState({ errorMessage: 'This field is required' })
    }
  }

  deleteExpense = () => {
    let data = {
      id: this.state.expenseId,
      status: true,
      message: 'Remove Expense?',
      type: 'expense'
    }
    this.props.handleFormOpen(false)
    this.props.showAlert(data)
  }
  render() {
    const actions = [
      <FlatButton label="Cancel" primary={true} onClick={this.handleClose} />,
      <FlatButton label={this.state.dest} primary={true} keyboardFocused={true} onClick={this.submitForm} />
    ]

    return this.state.size === 'mobile' ? (
      <FullscreenDialog
        open={this.state.open}
        onRequestClose={this.handleClose}
        title={this.state.title}
        actionButton={<FlatButton label={this.state.dest} onClick={this.submitForm} />}
      >
        <TextField
          floatingLabelText="Category"
          floatingLabelStyle={{ color: 'grey' }}
          type="text"
          style={inputStyle}
          inputStyle={{ color: '#212121' }}
          hintStyle={{ color: 'grey' }}
          value={this.state.inputCategory}
          onChange={this.handleCategory}
          errorText={this.state.errorMessage}
          autoFocus
        />
        <TextField
          floatingLabelText="Budget"
          floatingLabelStyle={{ color: 'grey' }}
          type="text"
          style={inputStyle}
          inputStyle={{ color: '#212121' }}
          hintStyle={{ color: 'grey' }}
          value={this.state.inputLimit}
          onChange={this.handleLimit}
        />

        <DeleteBtn dest={this.state.dest}>
          <span onClick={this.deleteExpense}>Delete</span>
        </DeleteBtn>
      </FullscreenDialog>
    ) : (
      <Dialog
        title={this.state.title}
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}
      >
        <TextField
          floatingLabelText="Category"
          floatingLabelStyle={{ color: 'grey' }}
          type="text"
          style={inputStyle}
          inputStyle={{ color: '#212121' }}
          hintStyle={{ color: 'grey' }}
          value={this.state.inputCategory}
          onChange={this.handleCategory}
          errorText={this.state.errorMessage}
          autoFocus
        />
        <TextField
          floatingLabelText="Budget"
          floatingLabelStyle={{ color: 'grey' }}
          type="text"
          style={inputStyle}
          inputStyle={{ color: '#212121' }}
          hintStyle={{ color: 'grey' }}
          value={this.state.inputLimit}
          onChange={this.handleLimit}
        />

        <DeleteBtn dest={this.state.dest}>
          <span onClick={this.deleteExpense}>Delete</span>
        </DeleteBtn>
      </Dialog>
    )
  }
}

//Style
const inputStyle = {
  margin: '0 auto',
  display: 'block'
}
const DeleteBtn = styled.div`
  display: ${(props) => (props.dest === 'Update' ? 'block' : 'none')};
  width: 256px;
  margin: 0 auto;
  margin-top: 20px;

  span {
    color: red;
    text-decoration: underline;
    cursor: pointer;
    user-select: none;
    font-size: 12px;
  }
`
export default connect(null, mapDispatchToProps)(Form)
