import { TweenMax } from 'gsap'

export default function(state = '', action) {
	switch (action.type) {
		case 'SHOW_SNACKBAR':
			let snackbar = document.querySelector('#snackbar')
			TweenMax.to(snackbar, 0.2, {
				// delay: .5,
				bottom: '70px'
			})
			TweenMax.to(snackbar, 0.2, {
				delay: 2,
				bottom: '-50px'
			})

			return action.data

		default:
			return state
	}
}
