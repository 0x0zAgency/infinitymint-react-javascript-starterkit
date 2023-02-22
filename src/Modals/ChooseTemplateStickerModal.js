import React, { Component } from 'react';
import { Modal, Form, Button, Col, Row, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

class ChooseTemplateStickerModal extends Component {
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Body></Modal.Body>
            </Modal>
        );
    }
}

// Types
ChooseTemplateStickerModal.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
};

export default ChooseTemplateStickerModal;
