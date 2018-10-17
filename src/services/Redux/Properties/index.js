import firebase from 'firebase'

export default function(state = [], action) {
  let newState
  switch (action.type) {

    case "SET_PROPERTIES":

      return action.data;

    case "INSERT_PROPERTY":
      newState = state.slice()
      newState.splice(Math.random(), 0, action.data)

      return newState;

    case "EDIT_PROPERTY":
      //update online
      firebase.firestore().collection("properties").doc(action.data.id).update({name: action.data.name})

      //update store
      let objIndex = state.findIndex((obj => obj.id === action.data.id))
      newState = state.map((item, index) => {
        if (index !== objIndex) {
          return item;
        }
        return {
          ...item,
          ...action.data
        };
      })

      return newState;

      case 'REMOVE_PROPERTY':

        //remove store
        objIndex = state.findIndex((obj => obj.id === action.data))

        newState = state.slice()
        newState.splice(objIndex, 1)

        return newState;

    default:
      return state
  }
}
