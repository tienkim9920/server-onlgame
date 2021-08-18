
let caseCaro = []

matrixTop(10, caseCaro)
console.log(caseCaro)

// Hàm này dùng để xử lý
function caseRow(row, colum, arrMap){

    const getColum = setColum(colum)

    let arrLeft = createArray(getColum)

    let arrRight = createArray(getColum)

    for (let j = 0; j < 5; j++){
        for (let i = 0; i < getColum; i++){

            // const value = j < 1 ? (j * 10) + i + (row * 10) : (j * 10) + j + i  + (row * 10)

            const valueLeft = j < 1 ? (j * 10) + i + (row * 10) : arrLeft[i][j - 1] + 11

            const valueRight = j < 1 ? 4 + i + (row * 10) : arrRight[i][j - 1] + 9

            arrLeft[i][j] = valueLeft

            arrRight[i][j] = valueRight

        }
    }

    pushArray(arrLeft, arrMap)
    pushArray(arrRight, arrMap)

}

// Hàm này dùng để push mảng con vào mảng cha
function pushArray(arrayChild, arrayParent) {
    for (let i = 0; i < arrayChild.length; i++){
        arrayParent.push(arrayChild[i])
    }
}

// Hàm này dùng để map cái những array vào mảng parent
function matrixTop(colum, arrMap){

    const getColum = setColum(colum)

    for (let i = 0; i < getColum; i++){
        caseRow(i, colum, arrMap)
    }
}

// Hàm này dùng để set colum nếu colum là số chẵn thì cộng 2 lẻ thì cộng 1
function setColum(colum) {
    if (colum > 10 && colum % 2 === 0){
        return Math.ceil(colum/2) + 2
    }else{
        return Math.ceil(colum/2) + 1
    }
}

// Hàm này dùng để tạo mảng rỗng 2 chiều
function createArray(colum){

    let array = []

    for(var i = 0; i < colum; i++){

        array.push([]);

        array[i].push(new Array(5));

        for(var j = 0; j < 5; j++){
            array[i][j] = 0;
        }
    }

    return array
}