export default class ZoneHandler {
    constructor(scene) {

        this.renderZone = (x, y, width, height) => {
            let dropZone = scene.add.zone(x, y, width, height).setRectangleDropZone(width, height);
            dropZone.setData({
                "cards": 0
            });
            // let dropZoneOutline = scene.add.graphics();
            // dropZoneOutline.lineStyle(4, 0xffd700);

            // // Calculate the top-left corner coordinates of the stroke rectangle
            // const topLeftX = dropZone.x - width / 2; // Divide by 8 to shift by half the width
            // const topLeftY = dropZone.y - height / 2; // Divide by 8 to shift by half the height
            // dropZoneOutline.strokeRect(topLeftX, topLeftY, width, height);
            return dropZone;
        }
        // this.renderOutline = (dropZone) => {
        //     let dropZoneOutline = scene.add.graphics();
        //     dropZoneOutline.lineStyle(4, 0xff69b4);
        //     dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width / 2,
        //                                 dropZone.y - dropZone.input.hitArea.height / 2,
        //                                 dropZone.input.hitArea.width,
        //                                 dropZone.input.hitArea.height)
        // }

        this.renderOutlineGrid = (x, y, width, height) => {
            const gap = 10;
            const rectWidth = width / 4;
            const rectHeight = height / 4;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 6; j++) {
                    let dropZoneOutline = scene.add.graphics();
                    dropZoneOutline.lineStyle(4, 0xff69b4);

                    // Calculate the position for each rectangle in the grid
                    const xPos = x - width / 2 + i * (rectWidth + gap);
                    const yPos = y - height / 2 + j * (rectHeight + gap);

                    // Draw the stroke rectangle at the calculated position with smaller dimensions
                    dropZoneOutline.strokeRect(xPos, yPos, rectWidth, rectHeight);
                }
            }
        }
    }
}