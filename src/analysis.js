let headers;
let dataByContent = createObj();
dataByContent = smooth();
writeObj();

function createObj() {
	const fs = require('fs');
	let contents = fs.readFileSync('./data.csv').toString().split('\n');
	if (0 == contents[contents.length - 1].length) contents.pop();
	headers = contents[0].split(','); // get the indeces of the first content and split it by ,
	headers = headers.map((header) => {
		return header.trim();
	});

	let data = contents.slice(1); // take out the first row
	let average; // this variable keeps track of the average of all values
	data = data.map((row) => {
		row = row.split(',');

		let output = {};

		for (let i = 0; i < headers.length; ++i) {
			output[headers[i]] = row[i].trim();
			//.trim();
		}
		return output;
	});

	let dataByContent = {};
	data.map((row) => {
		if (!dataByContent.hasOwnProperty(row.content)) {
			dataByContent[row.content] = [];
		}
		dataByContent[row.content].push(row);
	});

	return dataByContent;
}

function smooth() {
	for (let content in dataByContent) {
		// the amount of subsections

		smooth = Math.round(1 + Math.round(dataByContent[content].length / 15));

		if (smooth > 30) {
			smooth = 30;
		}
		var listOfQue = new Array();
		listOfQue = [ [], [], [], [], [] ];

		// var BetaQueue=new Array();
		// var ThetaQueue=new Array();
		// var GammaQueue=new Array();

		// console.log(Q);
		// Q.unshift("b");
		for (let count = 0; count < dataByContent[content].length; ++count) {
			//the amount places in that content

			for (let countQue = 3; countQue < headers.length; countQue++) {
				listOfQue[countQue - 3].unshift(dataByContent[content][count][headers[countQue]]);
			}

			if (count < smooth) {
				if (count != 0) {
					for (let countHeaders = 0; countHeaders < headers.length; countHeaders++) {
						if (headers[countHeaders] == 'content') {
						} else if (headers[countHeaders] == 'offset' || headers[countHeaders] == 'samples') {
              
							dataByContent[content][count][headers[countHeaders]] = parseInt(
								dataByContent[content][count][headers[countHeaders]]
							);
						} else {
							dataByContent[content][count][headers[countHeaders]] =
								(parseFloat(dataByContent[content][count - 1][headers[countHeaders]]) * count +
									parseFloat(dataByContent[content][count][headers[countHeaders]])) /
								(count + 1);
						}
					}
				} else {
					for (let countHeaders = 0; countHeaders < headers.length; countHeaders++) {
						if (headers[countHeaders] == 'content') {
						} else if (headers[countHeaders] == 'offset' || headers[countHeaders] == 'samples') {
							dataByContent[content][count][headers[countHeaders]] = parseInt(
								dataByContent[content][count][headers[countHeaders]]
							);
						} else {
							dataByContent[content][count][headers[countHeaders]] = parseFloat(
								dataByContent[content][count][headers[countHeaders]]
							);
						}
					}
				}
			} else {
				var old = new Array();
				old = [ [], [], [], [], [] ];
				for (let countQue = 3; countQue < headers.length; countQue++) {
					old[countQue - 3] = listOfQue[countQue - 3].pop();
				}
				// let oldBeta=BetaQueue.pop();
				// let oldGamma=GammaQueue.pop();
				// let oldTheta=ThetaQueue.pop();

				for (let countQue = 0; countQue < headers.length; countQue++) {
					if (headers[countQue] == 'content') {
					} else if (headers[countQue] == 'offset' || headers[countQue] == 'samples') {
						dataByContent[content][count][headers[countQue]] = parseInt(
							dataByContent[content][count][headers[countQue]]
						);
					} else {
						dataByContent[content][count][headers[countQue]] =
							(parseFloat(dataByContent[content][count - 1][headers[countQue]]) * smooth -
								parseFloat(old[countQue - 3]) +
								parseFloat(dataByContent[content][count][headers[countQue]])) /
							parseFloat(smooth);
					}
				}

				// let oldBeta=BetaQueue.pop();
				// let oldGamma=GammaQueue.pop();
				// let oldTheta=ThetaQueue.pop();

				// dataByContent[content][count].beta=(parseFloat(dataByContent[content][count-1].beta)*smooth-parseFloat(oldBeta)+parseFloat(dataByContent[content][count].beta))/parseFloat(smooth);
				// dataByContent[content][count].theta=(parseFloat(dataByContent[content][count-1].theta)*smooth-parseFloat(oldTheta)+parseFloat(dataByContent[content][count].theta))/parseFloat(smooth);
				// dataByContent[content][count].gamma=(parseFloat(dataByContent[content][count-1].gamma)*smooth-parseFloat(oldGamma)+parseFloat(dataByContent[content][count].gamma))/parseFloat(smooth);
			}
		}
	}
	return dataByContent;
}

function writeObj() {
	const fs = require('fs');
	fs.writeFileSync('./old.csv', headers.join(',') + '\n'); //create
	for (let content in dataByContent) {
		//used in because it is an array
		let rows = [];
		for (let row of dataByContent[content]) {
			//used of because it is an object
			let list = [];
			for (let header of headers) {
				list.push(row[header]);
			}
			//fs.appendFileSync("./allfinal.csv",list.join(","));
			rows.push(list.join(','));
		}
		fs.appendFileSync('./old.csv', rows.join('\n') + '\n');
	}
}
