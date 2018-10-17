import firebase from 'firebase'

const fetchFirestoreDeleteAll = async (propertyId) => {
  let db = firebase.firestore(),
    billIds = [],
    billPaymentsIds = [],
    incomeIds = [],
    incomePaymentsIds = [],
    expenseIds = [],
    expensePaymentsIds = [],
    ids

  //- get bills
  let bills = await db.collection("bills").where("propertyId", "==", propertyId).get()
  if (bills.empty === false) {
    bills.forEach((doc) => {
      billIds.push(doc.id)
    })
  }

  //- get bill payments
  let billPayments = await db.collection("billPayments").where("propertyId", "==", propertyId).get()
  if (billPayments.empty === false) {
    billPayments.forEach((doc) => {
      billPaymentsIds.push(doc.id)
    })
  }

  //- get income
  let incomes = await db.collection("incomes").where("propertyId", "==", propertyId).get()
  if (incomes.empty === false) {
    incomes.forEach((doc) => {
      incomeIds.push(doc.id)
    })
  }

  //- get income payments
  let incomePayments = await db.collection("incomePayments").where("propertyId", "==", propertyId).get()
  if (incomePayments.empty === false) {
    incomePayments.forEach((doc) => {
      incomePaymentsIds.push(doc.id)
    })
  }

  //- get expense
  let expenses = await db.collection("expenses").where("propertyId", "==", propertyId).get()
  if (expenses.empty === false) {
    expenses.forEach((doc) => {
      expenseIds.push(doc.id)
    })
  }

  //- get expense payments
  let expensePayments = await db.collection("expensePayments").where("propertyId", "==", propertyId).get()
  if (expensePayments.empty === false) {
    expensePayments.forEach((doc) => {
      expensePaymentsIds.push(doc.id)
    })
  }

  //- delete bills
  billIds.map((id) => {
    return db.collection("bills").doc(id).delete()
  })
  //- delete bill payments
  billPaymentsIds.map((id) => {
    return db.collection("billPayments").doc(id).delete()
  })

  //- delete income
  incomeIds.map((id) => {
    return db.collection("incomes").doc(id).delete()
  })

  //- delete income payments
  incomePaymentsIds.map((id) => {
    return db.collection("incomePayments").doc(id).delete()
  })

  //- delete expense
  expenseIds.map((id) => {
    return db.collection("expenses").doc(id).delete()
  })

  //- delete expense payments
  expensePaymentsIds.map((id) => {
    return db.collection("expensePayments").doc(id).delete()
  })

  //delete Property
  db.collection("properties").doc(propertyId).delete()

  ids = {
    billIds,
    billPaymentsIds,
    incomeIds,
    incomePaymentsIds,
    expenseIds,
    expensePaymentsIds
  }

  return ids
}

export default fetchFirestoreDeleteAll
