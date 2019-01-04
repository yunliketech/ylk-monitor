var  utils = {
    assignObject: function ( obj1, obj2 ) {
        for ( var name in obj2 ) {
          if ( obj2.hasOwnProperty( name ) ) {
            obj1[ name ] = obj2[ name ];
          }
        }
        return obj1;
    },
   
}




export default utils;