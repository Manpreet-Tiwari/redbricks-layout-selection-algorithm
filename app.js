const PDFDocument = require('pdfkit');
const fs = require('fs');

let doc = new PDFDocument({ size: [1080, 566], margin: 0 });
doc.pipe(fs.createWriteStream('./generated.pdf'));
doc.image('./layout.png', { width: 1080, height: 566 });


let outline = [[56, 272], [866, 272], [866, 517], [56, 517]];

let outlineXAxis = [56, 866];
let outlineYAxis = [272, 517];

let startingXAxis = 56;
let startingYAxis = 272;

let noOfSeats = 326;

let noOfSeatsInRow = 11;

let sizeOfSeat = { width: 20, height: 19 };

let selectedArea;
let selectedAreaxAxis = 56;
let selectedAreaYAxis = 272;
let rowComplete = false;
let pillarArived = false;
let gapStartingPosition = [133, 236,358, 455,512,654,719];
let gapWithPillar = [133, 236, 512, 654];
let widthOfPillar = 7;
let pillarRowComplete = false;

// for (let i = 1; i <= noOfSeats; i++){
//     selectedAreaYAxis += 19;
//     if (i % 5 === 0) {
//         rowComplete = true;
//     } else if (rowComplete === true) {
//         selectedAreaxAxis += 20;
//         rowComplete = false;
//     }
// };


for (let i = 1; i <= noOfSeats; i++) {
    // console.log(selectedAreaxAxis);
    if (rowComplete === true) {
        selectedAreaxAxis += 19.25;
        selectedAreaYAxis = startingYAxis;
        rowComplete = false;
    }
    gapStartingPosition.forEach((position) => {
        if ((selectedAreaxAxis > (position - 1)) && (selectedAreaxAxis < (position + 1))) {
            selectedAreaYAxis = startingYAxis
            gapWithPillar.forEach((pillarPosition) => {
                if (pillarPosition === position) {
                    doc.polygon(
                        [selectedAreaxAxis, selectedAreaYAxis],
                        [selectedAreaxAxis + widthOfPillar, selectedAreaYAxis],
                        [selectedAreaxAxis + widthOfPillar, selectedAreaYAxis + 235],
                        [selectedAreaxAxis, selectedAreaYAxis + 235]
                    ).fillOpacity(0.4).fill("blue");
                    selectedAreaxAxis += 7;
                }
            });
            doc.polygon(
                [selectedAreaxAxis, selectedAreaYAxis],
                [selectedAreaxAxis + 19.25, selectedAreaYAxis],
                [selectedAreaxAxis + 19.25, selectedAreaYAxis + 235],
                [selectedAreaxAxis, selectedAreaYAxis + 235]
            ).fillOpacity(0.4).fill('blue');

            rowComplete = false;
            selectedAreaYAxis = startingYAxis;
            selectedAreaxAxis += 19.25;
        }
    })
    doc.polygon(
        [selectedAreaxAxis, selectedAreaYAxis],
        [selectedAreaxAxis + 19.25, selectedAreaYAxis],
        [selectedAreaxAxis + 19.25, selectedAreaYAxis + 21.36],
        [selectedAreaxAxis, selectedAreaYAxis + 21.36]
    ).fillOpacity(0.4).fill("blue");
    selectedAreaYAxis += 21.36;
    if (i % noOfSeatsInRow === 0) {
        rowComplete = true;
    }


}

console.log('selected X-Axis::', selectedAreaxAxis);
console.log('selecte Y-Axis::', selectedAreaYAxis);


doc.end();
