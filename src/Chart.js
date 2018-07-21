import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Brush } from 'recharts';
import ReactPlayer from 'react-player';
import _ from 'lodash';
import data from './data.json';

import './Chart.css';
class Chart extends React.Component {
	state = {
		playedSeconds: 0,
		position: 0,
		data: data,
		counter: 0,
		attentionBaseline: 0.5,
		connectionBaseline: 0.3,
		encodingBaseline: 0.4,
	};
	componentDidMount() {
		const secondDiv = document.getElementById('second-div').getBoundingClientRect();
		console.log(`${secondDiv.top}, ${secondDiv.right}, ${secondDiv.bottom}, ${secondDiv.left}`);
		this.setState({ rectangle: secondDiv });
		window.addEventListener('resize', () => {
			const newDiv = document.getElementById('second-div').getBoundingClientRect();
			console.log(`${newDiv.top}, ${newDiv.right}, ${newDiv.bottom}, ${newDiv.left}`);

			this.setState({
				rectangle: newDiv
			});
		});
		this.calculateRangeAverage(0, 30, this.state.data);
	}
	handleProgress = (state) => {
		const newPosition = Math.floor(state.playedSeconds);
		this.setState({ ...state, position: newPosition });
	};
	handleChartClick = (event) => {
		//console.log(`${event.clientX} and ${event.clientY}`)
		const newSeekSpot = this.convertUnitsToVideo(event.clientX);
		//console.log(`${newSeekSpot}`);
		this.player.seekTo(newSeekSpot);
	};
	calculateRangeAverage = (start, end, data) => {
		//slice out a new array from the existing data set
		const rangeArray = data.slice(start, end);
		let alphaAverage;
		let betaAverage;
		let gammaAverage;

		let alphaSum, betaSum, gammaSum;

		if (rangeArray.length) {
			
			alphaSum = rangeArray.reduce((a, b) => {
				// console.log(a, b["Time"])
				return a + b['a'] }, 0
			);
			//console.log({alphaSum})
			betaSum = rangeArray.reduce((a, b) => {
				// console.log(a, b["Time"])
				return a + b['a'] }, 0
			);
			gammaSum = rangeArray.reduce((a, b) => {
				// console.log(a, b["Time"])
				return a + b['a'] }, 0
			);

			alphaAverage = alphaSum/ rangeArray.length;
			gammaAverage = gammaSum/ rangeArray.length;
			betaAverage = betaSum / rangeArray.length;
			// console.log({alphaAverage, gammaAverage, betaAverage})
			console.log("hi")

		}
		this.setState({
			alphaAverage,
			betaAverage,
			gammaAverage
		});
		//console.log({alphaAverage, alphaSum, betaAverage, betaSum, gammaAverage, gammaSum})
	};
	convertUnitsToVideo = (unit) => {
		const startPosition = 280;
		const width = 900;
		const time = 30;
		return (unit - startPosition) / width * time;
	};
	handleBrushChange = (event) => {
		console.log(`Event `);
		const debounced = _.debounce(() => this.calculateRangeAverage(event['startIndex'], event['endIndex'], this.state.data), 500);
		debounced();
		
	};
	ref = (player) => {
		this.player = player;
	};

	render() {
		const { data } = this.state;

		return (
			<div className="MainDiv">
				<div className="row-layout">
					<div
						className="SecondDiv"
						id="second-div"
						onClick={(event) => {
							this.handleChartClick(event);
							//console.log(`${event.clientX} and ${event.clientY}`)
						}}
					>
						<LineChart
							width={1000}
							height={500}
							data={data}
							margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
						>
							<XAxis dataKey="time" />
							<YAxis />
							<CartesianGrid strokeDasharray="3 3" />
							<Tooltip />
							<Legend />
							<ReferenceLine x={this.state.position} stroke="red" />
							<Line type="monotone" dataKey="a" stroke="pink" activeDot={{ r: 8 }} />
							<Line type="monotone" dataKey="c" stroke="#008856" />
							<Line type="monotone" dataKey="e" stroke="blue" />
							<ReferenceLine y={this.state.attentionBaseline} stroke="red"/>
							<ReferenceLine y={this.state.connectionBaseline} stroke="blue"/>
							<ReferenceLine y={this.state.encodingBaseline} stroke="yellow dashed"/>
							<Brush onChange={(event) => this.handleBrushChange(event)}/>
						</LineChart>
					</div>
					<div>

					<ReactPlayer
						url="https://www.youtube.com/watch?v=xLNeZogTsK8"
						ref={this.ref}
						onProgress={this.handleProgress}
						progressInterval={1000}
						width="500px"
						volume={0}
						controls={true}

						
					/>
					</div>
				</div>
				<button
					max-width="500px"
					onClick={() => {
						this.player.seekTo(0);
					}}
				>
					Reset
				</button>
				<p>{`Attention ${this.state.alphaAverage}`}</p>
				<p>{`Connection ${this.state.betaAverage}`}</p>
				<p>{`Encoding ${this.state.gammaAverage}`}</p>
			</div>
		);
	}
}
export default Chart;
