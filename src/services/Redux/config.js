import { createStore } from 'redux'
import { Provider } from 'react-redux'
import Reducers from './reducers'

export default Provider

//Dev Tools
export const Store = createStore(Reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
