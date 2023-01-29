let contador = 1
let numeros = []


process.on("message", (msg) => {
  console.log(`Msj padre: `, msg);
  for(let i = 0; i<msg; i++){
    const random = Math.trunc(Math.random()*1000+1)
    const repetido = numeros.find(n => n.nro == random)
    if(repetido){
      repetido.cant++
    }
    else{
      numeros.push({nro: random, cant: 1})
    }
 }
  process.send(numeros);
  process.exit()
});
