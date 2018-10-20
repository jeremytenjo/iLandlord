//Vendors
import React from 'react'
import styled from 'styled-components'

//Images

//Components

class Offline extends React.PureComponent {
  //initial state
  constructor(props) {
    super(props)
    this.state = {
      ...props
    }
  }

  render() {
    //Template
    return <Wrapper style={this.state.style}>Offline</Wrapper>
  }
}

//Style
const Wrapper = styled.div``

export default Offline
