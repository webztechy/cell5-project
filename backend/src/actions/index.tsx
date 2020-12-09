export const showNotification = (nr : string = '' ) : Object =>{
    return{
      type : 'SHOW_NOTIFICATION',
      payload : nr
    }
}

export const isLoggedin = (nr : number = 0 ) : Object  =>{
  return{
    type : 'LOGGEDIN_STATUS',
    payload : nr
  }
}


export const showCounters = (nr : string = '' ) : Object  =>{
  return{
    type : 'SHOW_COUNTERS',
    payload : nr
  }
}

