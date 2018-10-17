//Vendors
import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

//Components

//Images

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setLocation } from '../../services/Redux/Location/actions'

//define actions
function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			setLocation
		},
		dispatch
	)
}

//Set global state to prop
function mapStateToProps(state) {
	return { Location: state.Location, Property: state.Property }
}

class LinkBar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			Location: this.props.location.pathname
		}
	}
	componentWillMount = () => {
		let path = this.props.location.pathname.split('/')
		this.props.setLocation(`/${path[2]}`)
	}

	//Methods
	setBills = () => {
		document.querySelector('#content').scrollTop = 0
		this.props.setLocation('/bills')
		this.props.history.push(`/${this.props.Property.id}/bills`)
	}
	setIncome = () => {
		document.querySelector('#content').scrollTop = 0
		this.props.setLocation('/income')
		this.props.history.push(`/${this.props.Property.id}/income`)
	}
	setExpenses = () => {
		document.querySelector('#content').scrollTop = 0
		this.props.setLocation('/expenses')
		this.props.history.push(`/${this.props.Property.id}/expenses`)
	}

	render() {
		//Properties

		//Template
		return (
			<Wrapper>
				<Inner>
					<First Location={this.props.Location} onClick={this.setBills}>
						Bills
					</First>
					<Second Location={this.props.Location} onClick={this.setIncome}>
						Income
					</Second>
					<Third Location={this.props.Location} onClick={this.setExpenses}>
						Expenses
					</Third>
				</Inner>
			</Wrapper>
		)
	}
}

//Style
const Wrapper = styled.div`
	box-sizing: border-box;
	padding: 10px;
	padding-bottom: 0;
	p {
		font-weight: bold;
		margin: 0;
		font-size: 15px;
		text-align: center;
		height: 27px;
		cursor: pointer;
		box-sizing: border-box;
		letter-spacing: 1px;
	}
`
const Inner = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-gap: 20px;
	max-width: 600px;
	margin: 0 auto;
`

const First = styled.p`
	border-bottom: ${(props) => (props.Location === '/bills' || props.Location === '/' ? '3px var(--colorMain) solid' : 'none')};
	color: ${(props) => (props.Location === '/bills' || props.Location === '/' ? 'white' : 'var(--colorDisabled)')};
`

const Second = styled.p`
	border-bottom: ${(props) => (props.Location === '/income' ? '3px var(--colorMain) solid' : 'none')};

	color: ${(props) => (props.Location === '/income' ? 'white' : 'var(--colorDisabled)')};
`

const Third = styled.p`
	border-bottom: ${(props) => (props.Location === '/expenses' ? '3px var(--colorMain) solid' : 'none')};
	color: ${(props) => (props.Location === '/expenses' ? 'white' : 'var(--colorDisabled)')};
`

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LinkBar))
