//Vendors
import React from 'react'
import styled from 'styled-components'
import { VictoryPie } from 'victory'
import CircularProgress from 'material-ui/CircularProgress'
import { withRouter } from 'react-router'

//Components
import TimePicker from '../../../../_global/TimePicker2'

//Images

//Functions

//Store
//import {bindActionCreators} from 'redux'
import { connect } from 'react-redux'
//import {triggerAction} from '../state/actions/index'

//define actions
//Set global state to prop
function mapStateToProps(state) {
	return {
		Loading: state.Loading,
		Property: state.Property,
		DateSelectionReport: state.DateSelectionReport,
		Expenses: state.Expenses,
		ExpensePayments: state.ExpensePayments
	}
}

class Expenses extends React.Component {
	//initial state
	constructor(props) {
		super(props)
		this.state = {
			...props,
			month: '',
			year: ''
		}
	}

	//Methods
	componentWillReceiveProps(nextProps) {
		this.setState({
			...nextProps
		})
	}
	componentDidMount() {
		//add event listener -  wehn more than 1200px redirect
		let windowWidth = window.innerWidth

		if (windowWidth >= 1200) {
			this.props.history.push(`/${this.props.Property.id}/report`)
		}
		window.onresize = () => {
			if (window.innerWidth >= 1200) {
				this.props.history.push(`/${this.props.Property.id}/report`)
			}
		}
	}

	componentWillUnmount() {
		//Remove event listener -  wehn more than 1200px redirect
		window.onresize = null
	}
	render() {
		//Properties
		let info,
			ExpensesData = [],
			Expense = {},
			sortedMonth,
			sortedYear,
			total = 0

		//Expense data
		//sort date
		//filter month

		sortedMonth = this.props.ExpensePayments.filter((el) => {
			return el.month === this.props.DateSelectionReport.month
		})

		//show all months
		if (this.props.DateSelectionReport.month === 'All') {
			sortedYear = this.props.ExpensePayments.filter((el) => {
				return el.year === this.props.DateSelectionReport.year
			})
		} else {
			sortedYear = sortedMonth.filter((el) => {
				return el.year === this.props.DateSelectionReport.year
			})
		}

		sortedYear.map((ExpensePayment) => {
			// get Expense name
			info = this.props.Expenses.filter((Expense) => {
				return Expense.expenseId === ExpensePayment.expenseId
			})

			if (info.length !== 0) {
				// set Expense category
				Expense.x = info[0].category

				// set Expense amount
				Expense.y = parseInt(ExpensePayment.amount, 10)

				// set both
				ExpensesData.push(Expense)

				// reset
				return (Expense = {})
			}
			return ''
		})

		//group providers
		//sort store data by provider
		ExpensesData.sort(function(a, b) {
			var nameA = a.x.toUpperCase() // ignore upper and lowercase
			var nameB = b.x.toUpperCase() // ignore upper and lowercase
			if (nameA < nameB) {
				return -1
			}
			if (nameA > nameB) {
				return 1
			}

			// names must be equal
			return 0
		})

		let datasetobj = { x: '', y: 0 },
			dataset = [],
			i = 0,
			delIndex

		for (let payment of ExpensesData) {
			i = i + 1

			if (datasetobj.x === payment.x) {
				i = i - 1

				//remove previous object
				delIndex = i - 1
				dataset.splice(delIndex, 1)

				//replace with new object with same name but with added value
				datasetobj.x = payment.x
				datasetobj.y = datasetobj.y + payment.y

				dataset.push(datasetobj)
			} else {
				datasetobj = {}
				//set new object
				datasetobj.x = payment.x
				datasetobj.y = payment.y

				dataset.push(datasetobj)
			}
		}

		//add all amounts
		dataset.map((item) => {
			return (total = total + item.y)
		})

		let colorset = ['#00E676', '#68EDCB', '#FFDC82', '#2CACFF', '#0079FF', '#F36900', '#8C9EFF']

		//sort by value
		let dataset2 = dataset

		dataset2.sort(function(a, b) {
			var nameA = a.y
			var nameB = b.y
			if (nameA > nameB) {
				return -1
			}
			if (nameA < nameB) {
				return 1
			}

			// names must be equal
			return 0
		})

		let Rows = dataset2.map((item, i) => {
			let perc = item.y * 100 / total
			return (
				<Row key={Math.random()}>
					<div style={{ background: colorset[i], maxHeight: '15px' }} />
					<span>{item.x}</span>
					<span>${item.y.toLocaleString()}</span>
					<span>{perc.toFixed()}%</span>
				</Row>
			)
		})
		//Template
		return this.props.Loading === true ? (
			<LoadingCon>
				<CircularProgress size={80} thickness={5} color="#00C853" />
			</LoadingCon>
		) : (
			<Wrapper show={this.state.show}>
				<TimepickerCon show={this.state.hideTimePicker}>
					<TimePicker source="report" />
				</TimepickerCon>
				<Content>
					<VictoryPie
						style={{ labels: { fill: 'white' } }}
						colorScale={colorset}
						data={dataset}
						height={250}
						padAngle={3}
						cornerRadius={2}
					/>
				</Content>

				<Dataset>{Rows}</Dataset>

				<Footer>
					<h3>TOTAL: ${total.toLocaleString()}</h3>
				</Footer>
			</Wrapper>
		)
	}
}

//Style
const Wrapper = styled.div`
	display: grid;
	height: 100%;
	grid-template-columns: 100%;
	grid-template-rows: 40px 250px auto 50px;
	overflow: hidden;
	color: white;

	@media (min-width: 900px) {
		display: grid !important;
		height: auto;
		width: 400px;
		margin: 0 auto;
	}
	@media (min-width: 1200px) {
		background: #1f3a67;
		border-radius: 10px;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
		grid-template-rows: 280px auto 60px;
		margin-top: 15px;
	}
`
const TimepickerCon = styled.div`
	display: ${(props) => (props.show === true ? 'none' : 'block')};
	width: 100%;
	max-width: 400px;
	margin: 0 auto;
`

const Content = styled.div`
	overflow: hidden;
	box-sizing: border-box;

	div {
		height: 245px !important;
		z-index: -1;
		@media (min-width: 1200px) {
			z-index: 0;
		}
	}
`
const Dataset = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: auto;
	overflow: scroll;
	grid-gap: 15px;
	overflow-x: hidden;
	grid-template-rows: repeat(auto-fill, 20px);

	@media (min-width: 600px) {
		padding-right: 10px;
		padding-left: 10px;
		box-sizing: border-box;
		grid-template-rows: repeat(auto-fill, 40px);
	}
`
const Row = styled.div`
	display: grid;
	grid-template-columns: 20px 1fr auto auto;
	font-size: 12px;
	height: auto;
	grid-gap: 10px;
	@media (min-width: 600px) {
		font-size: 14px;
	}
`
const Footer = styled.div`
	text-align: center;
	@media (min-width: 900px) {
		${'' /* grid-area: Footer; */};
	}
`

const LoadingCon = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	margin: auto;
	width: 80px;
	height: 80px;
`
export default withRouter(connect(mapStateToProps, null)(Expenses))
