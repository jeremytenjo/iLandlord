export const setBills = (e) => {
  return {type: 'SET_BILLS', data: e}
}
export const insertBill = (e) => {
  return {type: 'INSERT_BILL', data: e}
}
export const removeBill = (e) => {
  return {type: 'REMOVE_BILL', data: e}
}
export const renameBill = (e) => {
  return {type: 'RENAME_BILL', data: e}
}
