import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Container, Stack, Row, Col } from 'react-bootstrap';
import modController from 'infinitymint-client/dist/src/classic/modController';
import storageController from 'infinitymint-client/dist/src/classic/storageController';
import TempProjectModal from '../../Modals/TempProjectModal';
import GemInfoModal from '../../Modals/GemInfoModal';
import { createNewTempProject } from '../../helpers';
import Loading from '../../Components/Loading';
import controller from 'infinitymint-client/dist/src/classic/controller';

function Gems() {
    const [showTempProjectModal, setShowTempProjectModal] = useState(false);
    const [showGemInfoModal, setShowGemInfoModal] = useState(false);
    const [hasTempProject, setHasTempProject] = useState({});
    const [tempProject, setTempProject] = useState({});
    const mod = useRef({});
    const [loading, setLoading] = useState(false);
    const project = controller.getProjectSettings();

    useEffect(() => {
        if (storageController.getGlobalPreference('tempProject')) {
            setHasTempProject(true);
            setTempProject(
                storageController.getGlobalPreference('_projects')[
                    storageController.getGlobalPreference('tempProject')
                ]
            );
        } else {
            setHasTempProject(false);
        }
    }, []);

    const saveData = () => {
        setLoading(true);
        storageController.setGlobalPreference('_projects', {
            ...(storageController.getGlobalPreference('_projects') || {}),
            [storageController.getGlobalPreference('tempProject')]: {
                ...tempProject,
            },
        });
        storageController.saveData();
        setLoading(false);
    };

    return (
        <>
            {loading ? (
                <Container>
                    <Loading />
                </Container>
            ) : (
                <Container>
                    <Row>
                        <Col>
                            <Card body>
                                <Card.Title>Modules</Card.Title>
                                <p>Here you can enable and disable modules.</p>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card body>
                                <Card.Title>Temporary Project</Card.Title>
                                <p>
                                    Here you can set a temporary project file.
                                </p>
                                {hasTempProject ? (
                                    <>
                                        <p>
                                            Current temporary project:{' '}
                                            {storageController.getGlobalPreference(
                                                'tempProject'
                                            )}
                                        </p>
                                    </>
                                ) : (
                                    <p>No temporary project set.</p>
                                )}
                                <Stack
                                    lg
                                    gap={3}
                                    direction="horizontal"
                                    className="mx-auto"
                                >
                                    <Button
                                        variant="success"
                                        onClick={() => {
                                            setShowTempProjectModal(
                                                !showTempProjectModal
                                            );
                                        }}
                                    >
                                        {hasTempProject ? 'Change' : 'Set'}
                                    </Button>
                                </Stack>
                                <Card body>
                                    <Stack direction="vertical" gap={1}>
                                        {Object.keys(
                                            modController.modManifest?.mods
                                        ).map((key, index) => {
                                            let value =
                                                modController.modManifest.mods[
                                                    key
                                                ];

                                            return (
                                                <div key={index}>
                                                    <h2>{key}</h2>
                                                    <p>
                                                        {value.manifest
                                                            ?.description ||
                                                            'No description available...'}
                                                    </p>
                                                    <div className="d-grid gap-2">
                                                        <Button
                                                            variant="success"
                                                            onClick={() => {
                                                                mod.current = {
                                                                    ...value,
                                                                    ...project
                                                                        .deployedMods[
                                                                        key
                                                                    ],
                                                                    pages: modController
                                                                        .modPages[
                                                                        key
                                                                    ],
                                                                };
                                                                setShowGemInfoModal(
                                                                    !showGemInfoModal
                                                                );
                                                            }}
                                                        >
                                                            Manifest
                                                        </Button>
                                                        <Button
                                                            variant="success"
                                                            onClick={() => {}}
                                                        >
                                                            Enable
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => {}}
                                                        >
                                                            Disable
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </Stack>
                                </Card>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            )}
            <TempProjectModal
                show={showTempProjectModal}
                onHide={() => {
                    setShowTempProjectModal(!showTempProjectModal);
                }}
                onSetTempProject={(projectName) => {
                    setTempProject(createNewTempProject(projectName));
                    saveData();
                    setHasTempProject(true);
                    setShowTempProjectModal(false);
                }}
            />
            <GemInfoModal
                show={showGemInfoModal}
                onHide={() => {
                    setShowGemInfoModal(!showGemInfoModal);
                }}
                mod={mod.current}
            />
        </>
    );
}

Gems.url = '/admin/gems';
Gems.id = 'Gems';
Gems.settings = {
    requireAdmin: true,
    dropdown: {
        admin: '$.UI.Navbar.AdminGems',
    },
};

export default Gems;
