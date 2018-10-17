export const showLoadingScreen = (e) => {
  return {type: 'SHOW_LOADINGSCREEN', data: e}
}

export const hideLoadingScreen = (e = '') => {
  return {type: 'HIDE_LOADINGSCREEN', data: e}
}
