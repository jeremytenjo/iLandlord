//Vendors
import React from 'react'
import styled from 'styled-components'
import { TweenMax } from 'gsap'
import { withRouter } from 'react-router'

//Components
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

//Images

//Functions
import fetchFirestoreDeleteAll from '../../services/Firebase/functions/deleteAll.js' //type, propertyId, idname

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { removeBill } from './Home/Bills/_state/Bills/actions'
import { removeBillPayment, removeBillPayments } from './Home/Bills/_state/BillPayments/actions'
import { removeIncome } from './Home/Income/_state/Income/actions'
import { removeIncomePayment, removeIncomePayments } from './Home/Income/_state/IncomePayments/actions'
import { removeExpense } from './Home/Expenses/_state/Expenses/actions'
import { removeExpensePayment, removeExpensePayments } from './Home/Expenses/_state/ExpensePayments/actions'
import { showSnackbar } from '../../services/Redux/Snackbar/actions'
import { showAlert } from '../../services/Redux/DialogAlert/actions'
import { removeProperty } from '../../services/Redux/Properties/actions'
import { showLoadingScreen, hideLoadingScreen } from '../../services/Redux/LoadingScreen/actions'

//define actions
function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			removeBill,
			showSnackbar,
			showAlert,
			removeBillPayment,
			removeBillPayments,
			removeIncome,
			removeIncomePayment,
			removeIncomePayments,
			removeExpense,
			removeExpensePayment,
			removeExpensePayments,
			removeProperty,
			showLoadingScreen,
			hideLoadingScreen
		},
		dispatch
	)
}
//Set global state to prop
function mapStateToProps(state) {
	return { DialogAlert: state.DialogAlert }
}
class DialogAlert extends React.Component {
	//initial state
	constructor(props) {
		super(props)
		this.state = {
			data: 'initial'
		}
	}

	//Methods
	handleClose = () => {
		let data = {
			id: '',
			status: false,
			message: ''
		}
		this.props.showAlert(data)

		//unselect bill payment
		let targetHistoryRow = document.querySelector('#targetHistoryRow')
		if (targetHistoryRow) {
			targetHistoryRow.style.borderColor = 'lightgrey'
		}
	}

	proceed = async () => {
		let data = {
			id: '',
			status: false,
			message: ''
		}
		// this.props.showSnackbar('Removing Payment...')
		this.props.showLoadingScreen('Removing payment...')

		//remove bill and its payments from dataase
		if (this.props.DialogAlert.type === 'bill') {
			this.props.removeBill(this.props.DialogAlert.id)
			this.props.removeBillPayments(this.props.DialogAlert.id)
			this.props.showAlert(data)

			this.props.hideLoadingScreen()
			this.props.showSnackbar('Bill Removed')

			//remove 1 payment
		} else if (this.props.DialogAlert.type === 'billPayment') {
			let targetHistoryRow = document.querySelector('#targetHistoryRow')
			targetHistoryRow.style.position = 'relative'
			TweenMax.to(targetHistoryRow, 0.3, { left: '100%' })
			TweenMax.to(targetHistoryRow, 0.1, {
				delay: 0.3,
				display: 'none'
			})

			setTimeout(() => {
				this.props.removeBillPayment(this.props.DialogAlert.id)
				this.props.showAlert(data)

				this.props.hideLoadingScreen()
				this.props.showSnackbar('Payment Removed')
			}, 300)

			//remove Income source
		} else if (this.props.DialogAlert.type === 'income') {
			this.props.removeIncome(this.props.DialogAlert.id)
			this.props.removeIncomePayments(this.props.DialogAlert.id)
			this.props.showAlert(data)

			this.props.hideLoadingScreen()
			this.props.showSnackbar('Income Removed')

			//remove 1 payment
		} else if (this.props.DialogAlert.type === 'incomePayment') {
			let targetHistoryRow = document.querySelector('#targetHistoryRow')
			targetHistoryRow.style.position = 'relative'
			TweenMax.to(targetHistoryRow, 0.3, { left: '100%' })
			TweenMax.to(targetHistoryRow, 0.1, {
				delay: 0.3,
				display: 'none'
			})

			setTimeout(() => {
				this.props.removeIncomePayment(this.props.DialogAlert.id)
				this.props.showAlert(data)

				this.props.hideLoadingScreen()
				this.props.showSnackbar('Payment Removed')
			}, 300)

			//remove expense
		} else if (this.props.DialogAlert.type === 'expense') {
			this.props.removeExpense(this.props.DialogAlert.id)
			this.props.removeExpensePayments(this.props.DialogAlert.id)
			this.props.showAlert(data)

			this.props.hideLoadingScreen()
			this.props.showSnackbar('Payment Removed')

			//remove  1 expense payment
		} else if (this.props.DialogAlert.type === 'expensePayment') {
			let targetHistoryRow = document.querySelector('#targetHistoryRow')
			targetHistoryRow.style.position = 'relative'
			TweenMax.to(targetHistoryRow, 0.3, { left: '100%' })
			TweenMax.to(targetHistoryRow, 0.1, {
				delay: 0.3,
				display: 'none'
			})

			setTimeout(() => {
				this.props.removeExpensePayment(this.props.DialogAlert.id)
				this.props.showAlert(data)

				this.props.hideLoadingScreen()
				this.props.showSnackbar('Payment Removed')
			}, 300)
		} else if (this.props.DialogAlert.type === 'property') {
			//delete online
			let ids = await fetchFirestoreDeleteAll(this.props.DialogAlert.id)

			//reset local data
			ids.billIds.map(() => {
				return this.props.removeBill(this.props.DialogAlert.id)
			})

			ids.billPaymentsIds.map(() => {
				return this.props.removeBillPayments(this.props.DialogAlert.id)
			})

			ids.incomeIds.map(() => {
				return this.props.removeIncome(this.props.DialogAlert.id)
			})

			ids.incomePaymentsIds.map(() => {
				return this.props.removeIncomePayments(this.props.DialogAlert.id)
			})

			ids.expenseIds.map(() => {
				return this.props.removeExpense(this.props.DialogAlert.id)
			})

			ids.expensePaymentsIds.map(() => {
				return this.props.removeExpensePayments(this.props.DialogAlert.id)
			})

			this.props.removeProperty(this.props.DialogAlert.id)

			//ending
			this.props.showAlert(data)
			this.props.hideLoadingScreen()
			this.props.showSnackbar('Property Removed')
			this.props.history.push('/')
		}
	}

	render() {
		//Properties

		const actions = [
			<FlatButton label="No" primary={true} onClick={this.handleClose} />,
			<FlatButton label="Yes" primary={true} onClick={this.proceed} />
		]
		//Template
		return <Wrapper>
        <Dialog  actions={actions} modal={false} open={this.props.DialogAlert.status} onRequestClose={this.handleClose}>
          {this.props.DialogAlert.message}
        </Dialog>
      </Wrapper>;
	}
}

//Style
const Wrapper = styled.div``
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DialogAlert))
