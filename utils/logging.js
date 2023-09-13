/*
*  Konpeki Discord Bot - Utility Definition File
*  logging.js - A custom logging script to apply information to output
*
*  Though console.error() and console.warn() exist, they don't exactly fit what is wanted here.
*/

// Enum list of severity levels
const logLevels = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
};

// Enum list of text colors
const textColor = {
    White: '\x1b[97m',
    Gray: '\x1b[37m',
    Yellow: '\x1b[33m',
    Red: '\x1b[91m',
    Blue: '\x1b[96m',
    Green: '\x1b[92m',
    Reset: '\x1b[0m',
};

// Get the current Date and Time
const date_time = new Date(new Date().toUTCString());
const datetime = '[' + ('0' + (date_time.getMonth() + 1)).slice(-2) + '/' + ('0' + date_time.getDate()).slice(-2) + '/' + date_time.getFullYear() + ' ' + ('0' + (date_time.getHours() + 1)).slice(-2) + ':' + ('0' + (date_time.getMinutes() + 1)).slice(-2) + ':' + ('0' + (date_time.getSeconds() + 1)).slice(-2) + ' UTC]';

// Add color to the text passed through - If a text manip util is made, move this there
const colorText = function(message, color) {
    return color + message + textColor.Reset;
};

// Print log message to console based on severity level
const log = function(logLevel, message) {
    // Used in the event the message is an error: see case 3
    const lines = message.toString().split('\n');

    switch (logLevel) {
        case 0:
            console.log(datetime + ' ' + colorText('[DEBUG]', textColor.Gray) + ' ' + message);
            break;
        case 1:
            console.log(datetime + ' ' + colorText('[INFO]', textColor.White) + ' ' + message);
            break;
        case 2:
            console.log(datetime + ' ' + colorText('[WARN]', textColor.Yellow) + ' ' + message);
            break;
        case 3:
            // Errors tend to have multiple lines, handle them specially to include the first two.
            console.log(datetime + ' ' + colorText('[ERROR]', textColor.Red) + ' ' + lines[0]);

            // If the error only has 1 line, don't try to read a second one
            if (lines[1] != null) {
                console.log(datetime + ' ' + colorText('[ERROR]', textColor.Red) + ' |   ' + lines[1].trim());
            }

            break;
        default:
            console.log(datetime + ' ' + colorText('[INFO]', textColor.White) + ' ' + message);
            break;
    }
};

module.exports = {
    logLevels,
    textColor,
    colorText,
    log,
};