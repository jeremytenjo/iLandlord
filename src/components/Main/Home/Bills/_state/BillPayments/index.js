import firebase from 'firebase'

export default function(state = [], action) {
  let newState

  switch (action.type) {

    case "SET_BILL_PAYMENTS":

      // var d1 = new Date("2017-11-10");
      // var d2 = new Date("2017-08-25");
      // let billPayments = [
      //   {
      //     "billPaymentId": 3,
      //     "billId": 1,
      //     "timestamp": d2,
      //     "date": 'August 21',
      //     "month": 'August',
      //     "year": 2017,
      //     "amount": 216.00
      //   }, {
      //     "billPaymentId": 4,
      //     "billId": 1,
      //     "timestamp": d1,
      //     "date": 'November 10',
      //     "month": 'November',
      //     "year": 2017,
      //     "amount": 26.00
      //   }
      // ]

      // return billPayments;
      return action.data;

    case 'INSERT_BILL_PAYMENT':

      state.push(action.data)

      return state;

    case 'UPDATE_BILL_PAYMENT':
      //update online
      firebase.firestore().collection("billPayments").doc(action.data.billPaymentId).update({amount: action.data.amount})

      //update store
      let objIndex = state.findIndex((obj => obj.billPaymentId === action.data.billPaymentId))
      newState = state.map((item, index) => {
        if (index !== objIndex) {
          return item;
        }
        return {
          ...item,
          ...action.data
        };
      })

      return newState;

    case 'REMOVE_BILL_PAYMENT':
      //delete online
      firebase.firestore().collection("billPayments").doc(action.data).delete()

      //remove store
      objIndex = state.findIndex((obj => obj.billPaymentId === action.data))

      newState = state.slice()
      newState.splice(objIndex, 1)

      return newState;

    case 'REMOVE_BILL_PAYMENTS':

      //remove from online
      newState = state.slice()
      for (var i = 0; i < newState.length; i++) {
        if (newState[i].billId === action.data) {
          firebase.firestore().collection("billPayments").doc(newState[i].billPaymentId).delete()
        }
      }
      // no need to  remove from store because they are not visible
      return newState;

    default:
      return state
  }
}
