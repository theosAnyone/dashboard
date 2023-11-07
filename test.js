const obj = {
  to_sort: ['Journey_Infos','progress'],
  caca:['prout']
}

const test = {...obj,caca: obj.caca ? [...obj["caca"],'pipi'] : ['pipi']}

console.log("test:",test);
