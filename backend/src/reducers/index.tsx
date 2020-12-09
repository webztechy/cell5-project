import { pageUtilitiesReducer, isloggedinReducer, showCountersReducers }  from './pages';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    showNotification : pageUtilitiesReducer,
    isLoggedin : isloggedinReducer,
    showCounters : showCountersReducers
});

export default allReducers;