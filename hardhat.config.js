require('module-alias/register');
const {
	debugLog,
	loadInfinityMint,
	prepareConfig,
	readSession,
	saveSession,
} = require('infinitymint/dist/app/helpers');
const {createDefaultFactory} = require('infinitymint/dist/app/pipes');

// Set as javascript session
const session = readSession();
session.environment.javascript = true;
saveSession(session);

createDefaultFactory();
// Require dotenv
require('dotenv').config({
	override: false, // Will not override already established environment variables
});

// Import our hardhat plugins
require('@nomicfoundation/hardhat-toolbox');
require('@nomiclabs/hardhat-ethers');
require('hardhat-change-network'); // Allows hre.changeNetwork to occur

// load infinitymint
loadInfinityMint(true);

// Return the infinitymint config file
const config = prepareConfig();

debugLog('loaded hardhat.config.js');
module.exports = config.hardhat; // Export the infinity mint configuration file
