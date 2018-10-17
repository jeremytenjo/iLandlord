export const setProperties = (e) => {
  return {type: 'SET_PROPERTIES', data: e}
}

export const insertProperty = (e) => {
  return {type: 'INSERT_PROPERTY', data: e}
}

export const editProperty = (e) => {
  return {type: 'EDIT_PROPERTY', data: e}
}

export const removeProperty = (e) => {
  return {type: 'REMOVE_PROPERTY', data: e}
}
