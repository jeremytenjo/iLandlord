//Vendors
import React from 'react'
import styled from 'styled-components'

//Components
import InputSelection from './Forms/InputSelection.js'

//Images

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setDate } from '../../services/Redux/DateSelection/actions'
import { setDateReport } from '../../services/Redux/DateSelectionReport/actions'

//define actions
function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			setDate,
			setDateReport
		},
		dispatch
	)
}
//Set global state to prop

class TimePicker extends React.Component {
	//initial state
	constructor(props) {
		super(props)
		this.state = {
			source: props.source || '',
			month: '',
			year: '',
			titleColor: 'var(--colorBg)'
		}
	}

	//Methods
	componentWillMount = () => {
		let d = new Date(),
			months = [
				'All',
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December'
			],
			// month = d.getMonth(),
			year = d.getFullYear()

		//set current date
		this.setState({ month: months[0], year })
	}

	handleMonth = (event, index, value) => this.setState({ month: value })

	handleYear = (event, index, value) => this.setState({ year: value })

	setMonth = (value) => {
		this.setState({ month: value })
	}
	setYear = (value) => {
		this.setState({ year: value })
	}

	render() {
		//Properties

		let months = [
				'All',
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December'
			],
			years = [],
			currentDate = {
				month: this.state.month,
				year: this.state.year
			}

		//make year list from the past 10 years
		for (var i = 0; i < 10; i++) {
			years.push(this.state.year - [i])
		}

		this.props.setDate(currentDate)

		//Template
		return (
			<Wrapper>
				<InputSelection
					options={months}
					value={this.state.month}
					color={'#1DE9B6'}
					selectedValue={(value) => this.setMonth(value)}
					titleColor={this.state.titleColor}
				/>

				<InputSelection
					options={years}
					value={this.state.year}
					color={'#1DE9B6'}
					selectedValue={(value) => this.setYear(value)}
					titleColor={this.state.titleColor}
				/>
			</Wrapper>
		)
	}
}

//Style
const Wrapper = styled.div`
	margin: 0 auto;
	margin-top: 0px;
	margin-bottom: 10px;
	cursor: pointer;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 10px;
	margin-left: 5px;
	margin-right: 5px;
	z-index: 2;
	position: relative;
	margin-right: 5px;
`

export default connect(null, mapDispatchToProps)(TimePicker)
