//Vendors
import React from 'react'
import styled from 'styled-components'
import { TweenMax } from 'gsap'
import Hammer from 'react-hammerjs'
import firebase from 'firebase'
import { withRouter } from 'react-router'
import { ListItem } from 'material-ui/List'
import EditIcon from 'material-ui/svg-icons/image/edit'

//Components
import Property from './property'

//Images
import Arrow from '../../../images/icons/downArrow.svg'
import Plus from '../../../images/icons/plus.svg'
import ArrowIcon from '../../../images/icons/downArrow.svg'

//functions
import fetchFirestoreGetAll from '../../../services/Firebase/functions/getAll.js' //type, propertyId, idname

//Store
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setBills } from '../Home/Bills/_state/Bills/actions'
import { setBillPayments } from '../Home/Bills/_state/BillPayments/actions'
import { ToggleBillsLoading } from '../Home/Bills/_state/Loading/actions'
import { setIncomes } from '../Home/Income/_state/Income/actions'
import { setIncomePayments } from '../Home/Income/_state/IncomePayments/actions'
import { setExpenses } from '../Home/Expenses/_state/Expenses/actions'
import { setExpensePayments } from '../Home/Expenses/_state/ExpensePayments/actions'
import { setProperty } from '../../../services/Redux/Property/actions'
import { setProperties } from '../../../services/Redux/Properties/actions'
import { insertProperty } from '../../../services/Redux/Properties/actions'
import { setLoading } from '../../../services/Redux/Loading/actions'
import { showSnackbar } from '../../../services/Redux/Snackbar/actions'
import { showLoadingScreen, hideLoadingScreen } from '../../../services/Redux/LoadingScreen/actions'

//define actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      showSnackbar,
      setProperties,
      insertProperty,
      setBills,
      setBillPayments,
      ToggleBillsLoading,
      setIncomes,
      setProperty,
      setIncomePayments,
      setExpenses,
      setExpensePayments,
      setLoading,
      showLoadingScreen,
      hideLoadingScreen
    },
    dispatch
  )
}

//Set global state to prop
function mapStateToProps(state) {
  return { Properties: state.Properties, Loading: state.Loading }
}
class SideBar extends React.Component {
  //initial state
  constructor(props) {
    super(props)
    this.state = {
      ...props,
      inputExpand: false,
      inputname: ''
    }
  }

  //Methods

  async componentDidMount() {
    //get all properties list
    //Get Data
    let db = firebase.firestore(),
      propertiesData,
      properties = [],
      data

    propertiesData = await db
      .collection('properties')
      .where('userId', '==', firebase.auth().currentUser.uid)
      .orderBy('addedDate')
      .get()

    propertiesData.forEach(function(doc) {
      data = {
        id: doc.id,
        name: doc.data().name
      }
      properties.push(data)
    })

    if (properties.length !== 0) {
      this.props.setProperties(properties)
    } else if (properties.length === 0 && navigator.onLine !== false) {
      //no properties
      let sideBar = document.querySelector('#sideBar'),
        sideBarinner = document.querySelector('#sideBarinner')

      sideBar.style.display = 'block'
      TweenMax.to(sideBar, 0.2, { background: 'rgba(0, 0, 0, .8)' })

      TweenMax.to(sideBarinner, 0.2, { left: 0 })

      this.props.showSnackbar('Add your First Property')
    }
  }

  hideSidebar = () => {
    document.onkeydown = null

    let sideBar = document.querySelector('#sideBar'),
      sideBarinner = document.querySelector('#sideBarinner'),
      ArrowOptionsDown = document.querySelector('#ArrowOptionsDown')

    document.querySelector('#EditConDOwn').style.display = 'none'

    TweenMax.to(ArrowOptionsDown, 0.2, { bottom: '-200px' })

    TweenMax.to(sideBar, 0.2, { background: 'rgba(0, 0, 0, 0)' })

    TweenMax.to(sideBarinner, 0.2, { left: '-100%' })

    TweenMax.to(sideBar, 0.1, {
      delay: 0.3,
      display: 'none'
    })
  }

