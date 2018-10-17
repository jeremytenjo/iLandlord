import firebase from 'firebase'

export default function(state = [], action) {
  let newState

  switch (action.type) {
    case 'SET_EXPENSE_PAYMENTS':
      // var d1 = new Date("2017-11-10");
      // var d2 = new Date("2017-08-25");
      // let expensePayments = [
      //   {
      //     "expensePaymentId": 3,
      //     "expenseId": 1,
      //     "timestamp": d2,
      //     "date": 'August 21',
      //     "month": 'August',
      //     "year": 2017,
      //     "amount": 216.00
      //   }, {
      //     "expensePaymentId": 4,
      //     "expenseId": 1,
      //     "timestamp": d1,
      //     "date": 'November 10',
      //     "month": 'November',
      //     "year": 2017,
      //     "amount": 26.00
      //   }
      // ]

      // return expensePayments;
      return action.data

    case 'INSERT_EXPENSE_PAYMENT':
      state.push(action.data)

      return state

    case 'UPDATE_EXPENSE_PAYMENT':
      //update online
      firebase
        .firestore()
        .collection('expensePayments')
        .doc(action.data.expensePaymentId)
        .update({ amount: action.data.amount, payee: action.data.payee })

      //update store
      let objIndex = state.findIndex((obj) => obj.expensePaymentId === action.data.expensePaymentId)
      newState = state.map((item, index) => {
        if (index !== objIndex) {
          return item
        }
        return {
          ...item,
          ...action.data
        }
      })

      return newState

    case 'REMOVE_EXPENSE_PAYMENT':
      //delete files
      firebase
        .firestore()
        .collection('expensePayments')
        .doc(action.data)
        .get()
        .then((doc) => {
          let flag = typeof doc.data().fileUrl === 'undefined'
          let flag2 = typeof doc.data().fileID === 'undefined'
          if (flag === false && flag2 === false) {
            var storage = firebase.storage()
            var storageRef = storage.ref()
            storageRef
              .child('files/expenses/' + doc.data().fileID)
              .delete()
              .then(() => {
                //delete online
                firebase
                  .firestore()
                  .collection('expensePayments')
                  .doc(action.data)
                  .delete()
              })
          } else {
            //delete online
            firebase
              .firestore()
              .collection('expensePayments')
              .doc(action.data)
              .delete()
          }
        })

      //remove store
      objIndex = state.findIndex((obj) => obj.expensePaymentId === action.data)

      newState = state.slice()
      newState.splice(objIndex, 1)

      return newState

    case 'REMOVE_EXPENSE_PAYMENTS':
      //remove from online
      newState = state.slice()
      for (var i = 0; i < newState.length; i++) {
        if (newState[i].expenseId === action.data) {
          firebase
            .firestore()
            .collection('expensePayments')
            .doc(newState[i].expensePaymentId)
            .delete()
        }
      }
      // no need to  remove from store because they are not visible
      return newState

    default:
      return state
  }
}
