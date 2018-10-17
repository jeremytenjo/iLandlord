import { TweenMax } from 'gsap'

export default function(state = '', action) {
  let loadingScreen = document.querySelector('#loadingScreen')

  switch (action.type) {
    case 'SHOW_LOADINGSCREEN':
      loadingScreen.style.display = 'block'

      TweenMax.to(loadingScreen, 0.1, {
        // background: 'rgba(255, 255, 255, 0.80)'
        background: 'rgba(97, 97, 97, 0.8)'
      })

      return action.data

    case 'HIDE_LOADINGSCREEN':
      loadingScreen.style.display = 'none'
      loadingScreen.style.background = 'none'

      return action.data

    default:
      return state
  }
}
