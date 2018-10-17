//Vendors
import React from 'react'
import styled from 'styled-components'
import Hammer from 'react-hammerjs'
import { withRouter } from 'react-router'
import firebase from 'firebase'

//Components
import ItemIncome from './itemIncome'
import Skeleton from '../../../../_global/Skeletons.js'
import Form from '../_Form/'

//Images

//functions
import fetchFirestoreGetAll from '../../../../../services/Firebase/functions/getAll.js' //type, propertyId, idname

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setIncomes } from '../_state/Income/actions'
import { setIncomePayments } from '../_state/IncomePayments/actions'
import { setLocation } from '../../../../../services/Redux/Location/actions'
import { setProperties } from '../../../../../services/Redux/Properties/actions'
import { setProperty } from '../../../../../services/Redux/Property/actions'

//define actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setLocation,
      setProperties,
      setIncomes,
      setProperty,
      setIncomePayments
    },
    dispatch
  )
}
//Set global state to prop
function mapStateToProps(state) {
  return {
    Location: state.Location,
    Property: state.Property,
    Income: state.Income,
    IncomeLoading: state.IncomeLoading
  }
}
class Income extends React.Component {
  //initial state
  constructor(props) {
    super(props)
    this.state = {
      skeletons: '',
      loading: true,
      incomeList: '',
      propertyId: '',
      formOpen: false,
      incomeData: '',
      type: ''
    }
  }

  //Methods
  componentWillMount() {
    let skeletons = []

    for (var i = 0; i < 6; i++) {
      skeletons.push(
        <Con key={Math.random()} loading={this.state.loading}>
          <Skeleton amount={5} />
        </Con>
      )
    }

    this.setState({ skeletons })
  }
  componentDidMount = async () => {
    let path = this.props.location.pathname.split('/')
    this.props.setLocation(`/${path[2]}`)
    if (document.querySelector('#content')) {
      document.querySelector('#content').scrollTop = 0
    }

    //Get Data
    //check onloine ony if no data locally
    if (this.props.Income.length === 0) {
      let incomes,
        incomePayments,
        pathname = this.props.location.pathname.split('/'),
        urlProperty = pathname[1]

      if (urlProperty === '') {
        let propertiesData = await firebase
          .firestore()
          .collection('properties')
          .where('userId', '==', firebase.auth().currentUser.uid)
          .orderBy('addedDate')
          .limit(1)
          .get()

        let propertyId = propertiesData.docs[0].id,
          fetchedProperty = propertiesData.docs[0].data()

        //set property data
        let propertyData = fetchedProperty
        propertyData.id = propertyId
        this.props.setProperty(propertyData)

        //set property id
        urlProperty = propertyId
      } else {
        var docRef = await firebase
          .firestore()
          .collection('properties')
          .doc(urlProperty)
          .get()

        //set property data
        let propertyData = docRef.data()
        propertyData.id = urlProperty
        this.props.setProperty(propertyData)
      }

      //get properties data
      incomes = await fetchFirestoreGetAll('incomes', this.props.Property.id, 'incomeId')
      incomePayments = await fetchFirestoreGetAll('incomePayments', this.props.Property.id, 'incomePaymentId')

      this.props.setIncomes(incomes)
      this.props.setIncomePayments(incomePayments)

      let currentDate = new Date(),
        incomeList = incomes.map((income, index) => (
          <ItemIncome
            key={Math.random()}
            {...income}
            date={currentDate}
            handleForm={(data) => this.setState({ formOpen: data.open, incomeData: data })}
          />
        ))

      this.setState({ loading: false, incomeList, propertyId: urlProperty })
    } else {
      //get data locally
      let currentDate = new Date(),
        incomeList = this.props.Income.map((income, index) => (
          <ItemIncome
            key={Math.random()}
            {...income}
            date={currentDate}
            handleForm={(data) => this.setState({ formOpen: data.open, incomeData: data })}
          />
        ))

      this.setState({ loading: false, incomeList })
    }
  }

  componentWillUpdate(nextProps, nextState) {
    //update only when store has been updated
    if (nextProps.Income !== this.props.Income) {
      let currentDate = new Date(),
        incomeList = nextProps.Income.map((income, index) => (
          <ItemIncome
            key={Math.random()}
            {...income}
            date={currentDate}
            handleForm={(data) => this.setState({ formOpen: data.open, incomeData: data })}
          />
        ))

      this.setState({ loading: false, incomeList })
    }
  }

  toOther = (e) => {
    if (e.direction === 2) {
      this.props.history.push(`/${this.props.Property.id}/expenses`)
      this.props.setLocation('/expenses')
    } else if (e.direction === 4) {
      this.props.history.push(`/${this.props.Property.id}/bills`)
      this.props.setLocation('/bills')
    }
  }

  render() {
    //Properties

    //Template
    return this.state.loading === true ? (
      <Hammer onSwipe={this.toOther} direction="DIRECTION_HORIZONTAL">
        <div style={{ height: 'calc(100vh - 107px)' }}>
          <Wrapper Location={this.props.Location}>{this.state.skeletons}</Wrapper>
        </div>
      </Hammer>
    ) : (
      <Hammer onSwipe={this.toOther} direction="DIRECTION_HORIZONTAL">
        <div style={{ height: 'calc(100vh - 107px)' }}>
          <Wrapper Location={this.props.Location}>{this.state.incomeList}</Wrapper>
          <Form
            dest="Update"
            title="Update Income"
            open={this.state.formOpen}
            incomeId={this.state.incomeData.incomeId}
            name={this.state.incomeData.name}
            type={this.state.incomeData.type}
            unit={this.state.incomeData.unit}
            amount={this.state.incomeData.amount}
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Income))
