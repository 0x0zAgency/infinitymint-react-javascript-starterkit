import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import GalleryElement from '../Components/GalleryElement.js';

function Gallery() {
    return (
        <Container fluid className="p-4">
            <Row className="mt-4">
                <Col className="text-center">
                    <h1 className="header-text textGold  force-white">
                        Attendees
                    </h1>
                    <h3>All the people attending the 2023 event</h3>
                </Col>
            </Row>
            <GalleryElement
                loadInstantly={true}
                rowNumber={3}
                sidebarWidth={3}
                hiddenSidebar={true}
                showHeader={false}
                useMemory={false}
                rowColumnClass={'row-cols-3'}
            />
            <br />
            <br />
            <br />
        </Container>
    );
}

Gallery.url = '/gallery';
Gallery.id = 'Gallery';
Gallery.settings = {
    dropdown: {
        user: '$.UI.Action.AllTokens',
    },
    navbar: '$.UI.Navbar.Gallery',
};
export default Gallery;
