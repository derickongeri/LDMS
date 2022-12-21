
let dir;
export function convertToDMS(src) {
    let degs =[];
    src.forEach((_,i) => {
        if(i===0){
             dir = src[0] > 0 ? "N" : "S";
        }else{
             dir = src[1] > 0 ? "E" : "W";
        }
        degs.push(toDMS(src[i]) + dir)
    });
   return degs
  }
  function toDMS(n) {
      // The sign doesn't matter
      n = Math.abs(n);
      // Get the degrees
      var d = Math.floor(n);
      // Strip off the answer we already have
      n = n - d;
      // And then put the minutes before the '.'
      n *= 60;
      // Get the minutes
      var m = Math.floor(n);
      // Remove them from the answer
      n = n - m;
      // Put the seconds before the '.'
      n *= 60;
      // Get the seconds
      var s = Math.floor(n);
      // Put it together.
      return "" + d + "." + m + "" + s;
    }
  