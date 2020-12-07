
class UtilitiesHelper {

    isEmpty = ( s: any ) : Boolean =>  {
        return ((s == null) || (s.length == 0));
    }
    
    rangeArray = (start : number, end : number) :  Array<any> => {
        const length = (end + 1) - start;
        let i : any;
        return Array.from({ length }, (_, i) => start + i);
    }

    _convertArray = ( row_array : Array<any> = [] ) : Array<any> => {
    
        let row_meta : Array<any> = [];
        
        if ( row_array.length>0 ){
            
            row_array.forEach(row => {
                const meta_key = row.meta_key;
                const meta_value = row.meta_value;

                if ( row.group_id  in row_meta){
                    let add_value = { [meta_key]: meta_value };
                    row_meta[row.group_id] = {...row_meta[row.group_id], ...add_value }

                }else{
                    row_meta[row.group_id] = {  group_id : row.group_id, [meta_key]: meta_value }
                }
            });

            // removed null or empty values 
            row_meta = row_meta.filter(function (el : any) {
                return el != null;
            });
            
        }
        
      return row_meta;
    }

}

export = new UtilitiesHelper();