  openProperty = async (name, id) => {
    this.props.ToggleBillsLoading(true)

    let bills,
      billPayments,
      incomes,
      incomePayments,
      expenses,
      expensePayments,
      path = this.props.location.pathname.split('/')

    this.hideSidebar()

    if (id !== path[1]) {
      this.props.setLoading(true)

      this.props.history.push(`/${id}/bills`)
      this.props.setProperty({ name, id })

      //get properties data
      bills = await fetchFirestoreGetAll('bills', id, 'billId')
      billPayments = await fetchFirestoreGetAll('billPayments', id, 'billPaymentId')
      incomes = await fetchFirestoreGetAll('incomes', id, 'incomeId')
      incomePayments = await fetchFirestoreGetAll('incomePayments', id, 'incomePaymentId')
      expenses = await fetchFirestoreGetAll('expenses', id, 'expenseId')
      expensePayments = await fetchFirestoreGetAll('expensePayments', id, 'expensePaymentId')

      this.props.setBills(bills)
      this.props.setBillPayments(billPayments)
      this.props.ToggleBillsLoading(false)
      this.props.setIncomes(incomes)
      this.props.setIncomePayments(incomePayments)
      this.props.setExpenses(expenses)
      this.props.setExpensePayments(expensePayments)

      this.props.setLoading(false)
    }
  }

  expandInput = () => {
    let HammerWrapper = document.querySelector('#HammerWrapper'),
      plusIcon = document.querySelector('#PlusIconSideBar'),
      input = document.querySelector('#propertyNameInput'),
      InputCon_SideBar = document.querySelector('#InputCon_SideBar')

    input.focus()

    if (this.state.inputExpand === false) {
      TweenMax.to(HammerWrapper, 0.2, { gridTemplateRows: '70px 34px 1fr 48px' })
      TweenMax.to(InputCon_SideBar, 0.2, { transform: 'scaleY(1)' })
      TweenMax.to(plusIcon, 0.2, { transform: 'rotate(45deg)' })
      this.setState({ inputExpand: true })
    } else {
      input.blur()
      TweenMax.to(HammerWrapper, 0.2, { gridTemplateRows: '70px 0px 1fr 48px' })
      TweenMax.to(InputCon_SideBar, 0.2, { transform: 'scaleY(0)' })
      TweenMax.to(plusIcon, 0.2, { transform: 'rotate(-90deg)' })
      this.setState({ inputExpand: false })
    }
  }

  handleNameinput = (e) => {
    this.setState({ inputname: e.target.value })
  }

  submitProperty = async () => {
    if (this.state.inputname !== '') {
      this.props.showLoadingScreen('Adding property...')

      this.expandInput()
      let data = {
        addedDate: new Date(),
        name: this.state.inputname,
        userId: firebase.auth().currentUser.uid
      }

      let newProperty = await firebase
        .firestore()
        .collection('properties')
        .add(data)
      data.id = newProperty.id

      this.props.insertProperty(data)
      this.props.hideLoadingScreen()

      this.props.showSnackbar('Property Added')
      this.setState({ inputname: '' })
    }
  }
  expandOptions = () => {
    let ArrowOptionsDown = document.querySelector('#ArrowOptionsDown')
    TweenMax.to(ArrowOptionsDown, 0.2, { bottom: '0' })
    document.querySelector('#EditConDOwn').style.display = 'block'
  }

  closeOptions = () => {
    let ArrowOptionsDown = document.querySelector('#ArrowOptionsDown')
    TweenMax.to(ArrowOptionsDown, 0.2, { bottom: '-200px' })
    document.querySelector('#EditConDOwn').style.display = 'none'
  }

  signOut = () => firebase.auth().signOut()

