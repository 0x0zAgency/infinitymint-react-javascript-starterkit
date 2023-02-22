import React from 'react';
import { Container, Row, Card } from 'react-bootstrap';
import resources from 'infinitymint-client/dist/src/classic/resources.js';
import NavigationLink from '../Components/NavigationLink.js';
import InfoFooter from '../Components/Micro/InfoFooter.js';
import Config from '../config.js';

function Index() {
    return (
        <>
            <Container className="my-3 mb-5">
                <Card.Img
                    variant="top"
                    className="rounded border bg-white"
                    style={{ padding: '1px' }}
                    src={Config.getHeaderBackground()}
                    alt="eventinfo"
                />
                <Row className="justify-content-center mb-2">
                    <NavigationLink
                        className="mr-1 bounce mt-1"
                        variant="success"
                        size={'lg'}
                        location="mint"
                    >
                        Get An {resources.token()}
                    </NavigationLink>
                </Row>
                <Card body className="">
                    <Card.Header className="display-3">
                        You're invited to the AWEdacity conference!
                    </Card.Header>
                    <Card.Body>
                        <Card.Title className="fs-4">
                            From The Founders
                        </Card.Title>
                        <Card.Text className="">
                            AWEdacity 2023 is a digital event designed to
                            celebrate, empower and inspire women across the
                            globe.
                            <br />
                            Our mission is to transform women&apos;s lives by
                            igniting the awe-inspiring passion that comes from
                            the pursuit of audacious goals!
                            <br />
                        </Card.Text>
                        <br />
                        <p>
                            This first metaversal women&apos;s empowerment
                            conference features:
                            <br />
                        </p>
                        <ul>
                            <li>Empowering Women Speakers</li>
                            <li>AWEdacious Woman 2023 Award</li>
                            <li>Nominee Gallery</li>
                            <li>Art Galley</li>
                            <li>Exhibitor Gallery and more!</li>
                        </ul>
                        <Card.Text>
                            We&apos;d like to give a special thank you to our
                            ticket provider,{' '}
                            <a
                                href="https://metaticket.eth.limo"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Metaticket.eth
                            </a>
                            .<br />
                            Thanks to their amazing technology, these tickets
                            don&apos;t just allow admission to the conference,
                            <br />
                            they also serve as a piece of digital memorabilia so
                            you can revisit your favorite parts of the
                            conference anytime you like!
                            <br />
                            <br />
                            We look forward to seeing you!
                            <br />
                            <br />
                        </Card.Text>
                        <NavigationLink
                            className="mr-1 bounce"
                            variant="success"
                            size={'lg'}
                            location="mint"
                        >
                            Get An {resources.token()}
                        </NavigationLink>
                        <hr />
                        <p className="signoff-text fs-3">
                            Stephanie & Nathania, Co-Founders
                        </p>
                        AWEdacity 2023
                    </Card.Body>
                    <Row>&nbsp;</Row>
                </Card>
            </Container>
            <InfoFooter />
        </>
    );
}

Index.url = '/';
Index.settings = {
    navbarStart: '$.UI.Navbar.Home',
};

export default Index;
