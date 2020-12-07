export const showNotification = (nr : string = '' ) : Object =>{
    return{
      type : 'SHOW_NOTIFICATION',
      payload : nr
    }
}
