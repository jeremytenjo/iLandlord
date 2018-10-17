export const setIncomePayments = (e) => {
  return {type: 'SET_INCOME_PAYMENTS', data: e}
}

export const insertIncomePayment = (e) => {
  return {type: 'INSERT_INCOME_PAYMENT', data: e}
}

export const updateIncomePayment = (e) => {
  return {type: 'UPDATE_INCOME_PAYMENT', data: e}
}

export const removeIncomePayment = (e) => {
  return {type: 'REMOVE_INCOME_PAYMENT', data: e}
}
export const removeIncomePayments = (e) => {
  return {type: 'REMOVE_INCOME_PAYMENTS', data: e}
}