  render() {
    //Properties
    let properties = this.props.Properties.map((property) => {
      return (
        <ListItem
          key={Math.random()}
          primaryText={property.name}
          style={{
            color: 'var(--colorBg)'
          }}
          onClick={() => this.openProperty(property.name, property.id)}
        />
      )
    })

    //edited propertei
    let editProperties = this.props.Properties.map((property) => <Property key={Math.random()} {...property} />)
    //Template
    return (
      <Wrapper id="sideBar">
        <Bar id="sideBarinner">
          <Hammer onSwipe={this.hideSidebar} direction="DIRECTION_LEFT">
            <div style={HammerWrapper} id="HammerWrapper">
              <Top>
                <ArrowIMG src={Arrow} atl="arrow" onClick={this.hideSidebar} />
                <h2>Properties</h2>
                <PlusIMG src={Plus} atl="arrow" onClick={this.expandInput} id="PlusIconSideBar" />
              </Top>

              <InputCon id="InputCon_SideBar">
                <input
                  type="text"
                  placeholder="Name"
                  value={this.state.inputname}
                  onChange={this.handleNameinput}
                  id="propertyNameInput"
                />
                <button type="button" onClick={this.submitProperty}>
                  Add
                </button>
              </InputCon>

              <Content>{properties}</Content>

              <OptionsCon>
                <ListItem key={1} primaryText="Edit Properties" leftIcon={<EditIcon />} onClick={this.expandOptions} />
              </OptionsCon>

              <EditCon id="ArrowOptionsDown">
                <ArrowDOwn id="EditConDOwn" src={ArrowIcon} alt="arrow" onClick={this.closeOptions} />
                <Bottom>{editProperties}</Bottom>
              </EditCon>

              <OptionsCon>
                <ListItem
                  key={1}
                  primaryText="Sign Out"
                  onClick={this.signOut}
                  style={{
                    fontSize: '14px'
                  }}
                />
              </OptionsCon>
            </div>
          </Hammer>
        </Bar>
        <Close onClick={this.hideSidebar} />
      </Wrapper>
    )
  }
}

//Style
const HammerWrapper = {
  height: '100%',
  boxSizing: 'borderBox',
  display: 'grid',
  gridTemplateColumns: '100%',
  gridTemplateRows: '70px 0px 1fr 48px'
}

const Wrapper = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 99;
  display: none;
  top: 0;
  left: 0;
  bottom: 0;
`
const Bar = styled.div`
  background: white;
  position: absolute;
  height: 100%;
  width: 90%;
  left: -100%;

  @media (min-width: 600px) {
    width: 400px;
    top: 0;
  }
`
const Close = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
`
const Top = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 20px;
  padding: 20px;
  padding-left: 12px;
  box-sizing: border-box;
  padding-right: 18px;
  position: relative;

  h2 {
    margin: 0;
    text-align: left;
    color: var(--colorBg);
  }
  img {
    margin-top: 5px;
  }
`
const ArrowIMG = styled.img`
  transform: rotate(90deg);
  width: 20px;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 20px;
`
const PlusIMG = styled.img`
  width: 20px;
  cursor: pointer;
  position: absolute;
  left: 140px;
  top: 20px;
`
const Content = styled.div`
  overflow: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
`
const InputCon = styled.div`
  display: grid;
  grid-template-columns: 1fr 40px;
  grid-gap: 5px;
  box-sizing: border-box;
  padding-left: 15px;
  padding-right: 16px;
  transform: scaleY(0);
  transform-origin: top;

  input {
    border: none;
    outline: none;
    font-size: 21px;
    display: block;
    font-weight: bold;
    width: 100%;

    &:focus {
      outline: none;
    }
  }

  button {
    border: 1px solid var(--colorBg);
    background-color: white;
    border-radius: 50px;
    cursor: pointer;
    padding: 0;
    &:focus {
      outline: none;
    }
  }
`
const OptionsCon = styled.div`
  ${'' /* background: red; */} border-top: .1px solid #EEEEEE;
`

const EditCon = styled.div`
  position: absolute;
  bottom: -200px;
  height: 200px;
  background: white;
  width: 100%;
  border-top: 0.1px solid #eeeeee;
`
const ArrowDOwn = styled.img`
  display: none;
  float: right;
  position: static !important;
  height: auto !important;
  transform: translate(-20px, -30px);
`

const Bottom = styled.div`
  overflow: scroll;
  margintop: 30px;
  height: 100%;
  overflow-x: hidden;
`

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SideBar))
