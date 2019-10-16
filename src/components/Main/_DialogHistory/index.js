//Vendors
import React from 'react'
import styled from 'styled-components'
import { TweenMax } from 'gsap'
import Hammer from 'react-hammerjs'

import Chart from 'chart.js'

//Components
import Rowhistory from './rowHistory'
import TimePicker from '../../_global/TimePicker'

//Images
import IconDownArrow from '../../../images/icons/downArrow.svg'
import IconChart from '../../../images/icons/chart.svg'
import IconClose from '../../../images/icons/close.svg'

//Store
//import {bindActionCreators} from 'redux';
import { connect } from 'react-redux'
//import {triggerAction} from '../state/actions/index';

//define actions
//Set global state to prop
function mapStateToProps(state) {
  return {
    Dialogues: state.Dialogues,
    DateSelection: state.DateSelection,
    Bills: state.Bills,
    BillPayments: state.BillPayments,
    Income: state.Income,
    IncomePayments: state.IncomePayments,
    Expenses: state.Expenses,
    ExpensePayments: state.ExpensePayments
  }
}
class DialogHistory extends React.Component {
  //initial state
  constructor(props) {
    super(props)
    this.state = {
      RowList: ''
    }
  }

  //Methods

  hideDialogHistory = () => {
    let dialog = document.querySelector('#DialogHistory')
    TweenMax.to(dialog, 0.2, { top: '100%' })
  }
  showChart = () => {
    let chartWrapper = document.querySelector('#chartWrapper'),
      chartContainer = document.querySelector('#chartContainer')

    chartWrapper.style.display = 'block'
    TweenMax.to(chartWrapper, 0.2, {
      background: 'rgba(0, 0, 0,  0.61) !important'
    })

    chartContainer.style.opacity = 1
    TweenMax.to(chartContainer, 0.2, {
      width: '100%',
      height: '100%'
    })
  }
  closeChart = () => {
    let chartWrapper = document.querySelector('#chartWrapper'),
      chartContainer = document.querySelector('#chartContainer')

    chartWrapper.style.backgroundColor = 'none'

    TweenMax.to(chartContainer, 0.1, {
      width: 0,
      height: 0,
      opacity: 0
    })

    TweenMax.to(chartWrapper, 0.1, {
      delay: 0.1,
      display: 'none'
    })
  }
  render() {
    //Properties
    let RowList,
      sortedYear,
      sortedMonth,
      sortedFinal,
      payments,
      total = 0,
      int

    if (this.props.Dialogues) {
      //if bill payments
      if (this.props.Dialogues.type === 'bill') {
        payments = this.props.BillPayments.filter((item) => {
          return item.billId === this.props.Dialogues.billId
        })
      }

      //if income payments
      if (this.props.Dialogues.type === 'incomePayment') {
        payments = this.props.IncomePayments.filter((item) => {
          return item.incomeId === this.props.Dialogues.incomeId
        })
      }

      //if expense payments
      if (this.props.Dialogues.type === 'expensePayment') {
        payments = this.props.ExpensePayments.filter((item) => {
          return item.expenseId === this.props.Dialogues.expenseId
        })
      }

      //filter month
      sortedMonth = payments.filter((el) => {
        return el.month === this.props.DateSelection.month
      })

      //show all months
      if (this.props.DateSelection.month === 'All') {
        sortedYear = payments.filter((el) => {
          return el.year === this.props.DateSelection.year
        })
      } else {
        sortedYear = sortedMonth.filter((el) => {
          return el.year === this.props.DateSelection.year
        })
      }

      //sort by date
      sortedFinal = sortedYear.sort(function(a, b) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })
      // console.log(sortedFinal);

      //total amoutn from selected date
      sortedFinal.map((item) => {
        int = parseInt(item.amount, 10)
        return (total = total + int)
      })

      RowList = sortedFinal.map((row, index) => {
        // console.log(row);
        return (
          <Rowhistory
            key={Math.random()}
            type={this.props.Dialogues.type}
            billId={this.props.Dialogues.id}
            {...row}
          />
        )
      })
    }

    let arrayy = [],
      chartData = [],
      labels = []

    //chart
    if (sortedFinal) {
      // console.log(sortedFinal);
      for (let payment of sortedFinal) {
        // let date = new Date(payment.date + ',' + payment.year)
        // date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        arrayy.push({
          // x: date.getDate(),
          y: parseInt(payment.amount, 10)
        })

