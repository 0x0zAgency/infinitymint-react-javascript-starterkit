import React, { Component } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Alert,
    Form,
} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Config from '../config.js';
import Transaction from '../Components/Transaction.js';
import InstantMint from '../Components/Micro/InstantMint.js';
import controller from 'infinitymint-client/dist/src/classic/controller.js';
import storageController from 'infinitymint-client/dist/src/classic/storageController.js';
import resources from 'infinitymint-client/dist/src/classic/resources.js';
import AnimatedNumber from '../Components/AnimatedNumber.js';
import { waitSetState } from '../helpers.js';

class Mint extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showOverlay: false,
            navigate: '',
            overlayTitle: 'Unknown',
            mintTransaction: {},
            element: <></>,
            previewBlocked: false,
            previewTimestamp: 0,
            previewCount: 0,
            maxTokens: false,
            mintsEnabled: false,
            overlaySubmit() {},
        };
    }

    setError(error) {
        this.setState({
            error: error[0]?.message || error.message,
        });
    }

    async previewMint() {
        storageController.values.previews = {};
        storageController.saveData();

        await controller.sendAndWaitForEvent(
            controller.accounts[0],
            'InfinityMint',
            'getPreview',
            Config.events.InfinityMint.Preview,
            {
                filter: {
                    sender: controller.accounts[0],
                },
                gasLimit: Config.gasLimit.preview, // Replace with a config somewhere
                gasPrice: Config.getGasPrice(
                    storageController.getGlobalPreference('gasSetting')
                ),
            }
        );

        // Redirect
        await waitSetState(this, {
            showOverlay: false,
            success: true,
            navigate: '/preview',
        });
    }

    async mint() {
        const result = await controller.sendAndWaitForEvent(
            controller.accounts[0],
            'InfinityMint',
            'mint',
            Config.events.InfinityMint.Mint,
            {
                filter: {
                    sender: controller.accounts[0],
                },
                gasLimit: Config.gasLimit.mint, // Replace with a config somewhere
                gasPrice: Config.getGasPrice(
                    storageController.getGlobalPreference('gasSetting')
                ),
            },
            !controller.isAdmin
                ? controller.web3.utils.toWei(
                      String(controller.getContractValue('getPrice')),
                      'ether'
                  )
                : 0
        );

        // Store this token
        const tokenId = controller.storeToken(result[1], 'event', 'mint', {
            tokenURI: true,
        });

        // Reset previews and save
        storageController.values.previews = {};
        storageController.saveData();

        // Redirect
        await waitSetState(this, {
            showOverlay: false,
            success: true,
            navigate: `/view/${tokenId}`,
        });
    }

    async componentDidMount() {
        try {
            let count = await controller.callMethod(
                controller.accounts[0],
                'InfinityMintApi',
                'getPreviewCount',
                {
                    parameters: [controller.accounts[0]],
                }
            );
            count = Number.parseInt(count.toString(), 10);
            await waitSetState(this, {
                previewCount: count,
            });
        } catch (error) {
            controller.log(error);
        }

        if (controller.isWalletValid) {
            const result = await controller.callMethod(
                controller.accounts[0],
                'InfinityMint',
                'mintsEnabled'
            );

            await waitSetState(this, {
                mintsEnabled: result,
            });
        }

        try {
            const result = await controller.callMethod(
                controller.accounts[0],
                'InfinityMintApi',
                'isPreviewBlocked',
                {
                    parameters: [controller.accounts[0]],
                }
            );

            console.log(result);

            this.setState({
                previewBlocked: result,
            });

            const timestamp = await controller.callMethod(
                controller.accounts[0],
                'InfinityMintApi',
                'getPreviewTimestamp',
                {
                    parameters: [controller.accounts[0]],
                }
            );

            this.setState({
                previewTimestamp: Number.parseInt(timestamp.toString(), 10),
            });

            // Dont do it on ganache
            if (
                Config.requiredChainId !== 1337 &&
                controller.getContractValue('balanceOf') >=
                    (controller.getProjectSettings().deployment
                        ?.maxTokensPerWallet || 256)
            ) {
                this.setState({
                    maxTokens: true,
                });
            }
        } catch (error) {
            controller.log('[😞] Error', 'error');
            controller.log(error);
        }
    }

    render() {
        if (this.state.navigate !== '') {
            return <Redirect to={this.state.navigate} />;
        }

        const count =
            controller.getContractValue('totalSupply') -
            controller.getContractValue('totalMints');

        const previewCount =
            controller.getProjectSettings()?.deployment?.previewCount || 0;

        return (
            <>
                <Container>
                    {this.state.success === true ? (
                        <Row className="mt-3">
                            <Col>
                                <Alert variant="success">
                                    <p clasName="fs-2">
                                        {resources.$.UI.Responses.Success}
                                    </p>
                                    Please give it a few minutes to update...
                                    Please do not reissue a transaction as you
                                    will get a revert.
                                </Alert>
                            </Col>
                        </Row>
                    ) : (
                        <></>
                    )}
                    <Row className="mt-5">
                        <Col className="text-center">
                            <h1 className="force-white textGold header-text">
                                {resources.$.Pages.Mint.Title}
                            </h1>
                            <p className="fs-4 force-white">
                                {resources.$.Pages.Mint.SubTitle}
                            </p>
                            <Card body className="mt-5">
                                {controller.isWalletValid ? (
                                    <></>
                                ) : (
                                    <Alert
                                        variant="danger"
                                        className="text-center bg-danger text-white"
                                    >
                                        You need to connect your wallet to the{' '}
                                        {Config.getNetwork().name} network
                                        before you can mint.
                                    </Alert>
                                )}
                                <Alert variant="light" className="text-center">
                                    {count > 0 ? (
                                        <AnimatedNumber
                                            className="fs-2"
                                            slowness={1}
                                            reach={count}
                                            delay={0}
                                        />
                                    ) : (
                                        <span className="fs-2">0</span>
                                    )}
                                </Alert>
                                <h4 className="text-uppercase mt-4">
                                    {resources.tokenPlural()} Remaining
                                </h4>
                            </Card>
                        </Col>
                    </Row>
                    {this.state.maxTokens ? (
                        <Row className="mt-2 gy-4">
                            <Col className="text-center">
                                <Alert variant="warning">
                                    <p className="display-1">😱</p>
                                    <span className="p-5 fs-3">
                                        Holy sh**! Incredible. You've hit the
                                        max tokens allowed per wallet (which is{' '}
                                        {controller.getProjectSettings()
                                            .deployment?.maxTokensPerWallet ||
                                            256}
                                        ). In order to mint more tokens. You
                                        will need to change to another wallet.
                                    </span>
                                </Alert>
                            </Col>
                        </Row>
                    ) : (
                        <></>
                    )}
                    <Row
                        className="text-center"
                        hidden={!this.state.previewBlocked}
                    >
                        <Col>
                            <Alert variant="warning">
                                You must mint one of your{' '}
                                <a href="/selectivemint">previews</a>. You can
                                mint again after{' '}
                                {new Date(
                                    this.state.previewTimestamp * 1000
                                ).toString()}
                            </Alert>
                        </Col>
                    </Row>
                    <Row
                        className="mt-4 text-center"
                        hidden={this.state.mintsEnabled}
                    >
                        <Col>
                            <Alert variant="warning">
                                The minter is currently disabled
                            </Alert>
                        </Col>
                    </Row>
                    <Row className="gy-2">
                        <Col className="text-center h-100" lg>
                            <Card body>
                                <h2 className="fs-3">
                                    {resources.$.UI.Action.SelectiveMint}{' '}
                                    <span className="badge bg-warning fs-6">
                                        {Config.getNetwork().name}
                                    </span>
                                </h2>
                                <p className="fs-6">Choose your own!</p>
                                <div className="d-flex mt-2 mb-2 gap-2">
                                    <Form.Control
                                        type="text"
                                        size="md"
                                        className="text-center w-25"
                                        placeholder={
                                            !controller.isAdmin
                                                ? `${controller.getContractValue(
                                                      'getPrice'
                                                  )} ` +
                                                  Config.getNetwork().token
                                                : 'FREE'
                                        }
                                        readOnly
                                    />
                                    <Button
                                        variant="success"
                                        size="md"
                                        className="w-100"
                                        disabled={
                                            !controller.isWalletValid ||
                                            count <= 0 ||
                                            this.state.maxTokens ||
                                            previewCount === 0 ||
                                            !this.state.mintsEnabled
                                        }
                                        onClick={async () => {
                                            // if (this.state.previewBlocked) {
                                            //     this.setState({
                                            //         navigate: '/preview',
                                            //     });
                                            // } else {
                                            //     this.setState({
                                            //         showOverlay: true,
                                            //         overlayTitle:
                                            //             'Preview Mint',
                                            //         element: <PreviewMint />,
                                            //         overlaySubmit: async () => {
                                            //             await this.previewMint();
                                            //         },
                                            //     });
                                            // }
                                            this.setState({
                                                navigate: '/selectivemint',
                                            });
                                            // window.location.reload();
                                        }}
                                    >
                                        {resources.$.UI.Action.PreviewTokens}
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                        <Col
                            className="text-center h-100"
                            lg
                            style={{
                                cursor: this.state.previewBlocked
                                    ? 'no-drop'
                                    : 'pointer',
                            }}
                        >
                            <Card
                                body
                                style={{
                                    opacity: this.state.previewBlocked
                                        ? 0.5
                                        : 1,
                                }}
                            >
                                <h2 className="fs-3">
                                    {resources.$.UI.Action.MintToken}{' '}
                                    <span className="badge bg-warning fs-6">
                                        {Config.getNetwork().name}
                                    </span>
                                </h2>
                                <p className="fs-6">Get a random choice!</p>
                                <div className="d-flex mt-2 mb-2 mt-auto gap-2">
                                    <Form.Control
                                        type="text"
                                        size="md"
                                        className="text-center w-25"
                                        placeholder={
                                            !controller.isAdmin
                                                ? `${controller.getContractValue(
                                                      'getPrice'
                                                  )} ` +
                                                  Config.getNetwork().token
                                                : 'FREE'
                                        }
                                        readOnly
                                    />
                                    <Button
                                        variant="warning"
                                        size="md"
                                        className="w-100"
                                        hidden={this.state.previewBlocked}
                                        disabled={
                                            !controller.isWalletValid ||
                                            count <= 0 ||
                                            this.state.previewBlocked ||
                                            this.state.maxTokens ||
                                            !this.state.mintsEnabled
                                        }
                                        onClick={() => {
                                            this.setState({
                                                showOverlay: true,
                                                overlayTitle: 'Mint',
                                                element: <InstantMint />,
                                                overlaySubmit: async () => {
                                                    await this.mint();
                                                },
                                            });
                                        }}
                                    >
                                        🔮 Get A Random {resources.token()}
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <Transaction
                        currentTransaction={this.state.mintTransaction}
                        element={this.state.element}
                        show={this.state.showOverlay}
                        title={this.state.overlayTitle}
                        onHide={() => {
                            this.setState({
                                showOverlay: false,
                            });
                        }}
                        onClick={this.state.overlaySubmit.bind(this)}
                    />
                    <br />
                    <br />
                    <br />
                </Container>
            </>
        );
    }
}

Mint.url = '/mint';
Mint.id = 'Mint';
Mint.settings = {
    navbarEnd: '$.UI.Navbar.Mint',
};

export default Mint;
