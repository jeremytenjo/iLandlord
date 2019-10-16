//Vendors
import React from 'react'
import styled from 'styled-components'
import LinearProgress from 'material-ui/LinearProgress'

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

class ExpenseItem extends React.Component {
  //initial state
  constructor(props) {
    super(props)
    this.state = {
      ...props,
      completed: 0,
      color: '#00c853'
    }
  }

  //Methods
  componentWillMount() {
    let completed = this.state.spent * 100

    completed = completed / this.state.goal
    completed = Math.floor(completed)

    if (this.state.spent > this.state.goal) {
      this.setState({ color: '#ff5252' })
    }

    if (isNaN(completed) === true) {
      completed = 0
    }
    this.setState({ completed })
  }
  render() {
    //Properties

    //Template
    return (
      <Wrapper>
        <Top>
          <Tile>{this.state.title}</Tile>
          <Results>
            <Spent>
              <span> &nbsp; Spent &nbsp;</span>
              <span> ${this.state.spent.toLocaleString()}</span>
              <span> &nbsp; of &nbsp;</span>
              <span> ${this.state.goal.toLocaleString()}</span>
            </Spent>
            <Rem>
              <span> &nbsp; Remaining &nbsp;</span>
              <span> ${this.state.remaining.toLocaleString()}</span>
            </Rem>
          </Results>
        </Top>
        <LinearProgress
          style={{ zIndex: 0 }}
          mode="determinate"
          value={this.state.completed}
          color={this.state.color}
        />
      </Wrapper>
    )
  }
}

//Style
const Wrapper = styled.div`
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  box-sizing: border-box;
  padding: 10px;
  height: auto;
  max-width: 400px;
  margin: 0 auto;
  border-radius: 10px;
  margin-bottom: 10px;
  display: grid;
  grid-gap: 5px;
  z-index: -1;
  position: relative;
`
const Top = styled.div`
  display: grid;
  grid-template-columns: auto auto;
`
const Tile = styled.span`
  color: var(--colorBg);
  font-weight: 600;
  font-size: 16px;
  margin: 0;
  line-height: 18px;
`
const Results = styled.div`
  text-align: right;
`
const Spent = styled.div`
  margin-bottom: 5px;
  span:nth-child(1) {
    color: var(--colorDisabled);
    font-weight: 600;
    font-size: 12px;
    margin: 0;
    letter-spacing: 1px;
  }
  span:nth-child(2) {
    color: var(--colorBg);
    font-size: 15px;
    margin: 0;
    letter-spacing: 1px;
  }
  span:nth-child(3) {
    color: var(--colorDisabled);
    font-weight: 600;
    font-size: 12px;
    margin: 0;
    letter-spacing: 1px;
  }

  span:nth-child(4) {
    color: var(--colorBg);
    font-size: 15px;
    margin: 0;
    letter-spacing: 1px;
  }
`
const Rem = styled.div`
  span:nth-child(1) {
    color: var(--colorDisabled);
    font-weight: 600;
    font-size: 12px;
    margin: 0;
    letter-spacing: 1px;
  }
  span:nth-child(2) {
    color: var(--colorBg);
    font-size: 15px;
    margin: 0;
    letter-spacing: 1px;
    font-weight: bold;
  }
`
//export default connect(mapStateToProps, mapDispatchToProps)(ExpenseItem)
export default ExpenseItem
