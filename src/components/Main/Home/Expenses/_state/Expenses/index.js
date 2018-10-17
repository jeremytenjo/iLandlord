import firebase from 'firebase'

export default function(state = [], action) {
	let expenseIndex, newState

	switch (action.type) {
		case 'SET_EXPENSES':
			//data profile
			// let Expenses = [
			//   {
			//     "expenseId": 1,
			//     "name": "Hydro",
			//     "provider": "London Hydro"
			//
			//   }, {
			//     "expenseId": 5,
			//     "name": "Gas",
			//     "provider": "Union Gas"
			//
			//   }
			// ]

			// return Expenses;
			return action.data

		case 'INSERT_EXPENSE':
			newState = state.slice()
			newState.splice(Math.random(), 0, action.data)

			return newState

		case 'RENAME_EXPENSE':
			//rename online
			firebase
				.firestore()
				.collection('expenses')
				.doc(action.data.expenseId)
				.update({ category: action.data.category, limit: action.data.limit })

			//rename in store
			expenseIndex = state.findIndex((obj) => obj.expenseId === action.data.expenseId)
			newState = state.map((item, index) => {
				if (index !== expenseIndex) {
					return item
				}
				return {
					...item,
					...action.data
				}
			})

			return newState

		case 'REMOVE_EXPENSE':
			//delete online
			firebase
				.firestore()
				.collection('expenses')
				.doc(action.data)
				.delete()

			//remove store
			expenseIndex = state.findIndex((obj) => obj.expenseId === action.data)

			newState = state.slice()
			newState.splice(expenseIndex, 1)

			return newState

		default:
			return state
	}
}
