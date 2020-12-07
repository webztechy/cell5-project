class UtilitiesHelper {

    isEmpty = ( s: any ) : Boolean =>  {
        return ((s == null) || (s.length == 0));
    }

    statusLabels = (n : number) => {
        return ( n==1 ) ? 'active' : 'inactive';
    }

    featuredLabels = (n : number) => {
        return ( n==1 ) ? 'yes' : 'no';
    }

    pageLimit = () : any =>  {
        return [5, 10, 15,20, 25];
    }
    
    rangeArray = (start : number, end : number) :  Array<any> => {
        const length = (end + 1) - start;
        let i : any;
        return Array.from({ length }, (_, i) => start + i);
    }
    
    currentUTCTime = () : string => {
        const now = new Date();        
        const utc_timezone : string = now.toUTCString();
        return utc_timezone;
    }

    toNormalArrayObject = (arr : Array<{}> ) : any =>{
        let arr_updated = [];
        for (const [key, value] of Object.entries(arr)) {
            arr_updated.push(value);
        }
        return arr_updated;
    }   
    
    fieldSorter = (fields : any ) => (a : any , b : any ) => fields.map( (o : any )  => {
        let dir = 1;
        if (o[0] === '-') { dir = -1; o=o.substring(1); }
        return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
    }).reduce((p  : any , n  : any ) => p ? p : n, 0);

    numberWithCommas = (x : string, symbol = ',') : string => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, symbol);
    }
    
    numberFormat = (number : any, digit : number ) : string => {
        let decimal : number = 2;
        if( !this.isEmpty(digit) ){ decimal =  digit; } 
        return parseFloat(number).toFixed(decimal);
    }
    
    number_format = (number: any, digit : number, symbol :string = ',') : string => {
        number = this.numberFormat(number, digit);
        number = this.numberWithCommas(number, symbol);
        return number;
    }

}

export default new UtilitiesHelper();

