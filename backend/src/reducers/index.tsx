import { pageUtilitiesReducer, isloggedinReducer }  from './pages';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    showNotification : pageUtilitiesReducer,
    isLoggedin : isloggedinReducer
});

export default allReducers;