import React, { Component } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Alert,
    ListGroup,
} from 'react-bootstrap';
import storageController from 'infinitymint-client/dist/src/classic/storageController.js';
import controller from 'infinitymint-client/dist/src/classic/controller.js';
import NavigationLink from '../Components/NavigationLink.js';
import Config from '../config.js';
import Token from '../Components/Token.js';
import {
    loadToken,
    loadStickers,
    hasDestination,
    connectWallet,
} from '../helpers.js';
import Resources from 'infinitymint-client/dist/src/classic/resources.js';
import TokenURIModal from '../Modals/TokenURIModal.js';
import Loading from '../Components/Loading.js';
import PageController from 'infinitymint-client/dist/src/classic/pageController.js';
import ModController from 'infinitymint-client/dist/src/classic/modController.js';

let _errorTimeout;
class ViewToken extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tokenId: this?.props?.match?.params?.tokenId || 0,
            tokenData: {},
            token: {
                pathSize: 13,
                colours: [],
            },
            stickers: [],
            hasStickers: false,
            tags: {},
            loading: true,
            modChildren: [],
            hasStickerContract: false,
            loadingInterval: null,
            loadingReason: 'Preparing Loading Reasons...',
            loadingReasons: [...Config.loadReasons],
            isValid: false,
            flags: {},
            error: undefined,
            errorTimeout: 30,
            showTokenURIModal: false,
        };
    }

    cleanupError(seconds = 5) {
        clearTimeout(_errorTimeout);
        return new Promise((_resolve, _reject) => {
            _errorTimeout = setTimeout(() => {
                this.setState({
                    error: undefined,
                });
            }, seconds * 1000);
        });
    }

    setError(error) {
        this.setState({
            error: error.message || error.error || error,
        });
        this.cleanupError(5);
    }

    async componentWillUnmount() {
        clearInterval(this.state.loadingInterval);
    }

    async componentDidMount() {
        const interval = setInterval(() => {
            if (!this.state.loading) {
                clearInterval(this.state.loadingInterval);
            }

            this.setState({
                loadingReason:
                    this.state.loadingReasons[
                        Math.floor(
                            Math.random() * this.state.loadingReasons.length
                        )
                    ],
            });
        }, 500);
        this.setState({
            loadingInterval: interval,
        });

        await this.loadToken();
        this.setState({
            loading: false,
        });

        // {this.state.ens}
        const children = await ModController.callModMethod(
            'getViewTokenSidebarChildren',
            { token: this.state.token }
        );
        this.setState({
            modChildren: Object.values(children),
        });
    }

    async loadToken() {
        try {
            // Load the token and return the flags
            const flags = await loadToken(this, true, true);

            if (this.state.isValid) {
                await loadStickers(this);

                if (this.state.token.owner === controller.accounts[0]) {
                    this.setState({
                        flags,
                    });
                    if (
                        (flags?.emptyTokenURI === true ||
                            flags?.tokenURI === false) &&
                        flags?.dontNotify !== true
                    ) {
                        setTimeout(() => {
                            this.setState({
                                showTokenURIModal: true,
                            });
                        }, 1000);
                    }

                    // Load the stickers
                }
            }
        } catch (error) {
            controller.log('[😞] Error', 'error');
            controller.log(error);
            this.setState({
                isValid: false,
            });
        }
    }

    // TODO: Turn into something more useful
    getBadge() {
        let lastUpdated = Date.now();
        if (this.state?.token?.tokenId !== undefined) {
            lastUpdated =
                storageController.values.tokens[this.state?.token?.tokenId]
                    .validTill;
        }

        return (
            <span className="badge bg-dark fs-6 ms-2">
                Updates {new Date(lastUpdated).toLocaleTimeString()}
            </span>
        );
    }

    render() {
        return (
            <>
                {/** token exists */}
                {this.state.isValid && !this.state.loading ? (
                    <Container className="mb-5">
                        {this.state.error !== undefined &&
                        this.state.error !== null ? (
                            <Row className="mt-2">
                                <Col>
                                    <Alert
                                        variant="danger"
                                        className="text-center"
                                    >
                                        <p className="display-2">😨</p>
                                        {this.state.error?.message ||
                                            this.state.error}
                                    </Alert>
                                </Col>
                            </Row>
                        ) : (
                            <></>
                        )}
                        <Row className="mt-5">
                            <Col className="text-white text-center">
                                <h1 className="display-1 textGold header-text force-white">
                                    🎫 #{this.state.token.tokenId}
                                </h1>
                                <p className="fs-5 mt-2">
                                    <span className="badge bg-light">
                                        Owned by {this.state.token.owner}
                                    </span>
                                    <br />
                                    <span className="small badge bg-dark force-white">
                                        {' '}
                                        tokenId {this.state.token.tokenId}
                                    </span>
                                </p>
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col hidden={this.state.token.tokenId <= 0}>
                                <div className="d-grid">
                                    <Button
                                        size="lg"
                                        variant="light"
                                        className="mx-1"
                                        onClick={() => {
                                            window.location.href =
                                                '/view/' +
                                                (Number.parseInt(
                                                    this.state.token.tokenId
                                                ) -
                                                    1);
                                        }}
                                    >
                                        {Number.parseInt(
                                            this.state.token.tokenId
                                        ) - 1}{' '}
                                        #️⃣ {Resources.$.UI.Action.PreviousToken}
                                    </Button>
                                </div>
                            </Col>
                            <Col
                                hidden={
                                    Number.parseInt(this.state.token.tokenId) >=
                                    controller.getContractValue('totalMints') -
                                        1
                                }
                            >
                                <div className="d-grid">
                                    <Button
                                        size="lg"
                                        variant="light"
                                        className="mx-1"
                                        onClick={() => {
                                            window.location.href =
                                                '/view/' +
                                                (Number.parseInt(
                                                    this.state.token.tokenId
                                                ) +
                                                    1);
                                        }}
                                    >
                                        {' '}
                                        {
                                            Resources.$.UI.Action.NextToken
                                        } #️⃣{' '}
                                        {Number.parseInt(
                                            this.state.token.tokenId
                                        ) + 1}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                        <Row className="gy-4">
                            {/** token element is a component */}
                            {this.state.isValid ? (
                                <Token
                                    theToken={this.state.token}
                                    stickers={this.state.stickers}
                                    textCutoff={48}
                                    maxWidth={true}
                                    settings={{
                                        hideDescription: true,
                                        useFresh: true,
                                        onlyBorder: true,
                                        showEditButton:
                                            this.state.token.owner ===
                                            controller.accounts[0],
                                        enableThreeJS: false,
                                        downsampleRate3D: 1.6,
                                        selectable3D: true,
                                        disableFloor3D: true,
                                        // ForceBackground: ModelBackground,
                                        showHelpers3D: false,
                                        lightIntensity3D: 100,
                                        lightColour3D: 0xff_ff_ff,
                                        ambientLightIntensity3D: 50,
                                        ambientLightColour3D: 0xff_ff_ff,
                                        rotationSpeed3D: 0.001,
                                    }}
                                />
                            ) : (
                                <></>
                            )}
                            <Col lg={4}>
                                <Card
                                    body
                                    className="bg-success"
                                    hidden={
                                        this.state.token.owner !==
                                        controller.accounts[0]
                                    }
                                >
                                    <p
                                        className="fs-2 mt-2 force-white"
                                        style={{ fontWeight: 'bolder' }}
                                    >
                                        {Resources.$.UI.Misc.YourToken}
                                    </p>
                                </Card>
                                <Card body>
                                    <div className="d-grid gap-2">
                                        <Button
                                            variant="light"
                                            size="lg"
                                            onClick={async () => {
                                                try {
                                                    delete storageController
                                                        .values.tokens[
                                                        this.state.tokenId
                                                    ];
                                                    storageController.saveData();

                                                    this.setState({
                                                        token: {
                                                            pathSize: 0,
                                                            colours: [],
                                                            stickers: [],
                                                        },
                                                        loading: true,
                                                        isValid: false,
                                                    });

                                                    await this.componentDidMount();
                                                } catch (error) {
                                                    this.setError(error);
                                                }
                                            }}
                                        >
                                            {Resources.$.UI.Action.Refresh}
                                        </Button>
                                        <NavigationLink
                                            location={
                                                '/edit/' + this.state.tokenId
                                            }
                                            variant="light"
                                            hidden={
                                                this.state.token.owner !==
                                                controller.accounts[0]
                                            }
                                            text={
                                                Resources.$.UI.Action.EditToken
                                            }
                                        />
                                        <Card
                                            body
                                            className="mb-2 bg-light shadow"
                                            hidden={
                                                !this.state.hasStickerContract
                                            }
                                        >
                                            <div className="d-grid">
                                                <Alert
                                                    className="text-center text-black"
                                                    variant="warning"
                                                >
                                                    <p className="text-center text-black display-5">
                                                        🥳 EADS
                                                    </p>
                                                    <strong className="text-black">
                                                        This token has Ethereum
                                                        Ad Service Sticker
                                                        support!
                                                    </strong>
                                                </Alert>
                                                <NavigationLink
                                                    location={
                                                        '/advertise/' +
                                                        this.state.tokenId
                                                    }
                                                    size="md"
                                                    variant="danger"
                                                    disabled={
                                                        !this.state
                                                            .hasStickerContract ||
                                                        !controller.isWalletValid
                                                    }
                                                    text={
                                                        Resources.$.UI.Action
                                                            .PlaceSticker
                                                    }
                                                />
                                                {this.state.token.owner ===
                                                    controller.accounts[0] &&
                                                hasDestination(
                                                    this.state.token,
                                                    1
                                                ) ? (
                                                    <NavigationLink
                                                        className="mt-2"
                                                        location={
                                                            '/edit/' +
                                                            this.state.tokenId +
                                                            '/stickers'
                                                        }
                                                        disabled={
                                                            !this.state
                                                                .hasStickerContract
                                                        }
                                                        variant="warning"
                                                        text={
                                                            Resources.$.UI
                                                                .Action
                                                                .StickerControlCenter
                                                        }
                                                    />
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </Card>
                                        {this.state.modChildren.map((child) => (
                                            <>{child}</>
                                        ))}
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <hr />
                        <Row className="pb-2 gy-4">
                            {/** 
                            <Col lg={6} className="gap-2 px-4">
                                <p className="display-2 header-text textGold">
                                    Stickers
                                </p>

                                <Card body className="mt-2">
                                    {this.state.hasStickers ? (
                                        <ListGroup>
                                            {this.state.stickers.map(
                                                (value, index) => (
                                                    <ListGroup.Item key={index}>
                                                        {tryDecodeURI(
                                                            value.sticker.name
                                                        )}{' '}
                                                        <span className="badge bg-dark">
                                                            {
                                                                value.sticker
                                                                    .owner
                                                            }
                                                        </span>
                                                    </ListGroup.Item>
                                                )
                                            )}
                                        </ListGroup>
                                    ) : (
                                        <>
                                            {hasDestination(
                                                this.state.token,
                                                0
                                            ) ? (
                                                <Alert
                                                    variant="danger"
                                                    className="text-center text-white"
                                                >
                                                    <p className="fs-3">
                                                        No Stickers
                                                    </p>
                                                    <p className="fs-6">
                                                        Maybe you could change
                                                        this for this{' '}
                                                        {Resources.projectToken()}{' '}
                                                        owner? Why not add a
                                                        sticker to it. Come on,
                                                        show your love!
                                                    </p>
                                                </Alert>
                                            ) : (
                                                <Alert
                                                    variant="warning"
                                                    className="text-center text-white"
                                                >
                                                    <p className="fs-3 text-white">
                                                        No Sticker Contract
                                                    </p>
                                                    {this.state.token.owner !==
                                                    Controller.accounts[0] ? (
                                                        <p className="fs-6">
                                                            This token holder
                                                            has yet to asign an
                                                            Ethereum Ad Service
                                                            sticker contract to
                                                            to their token,
                                                            maybe you should
                                                            magic ping them!
                                                        </p>
                                                    ) : (
                                                        <p>
                                                            You can head to the
                                                            launchpad to set up
                                                            the needed bits in
                                                            order to get your
                                                            stickers online!
                                                        </p>
                                                    )}
                                                </Alert>
                                            )}
                                        </>
                                    )}
                                    {this.state.token.owner !==
                                        Controller.accounts[0] &&
                                    hasDestination(this.state.token, 1) ? (
                                        <>
                                            <div className="d-grid mt-2">
                                                <NavigationLink
                                                    location={`/advertise/${this.state.token?.tokenId}`}
                                                    disabled={
                                                        !this.state
                                                            .hasStickerContract ||
                                                        !Controller.isWalletValid
                                                    }
                                                    text={
                                                        Resources.$.UI.Action
                                                            .PlaceSticker
                                                    }
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {this.state.token.owner ===
                                                Controller.accounts[0] &&
                                            hasDestination(
                                                this.state.token,
                                                1
                                            ) ? (
                                                <div className="d-grid mt-2">
                                                    <NavigationLink
                                                        location={`/edit/${this.state.token?.tokenId}/deploy`}
                                                        variant="warning"
                                                        text={
                                                            '🚀 Launchpad' // TODO: Replace with line in resources file
                                                        }
                                                    />
                                                </div> ? (
                                                    hasDestination(
                                                        this.state.token,
                                                        1
                                                    )
                                                ) : (
                                                    <div className="d-grid mt-2">
                                                        <NavigationLink
                                                            location={`/advertise/${this.state.token?.tokenId}`}
                                                            disabled={
                                                                !this.state
                                                                    .hasStickerContract ||
                                                                !Controller.isWalletValid
                                                            }
                                                            text={
                                                                Resources.$.UI
                                                                    .Action
                                                                    .PlaceStickers
                                                            }
                                                        />
                                                    </div>
                                                )
                                            ) : (
                                                <div className="d-grid mt-2">
                                                    <NavigationLink
                                                        disabled={true}
                                                        location={`/advertise/${this.state.token?.tokenId}`}
                                                        text={
                                                            Resources.$.UI
                                                                .Action
                                                                .PlaceStickers
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </Card>
                            </Col>
                             */}
                            <Col lg={12} className="px-4">
                                <p className="display-2 header-text textGold">
                                    Marketplaces
                                </p>

                                <Card body className="mt-2">
                                    <ListGroup>
                                        <ListGroup.Item className="bg-light text-white fs-5">
                                            <a
                                                className="text-info"
                                                href={controller.getCollectionURL(
                                                    this.state.token?.tokenId ||
                                                        0
                                                )}
                                            >
                                                OpenSea
                                            </a>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                        <hr />
                        <Row className="mt-4">
                            <Col>
                                <div className="d-grid gap-2">
                                    <NavigationLink
                                        location={'/mytokens'}
                                        variant="dark"
                                        size="lg"
                                        text={Resources.$.UI.Action.MyTokens}
                                    />
                                </div>
                            </Col>
                        </Row>
                        {/** token doesn't exist */}
                        <TokenURIModal
                            show={this.state.showTokenURIModal}
                            theToken={this.state.token}
                            stickers={this.state.stickers}
                            onHide={() => {
                                this.setState({
                                    showTokenURIModal: false,
                                });
                            }}
                        />
                        <br />
                        <br />
                        <br />
                    </Container>
                ) : (
                    <Container>
                        {this.state.loading ? (
                            <Loading />
                        ) : (
                            <Row className="mt-4">
                                <Col className="text-center text-white">
                                    {!controller.isWalletValid ? (
                                        <div className="d-grid mt-2 gap-2 text-center">
                                            <Alert variant="danger">
                                                <h3>
                                                    Sorry to put a stop to your
                                                    travels....
                                                </h3>
                                                You need to connect your web3
                                                wallet in order to view a{' '}
                                                {Resources.projectToken().toLowerCase()}
                                            </Alert>
                                            <Button
                                                onClick={() => {
                                                    window.open(
                                                        controller.getCollectionURL(
                                                            this.state.tokenId
                                                        )
                                                    );
                                                }}
                                                variant="success"
                                            >
                                                View Token On Opensea
                                            </Button>
                                            <Button
                                                variant="dark"
                                                className="ms-2"
                                                onClick={async () => {
                                                    await connectWallet();
                                                }}
                                            >
                                                Connect Wallet
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="display-2 zombieTextRed  text-white">
                                                Cant Find That Token...
                                            </p>
                                            <p className="fs-5 bg-danger text-white pb-2 pt-2">
                                                It might be loading or this{' '}
                                                {Resources.projectToken()} might
                                                not exists....
                                            </p>
                                            <img
                                                alt="#"
                                                src={Config.getImage(
                                                    'defaultImage'
                                                )}
                                            />
                                            <div className="d-grid mt-2 gap-2">
                                                <Button
                                                    variant="light"
                                                    size="lg"
                                                    onClick={async () => {
                                                        try {
                                                            delete storageController
                                                                .values.tokens[
                                                                this.state
                                                                    .tokenId
                                                            ];
                                                            storageController.saveData();

                                                            this.setState({
                                                                token: {
                                                                    pathSize: 0,
                                                                    colours: [],
                                                                    stickers:
                                                                        [],
                                                                },
                                                                error: null,
                                                                loading: true,
                                                                isValid: false,
                                                            });

                                                            await this.componentDidMount();
                                                        } catch (error) {
                                                            this.setError(
                                                                error
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {
                                                        Resources.$.UI.Action
                                                            .Refresh
                                                    }
                                                </Button>
                                                <NavigationLink
                                                    location="/mint"
                                                    text={
                                                        Resources.$.UI.Action
                                                            .MintToken
                                                    }
                                                />
                                                <NavigationLink
                                                    location="/"
                                                    text={'🍓 Home'}
                                                />
                                                <NavigationLink
                                                    location={'/mytokens'}
                                                    text={
                                                        Resources.$.UI.Action
                                                            .MyTokens
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}
                                </Col>
                            </Row>
                        )}
                    </Container>
                )}
            </>
        );
    }
}

ViewToken.url = '/view/:tokenId';
ViewToken.id = 'ViewToken';
ViewToken.settings = {};

PageController.registerPage(ViewToken);
export default ViewToken;
