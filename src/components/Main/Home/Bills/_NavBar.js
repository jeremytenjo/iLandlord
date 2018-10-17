//Vendors
import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router'

//Components
import { Tabs, Tab } from 'material-ui/Tabs'
import FlatButton from 'material-ui/FlatButton'
import Form from './_Form/'

//Images
import AddIMG from 'material-ui/svg-icons/content/add-circle-outline'

//Functions

//Store
//import {bindActionCreators} from 'redux'
//import {connect} from 'react-redux'
//import {triggerAction} from './_state/actions'

//Actions

//Reducers

//Dynamic Components

class NavBar extends React.Component {
  //initial state
  constructor(props) {
    super(props)

    this.state = {
      ...props,
      value: '',
      formOpen: false
    }
  }

  //Methods
  componentWillMount() {
    let path = window.location.pathname.split('/')

    this.setState({ value: path[3] })
  }

  handleChange = (value) => {
    let path = window.location.pathname.split('/')
    this.props.history.push(`/${path[1]}/bills/${value}`)

    // this.props.Set_Location(location)
    this.setState({
      value: value
    })
  }
  openAddBill = () => {
    this.setState({ formOpen: true })
  }
  render() {
    //Properties
    let isReport = this.props.location.pathname.includes('report'),
      value
    if (isReport === true) {
      value = 'report'
    } else {
      value = ''
    }
    //Template
    return (
      <Wrapper>
        <Top>
          <Tabs tabItemContainerStyle={TabsStyle} onChange={this.handleChange} value={value}>
            <Tab label="List" value="" />
            <Tab label="Report" value="report" className="linkReport" />
          </Tabs>
          <FlatButton
            onClick={this.openAddBill}
            style={AddbutonStyle}
            icon={<AddIMG color="#BDBDBD" style={AddbutonStyle} />}
          />
        </Top>
        <Form
          title="New Bill"
          dest="Create"
          open={this.state.formOpen}
          handleFormOpen={(value) => this.setState({ formOpen: value })}
        />
      </Wrapper>
    )
  }
}

//Style
const Wrapper = styled.div``
const TabsStyle = { backgroundColor: 'none' }
const Top = styled.div`
  display: grid;
  grid-template-columns: 1fr 88px;
`
const AddbutonStyle = {
  height: '48px'
}
//export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
export default withRouter(NavBar)
