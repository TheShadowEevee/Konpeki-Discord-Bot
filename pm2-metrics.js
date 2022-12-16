const io = require('@pm2/io');

const interactionErrors = io.counter({
	name: 'Interaction Errors (Since last restart)',
	id: 'app/interactions/errors',
});

const interactionSuccessCounter = io.counter({
	name: 'Interaction Successful Runs (Since last restart)',
	id: 'app/interactions/success',
});

const interactionSuccessMeter = io.meter({
	name: 'Successful Interactions per Second',
	id: 'app/interactions/success',
});

const interactionSuccess = function() {
	interactionSuccessCounter.inc();
	interactionSuccessMeter.mark();
};

module.exports = {
	io,
	interactionErrors,
	interactionSuccess,
};