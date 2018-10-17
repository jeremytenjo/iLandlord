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
import { insertBill, renameBill } from '../_state/Bills/actions.js'
import { showSnackbar } from '../../../../../services/Redux/Snackbar/actions'
import { showAlert } from '../../../../../services/Redux/DialogAlert/actions'

//Actions
function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			showLoadingScreen,
			hideLoadingScreen,
			insertBill,
			showSnackbar,
			showAlert,
			renameBill
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
			billId: props.billId || '',
			inputName: props.name || '',
			inputProvider: props.provider || '',
			inputDueDate: props.dueDate || '',
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
				billId: nextProps.billId,
				inputName: nextProps.name || '',
				inputProvider: nextProps.provider || '',
				inputDueDate: nextProps.dueDate || ''
			})
		}
	}

	handleClose = () => {
		this.setState({ inputName: '', inputProvider: '', handleDueDate: '', errorMessage: '' })
		this.props.handleFormOpen(false)
	}

	handleName = (e) => this.setState({ inputName: e.target.value, errorMessage: '' })

	handleProvider = (e) => this.setState({ inputProvider: e.target.value })

	handleDueDate = (e) => this.setState({ inputDueDate: e.target.value })

	submitForm = (e) => {
		e.preventDefault()

		if (this.state.inputName !== '') {
			switch (this.state.dest) {
				case 'Create':
					this.createBill()
					break
				case 'Update':
					this.updateBill()
					break
				default:
					console.log('Please set a dest')
			}
		} else {
			this.setState({ errorMessage: 'This field is required' })
		}
	}
	createBill = async () => {
		this.props.handleFormOpen(false)
		this.props.showLoadingScreen('Adding Bill')

		let path = window.location.pathname.split('/'),
			currentData = {
				name: this.state.inputName,
				provider: this.state.inputProvider,
				dueDate: this.state.inputDueDate,
				propertyId: path[1]
			}

		let newBIllData = await firebase
			.firestore()
			.collection('bills')
			.add(currentData)

		let data = {
			billId: newBIllData.id,
			name: currentData.name,
			provider: currentData.provider,
			dueDate: currentData.dueDate
		}

		this.props.insertBill(data)
		this.props.hideLoadingScreen()

		this.props.showSnackbar('Bill Added')
	}
	updateBill = () => {
		if (this.state.inputName !== '') {
			this.props.showLoadingScreen('Updating Bill')
			let data = {
				name: this.state.inputName,
				provider: this.state.inputProvider,
				dueDate: this.state.inputDueDate
			}

			let ref = firebase
				.firestore()
				.collection('bills')
				.doc(this.state.billId)

			ref.update(data).then(() => {
				data.billId = this.state.billId
				this.props.renameBill(data)
				this.props.hideLoadingScreen()
				this.props.showSnackbar('Update Successful')
				this.props.handleFormOpen(false)
			})
		} else {
			this.setState({ errorMessage: 'This field is required' })
		}
	}

	deleteBill = () => {
		let data = {
			id: this.state.billId,
			status: true,
			message: 'Remove Bill?',
			type: 'bill'
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
					floatingLabelText="Provider"
					floatingLabelStyle={{ color: 'grey' }}
					type="text"
					style={inputStyle}
					inputStyle={{ color: '#212121' }}
					hintStyle={{ color: 'grey' }}
					value={this.state.inputProvider}
					onChange={this.handleProvider}
				/>
				<TextField
					floatingLabelText="Due Date"
					floatingLabelStyle={{ color: 'grey' }}
					type="text"
					style={inputStyle}
					inputStyle={{ color: '#212121' }}
					hintStyle={{ color: 'grey' }}
					value={this.state.inputDueDate}
					onChange={this.handleDueDate}
				/>
				<DeleteBtn dest={this.state.dest}>
					<span onClick={this.deleteBill}>Delete</span>
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
					floatingLabelText="Provider"
					floatingLabelStyle={{ color: 'grey' }}
					type="text"
					style={inputStyle}
					inputStyle={{ color: '#212121' }}
					hintStyle={{ color: 'grey' }}
					value={this.state.inputProvider}
					onChange={this.handleProvider}
				/>
				<TextField
					floatingLabelText="Due Date"
					floatingLabelStyle={{ color: 'grey' }}
					type="text"
					style={inputStyle}
					inputStyle={{ color: '#212121' }}
					hintStyle={{ color: 'grey' }}
					value={this.state.inputDueDate}
					onChange={this.handleDueDate}
				/>
				<DeleteBtn dest={this.state.dest}>
					<span onClick={this.deleteBill}>Delete</span>
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
