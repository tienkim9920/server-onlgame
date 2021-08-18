
let caseCaro = []

matrixTop(11)

function caseRow(row, colum){

    let array = createArray(colum)

    for (let j = 0; j < 5; j++){
        for (let i = 0; i < Math.ceil(colum / 2) + 1; i++){

            const value = j < 1 ? (j * 10) + i + (row * 10) : (j * 10) + j + i  + (row * 10)

            array[i][j] = value

        }
    }

    console.log(array)

}

function matrixTop(row){
    for (let i = 0; i < Math.ceil(row / 2) + 1; i++){
        caseRow(i, row)
    }
}

function createArray(colum){

    let array = []

    for(var i = 0; i < Math.ceil(colum / 2) + 1; i++){

        array.push([]);

        array[i].push(new Array(5));

        for(var j = 0; j < 5; j++){
            array[i][j] = 0;
        }
    }

    return array
}