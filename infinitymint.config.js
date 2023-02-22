// Please visit docs.infinitymint.app for a more complete starter configuration file
const {readSession} = require('infinitymint/dist/app/helpers');

const session = readSession();
const config = {
	console: true,
	ipfs: true,
	hardhat: {
		solidity: {
			version: '0.8.12',
			settings: {
				optimizer: {
					enabled: true,
					runs: 20,
				},
			},
		},
		networks: {
			ganache: {
				url: 'http://127.0.0.1:8545',
				accounts: {
					mnemonic: session.environment?.ganacheMnemonic,
				},
			},
			ethereum: {
				url: 'https://mainnet.infura.io/v3/ef00c000f793483bbf8506235ba4439b',
				accounts: {
					mnemonic:
						process.env.DEFAULT_WALLET_MNEMONIC
						|| session.environment?.ganacheMnemonic,
				},
			},
			goerli: {
				url: 'https://goerli.infura.io/v3/b893dc62f7a742198d70ba203081ae37',
				accounts: {
					mnemonic:
						process.env.DEFAULT_WALLET_MNEMONIC
						|| session.environment?.ganacheMnemonic,
				},
			},
			polygon: {
				url: 'https://polygon-rpc.com',
				accounts: {
					mnemonic:
						process.env.DEFAULT_WALLET_MNEMONIC
						|| session.environment?.ganacheMnemonic,
				},
			},
			mumbai: {
				url: 'https://matic-mumbai.chainstacklabs.com',
				accounts: {
					mnemonic:
						process.env.DEFAULT_WALLET_MNEMONIC
						|| session.environment?.ganacheMnemonic,
				},
			},
		},
		paths: {
			tests: './tests',
		},
	},
	roots: ['../infinitymint-buildtools/'],
	ganache: {
		chain: {
			chainId: 1337,
		},
		wallet: {
			totalAccounts: 20,
			defaultBalance: 69_420,
		},
	},
	settings: {
		scripts: {
			disableJavascriptRequire: ['/infinitymint-buildtools/'],
		},
		networks: {},
	},
};
module.exports = config;
