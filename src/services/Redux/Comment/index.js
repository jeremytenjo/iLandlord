export default function(state = '', action) {
  switch (action.type) {
    case "SET_COMMENT":
      return action.data;

    default:
      return state
  }
}
