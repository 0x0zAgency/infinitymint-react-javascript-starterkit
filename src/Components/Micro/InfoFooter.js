import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const InfoFooter = ({ _hasBackground = false, className, light = false }) => (
    <Container
        fluid
        className={`px-5 py-2 ${className || ''} ${light ? 'bg-light' : ''}`}
    >
        <Row className="justify-content-center align-items-center h-100 mt-2 mb-5 gap-2">
            <Col lg>
                <Card body className="text-center shadow-lg">
                    <p className="fs-2">0x0z.eth</p>
                    <div className="d-grid">
                        <Button
                            variant="info"
                            onClick={() => {
                                window.open('https://0x0z.eth.limo');
                            }}
                        >
                            Visit 🪞
                        </Button>
                    </div>
                </Card>
            </Col>
            <Col lg>
                <Card body className="text-center shadow-lg">
                    <p className="fs-2">♾Mint.eth</p>
                    <div className="d-grid">
                        <Button
                            variant="info"
                            onClick={() => {
                                window.open('https://infinitymint.eth.limo');
                            }}
                        >
                            Visit 🪞
                        </Button>
                    </div>
                </Card>
            </Col>
        </Row>
    </Container>
);

export default InfoFooter;
