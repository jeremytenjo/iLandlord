export default function(state = 'bills', action) {
  switch (action.type) {
    case "SET_LOCATION":
      return action.data;

    default:
      return state
  }
}
