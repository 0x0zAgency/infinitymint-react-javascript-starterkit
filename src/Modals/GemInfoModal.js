import React, { useRef } from 'react';
import {
    Modal,
    Form,
    Col,
    Row,
    Button,
    ListGroup,
    Card,
    Alert,
} from 'react-bootstrap';
import PropTypes from 'prop-types';

const variants = {
    name: 'success',
};

function GemInfoModal({
    show,
    onHide,
    mod = {
        manifest: {},
    },
}) {
    return (
        <Modal show={show} onHide={onHide} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Mod Manifest</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <ListGroup>
                            {Object.entries(mod?.manifest || {}).map(
                                ([key, mod], index) => (
                                    <ListGroup.Item
                                        key={index}
                                        variant={variants[key] || 'secondary'}
                                    >
                                        <span className="badge bg-dark">
                                            {key}
                                        </span>
                                        <p
                                            className="fs-3"
                                            style={{
                                                wordBreak: 'break-all',
                                                wordWrap: 'break-word',
                                                textAlign: 'right',
                                            }}
                                        >
                                            {typeof mod !== 'object'
                                                ? mod
                                                : JSON.stringify(mod)}
                                        </p>
                                    </ListGroup.Item>
                                )
                            )}
                        </ListGroup>
                        <Row className="mt-2">
                            <Col>
                                <Card>
                                    <Card.Header>
                                        <span className="badge bg-light">
                                            by{' '}
                                            {typeof mod?.manifest?.author ===
                                            'object'
                                                ? JSON.stringify(
                                                      mod?.manifest?.author
                                                  ).name
                                                : mod?.manifest?.author ||
                                                  'Unknown Author'}
                                        </span>{' '}
                                        <span className="badge bg-light">
                                            version{' '}
                                            {mod?.manifest?.version || '?.?'}
                                        </span>
                                        <span className="badge bg-dark ms-1">
                                            {mod.path}
                                        </span>
                                        {mod.enabled ? (
                                            <span className="badge bg-success ms-2">
                                                enabled
                                            </span>
                                        ) : (
                                            <span className="badge bg-danger">
                                                disabled
                                            </span>
                                        )}
                                    </Card.Header>
                                    <Card.Body>
                                        <Row className="gap-2">
                                            <Col lg={6}>
                                                <p className="fs-4 mb-1">
                                                    Description
                                                </p>
                                                <Alert variant="light">
                                                    <span className="fs-3 me-2 pb-4">
                                                        ❓
                                                    </span>
                                                    {mod?.manifest
                                                        ?.description ||
                                                        'No Description Available'}
                                                </Alert>
                                                <Row>
                                                    <Col>
                                                        <div className="d-grid gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="dark"
                                                                disabled={
                                                                    mod
                                                                        ?.manifest
                                                                        ?.github ===
                                                                    undefined
                                                                }
                                                            >
                                                                Github
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="dark"
                                                                disabled={
                                                                    mod
                                                                        ?.manifest
                                                                        ?.twitter ===
                                                                    undefined
                                                                }
                                                            >
                                                                Tweet Developer
                                                            </Button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        <p className="fs-4 mb-2">
                                                            Deployed Contracts{' '}
                                                            <style className="badge bg-dark fs-6">
                                                                {
                                                                    (
                                                                        mod?.receipts ||
                                                                        []
                                                                    ).length
                                                                }
                                                            </style>
                                                        </p>
                                                        <ListGroup>
                                                            {(
                                                                mod?.receipts ||
                                                                []
                                                            ).map(
                                                                (
                                                                    receipt,
                                                                    _i
                                                                ) => {
                                                                    return (
                                                                        <ListGroup.Item
                                                                            key={
                                                                                _i
                                                                            }
                                                                            className="text-center"
                                                                        >
                                                                            {
                                                                                receipt.contractName
                                                                            }{' '}
                                                                            <span className=" badge bg-dark d-sm-none d-md-none d-lg-block d-none">
                                                                                {
                                                                                    receipt.address
                                                                                }
                                                                            </span>
                                                                        </ListGroup.Item>
                                                                    );
                                                                }
                                                            )}
                                                        </ListGroup>
                                                    </Col>
                                                </Row>
                                                <Row className="mt-2">
                                                    <Col>
                                                        <p className="fs-4 mb-2">
                                                            Pages{' '}
                                                            <style className="badge bg-dark fs-6">
                                                                {
                                                                    (
                                                                        mod.pages ||
                                                                        []
                                                                    ).length
                                                                }
                                                            </style>
                                                        </p>
                                                        <ListGroup>
                                                            {(
                                                                mod.pages || []
                                                            ).map(
                                                                (page, _i) => {
                                                                    if (
                                                                        !page ||
                                                                        page ===
                                                                            null
                                                                    )
                                                                        return (
                                                                            <>

                                                                            </>
                                                                        );

                                                                    return (
                                                                        <ListGroup.Item
                                                                            key={
                                                                                _i
                                                                            }
                                                                            className="text-center"
                                                                        >
                                                                            {
                                                                                page?.name
                                                                            }
                                                                            <span className="badge bg-dark ms-2 d-sm-none d-md-none d-lg-block d-none">
                                                                                ./Deployments/mods/
                                                                                {
                                                                                    page?.src
                                                                                }
                                                                                .js
                                                                            </span>
                                                                            <a
                                                                                className="text-info mx-1 small"
                                                                                href={
                                                                                    page.url !==
                                                                                    undefined
                                                                                        ? page?.url?.replace(
                                                                                              ':tokenId',
                                                                                              0
                                                                                          )
                                                                                        : ''
                                                                                }
                                                                                hidden={
                                                                                    page?.url ===
                                                                                        undefined ||
                                                                                    page
                                                                                        ?.url
                                                                                        ?.length ===
                                                                                        0
                                                                                }
                                                                            >
                                                                                visit
                                                                            </a>
                                                                        </ListGroup.Item>
                                                                    );
                                                                }
                                                            )}
                                                        </ListGroup>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <div className="d-grid mt-2">
                            <Button
                                variant="danger"
                                onClick={() => {
                                    onHide();
                                }}
                            >
                                Close
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
}

GemInfoModal.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
};

export default GemInfoModal;
