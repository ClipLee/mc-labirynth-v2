class MapDataModel {
    constructor(sx, sy) {
        this.rowCount = sy;
        this.columnCount = sx;
        this.mapData = Array.from({ length: sx }, () => Array(sy).fill(0));
    }

    generate() {
        let iterations = Math.ceil(Math.log2(Math.max(this.rowCount, this.columnCount)));
        let dim = Math.pow(2, iterations) + 1;

        let newMap = Array.from({ length: dim }, () => Array(dim).fill(0));

        for (let i = 0; i < 3; i++) {
            for (let z = 0; z < 3; z++) {
                newMap[i][z] = (i === 1 && z === 1) ? 0 : 1;
            }
        }

        let vectors = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        let edgeLen = 3;

        for (let iter = 0; iter < iterations - 1; iter++) {
            this.pasteMap(newMap, newMap, 0, 0, edgeLen, edgeLen, edgeLen - 1, 0);
            this.pasteMap(newMap, newMap, 0, 0, edgeLen, edgeLen, 0, edgeLen - 1);
            this.pasteMap(newMap, newMap, 0, 0, edgeLen, edgeLen, edgeLen - 1, edgeLen - 1);

            let skipped = Math.floor(Math.random() * 4);

            for (let i = 0; i < 4; i++) {
                if (i !== skipped) {
                    while (true) {
                        let picked_distance = Math.floor(Math.random() * (edgeLen - 2)) + 1;
                        let picked_x = edgeLen + picked_distance * vectors[i][0] - 1;
                        let picked_y = edgeLen + picked_distance * vectors[i][1] - 1;

                        let perpendicular_x = i % 2 === 0 ? 0 : 1;
                        let perpendicular_y = i % 2 !== 0 ? 0 : 1;

                        let spotleft = newMap[picked_x - perpendicular_x][picked_y - perpendicular_y];
                        let spotright = newMap[picked_x + perpendicular_x][picked_y + perpendicular_y];

                        if (newMap[picked_x][picked_y] === 0)
                            continue;

                        if (spotleft === 0 && spotright === 0) {
                            newMap[picked_x][picked_y] = 0;
                            break;
                        }
                    }
                }
            }

            edgeLen = 2 * edgeLen - 1;
        }

        this.pasteMap(newMap, this.mapData, 0, 0, this.columnCount, this.rowCount, 0, 0);

        for (let i = 0; i < this.columnCount; i++) {
            if (this.mapData[i][0] === 0 || this.mapData[i][this.rowCount - 1] === 0) {
                this.mapData[i][0] = 0;
                this.mapData[i][this.rowCount - 1] = 0;
            }
        }

        for (let i = 0; i < this.rowCount; i++) {
            if (this.mapData[0][i] === 0 || this.mapData[this.columnCount - 1][i] === 0) {
                this.mapData[0][i] = 0;
                this.mapData[this.columnCount - 1][i] = 0;
            }
        }

        while (Math.random() <= 0.85) {
            this.mapData[Math.floor(Math.random() * this.columnCount)][Math.floor(Math.random() * this.rowCount)] = 0;
        }
    }

    pasteMap(src, dest, srcx, srcy, srcx2, srcy2, dstx, dsty) {
        for (let i = srcx; i < srcx2; i++) {
            for (let z = srcy; z < srcy2; z++) {
                dest[i + dstx][z + dsty] = src[i][z];
            }
        }
    }

    getRowCount() {
        return 10;
    }

    getColumnCount() {
        return 10;
    }

    getValueAt(rowIndex, columnIndex) {
        return this.mapData[columnIndex][rowIndex];
    }
}