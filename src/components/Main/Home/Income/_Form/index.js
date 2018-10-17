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
import { insertIncome, renameIncome } from '../_state/Income/actions.js'
import { showSnackbar } from '../../../../../services/Redux/Snackbar/actions'
import { showAlert } from '../../../../../services/Redux/DialogAlert/actions'

//Actions
function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			showLoadingScreen,
			hideLoadingScreen,
			insertIncome,
			showSnackbar,
			showAlert,
			renameIncome
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
			incomeId: props.incomeId || '',
			inputName: props.name || '',
			inputType: props.type || '',
			inputUnit: props.unit || '',
			inputAmount: props.amount || '',
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
				incomeId: nextProps.incomeId,
				inputName: nextProps.name || '',
				inputType: nextProps.type || '',
				inputUnit: nextProps.unit || '',
				inputAmount: nextProps.amount || ''
			})
		}
	}

	handleClose = () => {
		this.setState({ inputName: '', inputType: '', inputUnit: '', inputAmount: '', errorMessage: '' })
		this.props.handleFormOpen(false)
	}

	handleName = (e) => this.setState({ inputName: e.target.value, errorMessage: '' })

	handleType = (e) => this.setState({ inputType: e.target.value })

	handleUnit = (e) => this.setState({ inputUnit: e.target.value })

	handleAmount = (e) => this.setState({ inputAmount: e.target.value })

	submitForm = (e) => {
		e.preventDefault()

		if (this.state.inputName !== '') {
			switch (this.state.dest) {
				case 'Create':
					this.createIncome()
					break
				case 'Update':
					this.updateIncome()
					break
				default:
					console.log('Please set a dest')
			}
		} else {
			this.setState({ errorMessage: 'This field is required' })
		}
	}
	createIncome = async () => {
		this.props.handleFormOpen(false)
		this.props.showLoadingScreen('Adding Income')

		let path = window.location.pathname.split('/'),
			currentData = {
				name: this.state.inputName,
				type: this.state.inputType,
				unit: this.state.inputUnit,
				amount: this.state.inputAmount,
				propertyId: path[1]
			}

		let newIncomeData = await firebase
			.firestore()
			.collection('incomes')
			.add(currentData)

		let data = {
			incomeId: newIncomeData.id,
			name: currentData.name,
			type: currentData.type,
			unit: currentData.unit,
			amount: this.state.inputAmount
		}

		this.props.insertIncome(data)
		this.props.hideLoadingScreen()

		this.props.showSnackbar('Income Added')
	}
	updateIncome = () => {
		if (this.state.inputName !== '') {
			this.props.showLoadingScreen('Updating Income')
			let data = {
				incomeId: this.state.incomeId,
				name: this.state.inputName,
				type: this.state.inputType,
				unit: this.state.inputUnit,
				amount: this.state.inputAmount
			}

			this.props.renameIncome(data)
			this.props.hideLoadingScreen()
			this.props.showSnackbar('Update Successful')
			this.props.handleFormOpen(false)
		} else {
			this.setState({ errorMessage: 'This field is required' })
		}
	}

	deleteIncome = () => {
		let data = {
			id: this.state.incomeId,
			status: true,
			message: 'Remove Income?',
			type: 'income'
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
					floatingLabelText="Name"
					floatingLabelStyle={{ color: 'grey' }}
					type="text"
					style={inputStyle}
					inputStyle={{ color: '#212121' }}
					hintStyle={{ color: 'grey' }}
					value={this.state.inputName}
					onChange={this.handleName}
					errorText={this.state.errorMessage}
					autoFocus
				/>
				<TextField
					floatingLabelText="Type"
					floatingLabelStyle={{ color: 'grey' }}
					type="text"
					style={inputStyle}
					inputStyle={{ color: '#212121' }}
					hintStyle={{ color: 'grey' }}
					value={this.state.inputType}
					onChange={this.handleType}
				/>
				<TextField
					floatingLabelText="Unit"
					floatingLabelStyle={{ color: 'grey' }}
					type="text"
					style={inputStyle}
					inputStyle={{ color: '#212121' }}
					hintStyle={{ color: 'grey' }}
					value={this.state.inputUnit}
					onChange={this.handleUnit}
				/>
				<TextField
					floatingLabelText="Amount"
					floatingLabelStyle={{ color: 'grey' }}
					type="number"
					style={inputStyle}
					inputStyle={{ color: '#212121' }}
					hintStyle={{ color: 'grey' }}
					value={this.state.inputAmount}
					onChange={this.handleAmount}
				/>
				<DeleteBtn dest={this.state.dest}>
					<span onClick={this.deleteIncome}>Delete</span>
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
					floatingLabelText="Name"
					floatingLabelStyle={{ color: 'grey' }}
					type="text"
					style={inputStyle}
					inputStyle={{ color: '#212121' }}
					hintStyle={{ color: 'grey' }}
					value={this.state.inputName}
					onChange={this.handleName}
					errorText={this.state.errorMessage}
					autoFocus
				/>
				<TextField
					floatingLabelText="Type"
					floatingLabelStyle={{ color: 'grey' }}
					type="text"
					style={inputStyle}
					inputStyle={{ color: '#212121' }}
					hintStyle={{ color: 'grey' }}
					value={this.state.inputType}
					onChange={this.handleType}
				/>
				<TextField
					floatingLabelText="Unit"
					floatingLabelStyle={{ color: 'grey' }}
					type="text"
					style={inputStyle}
					inputStyle={{ color: '#212121' }}
					hintStyle={{ color: 'grey' }}
					value={this.state.inputUnit}
					onChange={this.handleUnit}
				/>
				<TextField
					floatingLabelText="Amount"
					floatingLabelStyle={{ color: 'grey' }}
					type="number"
					style={inputStyle}
					inputStyle={{ color: '#212121' }}
					hintStyle={{ color: 'grey' }}
					value={this.state.inputAmount}
					onChange={this.handleAmount}
				/>
				<DeleteBtn dest={this.state.dest}>
					<span onClick={this.deleteIncome}>Delete</span>
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
