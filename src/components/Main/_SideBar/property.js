//Vendors
import React from 'react'
import styled from 'styled-components'

//Components

//Images
import Trash from '../../../images/icons/trash.svg'

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { showSnackbar } from '../../../services/Redux/Snackbar/actions'
import { editProperty } from '../../../services/Redux/Properties/actions'
import { showAlert } from '../../../services/Redux/DialogAlert/actions'

//define actions
function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			showSnackbar,
			editProperty,
			showAlert
		},
		dispatch
	)
}
//Set global state to prop

class Property extends React.Component {
	//initial state
	constructor(props) {
		super(props)
		this.state = {
			...props,
			enabled: false
		}
	}

	//Methods
	handleInput = (e) => {
		this.setState({ name: e.target.value, enabled: true })
	}

	sumbitInput = () => {
		if (this.state.enabled === true) {
			this.props.editProperty({
				...this.state
			})
			this.props.showSnackbar('Property Edited')
		}
	}
	deleteProperty = () => {
		let data = {
			id: this.state.id,
			status: true,
			message: 'Remove Property?',
			type: 'property'
		}
		this.props.showAlert(data)
	}
	render() {
		//Properties

		//Template
		return (
			<Wrapper>
				<input type="text" value={this.state.name} onChange={this.handleInput} />
				<Pi enabled={this.state.enabled} onClick={this.sumbitInput}>
					UPDATE
				</Pi>
				<Img src={Trash} alt="remove" onClick={this.deleteProperty} />
			</Wrapper>
		)
	}
}

//Style
const Wrapper = styled.div`
	display: grid;
	grid-template-rows: 100%;
	grid-template-columns: 1fr 80px 30px;
	width: 100%;

	input {
		outline: none;
		padding: 18px;
		border: none;
		font-size: 16px;
		font-weight: bold;
		width: 100%;
		box-sizing: border-box;

		&:focus {
			outline: none;
		}
	}
`
const Pi = styled.p`
	font-weight: bold;
	margin: 0;
	color: ${(props) => (props.enabled ? 'var(--colorMain)' : 'var(--colorDisabled)')};
	margin-top: 18px;
	cursor: pointer;
`
const Img = styled.img`
	width: 15px !important;
	position: static !important;
	margin-top: 19px;
`
export default connect(null, mapDispatchToProps)(Property)
