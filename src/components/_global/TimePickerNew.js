//Vendors
import React from 'react'
import styled from 'styled-components'

//Components
import InputSelection from './Forms/InputSelection.js'

//Images

//define actions

//Set global state to prop

class TimePicker extends React.Component {
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
			currentYear = d.getFullYear(),
			currentMonth = d.getMonth() + 1,
			currentDate = { month: months[currentMonth], year: currentYear }

		//set current date
		this.setState({ month: months[currentMonth], year: currentYear })
		this.state.setDate(currentDate)
	}

	setMonth = (value) => {
		this.setState({ month: value })
		this.state.setMonth(value)
	}
	setYear = (value) => {
		this.setState({ year: value })
		this.state.setYear(value)
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
			years = []

		//make year list from the past 10 years
		for (var i = 0; i < 10; i++) {
			years.push(this.state.year - [i])
		}

		//Template
		return (
			<Wrapper>
				<InputSelection
					options={months}
					value={this.state.month}
					color={'#1DE9B6'}
					selectedValue={(value) => this.setMonth(value)}
				/>

				<InputSelection
					options={years}
					value={this.state.year}
					color={'#1DE9B6'}
					selectedValue={(value) => this.setYear(value)}
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
	position: relative;
	margin-right: 5px;
`

export default TimePicker
