import React, { Component } from 'react';
import { Modal, Form, Button, Col, Row, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

class IPFSSetupModal extends Component {
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();

                            // Call
                        }}
                    ></Form>
                </Modal.Body>
            </Modal>
        );
    }
}

// Types
IPFSSetupModal.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
};

export default IPFSSetupModal;
