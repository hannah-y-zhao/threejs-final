const all=["blue-textured1","blue-textured2","copper-textured","dark-metallic-pearl","dark-textured","glass","glass2","gold-textured","green-textured","green-textured1","hard-metallic-dark","hard-metallic-gold","hard-metallic-gold2","hard-metallic-green","hard-metallic-pearl","hard-metallic-pink","hard-metallic-red","hard-metallic-red2","hard-metallic-silver-textured","hard-metallic-dark","marble-old-textured","mat","metallic-red-blue","orange-blue","soft-blue","soft-metallic-gray","soft-metallic-orange-blue","soft-metallic-orange-textured","soft-metallic-pearl","soft-metallic-red","soft-metallic-silver","soft-metallic-yellow-blue","soft-metallic1","teal-textured"]

const cool=["blue-textured1","blue-textured2","green-textured","green-textured1","hard-metallic-green","metallic-red-blue","orange-blue","soft-metallic-orange-blue","soft-blue","soft-metallic-yellow-blue"]
const warm=["copper-textured","gold-textured","hard-metallic-gold","hard-metallic-gold2","hard-metallic-pink","hard-metallic-red","hard-metallic-red2","metallic-red-blue","orange-blue","soft-metallic-orange-blue","soft-metallic-orange-textured","soft-metallic-red","soft-metallic-yellow-blue"]
const textured=["copper-textured","blue-textured1","blue-textured2","dark-textured","gold-textured","green-textured","green-textured1","hard-metallic-silver-textured","marble-old-textured","soft-metallic-orange-textured","teal-textured"]
const other=["dark-metallic-pearl","glass","glass2","hard-metallic-dark","hard-metallic-pearl","hard-metallic-silver-textured","hard-metallic-dark","marble-old-textured","mat","soft-metallic-gray","soft-metallic-pearl","soft-metallic-silver","soft-metallic1"]

export function randomAll(){
    return all[Math.floor(Math.random()*all.length)]
}
export function randomGroup(){
    let randGroup=Math.floor(Math.random()*4)
    let randIndex
    if (randGroup==0){
        randIndex=Math.floor(Math.random()*cool.length)
        return cool[randIndex]
    }else if (randGroup==1){
        randIndex=Math.floor(Math.random()*warm.length)
        return warm[randIndex]
    }else if (randGroup==2){
        randIndex=Math.floor(Math.random()*textured.length)
        return textured[randIndex]
    }else if (randGroup==3){
        randIndex=Math.floor(Math.random()*other.length)
        return other[randIndex]
    }
}