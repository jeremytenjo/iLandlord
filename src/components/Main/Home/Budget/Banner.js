//Vendors
import React from 'react'
import styled from 'styled-components'

//Components

//Images

//Functions

//Store
//import {bindActionCreators} from 'redux'
//import {connect} from 'react-redux'
//import {triggerAction} from './_state/actions'

//Actions

//Reducers

//Dynamic Components

class Banner extends React.Component {
	//initial state
	constructor(props) {
		super(props)
		this.state = {
			...props
		}
	}

	//Methods
	componentWillReceiveProps(nextProps) {
		if (nextProps.total !== this.state.total || nextProps.limitTotal !== this.state.limitTotal) {
			this.setState({ total: nextProps.total, limitTotal: nextProps.limitTotal, budget: nextProps.budget })
		}
	}
	render() {
		//Properties
		//Template
		return this.state.budget === false ? (
			<NoBudget>No budgets set</NoBudget>
		) : (
			<Wrapper>
				<span>Total Spent </span>
				<span> ${this.state.total.toLocaleString()}</span>
				<span>/</span>
				<span>${this.state.limitTotal.toLocaleString()}</span>
			</Wrapper>
		)
	}
}

//Style
const NoBudget = styled.span`
	margin-top: 20px;
`
const Wrapper = styled.div`
	box-sizing: border-box;
	height: auto;
	width: 100%;
	min-width: auto;
	max-width: 400px;
	margin: 0 auto;
	border-radius: 2px;
	margin-top: 30px;
	margin-bottom: 10px;
	@media (min-width: 600px) {
		margin-left: 0;
	}
	span {
		font-size: 15px;
	}
	span:nth-child(1) {
		font-size: 15px;
		font-weight: bold;
		letter-spacing: 1px;
	}
`

//export default connect(mapStateToProps, mapDispatchToProps)(Banner)
export default Banner
