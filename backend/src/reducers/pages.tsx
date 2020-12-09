export const pageUtilitiesReducer = ( state : string = '', action : any ) : any =>{
    switch (action.type) {
        case 'SHOW_NOTIFICATION':
                state  = action.payload;
                return state;
            break;

        default:
            return state;
            break;
    }
}

export const isloggedinReducer = ( state : number = 0, action : any ) =>{
    switch (action.type) {
        case 'LOGGEDIN_STATUS':
                state = action.payload;
                return state;
            break;
    
        default:
            return state;
            break;
    }
}

export const showCountersReducers = ( state : string = '', action : any ) =>{
    switch (action.type) {
        case 'SHOW_COUNTERS':
                state = action.payload;
                return state;
            break;
    
        default:
            return state;
            break;
    }
}
