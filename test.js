const fs = require('fs');
const PDFDocument = require('pdfkit');
let selectedAreaColor = "blue";

const generateLayout = (requiredNoOfSeats) => {
    let workStationId;
    let rowComplete = false;
    let layoutData = require('./layout.json');
    const doc = new PDFDocument({ size: [1080, 566], margin: 0 });
    doc.pipe(fs.createWriteStream('./generated.pdf'));
    try {
        layoutData.workstations.forEach((workStation) => {
            console.log('forEach started');
            if (requiredNoOfSeats > workStation.AvailableNoOfSeats) {
                return new Error('Seats Not Available');
            }
            else if (workStationId === undefined) {
                workStationId = workStation._id;
            }
        })
    }
    catch (err) {
        if (!err.message) err.message = 'Error while generation layout';
        console.log(err.message);
    }
    if (workStationId) {
        doc.image('./layout.png', { width: 1080, height: 566 });
        let workStationData = layoutData.workstations.find((workStation) => workStationId === workStation._id);
        for (let i = 1; i <= requiredNoOfSeats; i++) {
            if (rowComplete === true) {
                workStationData.selectedAreaXAxis += 19.25;
                workStationData.selectedAreaYAxis = workStationData.startingYAxis;
                rowComplete = false;
            }
            workStationData.gapPosition.forEach((gap) => {
                if ((workStationData.selectedAreaXAxis > (gap.startingPositon - 1)) && (workStationData.selectedAreaXAxis < (gap.startingPositon + 1))) {
                    workStationData.selectedAreaYAxis = workStationData.startingYAxis;
                    doc.polygon(
                        [workStationData.selectedAreaXAxis, workStationData.selectedAreaYAxis],
                        [workStationData.selectedAreaXAxis + gap.pillarWidth, workStationData.selectedAreaYAxis],
                        [workStationData.selectedAreaXAxis + gap.pillarWidth, workStationData.selectedAreaYAxis + gap.pillarHeight],
                        [workStationData.selectedAreaXAxis, workStationData.selectedAreaYAxis + gap.pillarHeight]
                    ).fillOpacity(0.4).fill("green");
                    rowComplete = false;
                    workStationData.selectedAreaYAxis = workStationData.startingYAxis;
                    workStationData.selectedAreaXAxis += gap.pillarWidth;
                }
            });
            doc.polygon(
                [workStationData.selectedAreaXAxis, workStationData.selectedAreaYAxis],
                [workStationData.selectedAreaXAxis + 19.25, workStationData.selectedAreaYAxis],
                [workStationData.selectedAreaXAxis + 19.25, workStationData.selectedAreaYAxis + 21.36],
                [workStationData.selectedAreaXAxis, workStationData.selectedAreaYAxis + 21.36]
            ).fillOpacity(0.4).fill("blue");
            workStationData.selectedAreaYAxis += 21.36;
            // if (i % workStationData.noOfSeatsInRow === 0) {
            //     rowComplete = true;
            // }
            if ((workStationData.selectedAreaYAxis > (workStationData.lastYAxis - 1)) && (workStationData.selectedAreaYAxis < (workStationData.lastYAxis + 1))) {
                rowComplete = true;
            }
        }
    }
    else {
        doc.fontSize(56).text("Space Not Available",330,253);
        console.log('Space Not Available');
    }
    doc.end();
}
generateLayout(100);