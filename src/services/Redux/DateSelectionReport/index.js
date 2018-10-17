export default function(state = '', action) {
  switch (action.type) {
    case "SET_DATE_REPORT":
      return action.data

    default:
      return state
  }
}
