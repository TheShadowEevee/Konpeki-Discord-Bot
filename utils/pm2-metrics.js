/*
*  Konpeki Discord Bot - Utility Definition File
*  pm2-metrics.js - A place to keep all pm2 metrics and error definitions
*/

const io = require('@pm2/io');

const interactionErrors = io.counter({
	name: 'Interaction Errors (Since last restart)',
});

const interactionSuccessCounter = io.counter({
	name: 'Interaction Successful Runs (Since last restart)',
});

const interactionSuccessMeter = io.meter({
	name: 'Successful Interactions per Second',
});

const websocketHeartbeatHist = io.histogram({
	name: 'Websocket Heartbeat (ms)',
	measurement: 'mean',
});

const interactionSuccess = function() {
	interactionSuccessCounter.inc();
	interactionSuccessMeter.mark();
};

module.exports = {
	io,
	interactionErrors,
	interactionSuccess,
	websocketHeartbeatHist,
};