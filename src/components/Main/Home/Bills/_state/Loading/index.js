export default function(state = true, action) {
	switch (action.type) {
		case 'TOGGLE_BILLS_LOADING':
			return action.data

		default:
			return state
	}
}
