class DataSheet {
    constructor(dataArray, sheetName) {
        const workbook = XLSX.read(dataArray, {type: "array"});
        if (!sheetName) {
            sheetName = workbook.SheetNames[0];
        }
        this.worksheet = workbook.Sheets[sheetName];
        this.data = XLSX.utils.sheet_to_json(this.worksheet, {header: "A"});
    }

    getRows() {
        const elems = this.worksheet['!ref'].split(':')
        if (elems.length != 2) {
            return [];
        }
        const range = (start, end) => [...Array((end-start) + 1)].map((_, i) => start + i);

        const start = elems[0].replace( /\d+/g, ''); // A1 -> A
        const end = elems[1].replace( /\d+/g, '');
        if (end.length == 1) {
            return range(start.charCodeAt(0), end.charCodeAt(0)).map(i => String.fromCharCode(i));
        }
        const ret = range(start.charCodeAt(0), 'Z'.charCodeAt(0)).map(i => String.fromCharCode(i));
        const alphabets = range('A'.charCodeAt(0), 'Z'.charCodeAt(0) + 1).map(i => String.fromCharCode(i));
        for (var i = 0; i < alphabets.length; i++) {
            for (var j = 0; j < alphabets.length; j++) {
                const row = alphabets[i] + alphabets[j];
                ret.push(row);            
                if (row === end) {
                    return ret;
                }
            }
        }
        return ret;
    }

    fetchDataFunc(rowNames) {
        if (typeof rowNames == 'string') {
            return (col) => col[rowNames];
        } else if (rowNames instanceof Array) {
            return (col) => rowNames.map(row => col[row]);
        } else {
            return (col) => -1;
        }
    }

    readAsDataset(rowNames, startCol) {
        return this.data.slice(startCol).map(this.fetchDataFunc(rowNames));
    }

    loadIconImage(url) {
        // TODO: Make default icon
        const defaultIcon = new Image(48,48);
        return new Promise((resolve, reject) => {
            const icon = new Image(48,48);
            icon.onload = () => resolve(icon);
            icon.onerror = (err) => resolve(defaultIcon);
            icon.src = url;
        })
    }

    async readAsIconDataset(rowName, startCol) {
        return this.data.slice(startCol).map(async col => {
            return await this.loadIconImage(`/data/icons/${col[rowName]}.png`);
        });
    }
}
