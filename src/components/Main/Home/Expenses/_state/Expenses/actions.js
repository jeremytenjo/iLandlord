export const setExpenses = (e) => {
  return {type: 'SET_EXPENSES', data: e}
}
export const insertExpense = (e) => {
  return {type: 'INSERT_EXPENSE', data: e}
}
export const removeExpense = (e) => {
  return {type: 'REMOVE_EXPENSE', data: e}
}
export const renameExpense = (e) => {
  return {type: 'RENAME_EXPENSE', data: e}
}
