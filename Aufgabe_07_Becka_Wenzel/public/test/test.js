
 /**
* @description This function takes the input coordinates from an oringin and a destination as arrays
* and calculates the distance from the origin point to that destination point
* @param {array} origin - the single point that is the origin to other points
* @param {array} dest - a single point to which the distance has to be calculated to
* @return {number} d - the distance
*/

 var dist = function(origin, dest){

    //get coordinates of point
    var lon1 = origin[0];
    var lat1 = origin[1];
    var lon2 = dest[0];
    var lat2 = dest[1];
    
    //degrees to radiants
    var R = 6371e3; // metres
    var φ1 = lat1 * (Math.PI/180);
    var φ2 = lat2 * (Math.PI/180);
    var φ3 = lon1 * (Math.PI/180);
    var φ4 = lon2 * (Math.PI/180);
    var Δφ = (lat2-lat1) * (Math.PI/180);
    var Δλ = (lon2-lon1) * (Math.PI/180);
    
    //calculate distances
    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    //distance
    var d = Math.round(R * c);
    
    return d;
    }
    
    
    /**
    * @description This function takes the input coordinates from an oringin and a destination as arrays
    * and calculates the direction from the origin point to that destination point as string (e.g N/S/SE etc.)
    * @param {array} origin - the single point that is the origin to other points
    * @param {array} dest - a single point to which the direction has to be calculated to
    * @return {string} text - the direction in text format (e.g. "N"/"SE" etc.)
    */
    
    var direc = function(origin, dest){
    
    //get coordinates of point
    var lon1 = origin[0];
    var lat1 = origin[1];
    var lon2 = dest[0];
    var lat2 = dest[1];
    
    //degrees to radiants
    var R = 6371e3; // metres
    var φ1 = lat1 * (Math.PI/180);
    var φ2 = lat2 * (Math.PI/180);
    var φ3 = lon1 * (Math.PI/180);
    var φ4 = lon2 * (Math.PI/180);
    var Δφ = (lat2-lat1) * (Math.PI/180);
    var Δλ = (lon2-lon1) * (Math.PI/180);
    
    //bearing
    var y = Math.sin((φ4-φ3) * Math.cos(φ2));
    var x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(φ4-φ3);
    var brng = Math.atan2(y,x)*180/Math.PI;
    
    //avoid negative bearing
    if (brng < 0) {
        brng += 360;
    }
    
    //direction derived from bearing
    switch(true){
        case (brng < 22.5):
            var text = "N";
            break;
        case (brng < 67.5):
            text = "NE";
            break;
        case (brng < 112.5):
            text = "E";
            break;
        case (brng < 157.5):
            text = "SE";
            break;
        case (brng < 202.5):
            text = "S";
            break;
        case (brng < 247.5):
            text = "SW";
            break;
        case (brng < 292.5):
            text = "W";
            break;
        case (brng < 337.5):
            text = "NW";
            break;
        case (brng < 360):
            text = "N";
        }
    
        return brng;
    } 

/**
 * @description This function converts the given direction into a direction that can be 
 * compared to the direction given by function turf.bearing().
 * @param {int} dir - direction in degrees  
 */
    function bear (dir){
        if (dir < 180){
            var d = Math.round (dir);
            console.log(d);
            return d;
                
        }
        else if (dir > 180){
            //console.log(dir);
             var d = (360 - (Math.round (dir))) *(-1);
            console.log(d);
            return d;
                
        }
        else {
            console.log("no correct coordinates given")
            }
    }  
 

// Distance tests
  QUnit.test( "equal test", function( assert ) {
    var options = {units: 'kilometres'};
    assert.equal((Math.round ( turf.distance([7.699356, 51.908273], [7.559967,51.940879]))), (Math.round(dist([7.699356, 51.908273], [7.559967,51.940879])/1000)), options, "success");
    assert.equal((Math.round ( turf.distance([7.699356, 51.908273], [7.699356,51.908273]))), (Math.round(dist([7.699356, 51.908273], [7.699356,51.908273])/1000)), options, "success");
    assert.equal((Math.round ( turf.distance([7.699356, 51.908273], [7.830505,52.044045]))), (Math.round(dist([7.699356, 51.908273], [7.830505,52.044045])/1000)), options, "success");
    assert.equal((Math.round ( turf.distance([7.699356, 51.908273], [7.657471,51.728729]))), (Math.round(dist([7.699356, 51.908273], [7.657471,51.728729])/1000)), options, "success");
    });


//bearing tests
QUnit.test( "equal test2", function( assert ) {
    assert.equal( (Math.round ( turf.bearing([7.699356, 51.908273], [7.559967,51.940879]))), (bear (direc([7.699356, 51.908273], [7.559967,51.940879]))), "success");
    assert.equal( (Math.round ( turf.bearing([7.699356, 51.908273], [7.699359,51.908300]))), (bear (direc([7.699356, 51.908273], [7.699359,51.908300]))), "success");
    assert.equal( (Math.round ( turf.bearing([7.699356, 51.908273], [7.830505,52.044045]))), (bear (direc([7.699356, 51.908273], [7.830505,52.044045]))), "success");
    assert.equal( (Math.round ( turf.bearing([7.699356, 51.908273], [7.657471,51.728729]))), (bear (direc([7.699356, 51.908273], [7.657471,51.728729]))), "success");
  
});


