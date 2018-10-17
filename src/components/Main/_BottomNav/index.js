//Vendors
import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router'

//Images

//State
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Set_Location } from './_state/actions'

//define actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      Set_Location
    },
    dispatch
  )
}

//Set global state to prop
function mapStateToProps(state) {
  return { BottomNavLocation: state.BottomNavLocation, Property: state.Property }
}
class BottomNav extends React.Component {
  //Methods
  componentWillMount() {
    let location = this.props.history.location.pathname
    location = location.substring(1)

    if (location === '') {
      this.props.Set_Location('bills')
    } else {
      location = location.split('/')
      location = location[1]
      // console.log(location)

      this.props.Set_Location(location)
    }
  }

  openLink = (location) => {
    this.props.Set_Location(location)

    let urlProperty = this.props.Property.id
    this.props.history.push(`/${urlProperty}/${location}`)
  }

  componentWillUpdate(nextProps, nextState) {
    //handle back button
    let location = nextProps.location.pathname.split('/')

    if (nextProps.BottomNavLocation !== location[2] && typeof location[2] !== 'undefined') {
      // console.log(location[2])
      this.props.Set_Location(location[2])
    }
  }

  render() {
    //Properties

    //Template
    return (
      <Wrapper>
        <IconCon onClick={(e) => this.openLink('bills')}>
          <IconHome location={this.props.BottomNavLocation} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path
              d="M31.4 10.6l-10-10C20.9 0.1 20.2-0.1 19.5 0.1c-0.4 0.1-0.7 0.3-0.9 0.5 -0.2 0.2-0.4 0.5-0.5 0.8 -0.5 1.5-1.2 2.7-2.4 3.9C14.1 6.9 12.1 8 10 9.3c-2.3 1.3-4.6 2.7-6.5 4.6 -1.6 1.6-2.7 3.4-3.4 5.6 -0.2 0.7 0 1.5 0.5 2l10 10c0.5 0.5 1.2 0.7 1.9 0.5 0.4-0.1 0.7-0.3 0.9-0.5 0.2-0.2 0.4-0.5 0.5-0.8 0.5-1.5 1.2-2.7 2.4-3.9 1.5-1.5 3.6-2.7 5.7-4 2.3-1.3 4.6-2.7 6.5-4.6 1.6-1.6 2.7-3.4 3.4-5.6C32.1 11.9 31.9 11.1 31.4 10.6zM12 30c-3.3-3.3-6.7-6.7-10-10 2.8-9.2 15.2-8.8 18-18 3.3 3.3 6.7 6.7 10 10C27.2 21.2 14.8 20.8 12 30z"
              className="a"
            />
            <path
              d="M19.6 14.9c-0.3-0.3-0.7-0.5-1-0.6 -0.3-0.1-0.7-0.1-1-0.1 -0.3 0-0.7 0.1-1 0.2 -0.3 0.1-0.7 0.3-1 0.4 -0.5-0.6-1.1-1.2-1.6-1.8 0.2-0.2 0.5-0.3 0.7-0.3 0.2 0 0.4 0 0.7 0.1 0.2 0.1 0.4 0.1 0.6 0.1 0.2 0 0.3 0 0.5-0.1 0.1-0.1 0.2-0.3 0.2-0.5 0-0.2-0.1-0.4-0.2-0.6 -0.2-0.2-0.5-0.4-0.8-0.4 -0.3-0.1-0.6 0-0.9 0 -0.3 0.1-0.6 0.2-0.9 0.4s-0.5 0.3-0.7 0.5c-0.1-0.1-0.1-0.1-0.2-0.2 -0.1-0.1-0.2-0.1-0.3-0.1 -0.1 0-0.2 0-0.3 0.1 -0.1 0.1-0.1 0.2-0.1 0.3 0 0.1 0.1 0.2 0.1 0.3 0.1 0.1 0.1 0.1 0.2 0.2 -0.3 0.3-0.5 0.7-0.6 1 -0.2 0.4-0.3 0.7-0.3 1.1 0 0.4 0 0.7 0.1 1 0.1 0.3 0.3 0.6 0.6 0.8 0.5 0.4 1 0.6 1.7 0.5 0.6 0 1.3-0.2 2.1-0.6 0.6 0.7 1.2 1.4 1.8 2 -0.2 0.2-0.5 0.3-0.7 0.4 -0.2 0-0.4 0-0.5 0 -0.2 0-0.3-0.1-0.4-0.2 -0.1-0.1-0.3-0.2-0.4-0.2 -0.1-0.1-0.3-0.1-0.4-0.1s-0.3 0.1-0.4 0.2c-0.2 0.1-0.2 0.3-0.2 0.5 0 0.2 0.1 0.4 0.3 0.6 0.2 0.2 0.4 0.4 0.7 0.5s0.6 0.2 0.9 0.2c0.3 0 0.7 0 1.1-0.2 0.4-0.1 0.7-0.4 1.1-0.7 0.2 0.2 0.4 0.3 0.5 0.5 0.1 0.1 0.2 0.1 0.3 0.1 0.1 0 0.2-0.1 0.3-0.1 0.1-0.1 0.1-0.2 0.1-0.3 0-0.1-0.1-0.2-0.1-0.2 -0.2-0.1-0.4-0.3-0.5-0.4 0.3-0.4 0.5-0.8 0.7-1.1 0.2-0.4 0.3-0.8 0.3-1.1 0-0.3 0-0.7-0.1-0.9C20 15.4 19.8 15.1 19.6 14.9zM14 15.6c-0.3 0-0.5-0.1-0.7-0.3 -0.1-0.1-0.2-0.2-0.2-0.3 0-0.1-0.1-0.3 0-0.4 0-0.1 0.1-0.3 0.1-0.5 0.1-0.2 0.2-0.3 0.3-0.5 0.5 0.5 1 1.1 1.5 1.6C14.6 15.5 14.3 15.6 14 15.6zM18.7 17.6c-0.1 0.2-0.2 0.3-0.3 0.4 -0.6-0.6-1.1-1.2-1.7-1.8 0.1-0.1 0.3-0.1 0.5-0.2s0.3-0.1 0.5-0.1c0.2 0 0.3 0 0.5 0 0.2 0 0.3 0.1 0.5 0.3 0.1 0.1 0.2 0.3 0.3 0.4 0 0.2 0 0.3 0 0.5C18.8 17.2 18.8 17.4 18.7 17.6z"
              className="a"
            />
            <path
              d="M14.7 22.2h0c-0.6 0.5-1.2 1-1.8 1.6 -0.5 0.5-1 1.1-1.5 1.7l-0.7 0.9 0 0c-0.1 0.2-0.1 0.5 0.1 0.6 0.2 0.2 0.5 0.2 0.7 0 0 0 0.1-0.1 0.1-0.1l0.6-0.9c0.4-0.5 0.9-1.1 1.4-1.6 0.6-0.6 1.1-1 1.7-1.5l0 0c0 0 0 0 0.1 0 0.2-0.2 0.2-0.5 0-0.7C15.2 22 14.9 22 14.7 22.2z"
              className="a"
            />
            <path
              d="M18.4 7.7c-0.5 0.5-1.1 1-1.7 1.4 0 0-0.1 0-0.1 0.1 -0.2 0.2-0.2 0.5 0 0.7 0.2 0.2 0.5 0.2 0.7 0l0 0c0.6-0.5 1.2-1 1.8-1.6 0.5-0.5 1-1.1 1.5-1.7l0.7-0.9 0 0c0.2-0.2 0.2-0.5 0-0.7 -0.2-0.2-0.5-0.2-0.7 0 0 0-0.1 0.1-0.1 0.1l-0.7 0.9C19.3 6.7 18.9 7.2 18.4 7.7z"
              className="a"
            />
          </IconHome>
          <LabelHome location={this.props.BottomNavLocation}>Bills</LabelHome>
        </IconCon>

        <IconCon onClick={(e) => this.openLink('income')}>
          <IconIcome location={this.props.BottomNavLocation} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <g id="money_4">
              <path d="M32,22.327c0-1.705-1.387-3.093-3.092-3.093c-0.637,0-1.227,0.199-1.717,0.528h-0.002c0,0.003-0.002,0.003-0.002,0.005 c-0.207,0.142-0.398,0.301-0.566,0.485l0.008,0.008c-0.641,0.576-1.666,1.543-2.41,2.423c-0.16-0.412-0.404-0.787-0.717-1.093 c-3.053-2.688-6.723-3.78-10.93-3.78c-1.377,0-2.705,0.149-3.961,0.424c-0.037-0.457-0.063-0.735-0.063-0.735H0.359 c0,0-0.359,2.998-0.359,6.694c0,3.697,0.359,6.694,0.359,6.694h8.189c0,0,0.072-0.78,0.15-1.893 c1.219-0.205,2.465,0.116,3.908,1.012c1.828,1.195,4.08,1.902,6.518,1.902c2.472,0,4.594-0.729,6.36-1.955l0.002,0.002 c0.019-0.015,0.041-0.031,0.068-0.052c0.5-0.353,0.973-0.741,1.413-1.168c0.347-0.354,0.814-0.807,1.519-1.495 c2.361-2.32,2.652-2.781,2.652-2.781s-0.007,0.002-0.009,0.002C31.668,23.909,32,23.159,32,22.327z M30.121,23.54 c-0.414,0.41-2.166,2.215-2.639,2.678c-1.229,1.207-1.801,1.771-2.072,2.084l-0.004-0.006c-0.188,0.168-0.385,0.322-0.586,0.47 c-1.584,1.071-3.557,1.711-5.695,1.711c-2.158,0-4.146-0.647-5.736-1.735h-0.012c-1.375-0.841-2.988-1.354-4.584-1.197 c0.063-1.103,0.115-2.312,0.115-3.349c0-1.44-0.1-3.211-0.193-4.567c1.215-0.274,2.512-0.428,3.857-0.428 c4.12,0,7.762,1.362,9.995,3.495c0.263,0.293,0.429,0.679,0.429,1.101c0,0.916-0.744,1.658-1.658,1.658 c-0.035,0-0.067-0.009-0.103-0.011l-0.004,0.021c-0.854-0.03-2.188-0.389-4.442-1.25l-0.513,1.34 c2.384,0.91,3.953,1.318,5.066,1.347v-0.01c1.395-0.005,2.572-0.933,2.955-2.201v0.002c0.482-0.801,2.287-2.472,3.312-3.383 l0.002,0.002c0.011-0.011,0.021-0.019,0.027-0.026c0.19-0.171,0.354-0.313,0.473-0.416c0.216-0.136,0.44-0.193,0.798-0.193 c0.914,0,1.655,0.744,1.655,1.656C30.564,22.786,30.363,23.219,30.121,23.54z" />
              <path d="M21.973,18.611c5.105,0,9.26-4.153,9.26-9.259s-4.152-9.26-9.26-9.26c-5.106,0-9.26,4.154-9.26,9.26 S16.865,18.611,21.973,18.611z M21.973,1.706c4.215,0,7.646,3.432,7.646,7.646c0,4.214-3.432,7.646-7.646,7.646 c-4.217,0-7.646-3.432-7.646-7.646C14.327,5.137,17.756,1.706,21.973,1.706z" />
              <path d="M19.545,9.04c0.197,0.23,0.48,0.441,0.848,0.637c0.365,0.193,0.855,0.338,1.467,0.43 c0.174,0.029,0.348,0.066,0.521,0.115c0.178,0.045,0.338,0.109,0.486,0.188c0.146,0.08,0.268,0.176,0.361,0.287 c0.094,0.109,0.141,0.242,0.141,0.393c0,0.18-0.09,0.324-0.27,0.438c-0.184,0.111-0.406,0.166-0.682,0.166 c-0.209,0-0.396-0.016-0.559-0.049c-0.158-0.031-0.309-0.082-0.439-0.15c-0.132-0.068-0.262-0.154-0.389-0.26 c-0.125-0.104-0.254-0.227-0.385-0.371h-1.51v2.266h1.51v-0.338c0.072,0.037,0.146,0.072,0.225,0.104 c0.072,0.033,0.15,0.066,0.229,0.102v0.885h1.51v-0.681c0.324-0.021,0.625-0.09,0.9-0.205c0.277-0.113,0.518-0.266,0.719-0.453 c0.201-0.186,0.359-0.404,0.475-0.652s0.174-0.516,0.174-0.803c0-0.15-0.025-0.346-0.082-0.588 c-0.053-0.24-0.178-0.486-0.371-0.734c-0.191-0.248-0.477-0.477-0.846-0.689c-0.371-0.213-0.869-0.365-1.494-0.459 c-1.008-0.15-1.51-0.459-1.51-0.926c0-0.166,0.078-0.32,0.24-0.465c0.162-0.143,0.396-0.215,0.695-0.215 c0.209,0,0.391,0.018,0.545,0.053c0.154,0.037,0.297,0.09,0.426,0.156c0.129,0.068,0.252,0.154,0.367,0.26 c0.115,0.104,0.232,0.225,0.355,0.361h1.52V5.577h-1.508V5.9c-0.18-0.109-0.383-0.195-0.605-0.26V4.82H21.1v0.713 c-0.295,0.043-0.564,0.129-0.812,0.254s-0.463,0.283-0.646,0.475c-0.185,0.189-0.326,0.408-0.427,0.652 c-0.103,0.244-0.151,0.502-0.151,0.777c0,0.186,0.031,0.4,0.092,0.641C19.219,8.572,19.348,8.81,19.545,9.04z" />
            </g>
          </IconIcome>
          <LabelIncome location={this.props.BottomNavLocation}>Income</LabelIncome>
        </IconCon>

        <IconCon onClick={(e) => this.openLink('expenses')}>
          <IconInfo
            location={this.props.BottomNavLocation}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 511.994 511.994"
          >
            <path d="M420.428,0H91.566C73.788,0,59.324,14.464,59.324,32.241v460.407c0,7.686,4.546,14.638,11.588,17.72 c7.029,3.069,15.224,1.709,20.873-3.501l45.138-41.624l46.873,41.836c7.364,6.571,18.5,6.545,25.838-0.071l46.363-41.83 l46.363,41.83c7.338,6.616,18.468,6.648,25.845,0.071l46.873-41.836l45.132,41.624c3.643,3.366,8.351,5.126,13.122,5.126 c2.618,0,5.262-0.535,7.757-1.625c7.035-3.082,11.581-10.04,11.581-17.72V32.241C452.669,14.464,438.206,0,420.428,0z M413.98,448.491l-25.574-23.588c-7.319-6.745-18.558-6.835-25.999-0.213l-47.014,41.965l-46.434-41.895 c-3.688-3.314-8.318-4.978-12.961-4.978c-4.636,0-9.279,1.657-12.961,4.985l-46.434,41.894l-47.021-41.965 c-7.428-6.635-18.681-6.545-25.993,0.213l-25.574,23.588V38.69H413.98V448.491z" />
            <path d="M335.955,195.383H176.038c-10.685,0-19.345,8.66-19.345,19.345s8.66,19.345,19.345,19.345h159.924 c10.685,0,19.338-8.66,19.338-19.345S346.64,195.383,335.955,195.383z" />
            <path d="M178.617,73.51c-10.685,0-19.345,8.66-19.345,19.345v43.848c0,10.685,8.66,19.345,19.345,19.345 c10.685,0,19.345-8.66,19.345-19.345V92.855C197.962,82.17,189.302,73.51,178.617,73.51z" />
            <path d="M255.997,73.51c-10.685,0-19.345,8.66-19.345,19.345v43.848c0,10.685,8.66,19.345,19.345,19.345 s19.345-8.66,19.345-19.345V92.855C275.342,82.17,266.682,73.51,255.997,73.51z" />
            <path d="M333.376,73.51c-10.685,0-19.345,8.66-19.345,19.345v43.848c0,10.685,8.66,19.345,19.345,19.345 c10.685,0,19.345-8.66,19.345-19.345V92.855C352.721,82.17,344.061,73.51,333.376,73.51z" />
            <path d="M335.955,266.314H176.038c-10.685,0-19.345,8.66-19.345,19.345s8.66,19.345,19.345,19.345h159.924 c10.685,0,19.338-8.66,19.338-19.345S346.64,266.314,335.955,266.314z" />
            <path d="M335.955,337.245H176.038c-10.685,0-19.345,8.66-19.345,19.345s8.66,19.345,19.345,19.345h159.924 c10.685,0,19.338-8.66,19.338-19.345S346.64,337.245,335.955,337.245z" />
          </IconInfo>
          <LabelInfo location={this.props.BottomNavLocation}>Expenses</LabelInfo>
        </IconCon>

        <ReportCon onClick={(e) => this.openLink('report')}>
          <IconReport
            location={this.props.BottomNavLocation}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 486.742 486.742"
          >
            <g>
              <path d="M33,362.371v78.9c0,4.8,3.9,8.8,8.8,8.8h61c4.8,0,8.8-3.9,8.8-8.8v-138.8l-44.3,44.3 C57.9,356.071,45.9,361.471,33,362.371z" />
              <path d="M142,301.471v139.8c0,4.8,3.9,8.8,8.8,8.8h61c4.8,0,8.8-3.9,8.8-8.8v-82.3c-13.9-0.3-26.9-5.8-36.7-15.6L142,301.471z" />
              <path d="M251,350.271v91c0,4.8,3.9,8.8,8.8,8.8h61c4.8,0,8.8-3.9,8.8-8.8v-167.9l-69.9,69.9 C257,345.971,254.1,348.271,251,350.271z" />
              <path d="M432.7,170.171l-72.7,72.7v198.4c0,4.8,3.9,8.8,8.8,8.8h61c4.8,0,8.8-3.9,8.8-8.8v-265.6c-2-1.7-3.5-3.2-4.6-4.2 L432.7,170.171z" />
              <path d="M482.6,41.371c-2.9-3.1-7.3-4.7-12.9-4.7c-0.5,0-1.1,0-1.6,0c-28.4,1.3-56.7,2.7-85.1,4c-3.8,0.2-9,0.4-13.1,4.5 c-1.3,1.3-2.3,2.8-3.1,4.6c-4.2,9.1,1.7,15,4.5,17.8l7.1,7.2c4.9,5,9.9,10,14.9,14.9l-171.6,171.7l-77.1-77.1 c-4.6-4.6-10.8-7.2-17.4-7.2c-6.6,0-12.7,2.6-17.3,7.2L7.2,286.871c-9.6,9.6-9.6,25.1,0,34.7l4.6,4.6c4.6,4.6,10.8,7.2,17.4,7.2 s12.7-2.6,17.3-7.2l80.7-80.7l77.1,77.1c4.6,4.6,10.8,7.2,17.4,7.2c6.6,0,12.7-2.6,17.4-7.2l193.6-193.6l21.9,21.8 c2.6,2.6,6.2,6.2,11.7,6.2c2.3,0,4.6-0.6,7-1.9c1.6-0.9,3-1.9,4.2-3.1c4.3-4.3,5.1-9.8,5.3-14.1c0.8-18.4,1.7-36.8,2.6-55.3 l1.3-27.7C487,49.071,485.7,44.571,482.6,41.371z" />
            </g>
          </IconReport>
          <LabelReport location={this.props.BottomNavLocation}>Report</LabelReport>
        </ReportCon>
      </Wrapper>
    )
  }
}

