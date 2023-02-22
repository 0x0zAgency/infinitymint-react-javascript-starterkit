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
import resources from 'infinitymint-client/dist/src/classic/resources.js';
import Config from '../../config.js';
import controller from 'infinitymint-client/dist/src/classic/controller.js';
import Loading from '../../Components/Loading.js';

const prices = [
    [0.0001, 0.001, 0.01, 0.1],
    [1, 10, 100, 1000],
    [1_000_000, 10_000_000, 100_000_000, 1_000_000_000],
];

class SetPrice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0.01,
            onchainValue: '?',
        };
    }

    async componentDidMount() {
        this.setState({
            loading: true,
        });

        try {
            const projectSettings = controller.getProjectSettings();
            controller.initializeContract(
                Config.deployInfo.contracts[projectSettings.modules.royalty],
                projectSettings.modules.royalty,
                true
            );

            const result = await controller.callMethod(
                controller.accounts[0],
                'InfinityMintApi',
                'getPrice'
            );

            this.setState({
                onchainValue: Number.parseFloat(
                    controller.web3.utils.fromWei(result)
                ),
                value: Number.parseFloat(controller.web3.utils.fromWei(result)),
            });
        } catch (error) {
            controller.log(error);
        } finally {
            this.setState({
                loading: false,
            });
        }
    }

    render() {
        return (
            <>
                {this.state.loading ? (
                    <Container>
                        <Loading></Loading>
                    </Container>
                ) : (
                    <Container>
                        {this.state.success ? (
                            <Alert
                                variant="success"
                                className="text-center"
                                style={{ borderRadius: 0 }}
                            >
                                <p className="fs-2">😊</p>
                                This is how your token looks to the rest of Web3
                            </Alert>
                        ) : (
                            <></>
                        )}
                        <Row className="text-white mt-4">
                            <Col>
                                <h1 className="fs-1">
                                    💸 Minter Pricing{' '}
                                    <span className="badge bg-dark">
                                        {this.state.onchainValue}{' '}
                                        {Config.getNetwork().token}
                                    </span>
                                </h1>
                                <p className="fs-5">
                                    Set how much your{' '}
                                    {resources.projectTokenPlural()} cost here.
                                </p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card body>
                                    {prices.map((priceGroup) => (
                                        <Row className="mt-2 gap-2">
                                            {priceGroup.map((price) => (
                                                <Col>
                                                    <div className="d-grid gap-2">
                                                        <Button
                                                            variant={
                                                                price ===
                                                                this.state.value
                                                                    ? 'success'
                                                                    : 'danger'
                                                            }
                                                            onClick={() => {
                                                                this.setState({
                                                                    value: price,
                                                                });
                                                            }}
                                                        >
                                                            {price}{' '}
                                                            {
                                                                Config.getNetwork()
                                                                    .token
                                                            }
                                                        </Button>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    ))}
                                    <Row className="mt-4">
                                        <Col>
                                            <h2>Custom Price</h2>
                                            <Form.Group
                                                className="mb-3"
                                                controlId="price"
                                            >
                                                <Form.Control
                                                    type="number"
                                                    size="sm"
                                                    value={this.state.value}
                                                    onChange={(e) =>
                                                        this.setState({
                                                            value: isNaN(
                                                                e.target.value
                                                            )
                                                                ? 0.001
                                                                : Number.parseFloat(
                                                                      e.target
                                                                          .value
                                                                  ),
                                                        })
                                                    }
                                                    placeholder={'0.0'}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col>
                                            <div className="d-grid">
                                                <Button
                                                    variant="dark"
                                                    onClick={async () => {
                                                        const projectSettings =
                                                            controller.getProjectSettings();
                                                        await controller.sendMethod(
                                                            controller
                                                                .accounts[0],
                                                            projectSettings
                                                                .modules
                                                                .royalty,
                                                            'changePrice',
                                                            [
                                                                controller.web3.utils
                                                                    .toWei(
                                                                        this.state.value.toString()
                                                                    )
                                                                    .toString(),
                                                            ]
                                                        );

                                                        this.setState({
                                                            success: true,
                                                        });
                                                    }}
                                                >
                                                    Set Price
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                )}
            </>
        );
    }
}

SetPrice.url = '/admin/price';
SetPrice.id = 'SetPrice';
SetPrice.settings = {
    identifier: 'setPrice',
    requireAdmin: true,
    dropdown: {
        admin: '💲 Set Minter Price',
    },
};

export default SetPrice;
