import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

export default MuiThemeProvider

export const muiTheme = getMuiTheme({
	palette: {
		primary1Color: '#00c853',
		accent1Color: '#00c853'
	}
})
