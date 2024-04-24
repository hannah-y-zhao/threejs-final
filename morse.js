const morseArr=[
    {
        type: "a",
        morse:". -"
    },
    {
        type: "b",
        morse:"- . . ."
    },
    {
        type: "c",
        morse:"- . - ."
    },
    {
        type: "d",
        morse:"- . ."
    },
    {
        type: "e",
        morse:"."
    },
    {
        type: "f",
        morse:". . - ."
    },
    {
        type: "g",
        morse:"- - ."
    },
    {
        type: "h",
        morse:". . . ."
    },
    {
        type: "i",
        morse:". ."
    },
    {
        type: "j",
        morse:". - - -"
    },
    {
        type: "k",
        morse:"- . -"
    },
    {
        type: "l",
        morse:". - . ."
    },
    {
        type: "m",
        morse:"- -"
    },
    {
        type: "n",
        morse:"- ."
    },
    {
        type: "o",
        morse:"- - -"
    },
    {
        type: "p",
        morse:". - - ."
    },
    {
        type: "q",
        morse:"- - . -"
    },
    {
        type: "r",
        morse:". - ."
    },
    {
        type: "s",
        morse:". . ."
    },
    {
        type: "t",
        morse:"-"
    },
    {
        type: "u",
        morse:". . -"
    },
    {
        type: "v",
        morse:". . . -"
    },
    {
        type: "w",
        morse:". - -"
    },
    {
        type: "x",
        morse:". - - ."
    },
    {
        type: "y",
        morse:"- . - -"
    },
    {
        type: "z",
        morse:"- - . ."
    }
]

export function translation(c){
    // console.log(c)
    for(let i=0;i<morseArr.length;i++){
        if(c==morseArr[i].type){
            return morseArr[i].morse
        }
    }
}