//Style
const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(1px, 1fr));
  background: rgba(37, 49, 55, 0.2);
`
const IconCon = styled.div`
  width: 100%;
  text-align: center;
  font-size: 10px;
  display: grid;
  grid-template-rows: 32px 12px;
  cursor: pointer;
  box-sizing: border-box;
  padding-top: 2px;

  span {
    user-select: none;
  }
`
const IconHome = styled.svg`
  width: 20px;
  fill: ${(props) => (props.location === 'bills' || props.location === '/' ? 'var(--colorMain)' : 'white')};
  transition: 0.1s;

  margin: 0 auto;
  height: 30px;
`
const LabelHome = styled.span`
  color: ${(props) => (props.location === 'bills' || props.location === '/' ? 'var(--colorMain)' : 'white')};
  transition: 0.1s;
`
const IconIcome = IconHome.extend`
  fill: ${(props) => (props.location === 'income' ? 'var(--colorMain)' : 'white')};
  transition: 0.1s;
`
const LabelIncome = styled.span`
  color: ${(props) => (props.location === 'income' ? 'var(--colorMain)' : 'white')};
  transition: 0.1s;
`

const IconInfo = IconHome.extend`
  fill: ${(props) => (props.location === 'expenses' ? 'var(--colorMain)' : 'white')};
  transition: 0.1s;
`
const LabelInfo = styled.span`
  color: ${(props) => (props.location === 'expenses' ? 'var(--colorMain)' : 'white')};
  transition: 0.1s;
`

//display report only in desktop
const ReportCon = IconCon.extend`
  display: none;

  @media (min-width: 1200px) {
    display: grid;
  }
`
const IconReport = IconHome.extend`
  fill: ${(props) => (props.location === 'report' ? 'var(--colorMain)' : 'white')};
  transition: 0.1s;
`
const LabelReport = styled.span`
  color: ${(props) => (props.location === 'report' ? 'var(--colorMain)' : 'white')};
  transition: 0.1s;
`

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BottomNav))
