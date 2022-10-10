const fs = require('fs');
const PDFDocument = require('pdfkit');
let selectedAreaColor = "blue";

const generateLayout = (requiredNoOfSeats) => {
    let workStationId;
    let layoutData = require('./layout copy.json');
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
        doc.image('./salarpuria.png',{height: 566, align: 'center', valign: 'center'});
        let workStationData = layoutData.workstations.find((workStation) => workStationId === workStation._id);
        let rowComplete = false;
        let mainWorkStationData;
        let subWorkStationStarted = false;
        let subWorkStationData;
        for (let i = 1; i <= requiredNoOfSeats; i++) {
            if (rowComplete === true) {
                workStationData.selectedAreaXAxis += workStationData.sizeOfSeat.width;
                workStationData.selectedAreaYAxis = workStationData.startingYAxis;
                rowComplete = false;
            }
            
            // console.log(i);
            
            
            // workStationData.partition.forEach((partition) => {
            //     if ((workStationData.selectedAreaXAxis > (partition.startingPosition - 1)) && (workStationData.selectedAreaXAxis > (partition.startingPosition + 1))) {
            //         workStationData.selectedAreaYAxis = workStationData.startingYAxis;
            //         doc.polygon(
            //             [workStationData.selectedAreaXAxis, workStationData.selectedAreaYAxis],
            //             [workStationData.selectedAreaXAxis + partition.width, workStationData.selectedAreaYAxis],
            //             [workStationData.selectedAreaXAxis + partition.width, workStationData.selectedAreaYAxis + partition.height],
            //             [workStationData.selectedAreaXAxis, workStationData.selectedAreaYAxis + partition.height]
            //         ).fillOpacity(0.4).fill('red');
            //         rowComplete = false;
            //         workStationData.selectedAreaYAxis = workStationData.startingYAxis;
            //         workStationData.selectedAreaXAxis += partition.width;
            //     }
            // });
            workStationData.pillarPosition.forEach((pillar) => {
                if (
                    (workStationData.selectedAreaXAxis > (pillar.startingXPosition - 1)) &&
                    (workStationData.selectedAreaXAxis < (pillar.startingXPosition + 1)) &&
                    (workStationData.selectedAreaYAxis > (pillar.startingYPosition - 1)) &&
                    (workStationData.selectedAreaYAxis < (pillar.startingYPosition + 1))
                ) {
                    console.log('pillar starting::', workStationData.selectedAreaYAxis);
                    doc.polygon(
                        [workStationData.selectedAreaXAxis, workStationData.selectedAreaYAxis],
                        [workStationData.selectedAreaXAxis + pillar.pillarWidth, workStationData.selectedAreaYAxis],
                        [workStationData.selectedAreaXAxis + pillar.pillarWidth, workStationData.selectedAreaYAxis + pillar.pillarHeight],
                        [workStationData.selectedAreaXAxis, workStationData.selectedAreaYAxis + pillar.pillarHeight],
                        ).fillOpacity(0.4).fill('green');
                        workStationData.selectedAreaYAxis += pillar.pillarHeight;
                        console.log('pillar starting::2::', workStationData.selectedAreaYAxis);
                }
            })
            if ((workStationData.selectedAreaYAxis > (workStationData.lastYAxis - 1)) && (workStationData.selectedAreaYAxis < (workStationData.lastYAxis + 1))) {
                console.log('y limit reached')
                rowComplete = true;
            }
            workStationData.partition.forEach((gap) => {
                if ((workStationData.selectedAreaXAxis > (gap.startingPosition - 1)) && (workStationData.selectedAreaXAxis < (gap.startingPosition + 1))) {
                    workStationData.selectedAreaYAxis = workStationData.startingYAxis;
                    doc.polygon(
                        [workStationData.selectedAreaXAxis, workStationData.selectedAreaYAxis],
                        [workStationData.selectedAreaXAxis + gap.width, workStationData.selectedAreaYAxis],
                        [workStationData.selectedAreaXAxis + gap.width, workStationData.selectedAreaYAxis + gap.height],
                        [workStationData.selectedAreaXAxis, workStationData.selectedAreaYAxis + gap.height]
                    ).fillOpacity(0.4).fill("red");
                    rowComplete = false;
                    workStationData.selectedAreaYAxis = workStationData.startingYAxis;
                    workStationData.selectedAreaXAxis += gap.width;
                }
            });
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
            workStationData.partition.forEach((gap) => {
                if ((workStationData.selectedAreaXAxis > (gap.startingPosition - 1)) && (workStationData.selectedAreaXAxis < (gap.startingPosition + 1))) {
                    workStationData.selectedAreaYAxis = workStationData.startingYAxis;
                    doc.polygon(
                        [workStationData.selectedAreaXAxis, workStationData.selectedAreaYAxis],
                        [workStationData.selectedAreaXAxis + gap.width, workStationData.selectedAreaYAxis],
                        [workStationData.selectedAreaXAxis + gap.width, workStationData.selectedAreaYAxis + gap.height],
                        [workStationData.selectedAreaXAxis, workStationData.selectedAreaYAxis + gap.height]
                    ).fillOpacity(0.4).fill("red");
                    rowComplete = false;
                    workStationData.selectedAreaYAxis = workStationData.startingYAxis;
                    workStationData.selectedAreaXAxis += gap.width;
                }
            });
            workStationData.subWorkStationArea.forEach((subWorkStation) => {
                if ((workStationData.selectedAreaXAxis > (subWorkStation.startingXAxis - 1)) && (workStationData.selectedAreaXAxis < (subWorkStation.startingXAxis + 1))) {
                    subWorkStationStarted = true;
                    subWorkStationData = subWorkStation;
                }
            })
            
            if (subWorkStationStarted === false) {
                if (rowComplete === true) {
                    i--;
                } else {
                    doc.polygon(
                        [workStationData.selectedAreaXAxis, workStationData.selectedAreaYAxis],
                        [workStationData.selectedAreaXAxis + workStationData.sizeOfSeat.width, workStationData.selectedAreaYAxis],
                        [workStationData.selectedAreaXAxis + workStationData.sizeOfSeat.width, workStationData.selectedAreaYAxis + workStationData.sizeOfSeat.height],
                        [workStationData.selectedAreaXAxis, workStationData.selectedAreaYAxis + workStationData.sizeOfSeat.height]
                    ).fillOpacity(0.4).lineWidth(0.2).stroke('blue');
                    workStationData.selectedAreaYAxis += workStationData.sizeOfSeat.height;
                }
            }
            // if (i % workStationData.noOfSeatsInRow === 0) {
            //     rowComplete = true;
            // }
            if ((workStationData.selectedAreaYAxis > (workStationData.lastYAxis - 1)) && (workStationData.selectedAreaYAxis < (workStationData.lastYAxis + 1))) {
                console.log('y limit reached')
                rowComplete = true;
            }
            
            if (subWorkStationStarted === true) {
                // subWorkStationData.selectedAreaXAxis = workStationData.selectedAreaXAxis;
                // subWorkStationData.selectedAreaYAxis = workStationData.selectedAreaYAxis;
                for (let j = 1; j <= subWorkStationData.AvailableNoOfSeats; j++) {
                    
                    console.log(i);
                    
                    console.log('sub');
                    // if (subrowComplete === true) {
                    //     subWorkStationData.selectedAreaXAxis += subWorkStationData.sizeOfSeats.width;
                    //     subWorkStationData.selectedAreaYAxis = subWorkStationData.startingYAxis;
                    //     rowComplete = false;
                    // }
                    // subWorkStationData.gapPosition.forEach((gap) => {
                    //     if ((subWorkStationData.selectedAreaXAxis > (gap.startingPositon - 1)) && (subWorkStationData.selectedAreaXAxis < (gap.startingPositon + 1))) {
                    //         subWorkStationData.selectedAreaYAxis = subWorkStationData.startingYAxis;
                            // doc.polygon(
                            //     [subWorkStationData.selectedAreaXAxis, subWorkStationData.selectedAreaYAxis],
                            //     [subWorkStationData.selectedAreaXAxis + gap.pillarWidth, subWorkStationData.selectedAreaYAxis],
                            //     [subWorkStationData.selectedAreaXAxis + gap.pillarWidth, subWorkStationData.selectedAreaYAxis + gap.pillarHeight],
                            //     [subWorkStationData.selectedAreaXAxis, subWorkStationData.selectedAreaYAxis + gap.pillarHeight]
                            // ).fillOpacity(0.4).fill("green");
                    //         rowComplete = false;
                    //         subWorkStationData.selectedAreaYAxis = subWorkStationData.startingYAxis;
                    //         subWorkStationData.selectedAreaXAxis += gap.pillarWidth;
                    //     }
                    // });
                    subWorkStationData.pillarPosition.forEach((pillar) => {
                        if ((subWorkStationData.selectedAreaXAxis > (pillar.startingXPosition - 1)) &&
                            (subWorkStationData.selectedAreaXAxis < (pillar.startingXPosition + 1)) &&
                            (subWorkStationData.selectedAreaYAxis > (pillar.startingYPosition - 1)) &&
                            (subWorkStationData.selectedAreaYAxis < (pillar.startingYPosition + 1))
                        ) {
                            console.log('pillar Dectected');
                            doc.polygon(
                                [subWorkStationData.selectedAreaXAxis, subWorkStationData.selectedAreaYAxis],
                                [subWorkStationData.selectedAreaXAxis + pillar.pillarWidth, subWorkStationData.selectedAreaYAxis],
                                [subWorkStationData.selectedAreaXAxis + pillar.pillarWidth, subWorkStationData.selectedAreaYAxis + pillar.pillarHeight],
                                [subWorkStationData.selectedAreaXAxis, subWorkStationData.selectedAreaYAxis + pillar.pillarHeight]
                            ).fillOpacity(0.4).fill("green");
                            subWorkStationData.selectedAreaYAxis += pillar.pillarHeight;
                        }
                    })
                    doc.polygon(
                        [subWorkStationData.selectedAreaXAxis, subWorkStationData.selectedAreaYAxis],
                        [subWorkStationData.selectedAreaXAxis + subWorkStationData.sizeOfSeat.width, subWorkStationData.selectedAreaYAxis],
                        [subWorkStationData.selectedAreaXAxis + subWorkStationData.sizeOfSeat.width, subWorkStationData.selectedAreaYAxis + subWorkStationData.sizeOfSeat.height],
                        [subWorkStationData.selectedAreaXAxis, subWorkStationData.selectedAreaYAxis + subWorkStationData.sizeOfSeat.height]
                    ).fillOpacity(0.4).lineWidth(0.2).stroke('red');
                    subWorkStationData.selectedAreaYAxis += subWorkStationData.sizeOfSeat.height;
                    // if ((subWorkStation.selectedAreaYAxis > (subWorkStation.lastYAxis - 1)) && (subWorkStation.selectedAreaYAxis < (subWorkStation.lastYAxis + 1))) {
                    //     subrowComplete = true;
                    // }
                    console.log('J::', j);
                    console.log('Avalible NO Of seats::', subWorkStationData.AvailableNoOfSeats);
                    if ((i === requiredNoOfSeats) || (j === subWorkStationData.AvailableNoOfSeats)) {
                        rowComplete = true;
                        break;
                    }
                    i++;
                }
                subWorkStationStarted = false
            }
            
        }
        
        // console.log(workStationData.partition);
        // console.log(subWorkStationData.selectedAreaXAxis)
        // console.log(subWorkStationData.selectedAreaYAxis)
        console.log(workStationData.selectedAreaXAxis);
        console.log(workStationData.selectedAreaYAxis)
        console.log(workStationData.selectedAreaYAxis -workStationData.sizeOfSeat.height)
        doc.circle(78, 176.7, 1).fill('red');
    }
    else {
        doc.fontSize(56).text("Space Not Available", 330, 253);
        console.log('Space Not Available');
    }
    doc.end();
}
generateLayout(356);