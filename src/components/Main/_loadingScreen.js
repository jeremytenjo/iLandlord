//Vendors
import React from 'react'
import styled from 'styled-components'
import CircularProgress from 'material-ui/CircularProgress'

//Components

//Images

//Store
import { connect } from 'react-redux'

//define actions
function mapStateToProps(state) {
  return { LoadingScreen: state.LoadingScreen }
}
//Set global state to prop

class loadingScreen extends React.Component {
  render() {
    //Properties

    //Template
    return (
      <Wrapper id="loadingScreen">
        <Main>
          <CircularProgress
            size={40}
            thickness={5}
            style={CircularStyle}
            innerStyle={innerStyle}
          />
          <p>{this.props.LoadingScreen}</p>
        </Main>
      </Wrapper>
    )
  }
}

//Style
const Wrapper = styled.div`
  z-index: 99999999999;
  background: rgba(255, 255, 255, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  display: none;
`

const Main = styled.div`
  background: white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  height: 80px;
  width: 300px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  border-radius: 10px;
  display: grid;
  grid-template-columns: 40px 1fr;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;
  grid-gap: 10px;

  svg {
    height: 100% !important;
  }

  p {
    margin: 0 auto;
    line-height: 80px;
    font-size: 14px;
  }
`

const CircularStyle = {
  height: '80px'
}
const innerStyle = {
  height: '80px'
}

export default connect(
  mapStateToProps,
  null
)(loadingScreen)
