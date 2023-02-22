import React, { Component } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import controller from 'infinitymint-client/dist/src/classic/controller.js';
import { connectWallet } from '../../helpers.js';
import Header from '../../Components/Micro/Header.js';

class RequireWallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
        };
    }

    render() {
        return (
            <>
                <Container className="">
                    <Row className="mt-4">
                        <Col>
                            <Card className="text-center text-uppercase py-1">
                                <Row className="justify-content-center">
                                    <Col>
                                        <iconify-icon
                                            width="48"
                                            icon="material-symbols:calendar-month-outline-rounded"
                                        />
                                        <h4>2.24.23</h4>
                                    </Col>
                                    <Col className="mx-1">
                                        <iconify-icon
                                            width="48"
                                            icon="mdi:alarm-clock"
                                        />
                                        <h4>3pm-9pm EST</h4>
                                    </Col>
                                    <Col>
                                        <iconify-icon
                                            width="48"
                                            icon="carbon:location-heart-filled"
                                        ></iconify-icon>
                                        <h4>Oncyber</h4>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-center">
                            {/* <div className="mt-5 pt-4 force-white">
								<p
									style={{
										fontWeight: 'bolder',
									}}
									className="header-text mb-0"
								>
									{Controller.getDescription().name}
									<span className="badge bg-primary fs-6 ms-2">
										{Config.getNetwork().name}
									</span>
								</p>
								<p className="mb-5 fs-4 text-white">
									by InfinityMint♾️
								</p>
							</div> */}
                            <Header button="false" />
                        </Col>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <Col lg={8}>
                            <Row className="gap-2">
                                <Col className="d-grid">
                                    {!controller.isWalletValid ? (
                                        <Alert
                                            variant="primary"
                                            className="p-3"
                                        >
                                            <p
                                                className="fs-2 bg-primary text-center p-2"
                                                style={{
                                                    fontWeight: 'bolder',
                                                }}
                                            >
                                                Web3 Error
                                            </p>
                                            <p className="fs-4 mb-0">
                                                <u>
                                                    {controller.walletError
                                                        ?.message || ''}
                                                    .
                                                </u>
                                            </p>
                                        </Alert>
                                    ) : (
                                        <></>
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col className="d-grid">
                                    <Button
                                        variant="success bounce"
                                        onClick={async () => {
                                            await connectWallet();
                                        }}
                                    >
                                        CONNECT YOUR WALLET
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <br />
                    <br />
                </Container>
            </>
        );
    }
}

export default RequireWallet;
