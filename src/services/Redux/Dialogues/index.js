export default function(state = '', action) {
  switch (action.type) {
    case "SET_DIALOG_HISTORY":
      return action.data;

    default:
      return state
  }
}
