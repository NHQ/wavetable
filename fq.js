var sampleRate = sr = 64
var table = Array(sampleRate).fill(0).map((e,i)=>Math.sin(Math.PI * 2 * i / sampleRate))
var cos = Array(sampleRate).fill(0).map((e,i)=>Math.cos(Math.PI * 2 * i / sampleRate))
var phable = table.map((e,i) => (1-Math.abs(Math.atan2(Math.cos(Math.PI*2*i/sr),e)/(Math.PI/2)))/2)
function cumSum(a) {
    let result = [a[0]];

    for(let i = 1; i < a.length; i++) {
      result[i] = result[i - 1] + a[i];
    }

    return result;
};
function okay(t=1){
  var i = 1; 
  for (i; i <= 32/2; i++){
    var w = []
    for(var j = 0; j <= sr/i; j++){
      var a = Math.sin(Math.PI * 2 * (j/sr) * i)
      var sine = Math.sin(Math.PI * 2 * i/sr)
      var p = (1-Math.abs(Math.atan2(cos[j],a)/(Math.PI/2)))/2
      w.push(p)
    }
    //console.log(w)
    //console.log(i, a, ((Math.atan2(Math.cos(Math.PI * 2 * t/sr),a))) / Math.PI / 2)
    //console.log(i, sine, (1-Math.abs(Math.atan2(Math.cos(Math.PI*2*i/sr),Math.sin(Math.PI*2*i/sr))/(Math.PI/2)))/2)///Math.PI/2)
    //console.log(w)
    console.log(w.slice(0, sr/4).reduce((a,e)=>a+e,0))
    console.log(i, w.reduce((a,e,i,v)=>a+Math.abs(e),0)/w.length*4)//v.slice(0,i+1).reduce((a,e)=>a+e,0), 0))
   // console.log(i, a, (1-(Math.atan2(Math.cos(Math.PI*2*t/sr),a)/(Math.PI/2)))/2)///Math.PI/2)
  }
}

okay(Number(process.argv[2]))
