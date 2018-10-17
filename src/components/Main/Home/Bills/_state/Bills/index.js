import firebase from 'firebase'

export default function(state = [], action) {
	let billIndex, newState

	switch (action.type) {
		case 'SET_BILLS':
			//data profile
			// let Bills = [
			//   {
			//     "billId": 1,
			//     "name": "Hydro",
			//     "provider": "London Hydro"
			//
			//   }, {
			//     "billId": 5,
			//     "name": "Gas",
			//     "provider": "Union Gas"
			//
			//   }
			// ]

			// return Bills;
			return action.data

		case 'INSERT_BILL':
			newState = state.slice()
			newState.splice(Math.random(), 0, action.data)

			return newState

		case 'RENAME_BILL':
			//rename online
			firebase
				.firestore()
				.collection('bills')
				.doc(action.data.billId)
				.update({ name: action.data.name, provider: action.data.provider, dueDate: action.data.dueDate })

			//rename in store
			billIndex = state.findIndex((obj) => obj.billId === action.data.billId)
			newState = state.map((item, index) => {
				if (index !== billIndex) {
					return item
				}
				return {
					...item,
					...action.data
				}
			})

			return newState

		case 'REMOVE_BILL':
			//delete online
			firebase
				.firestore()
				.collection('bills')
				.doc(action.data)
				.delete()

			//remove store
			billIndex = state.findIndex((obj) => obj.billId === action.data)

			newState = state.slice()
			newState.splice(billIndex, 1)

			return newState

		default:
			return state
	}
}
