export default function(state = true, action) {
	switch (action.type) {
		case 'TOGGLE_INCOME_LOADING':
			return action.data

		default:
			return state
	}
}
