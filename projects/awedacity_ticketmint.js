// Created Wed Dec 14 2022 17:33:54 GMT-0600 (Central Standard Time)
const project = {
    description: {
        name: 'AWEdacity Confrenece Tickets',
        token: 'AWEdacity🎫Ticket',
        tokenPlural: 'AWEdacity🎫Tickets',
        tokenSymbol: '🎫',
        authors: [
            {
                name: 'Awedacity Confrence',
                ens: 'awedacityconference.eth',
                twitter: 'nathania_ml',
                avatar: 'https://pbs.twimg.com/profile_images/1615766585171394574/UEQZOFBa_400x400.jpg',
            },
            {
                name: '🎫Mint.eth > Metaticket.eth',
                ens: '0x0z.eth',
                twitter: '0x0zAgency',
                avatar: 'https://pbs.twimg.com/profile_images/1587901306039148544/Igqsaicc_400x400.jpg',
            },
            {
                name: 'llydia.eth',
                link: 'https://twitter.com/lydsmas',
                avatar: 'https://pbs.twimg.com/profile_images/1617141865672835074/f4RN4jnT_400x400.jpg',
            },
            {
                name: '0xWizardOf0z',
                link: 'https://twitter.com/0xWizardOf0z',
                avatar: 'https://pbs.twimg.com/profile_images/1600937709823991808/qLpmre9L_400x400.png',
            },
            {
                name: 'Koma',
                link: 'https://twitter.com/komakae_',
                avatar: 'https://pbs.twimg.com/profile_images/1615512522223755265/mSJsgL8-_400x400.jpg',
            },
        ],
    },
    static: {
        background: '',
        headerBackground: 'awedacity/awedacity-header.png',
        defaultImage: '@Images/sad_panda.jpg',
        backgroundColour: '#f9029c',
        stylesheets: [
            'styles/bootstrap.quartz.css',
            'styles/darkTypography.css',
        ],
        images: {
            features: '@Images/default_features.jpg',
            loading: '@Images/loading.gif',
            texture: '@Images/texture.jpg',
            teamDefaultIcon: '@Images/person.png',
            noWeb3: '@Images/missingWeb3.png',
            loadingComponent: '@Images/loading.gif',
        },
    },
    deployment: {
        colourChunkSize: 9999,
        seedNumber: 256,
        startingPrice: 25,
        stickerSplit: 20,
        baseTokenValue: 1_000_000_000_000_000_000,
        randomessFactor: 420,
        nameCount: 4,
        mustGenerateName: true,
        previewCount: 3,
        maxSupply: 420,
        extraColours: 3,
        maxRandomNumber: 512,
        incrementalMode: false,
        stopDuplicateMint: false,
        matchedMode: false,
        lowestRarity: false,
        highestRarity: false,
        randomRarity: true,
    },
    paths: {
        default: {
            fileName: null,
            name: 'Unknown',
            padding: '2.5%',
            rarity: 15,
            innerPadding: '5%',
        },
        indexes: [
            {
                fileName: 'ticketmint/metaticket.svg',
                name: 'Token',
                viewbox: '0 0 1280 1280',
                hideStroke: true,
                rarity: 100,
                translate: {
                    x: '5%',
                    y: '10%',
                },
                content: {
                    // Proof of Moment contents
                    momentName: 'Event',
                    hero: null,
                    heroPFP: null,
                    heroAvatar: null,
                    heroImage: null,
                    heroAnimation: null,
                    heroVideo: null,

                    audio_auralTone: null,
                    audio_podcasts: null,
                    audio_musics: null,
                    audio_clips: null,

                    playbill: null,
                    roster: null,
                    credits: null,
                    eventData: null,
                    socialTimeCapsule: null,
                    eventQuestsAndAchievements: null,
                    // EGPS Data
                    eGPS_locationData: null,
                    eGPS_eventMap: null,
                    eGPS_eventKey: null,
                },
            },
        ],
    },
    names: [],
    assets: {},
    assetConfig: {},
    modules: {
        controller: 'RaritySVG',
        minter: 'DefaultMinter',
        random: 'UnsafeRandom',
        royalty: 'DefaultRoyalty',
        tokenPaths: 'TokenPaths',
    },
    mods: {
        marketplace: true,
        redemption: true,
        awedacity: true,
    },
    approved: [
        '0xDFF917ab602e8508b6907dE1b038dd52B24A2379',
        '0x171E978E0F049a7fBc48ce77F4A8BB3569852Ab6',
    ], // List of approved addresses that can free mint / implicit mint
};
// Do not delete this line
module.exports = project;
