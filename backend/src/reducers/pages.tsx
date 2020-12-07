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