import firebase from 'firebase'

export default function(state = [], action) {
	let incomeIndex, newState

	switch (action.type) {
		case 'SET_INCOMES':
			//data profile
			// let Tenants = [
			//   {
			//     "incomeId": 1,
			//     "name": "Jeremy Tenjo",
			//     "unit": 1,
			//     "amount": 475,
			//     "propertyId": 'Jd9HQKPtccUoZIOS9cyM'
			//   }, {
			//     "incomeId": 5,
			//     "name": "Hayle Whitehead",
			//     "unit": 1,
			//     "amount": 475,
			//     "propertyId": 'Jd9HQKPtccUoZIOS9cyM'
			//   }
			// ]
			//
			// return Tenants;
			return action.data

		case 'INSERT_INCOME':
			newState = state.slice()
			newState.splice(Math.random(), 0, action.data)

			return newState

		case 'RENAME_INCOME':
			//rename online
			let data = {
				name: action.data.name,
				type: action.data.type,
				unit: action.data.unit,
				amount: action.data.amount
			}

			firebase
				.firestore()
				.collection('incomes')
				.doc(action.data.incomeId)
				.update({
					...data
				})

			//rename in store
			incomeIndex = state.findIndex((obj) => obj.incomeId === action.data.incomeId)
			newState = state.map((item, index) => {
				if (index !== incomeIndex) {
					return item
				}
				return {
					...item,
					...data
				}
			})

			return newState

		case 'REMOVE_INCOME':
			//delete online
			firebase
				.firestore()
				.collection('incomes')
				.doc(action.data)
				.delete()

			//remove store
			incomeIndex = state.findIndex((obj) => obj.incomeId === action.data)

			newState = state.slice()
			newState.splice(incomeIndex, 1)

			return newState

		default:
			return state
	}
}
