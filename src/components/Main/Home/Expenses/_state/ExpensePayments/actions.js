export const setExpensePayments = (e) => {
  return {type: 'SET_EXPENSE_PAYMENTS', data: e}
}

export const insertExpensePayment = (e) => {
  return {type: 'INSERT_EXPENSE_PAYMENT', data: e}
}

export const updateExpensePayment = (e) => {
  return {type: 'UPDATE_EXPENSE_PAYMENT', data: e}
}

export const removeExpensePayment = (e) => {
  return {type: 'REMOVE_EXPENSE_PAYMENT', data: e}
}
export const removeExpensePayments = (e) => {
  return {type: 'REMOVE_EXPENSE_PAYMENTS', data: e}
}
