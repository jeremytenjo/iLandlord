//Vendors
import React from 'react'
import styled from 'styled-components'

//Components

//Images

//Store
import {connect} from 'react-redux'

//define actions
function mapStateToProps(state) {
  return {Snackbar: state.Snackbar}
 }
//Set global state to prop

class snackbar extends React.Component {

  //initial state
  constructor(props) {
    super(props)
    this.state = {
      data: 'initial'
    }
  }

  //Methods

  render() {
    //Properties

    //Template
    return (<Wrapper id="snackbar">
      <p>{this.props.Snackbar}</p>
    </Wrapper>);
  }

}

//Style
const Wrapper = styled.div `
  z-index: 99;
background: rgba(66,66,66 , .8);
height: 50px;
width: 300px;
position: fixed;
bottom: -50px;
left: 0;
right: 0;
margin: auto;
border-radius: 50px;
color: white;
-webkit-text-align: center;
text-align: center;
box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
p {
  color: white !important;
  
}

        `;

export default connect(mapStateToProps, null)(snackbar);
