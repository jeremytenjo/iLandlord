//Vendors
import React from 'react'
import styled from 'styled-components'
import { TweenMax } from 'gsap'
//Components

//Images
import miniArrow from '../../../images/icons/miniArrow.svg'

//Store
//import {bindActionCreators} from 'redux'
//import {connect} from 'react-redux'
//import {triggerAction} from '../state/actions/index'

//define actions
//Set global state to prop

class InputSelection extends React.Component {
  //initial state
  constructor(props) {
    super(props)
    this.state = {
      color: props.color,
      options: props.options,
      value: props.value,
      open: false,
      FN_selectedValue: props.selectedValue,
      titleColor: props.titleColor || 'white'
    }
  }

  //Methods
  expand = (e) => {
    let contentCon

    if (e.target.nodeName !== 'DIV') {
      contentCon = e.target.parentNode.parentNode.childNodes[1]
    } else {
      contentCon = e.target.parentNode.childNodes[1]
    }

    if (this.state.open === false) {
      TweenMax.to(contentCon, 0.2, {
        transform: 'scaleY(1)',
        opacity: 1
      })

      this.setState({ open: true })
    } else {
      TweenMax.to(contentCon, 0.1, {
        delay: 0.1,
        transform: 'scaleY(0)',
        opacity: 0,
        padding: 0
      })

      this.setState({ open: false })
    }
  }

  select = (e, value) => {
    let contentCon = e.target.parentNode

    TweenMax.to(contentCon, 0.1, {
      delay: 0.1,
      transform: 'scaleY(0)',
      opacity: 0,
      padding: 0
    })

    this.setState({ value: value.option, open: false })

    this.state.FN_selectedValue(value.option)
  }

  render() {
    //Properties
    let optionsList = this.state.options.map((option) => {
      if (option === this.state.value) {
        return (
          <span
            style={{
              color: this.state.color
            }}
            key={Math.random()}
            id={1}
            onClick={(e) => this.select(e, { option })}
          >
            {option}
          </span>
        )
      }

      return (
        <span
          style={{
            background: 'white'
          }}
          key={Math.random()}
          id={1}
          onClick={(e) => this.select(e, { option })}
        >
          {option}
        </span>
      )
    })
    //Template
    return (
      <Wrapper>
        <Header onClick={this.expand} titleColor={this.state.titleColor}>
          <p>{this.state.value}</p>
          <img src={miniArrow} alt="arrow" />
        </Header>

        <Content>{optionsList}</Content>
      </Wrapper>
    )
  }
}

//Style
const Wrapper = styled.div`
  height: 40px;
`
const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 24px;
  cursor: pointer;
  padding-top: 15px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--colorLightGrey);
  height: 40px;

  p {
    color: ${(props) => props.titleColor};
    font-weight: bold;
    font-size: 14px;
    margin: 0;
  }

  img {
    width: 9px !important;
    margin-top: 4px;
  }
`
const Content = styled.div`
  background: white;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;
  width: 100%;
  height: auto;
  max-height: 300px;
  overflow-y: auto;
  display: grid;
  grid-template-rows: 32px;
  transform-origin: top;
  border-radius: 2px;
  transform: scaleY(0);
  opacity: 0;
  @media (min-width: 1200px) {
    z-index: 1;
    position: relative;
  }

  span {
    color: var(--colorBg);
    width: 100%;
    font-size: 15px;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    padding-top: 7px;
    height: 32px;

    &:hover {
      background: var(--colorLightGrey);
    }

    &:active {
      background: var(--colorLightGrey);
    }
  }
`
//export default connect(mapStateToProps, mapDispatchToProps)(InputSelection);
export default InputSelection
