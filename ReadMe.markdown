# InfinityMint Javascript Starterkit by 0x0zAgency

## 🗿 Requirements

-   Mac OSX (any version), Windows (XP, Vista, 7, 8, 10, 11), Debian (5+), Ubuntu (14+)
-   Node **16.0.0** or Higher
-   (Optional) Nix

## 🗿 Boilerplates & Starterkits

Don't feel like starting from scratch? Check out our boilerplates and starterkits and get building with InfinityMint straight away!

[Javascript Boilerplate](https://github.com/0x0zAgency/infinitymint-javascript-boilerplate)

[Typescript Boilerplate](https://github.com/0x0zAgency/infinitymint-typescript-boilerplate)

[React Starterkit (Typescript)](https://github.com/0x0zAgency/infinitymint-react-typescript-starterkit)

[NextJS Starterkit](https://github.com/0x0zAgency/infinitymint-nextjs-starterkit)

## 🗿 Installation

`npm i infinitymint`

InfinityMint also provides a working [_Nix_](https://nixos.org) setup out of the box for development.
This is to prevent conflicts in environment between the end developer & shipping to production.

Access to the environment is provided via a _Nix Flake._ To enter;
`nix develop`

InfinityMint works with both Javascript and Typescript and can be used in both the browser and in node.

## 🗿 Setup

You will need to create a new file in the current working directory (the one with your package.json) or the node project called `hardhat.config.js` or `hardhat.config.ts`, depending on if you are using InfinityMint in a TypeScript or Javascript environment.

Please either download the configuration file and place it in your node projects root or copy the following contents into your hardhat configuration file. If you are bringing InfinityMint into an already established hardhat project. Then simply backup the contents of your current hardhat configuration file as you will be able to place it into InfinityMint's configuration file instead.

[Link to hardhat.config.ts (for ts)](https://github.com/0x0zAgency/infinitymint-beta/blob/master/examples/hardhat.config.ts)

[Link to hardhat.config.js (for js)](https://github.com/0x0zAgency/infinitymint-beta/blob/master/examples/js/hardhat.config.js)

InfinityMint will automatically create a `infinitymint.config.ts` or `infinitymint.config.js` depending on the environment. This new project file which is created is where you configure both hardhat and InfinityMint and other things which can be installed into InfinityMint.

Please view our official documentation and [examples](https://docs.infinitymint.app/modules/examples_examples.html) for more information.

### 🚨 **READ HERE IN CASE OF ERRORS**

-   `Error: error:0308010C:digital envelope routines::unsupported`

This is a **known** issue with some node versions < 16.
The workaround is to simply pass the `--openssl-legacy-provider` flag into your `npm run start`.

## 🗿 Usage

InfinityMint can work via npx and any of the InfinityMint scripts (including gems) can be executed through the terminal. Simply run `npx infinitymint` to see a list of available commands.

You can do every action inside of InfinityMint through the npx command module.

`npx infinitymint compile --project "maskmode"`

`npx infinitymint deploy --project "maskmode" --network "ganache"`

### 🗿 Usage (if you are working on this repository)

To run commands inside of this repository all you need to do is run the following command in replacement to npx infinitymint.

`ts-node run.ts`

## 🗿 Documentation

[Official Documentation](https://docs.infinitymint.app)</br>
[TypeDoc Documentation](https://typedoc.org/)
