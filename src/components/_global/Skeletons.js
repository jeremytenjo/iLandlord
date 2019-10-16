//Vendors
import React from 'react'
import styled from 'styled-components'
import 'react-loading-skeleton'
//Components

//Images

//Store
//import {bindActionCreators} from 'redux'
//import {connect} from 'react-redux'
//import {triggerAction} from '../state/actions/index'

//define actions
//Set global state to prop

class Bill extends React.Component {
  //initial state
  constructor(props) {
    super(props)
    this.state = {
      ...props
    }
  }

  //Methods

  render() {
    //Properties

    let amount = []
    for (var i = 0; i < this.state.amount; i++) {
      amount.push(<span key={Math.random()} amount={this.state.amount} />)
    }
    //Template
    return <Wrapper>{amount}</Wrapper>
  }
}

//Style
const Wrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 10px;
  display: grid;
  grid-row-gap: 10px;

  @media (min-width: 600px) {
    height: ${(props) => props.amount * 17} + 'px';
  }

  span {
    animation: progress 0.5s ease-in-out infinite;
    background-color: #eee;
    background-image: linear-gradient(90deg, #eee, #e0e0e0, #eee);
    background-size: 200px 100%;
    background-repeat: no-repeat;
    border-radius: 4px;
    display: inline-block;
    line-height: 1;
    width: 100%;
    height: 17px;
  }
`
//export default connect(mapStateToProps, mapDispatchToProps)(Bill);
export default Bill
