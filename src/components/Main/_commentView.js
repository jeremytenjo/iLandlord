//Vendors
import React from 'react'
import styled from 'styled-components'
import {TweenMax} from "gsap"
import Hammer from 'react-hammerjs'

//Components

//Images
import IconArrow from '../../images/icons/downArrow.svg'

//Functions

//Store
// import {bindActionCreators} from 'redux'
// import {connect} from 'react-redux'
// import {setComment} from '../../store/Comment/actions'

//define actions

//Set global state to prop

class CommentView extends React.Component {

  //initial state
  constructor(props) {
    super(props)
    this.state = {
      ...props,
      comment: ''
    }
  }

  //Methods
  hideComment = () => {
    let CommentDialogView = document.querySelector('#CommentDialogView')
    TweenMax.to(CommentDialogView, .2, {top: "-100%"})

  }

  render() {
    //Properties

    //Template
    return (
      <Hammer onSwipe={this.hideComment} direction="DIRECTION_UP">
        <div>
          <Wrapper id="CommentDialogView">
      <Header>
        <h2>Comment</h2>
        <img src={IconArrow} alt="arrow" onClick={this.hideComment}/>
      </Header>
      <p id="CommentViewText"></p>
      {/* <Button onClick={this.setComment}>Add</Button> */}
    </Wrapper>
  </div>
</Hammer>);
  }

}

//Style
const Wrapper = styled.div `
background: white;
position: fixed;
height: 50%;
width: 100%;
top: -100%;
left: 0;
z-index: 3;
display: grid;
grid-template-columns: 100%;
${ ''/* grid-template-rows: auto 1fr 40px; */}
grid-template-rows: auto 1fr ;
padding: 10px;
box-sizing: border-box;
grid-row-gap: 10px;
box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
        `;
const Header = styled.div `
position: relative;
  h2 {
    color: var(--colorBg);
    text-align: center;
    margin: 0;
  }

  img {
    width: 20px;
    transform: rotate(180deg);
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
  }

         `;

export default CommentView
