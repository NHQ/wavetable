var tf = require('../various/node_modules/@tensorflow/tfjs')
var jsynth = require('../jsynth-buffer')
var $ = require('../polysynth/cheatcode.js')
var sampleRate = 32 * 2 
var sr = sampleRate
var fq = 1
var mag = 32/4

var master = new AudioContext
console.log(master.state)
function canv(){
  var canvas = document.createElement('canvas')
  canvas.style.width = canvas.style.height = sampleRate * mag + 'px'
  canvas.height = canvas.width = sampleRate * mag
  document.body.appendChild(canvas)
  var ctx = canvas.getContext('2d')
  ctx.strokeStyle = 'gray' //gradient;
  ctx.lineWidth = .5;
  return ctx
}
var ctx = canv()
var ctz = canv()
var table = Array(sampleRate).fill(0).map((e,i)=>Math.sin(Math.PI * 2 * i / sampleRate))
var cos = Array(sampleRate).fill(0).map((e,i)=>Math.cos(Math.PI * 2 * i / sampleRate))
var phable = table.map((e,i) =>(Math.abs(Math.atan2((e*-e), -1+0*(Math.cos(Math.PI*2*i/sr)))/(Math.PI))))
//console.log(phable)
var a = tf.tensor(table, [1, table.length])
var p = tf.tensor(cos, [1, table.length])
var ph = tf.tensor(phable, [1, table.length])
//console.log(ph.dataSync())
var phdev = tf.sqrt(tf.pow(ph, tf.scalar(2)).mean())//.mul(tf.scalar(Math.PI*2))
phdev.print()
ph.mean().print()
function train(signal, sr){ // [length, 1]
  
}
var last = a
window.requestAnimationFrame(draw)
var frame = 1
var prev = a
var all = []
function draw(){
  var wave = Array(sampleRate).fill(0).map((e,i)=>$.oz.sine(i / sampleRate,  fq) * 1)//, 0, 1/4, 2, 0, $.oz.sine, 0))// * $.amod(1, 0, i/sampleRate, fq/2))
   
  var b = tf.tensor(wave, [1, wave.length])
  var b2 = b//.div(tf.scalar(4))
  var dev = tf.pow(b, tf.scalar(2)).div(tf.scalar(sampleRate-1)).sum().sqrt()//.mul(tf.scalar(Math.PI*2))
  //dev.print()
  console.log(fq)
  var cs = b.dot(last.transpose()).div(b.pow(tf.scalar(2)).sum().sqrt().mul(b2.pow(tf.scalar(2)).sum().sqrt()))//.print()
  last = b
  cs.print()//tf.acos(cs).div(tf.scalar(Math.PI)).print()
  //tf.acos(cs).div(tf.scalar(Math.PI)).print()
  //tf.scalar(1).div(tf.cos(b.mul(b.div(tf.scalar(2))))).div(tf.scalar(Math.PI)).sum().print()
  var pz = (tf.atan2(b.mul(a.neg()), tf.scalar(1)).div(tf.scalar(Math.PI)))
  var mmm = pz.mul(b).sum().dataSync()[0]//.print()
  var cum = pz.slice([0,0], [1, 32]).sum(1).dataSync()[0]
  //console.log(pz.dataSync())
  //console.log(pz.slice([0,0], [1, 8]).sum(1).round().dataSync())
  //console.log(fq)
  //pz.cumsum(1).sum(1).print() 
  //console.log(pz.dataSync())
  var dev = tf.sqrt(tf.pow(pz, tf.scalar(2)).mean())//.mul(tf.scalar(Math.PI*2))
  var bn =  pz.sub(ph.mean()).mul(phdev.div(dev)).add(pz.mean()) //tf.batchNormalization(pz, pz.mean(), phdev)
  //console.log(fq, cum, pz.dataSync(), pz.tanh().tanh().dataSync())
  //console.log(fq, fq % 2 == 1 ? 'odd' : 'even', cum > .01 ? 'even' : 'odd', cum)
  //pz = tf.sigmoid(tf.abs(pz))
  var zz = tf.sigmoid(tf.mul(b, a))//b.transpose()))
  z2 = (tf.matMul(b.transpose(), b))
  //console.log(z2.sum(1).dataSync())
  //;(z2.cumsum(1).slice([0,0],[sampleRate, sampleRate/2]).sum(1).argMax()).print()
  //pz.print)
  z = b.mul(b).tile([1, sampleRate]).reshape([sampleRate, sampleRate])
  //z2 = pz//pz.tile([1, sampleRate]).reshape([sampleRate, sampleRate])
  //var z = zz.slice([0,0], [sampleRate/2, sampleRate/2])
  z = z.dataSync()
  //var z2 = pz.slice([sampleRate/2, sampleRate/2], [sampleRate/2, sampleRate/2])
  z3 = z2.slice([0,0], [sampleRate, sampleRate/2])
  z3 = z3.mul(z2.slice([0,sampleRate/2], [sampleRate, sampleRate/2]))
  z2 = z2.dataSync()//z3.tile([1,2]).dataSync()
  //z2 = z2.dataSync()//z2.transpose().dataSync()
  ctx.clearRect(0,0, mag*sampleRate, mag*sampleRate)
  z.forEach((e,i) => {
    ctx.fillStyle = `hsl(${Math.abs(e*2)*360}, ${Math.abs(.5)*100}%, ${Math.abs(.5)*100}%)`
    var x, y
    ctx.fillRect(i % (sampleRate) * mag, Math.floor(i / sampleRate) * mag, mag, mag)
  //  ctx.strokeRect(x = i % sampleRate * mag, y = Math.floor(i / sampleRate) * mag, mag, mag)
  })
  //ctz.clearRect(0,0, mag*sampleRate, mag*sampleRate)
  z2.forEach((e,i) => {
    ctz.fillStyle = `hsla(${(e*$.amod(8, 2, frame / sampleRate, 12/2))*360/2}, ${Math.abs(1)*70}%, ${Math.abs(1)*40}%, 100%)`
    var x, y
    ctz.fillRect(i % (sampleRate) * mag, Math.floor(i / sampleRate) * mag, mag, mag)
  //  ctx.strokeRect(x = i % sampleRate * mag, y = Math.floor(i / sampleRate) * mag, mag, mag)
  })
  frame++// = Math.floor(Math.random() * 1000)
  //fq = $.amod(63, 1/sampleRate*8, frame / sampleRate, 1)//(fq + 1) % (sampleRate/2)
  fq = (frame) % (sampleRate) 
  setTimeout(_=>window.requestAnimationFrame(draw),1333)
}
