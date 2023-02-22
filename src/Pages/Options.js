import React, { Component, useEffect, useRef, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Alert,
    Button,
    Form,
} from 'react-bootstrap';
import Config from '../config.js';
import resources from 'infinitymint-client/dist/src/classic/resources.js';
import storageController from 'infinitymint-client/dist/src/classic/storageController.js';
import Box from '../Components/Box.js';

function Options() {
    const web3StorageApiKey = useRef(null);
    const [hasKey, setHasKey] = useState(false);

    const developerReset = () => {
        storageController.wipe();
        storageController.saveData();
        window.location.reload();
    };

    useEffect(() => {
        if (storageController.getGlobalPreference('web3StorageApiKey'))
            setHasKey(true);
    }, []);

    if (web3StorageApiKey?.current?.value?.length === 0)
        web3StorageApiKey.current.value =
            storageController.getGlobalPreference('web3StorageApiKey');

    return (
        <>
            <Container className="mb-5">
                <Row className="mt-5">
                    <Col>
                        <p className="display-5 zombieTextRed  text-white">
                            ⚙️ Options
                        </p>
                        <Card body className="mt-4">
                            <p className="fs-6 text-center">
                                Reset Browser{' '}
                                <span className="badge bg-danger">DANGER</span>
                            </p>
                            <div className="d-grid gap-2">
                                <Alert variant="danger" className="text-center">
                                    This will clear everything in your local
                                    storage.
                                    <br />
                                    <br />
                                    <b>
                                        Warning: Will clear WIP stickers, the
                                        lot. All things you have done will be
                                        gone till they are viewed again.
                                    </b>
                                </Alert>
                                <Button
                                    onClick={developerReset}
                                    variant="danger"
                                >
                                    {resources.$.UI.Action.Reset}
                                </Button>
                            </div>
                            <p className="fs-6 text-center mt-4">
                                Decompile & Save As Project File
                            </p>
                            <div className="d-grid gap-1">
                                <Alert variant="dark" className="text-center">
                                    Turns a deployed InfinityMint project into a
                                    not deployed project file.
                                </Alert>
                                <Button
                                    onClick={developerReset}
                                    variant="light"
                                >
                                    {resources.$.UI.Action.Save}
                                </Button>
                                <Alert variant="warning" className="mt-4">
                                    <b>Note:</b> You will need to navigate and
                                    save over your project '.js' file inside of
                                    the InfinityMint solidity repository.{' '}
                                    <b>
                                        This project is called{' '}
                                        {Config.deployInfo.project}.js
                                    </b>
                                </Alert>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <div className="d-grid gy-2 gap-2">
                        <p className="display-5 zombieTextRed  text-white">
                            🛸 IPFS - InterPlanetary File System
                        </p>
                        <Row>
                            <Col>
                                <div className="d-grid gap-2 mx-2 mb-2">
                                    <Button
                                        size="lg"
                                        variant="success"
                                        onClick={() => {
                                            window.open('https://web3.storage');
                                        }}
                                    >
                                        Get 'Web3.storage' API Key{' '}
                                        <span className="badge bg-dark">
                                            External Site
                                        </span>
                                    </Button>

                                    {hasKey ? (
                                        <Alert variant="success">
                                            Your key appears to be valid!
                                        </Alert>
                                    ) : (
                                        <Alert>
                                            You will need to enter an API key to
                                            effectively use InfinityMint!
                                        </Alert>
                                    )}

                                    <Form.Control
                                        type="text"
                                        size="md"
                                        placeholder="web3.storage API Key"
                                        ref={web3StorageApiKey}
                                    />
                                    <Button
                                        variant="success"
                                        onClick={() => {
                                            if (
                                                web3StorageApiKey?.current
                                                    ?.value?.length === 0
                                            )
                                                return;

                                            storageController.setGlobalPreference(
                                                'web3StorageApiKey',
                                                web3StorageApiKey.current?.value
                                            );
                                            storageController.saveData();
                                        }}
                                    >
                                        Save
                                    </Button>
                                </div>

                                <Box tag={'😍'}>
                                    Dont panic! All you need to do is click the
                                    'Get Web3.Storage Api Key' token and create
                                    an account completely for free. Once you
                                    have an account you can then go to your
                                    account settings and create a new API token
                                    and then you can simply paste it into the
                                    web3.storagekey box!
                                </Box>
                                <Box tag={'📟'} className="mt-2">
                                    {' '}
                                    We use <b>ipfs</b> to store your tokens
                                    apperance and information forever. IPFS is a
                                    decentralized file solution similar to
                                    Google Drive or Dropbox and is{' '}
                                    <b>free to use.</b>
                                </Box>
                            </Col>
                        </Row>
                    </div>
                </Row>
            </Container>
        </>
    );
}
Options.url = '/options';
Options.id = 'Options';
Options.settings = {
    dropdown: {
        utility: '$.UI.Navbar.Options',
    },
};
export default Options;
