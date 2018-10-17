export default function(state = {
  id: '',
  message: '',
  status: false
}, action) {
  switch (action.type) {
    case "SHOW_ALERT":

      return action.data

    default:
      return state
  }
}
