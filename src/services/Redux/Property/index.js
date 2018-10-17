
export default function(state = [], action) {
  switch (action.type) {
    case "SET_PROPERTY":

      return action.data;



    default:
      return state
  }
}
