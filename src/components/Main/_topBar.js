//Vendors
import React from 'react'
import styled from 'styled-components'
import { TweenMax } from 'gsap'
import { withRouter } from 'react-router'

//Components
import SideBar from './_SideBar/'

//Images
import IconMenu from '../../images/icons/menu.svg'

//functions

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setBills } from './Home/Bills/_state/Bills/actions'
import { setBillPayments } from './Home/Bills/_state/BillPayments/actions'
import { setExpenses } from './Home/Expenses/_state/Expenses/actions'
import { setExpensePayments } from './Home/Expenses/_state/ExpensePayments/actions'
import { setIncomes } from './Home/Income/_state/Income/actions'
import { setIncomePayments } from './Home/Income/_state/IncomePayments/actions'

//define actions
function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			setBills,
			setBillPayments,
			setExpenses,
			setExpensePayments,
			setIncomes,
			setIncomePayments
		},
		dispatch
	)
}

//Set global state to prop
function mapStateToProps(state) {
	return {
		Property: state.Property,
		Bills: state.Bills,
		BillPayments: state.BillPayments
	}
}

class topBar extends React.Component {
	//initial state
	constructor(props) {
		super(props)
		this.state = {
			...props
		}
	}

	//Methods

	showSidebar = () => {
		let sideBar = document.querySelector('#sideBar'),
			sideBarinner = document.querySelector('#sideBarinner')

		sideBar.style.display = 'block'
		TweenMax.to(sideBar, 0.2, { background: 'rgba(0, 0, 0, .8)' })

		TweenMax.to(sideBarinner, 0.2, { left: 0 })

		this.props.history.push(this.props.location.pathname)
		window.onkeydown = (e) => {
			if (e.key === 'BrowserBack') {
				TweenMax.to(sideBar, 0.2, { background: 'rgba(0, 0, 0, 0)' })

				TweenMax.to(sideBarinner, 0.2, { left: '-100%' })

				TweenMax.to(sideBar, 0.1, {
					delay: 0.2,
					display: 'none'
				})
			}
		}
	}

	render() {
		//Properties

		//Template
		return (
			<Wrapper>
				<img src={IconMenu} alt="menu button" onClick={this.showSidebar} />
				<h1>{this.props.Property.name}</h1>
				<SideBar />
			</Wrapper>
		)
	}
}

//Style
const Wrapper = styled.div`
	box-sizing: border-box;
	position: relative;
	height: 50px;
	padding-left: 20px;
	padding-right: 20px;
	z-index: 2;
	width: 100%;
	position: relative;

	h1 {
		margin: 0;
		font-size: 19px;
		font-weight: 400;
		color: white;
		margin-left: 35px;
		line-height: 50px;
	}

	img {
		width: 20px;
		height: 100%;
		cursor: pointer;
		position: absolute;
		top: 0;
		bottom: 0;
		margin: auto;
	}
`

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(topBar))
