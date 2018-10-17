export const setBillPayments = (e) => {
  return {type: 'SET_BILL_PAYMENTS', data: e}
}

export const insertBillPayment = (e) => {
  return {type: 'INSERT_BILL_PAYMENT', data: e}
}

export const updateBillPayment = (e) => {
  return {type: 'UPDATE_BILL_PAYMENT', data: e}
}

export const removeBillPayment = (e) => {
  return {type: 'REMOVE_BILL_PAYMENT', data: e}
}
export const removeBillPayments = (e) => {
  return {type: 'REMOVE_BILL_PAYMENTS', data: e}
}