        labels.push(payment.date)
      }

      chartData = arrayy
      chartData.reverse()
      labels.reverse()
      // console.log(chartData)
      // console.log(labels)

      let HistoryLineCHart = document.querySelector('#HistoryLineCHart'),
        myLineChart = new Chart(HistoryLineCHart, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                data: chartData,
                backgroundColor: 'rgba(0, 199, 83, 0.20)'
              }
            ]
          },
          options: {
            legend: {
              display: false
            }
          }
        })
    }

    //Template
    return (
      <Wrapper id="DialogHistory">
        <Hammer onSwipe={this.hideDialogHistory} direction="DIRECTION_DOWN">
          <div
            style={{
              height: '100%'
            }}
          >
            <IconDownArrowIMG
              src={IconDownArrow}
              alt="arrow down"
              onClick={this.hideDialogHistory}
            />

            <Title>
              <span>
                {this.props.Dialogues.name}
                {this.props.Dialogues.category}
                &nbsp;
              </span>
              <span>Payment History</span>
            </Title>
            <SubTitle>{this.props.Dialogues.provider}</SubTitle>

            <TimePicker />

            <Table>
              <ListCon>{RowList}</ListCon>

              <ChartWrapper id="chartWrapper">
                <ChartContainer id="chartContainer">
                  <Topp>
                    <p>Usage</p>
                    <img
                      src={IconClose}
                      alt="close"
                      onClick={this.closeChart}
                    />
                  </Topp>

                  <canvas id="HistoryLineCHart" width="400" height="400" />
                </ChartContainer>
              </ChartWrapper>
            </Table>

            <TotalCon>
              <p>Total: ${total.toLocaleString()}</p>
            </TotalCon>

            <ChartBton src={IconChart} alt="chart" onClick={this.showChart} />
          </div>
        </Hammer>
      </Wrapper>
    )
  }
}

//Style
const Wrapper = styled.div`
  position: fixed;
  background: white;
  height: 100%;
  width: 100%;
  z-index: 2;
  top: 100%;
  left: 0;
  padding: 10px;
  padding-bottom: 30px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow: hidden;
`

const IconDownArrowIMG = styled.img`
  width: 20px;
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
`

const Title = styled.p`
  text-align: center;
  font-weight: bold;
  margin: 0;
  margin-bottom: 5px;
  color: var(--colorBg);
  font-size: 20px;
`

const SubTitle = styled.p`
  text-align: center;
  margin: 0;
  margin-top: 0;
  color: var(--colorBg);
  margin-bottom: 10px;
`

const Table = styled.div`
  width: 100%;
  height: calc(100% - 94px);
  overflow: auto;
  padding-top: 5px;
  overflow-x: hidden;
  display: grid;
  grid-template-columns: minmax(max-content, auto) 1fr;
  grid-gap: 20px;
  @media (max-width: 800px) {
    display: block;
  }
`
const ListCon = styled.div``
const ChartWrapper = styled.div`
  display: none;

  @media (max-width: 800px) {
    z-index: 4;
    position: fixed;
    background: rgba(0, 0, 0, 0.61);
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  @media (min-width: 800px) {
    display: block !important;
    background: rgba(0, 0, 0, 0) !important;
  }
`
const ChartContainer = styled.div`
  box-sizing: border-box;
  padding: 10px;

  img {
    width: 20px;
    cursor: pointer;
    @media (min-width: 800px) {
      display: none;
    }
  }
  @media (max-width: 800px) {
    position: absolute;
    width: 0;
    height: 0;
    background: white;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    border-radius: 10px;
  }

  @media (min-width: 800px) {
    opacity: 1 !important;
  }
`
const Topp = styled.div`
  display: grid;
  grid-template-columns: 1fr 20px;

  p {
    text-align: center;
  }
  img {
    margin-top: 18px;
    width: 15px;
  }
`
const TotalCon = styled.div`
  border-top: 1px solid var(--colorLightGrey);
  background: white;
  height: 30px;
  width: 95%;
  position: absolute;
  bottom: 0;
  left: 0;
  color: var(--colorBg);
  margin: auto;
  right: 0;
  p {
    margin-top: 7px;
    margin-bottom: 0;
    height: 100%;
    font-size: 16px;
    font-weight: bold;
  }
`

const ChartBton = styled.img`
  position: absolute;
  width: 20px;
  bottom: 6px;
  right: 20px;
  cursor: pointer;
  display: block;
  margin-top: 18px;
  @media (min-width: 800px) {
    display: none;
  }
`

export default connect(
  mapStateToProps,
  null
)(DialogHistory)
