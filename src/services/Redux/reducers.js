import { combineReducers } from 'redux'

import Bills from '../../components/Main/Home/Bills/_state/Bills'
import BillPayments from '../../components/Main/Home/Bills/_state/BillPayments'
import Income from '../../components/Main/Home/Income/_state/Income'
import IncomePayments from '../../components/Main/Home/Income/_state/IncomePayments'
import Expenses from '../../components/Main/Home/Expenses/_state/Expenses'
import ExpensePayments from '../../components/Main/Home/Expenses/_state/ExpensePayments'
import BottomNavLocation from '../../components/Main/_BottomNav/_state/'
import Properties from './Properties'
import Location from './Location'
import Dialogues from './Dialogues'
import Snackbar from './Snackbar'
import DateSelection from './DateSelection'
import DateSelectionReport from './DateSelectionReport'
import DialogAlert from './DialogAlert'
import Property from './Property'
import Loading from './Loading'
import Comment from './Comment'
import LoadingScreen from './LoadingScreen'
import BillsLoading from '../../components/Main/Home/Bills/_state/Loading'
import ExpensesLoading from '../../components/Main/Home/Expenses/_state/Loading'
import IncomeLoading from '../../components/Main/Home/Income/_state/IncomeLoading'

const Reducers = combineReducers({
  Properties,
  Bills,
  BillPayments,
  Location,
  Dialogues,
  Snackbar,
  DateSelection,
  DateSelectionReport,
  DialogAlert,
  Income,
  IncomePayments,
  Property,
  Expenses,
  ExpensePayments,
  Loading,
  Comment,
  LoadingScreen,
  BottomNavLocation,
  BillsLoading,
  ExpensesLoading,
  IncomeLoading
})

export default Reducers
