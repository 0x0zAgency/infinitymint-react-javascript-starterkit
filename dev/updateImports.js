const fs = require('node:fs');
const glob = require('glob');

const scrapeDir = filePath => new Promise((resolve, reject) => {
	glob(filePath, (error, matches) => {
		if (error !== null) {
			reject(error);
		}

		resolve(matches);
	});
});

async function main() {
	console.log('\n > Updating Page Imports\n');
	let files = await scrapeDir('./src/Pages/**/*.js');
	files = Object.values(files).filter(file => !file.includes('Pages/Routeless')).map(file => {
		const name = file.replace(/^.*[\\/]/, '').split('.')[0];
		const path = file.replace('./src/', '');
		console.log('- page found ' + name + ' at ' + path);
		return {
			path,
			name,
			directory: path.replace(name + '.js', ''),
		};
	});

	const actualResult = {};
	for (const file of files) {
		actualResult[file.name] = file.path;
	}

	console.log('- savings imports tree to ./src/Resources/pages.json');
	fs.writeFileSync('./src/Resources/pages.json', JSON.stringify(files, null, 2));

	console.log('\n > Updating Mod Imports\n');
}

main().then(() => {
	process.exit(0);
}).catch(error => {
	console.error(error);
	process.exit(1);
});
