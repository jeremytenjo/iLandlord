export const setIncomes = (e) => {
  return {type: 'SET_INCOMES', data: e}
}
export const insertIncome = (e) => {
  return {type: 'INSERT_INCOME', data: e}
}
export const removeIncome = (e) => {
  return {type: 'REMOVE_INCOME', data: e}
}
export const renameIncome = (e) => {
  return {type: 'RENAME_INCOME', data: e}
}
