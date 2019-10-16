//Vendors
import React from 'react'
import { withRouter } from 'react-router'
import firebase from 'firebase'
import styled from 'styled-components'
import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router-dom'

//Components
import NavBar from './_NavBar'
//Images

//functions
import fetchFirestoreGetAll from '../../../../services/Firebase/functions/getAll.js' //type, propertyId, idname

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setBills } from './_state/Bills/actions'
import { setBillPayments } from './_state/BillPayments/actions'
import { ToggleBillsLoading } from './_state/Loading/actions'
import { setProperties } from '../../../../services/Redux/Properties/actions'
import { setProperty } from '../../../../services/Redux/Property/actions'

//define actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
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
    Properties: state.Properties
  }
}

//Dynamic Components
const List = Loadable({
  loader: () => import('./List'),
  loading: () => null
})
const Report = Loadable({
  loader: () => import('./Report'),
  loading: () => null
})

class Bills extends React.Component {
  //initial state
  constructor(props) {
    super(props)
    this.state = {
      billsList: '',
      propertyId: ''
    }
  }

  //Methods

  componentDidMount = async () => {
    //Get Data
    //check onloine ony if no data locally
    if (this.props.Bills.length === 0) {
      let bills,
        billPayments,
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

        //if url blank add propertyid to url
        let path = window.location.pathname.split('/')

        if (path.length === 2) {
          this.props.history.push(`/${propertyId}/bills`)
        }
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

      bills = await fetchFirestoreGetAll('bills', urlProperty, 'billId')
      billPayments = await fetchFirestoreGetAll(
        'billPayments',
        urlProperty,
        'billPaymentId'
      )

      this.props.setBills(bills)
      this.props.setBillPayments(billPayments)
      this.props.ToggleBillsLoading(false)
    } else {
      this.props.ToggleBillsLoading(false)
    }
  }

  render() {
    //Properties

    //Template
    return (
      <Wrapper>
        <NavBar />
        <Content className="react-transition fade-in">
          <Switch>
            <Route exact={true} path="/" component={List} />
            <Route exact={true} path="/:id/" component={List} />
            <Route exact={true} path="/:id/bills" component={List} />
            <Route exact={true} path="/:id/bills/report" component={Report} />
          </Switch>
        </Content>
      </Wrapper>
    )
  }
}

//Style
const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
`
const Content = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
`
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Bills)
)
