//Vendors
import React from 'react'
import styled from 'styled-components'
import Hammer from 'react-hammerjs'
import { withRouter } from 'react-router'

//Components
import ItemBill from './_itemBill'
import Skeleton from '../../../../_global/Skeletons.js'
import Form from '../_Form/'

//Images

//functions

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setBills } from '../_state/Bills/actions'
import { setBillPayments } from '../_state/BillPayments/actions'
import { ToggleBillsLoading } from '../_state/Loading/actions'
import { setLocation } from '../../../../../services/Redux/Location/actions'
import { setProperties } from '../../../../../services/Redux/Properties/actions'
import { setProperty } from '../../../../../services/Redux/Property/actions'

//define actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setLocation,
      setBills,
      setBillPayments,
      setProperties,
      setProperty,
      ToggleBillsLoading
    },
    dispatch
  )
}

//Set global state to prop
function mapStateToProps(state) {
  return {
    Bills: state.Bills,
    BillPayments: state.BillPayments,
    Property: state.Property,
    Location: state.Location,
    BillsLoading: state.BillsLoading,
    Properties: state.Properties
  }
}

class Bills extends React.Component {
  //initial state
  constructor(props) {
    super(props)
    this.state = {
      skeletons: '',
      loading: true,
      billsList: '',
      formOpen: false,
      billData: '',
      type: ''
    }
  }

  //Methods
  componentWillMount() {
    let skeletons = []

    for (var i = 0; i < 6; i++) {
      skeletons.push(
        <Con key={Math.random()} loading={this.state.loading}>
          <Skeleton amount={4} />
        </Con>
      )
    }

    this.setState({ skeletons })
  }

  componentDidMount = async () => {
    let path = this.props.location.pathname.split('/')
    if (path[1] === '') {
      this.props.setLocation(`/bills`)
    } else {
      this.props.setLocation(`/${path[2]}`)
    }
    if (document.querySelector('#content')) {
      document.querySelector('#content').scrollTop = 0
    }

    let currentDate = new Date(),
      billsList = this.props.Bills.map((bill, index) => (
        <ItemBill
          key={Math.random()}
          {...bill}
          date={currentDate}
          handleForm={(data) => this.setState({ formOpen: data.open, billData: data })}
        />
      ))

    this.setState({ billsList })
  }

  componentWillUpdate(nextProps, nextState) {
    //update only when store has been updated
    if (nextProps.Bills !== this.props.Bills) {
      let currentDate = new Date(),
        billsList = nextProps.Bills.map((bill, index) => (
          <ItemBill
            key={Math.random()}
            {...bill}
            date={currentDate}
            handleForm={(data) => this.setState({ formOpen: data.open, billData: data })}
          />
        ))

      this.setState({ billsList })
    }
  }

  toIncome = () => {
    this.props.history.push(`/${this.props.Property.id}/income`)
    this.props.setLocation('/income')
  }

  render() {
    //Properties
    //Template
    return this.props.BillsLoading === true ? (
      <Hammer onSwipe={this.toIncome} direction="DIRECTION_LEFT">
        <div
          style={{
            height: 'calc(100vh - 107px)'
          }}
        >
          <Wrapper Location={this.props.Location}>{this.state.skeletons}</Wrapper>
        </div>
      </Hammer>
    ) : (
      <Hammer onSwipe={this.toIncome} direction="DIRECTION_LEFT">
        <div
          style={{
            height: 'calc(100vh - 107px)'
          }}
        >
          <Wrapper Location={this.props.Location}>{this.state.billsList}</Wrapper>
          <Form
            dest="Update"
            title="Update Bill"
            open={this.state.formOpen}
            billId={this.state.billData.billId}
            name={this.state.billData.name}
            provider={this.state.billData.provider}
            dueDate={this.state.billData.dueDate}
            handleFormOpen={(value) => this.setState({ formOpen: value })}
          />
        </div>
      </Hammer>
    )
  }
}

//Style
const Wrapper = styled.div`
  display: grid;
  grid-gap: 10px;
  margin-top: 10px;

  @media (min-width: 630px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`
const Con = styled.div`
  display: ${(props) => (props.loading === true ? 'block' : 'none')};
`

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Bills))
