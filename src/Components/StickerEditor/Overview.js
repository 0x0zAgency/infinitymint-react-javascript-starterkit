import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tinySVG from 'infinitymint-client/dist/src/classic/tinysvg.js';
import {
    Form,
    Button,
    Row,
    Col,
    ListGroup,
    Card,
    Alert,
} from 'react-bootstrap';
import Config from '../../config.js';
import { isEmpty, tryDecodeURI } from '../../helpers.js';
import StickerHealth from './StickerHealth.js';

import controller from 'infinitymint-client/dist/src/classic/controller.js';
import resources from 'infinitymint-client/dist/src/classic/resources.js';

class Overview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            infoForm: this.getInfoFormValues(),
            svgForm: this.getSVGFormValues(),
            hasChanges: false,
            hasApperanceChanges: false,
        };
    }

    getSVGFormValues(paths = undefined, colours = undefined) {
        try {
            return {
                text: this.props?.sticker?.paths
                    ? tinySVG.toSVG(paths || this.props?.sticker?.paths, true, [
                          ...(colours || this.props?.sticker?.colours),
                      ])[0]
                    : '',
                file: '',
            };
        } catch (error) {
            controller.log('[😞] Error', 'error');
            controller.log(error);
            return {
                text: '',
                file: '',
            };
        }
    }

    getInfoFormValues() {
        return {
            name: this.props?.sticker?.name || '',
            description: this.props?.sticker?.description || '',
            twitter: this.props?.sticker?.twitter || '',
            url: this.props?.sticker?.url || '',
        };
    }

    /**
     * Sets a form value, forms used in this component are infoForm and svgForm
     * @param {string} form
     * @param {string|number} key
     * @param {any} value
     */
    setFormValue(form, key, value) {
        this.setState({
            [form]: {
                ...this.state[form],
                [key]: value,
            },
        });
    }

    /**
     * Changes the apperance of the sticker
     */
    async onApperanceSubmit() {
        let result;
        result =
            this.state.svgForm.text.slice(0, 1) === '/'
                ? tinySVG.toTinySVG(
                      tinySVG.toSVG(
                          this.state.svgForm.text,
                          false,
                          [],
                          false,
                          true
                      )[0],
                      true
                  )
                : tinySVG.toTinySVG(this.state.svgForm.text, true);

        const object = {
            paths: result.compressed,
            colours: [...result.colours],
        };

        if (isEmpty(object.paths)) {
            throw new Error('paths cannot be empty');
        }

        // Set the values inside the sticker
        await this.props.setInSticker(object);
        // Save the sticker
        this.props.saveSticker(object);
        // Reprocess apperance (redraw) with changes
        await this.props.processApperance(object);
        // Reset SVG form data
        this.setState({
            svgForm: this.getSVGFormValues(object.paths, object.colours),
            hasApperanceChanges: false,
        });
    }

    /**
     * Saves descriptive information inside of the sticker.
     */
    onInformationSubmit() {
        const object = {
            name: encodeURI(this.state.infoForm.name),
            description: encodeURI(this.state.infoForm.description),
            twitter: encodeURI(this.state.infoForm.twitter),
            url: encodeURI(this.state.infoForm.url),
        };

        if (isEmpty(object.name)) {
            throw new Error('name cannot be empty');
        }

        this.props.setInSticker(object).then(() => {
            // If you are waiting you shouldn't need to pass the obj and can just save the sticker
            this.props.saveSticker();
            // Calculate new blob sizes
            this.props.calculateStorageUsage();
            this.setState({
                hasChanges: false,
            });
        });
    }

    /**
     *
     * @returns
     */
    render() {
        return (
            <>
                <Row className="mt-4">
                    <Col>
                        <Card body>
                            <Row className="justify-content-center">
                                <Col className="pt-4">
                                    <p className="fs-2">👕 Apperance</p>
                                    <hr />

                                    {this.props.sticker.environment === 0 ? (
                                        <Form
                                            onSubmit={async (e) => {
                                                e.preventDefault();
                                                this.onApperanceSubmit().catch(
                                                    (error) => {
                                                        this.props.setError(
                                                            error
                                                        );
                                                    }
                                                );
                                            }}
                                        >
                                            <Row className="gy-2">
                                                <Col lg={8}>
                                                    <Form.Group
                                                        className="mb-2"
                                                        controlId="formSVG"
                                                    >
                                                        <Form.Label>
                                                            📁 Paste SVG Code
                                                        </Form.Label>
                                                        <textarea
                                                            className="form-control bg-light text-dark"
                                                            rows={20}
                                                            value={
                                                                this.state
                                                                    .svgForm
                                                                    .text
                                                            }
                                                            type="text"
                                                            style={{
                                                                resize: 'none',
                                                            }}
                                                            placeholder="<svg>...</svg>"
                                                            onChange={(e) => {
                                                                this.setFormValue(
                                                                    'svgForm',
                                                                    'text',
                                                                    e.target
                                                                        .value ||
                                                                        ''
                                                                );

                                                                this.setState({
                                                                    hasApperanceChanges: true,
                                                                });
                                                            }}
                                                        />
                                                    </Form.Group>
                                                    <div className="d-grid mt-3 gap-2">
                                                        <Button
                                                            variant="primary"
                                                            type="submit"
                                                            hidden={
                                                                !this.state
                                                                    .hasApperanceChanges
                                                            }
                                                        >
                                                            {
                                                                resources.$.UI
                                                                    .Action.Save
                                                            }
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col lg>
                                                    {this.props
                                                        .validApperance ? (
                                                        <Card
                                                            body
                                                            bg="dark"
                                                            text="light"
                                                        >
                                                            <p className="fs-5">
                                                                {
                                                                    resources.$
                                                                        .UI
                                                                        .Action
                                                                        .Preview
                                                                }
                                                            </p>
                                                            <div
                                                                className="p-4 d-grid mb-2"
                                                                style={{
                                                                    maxHeight: 274,
                                                                    overflowY:
                                                                        'scroll',
                                                                }}
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                        this
                                                                            ?.props
                                                                            ?.assets
                                                                            ?.svg[0] ||
                                                                        '<svg></svg>',
                                                                }}
                                                            ></div>
                                                            <ListGroup>
                                                                <ListGroup.Item>
                                                                    Colours{' '}
                                                                    <div className="badge bg-dark ms-2">
                                                                        {this
                                                                            .props
                                                                            .sticker
                                                                            ?.colours
                                                                            ?.length ||
                                                                            0}
                                                                    </div>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item>
                                                                    Path Size{' '}
                                                                    <div className="badge bg-dark ms-2">
                                                                        {this
                                                                            ?.props
                                                                            ?.assets
                                                                            ?.svg[1] ||
                                                                            0}
                                                                    </div>
                                                                </ListGroup.Item>
                                                                <ListGroup.Item>
                                                                    SVG Size{' '}
                                                                    <div className="badge bg-dark ms-2">
                                                                        {this
                                                                            .props
                                                                            .assets
                                                                            .svg !==
                                                                            undefined &&
                                                                        this
                                                                            .props
                                                                            .assets
                                                                            .svg
                                                                            .length >
                                                                            0
                                                                            ? [
                                                                                  ...this
                                                                                      .props
                                                                                      .assets
                                                                                      .svg,
                                                                              ].pop()
                                                                            : 0}
                                                                        kb
                                                                    </div>
                                                                    <span className="badge bg-success ms-2">
                                                                        compressed
                                                                    </span>
                                                                </ListGroup.Item>
                                                            </ListGroup>
                                                            <div className="d-grid mt-2 gap-2">
                                                                <Button
                                                                    variant="light"
                                                                    onClick={() => {
                                                                        this.props.setSection(
                                                                            'apperance'
                                                                        );
                                                                    }}
                                                                >
                                                                    {
                                                                        resources
                                                                            .$
                                                                            .UI
                                                                            .Action
                                                                            .EditApperance
                                                                    }
                                                                </Button>
                                                            </div>
                                                        </Card>
                                                    ) : (
                                                        <Card body>
                                                            <p className="fs-5">
                                                                {
                                                                    resources.$
                                                                        .UI
                                                                        .Action
                                                                        .Preview
                                                                }
                                                            </p>
                                                            <div className="d-grid mt-3 text-center">
                                                                <Alert variant="warning">
                                                                    Invalid
                                                                    Apperance
                                                                </Alert>
                                                            </div>
                                                        </Card>
                                                    )}
                                                </Col>
                                                <Row className="justify-content-center mb-2">
                                                    <Col lg={8}>
                                                        <Form.Group
                                                            className="mt-2 text-center"
                                                            controlId="formSVGFile"
                                                        >
                                                            <Form.Label className="fs-3">
                                                                📁 Upload an
                                                                Image/Vector
                                                            </Form.Label>
                                                            <Form.Control
                                                                size="lg"
                                                                type="file"
                                                                className="m-2"
                                                                accept="image/svg+xml"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const fileReader =
                                                                        new FileReader();
                                                                    fileReader.addEventListener(
                                                                        'load',
                                                                        () => {
                                                                            this.setFormValue(
                                                                                'svgForm',
                                                                                'text',
                                                                                fileReader.result ||
                                                                                    ''
                                                                            );

                                                                            this.setState(
                                                                                {
                                                                                    hasApperanceChanges: true,
                                                                                }
                                                                            );
                                                                        }
                                                                    );

                                                                    fileReader.readAsText(
                                                                        e.target
                                                                            .files[0]
                                                                    );
                                                                }}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Row>
                                        </Form>
                                    ) : (
                                        <></>
                                    )}
                                </Col>
                            </Row>
                            <Row className="mt-2 gy-2">
                                <Col>
                                    <Card
                                        Body
                                        className="p-3 bg-dark force-white"
                                    >
                                        <Row className="mt-2">
                                            <Col lg={6}>
                                                <p className="fs-3">
                                                    Basic Information
                                                </p>
                                                <hr />
                                                <Form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        this.onInformationSubmit();
                                                    }}
                                                >
                                                    <Form.Group
                                                        className="mb-3"
                                                        controlId="formSVG"
                                                    >
                                                        <Form.Label>
                                                            Name
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={tryDecodeURI(
                                                                this.state
                                                                    .infoForm
                                                                    .name
                                                            )}
                                                            onChange={(e) => {
                                                                this.setFormValue(
                                                                    'infoForm',
                                                                    'name',
                                                                    e.target
                                                                        .value ||
                                                                        ''
                                                                );
                                                                this.setState({
                                                                    hasChanges: true,
                                                                });
                                                            }}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group
                                                        className="mb-3"
                                                        controlId="formSVG"
                                                    >
                                                        <Form.Label>
                                                            Website
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="url"
                                                            value={
                                                                this.state
                                                                    .infoForm
                                                                    .url
                                                            }
                                                            onChange={(e) => {
                                                                this.setFormValue(
                                                                    'infoForm',
                                                                    'url',
                                                                    e.target
                                                                        .value ||
                                                                        ''
                                                                );
                                                                this.setState({
                                                                    hasChanges: true,
                                                                });
                                                            }}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group
                                                        className="mb-3"
                                                        controlId="formSVG"
                                                    >
                                                        <Form.Label>
                                                            Environment
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            disabled
                                                            className="border-dark"
                                                            value={
                                                                Config.settings
                                                                    .environments[
                                                                    this.props
                                                                        .sticker
                                                                        .environment
                                                                ].name
                                                            }
                                                        />
                                                    </Form.Group>
                                                    <Form.Group
                                                        className="mb-3"
                                                        controlId="formSVG"
                                                    >
                                                        <Form.Label>
                                                            Creator
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            disabled
                                                            className="border-dark"
                                                            value={
                                                                this.props
                                                                    .sticker
                                                                    .owner
                                                            }
                                                        />
                                                    </Form.Group>
                                                    <div className="d-grid mt-2 gap-2">
                                                        <Button
                                                            variant="primary"
                                                            type="submit"
                                                            hidden={
                                                                !this.state
                                                                    .hasChanges
                                                            }
                                                        >
                                                            {
                                                                resources.$.UI
                                                                    .Action.Save
                                                            }
                                                        </Button>
                                                    </div>
                                                </Form>
                                            </Col>
                                            <Col lg>
                                                <p className="fs-3">
                                                    Sticker Health
                                                </p>
                                                <hr />
                                                <StickerHealth
                                                    sticker={this.props.sticker}
                                                    assets={this.props.assets}
                                                />
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}

Overview.propTypes = {
    isValid: PropTypes.bool,
    validApperance: PropTypes.bool,
    sticker: PropTypes.object,
    assets: PropTypes.object,
    saveSticker: PropTypes.func,
    setInSticker: PropTypes.func,
    setError: PropTypes.func,
    setSection: PropTypes.func,
    processApperance: PropTypes.func,
    calculateStorageUsage: PropTypes.func,
};

export default Overview;
