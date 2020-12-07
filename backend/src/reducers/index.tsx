import { pageUtilitiesReducer }  from './pages';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    showNotification : pageUtilitiesReducer
});

export default allReducers;