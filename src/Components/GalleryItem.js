import React, { useEffect } from 'react';
import { Card, Col } from 'react-bootstrap';
import { cutLongString, hasDestination } from '../helpers.js';
import resources from 'infinitymint-client/dist/src/classic/resources.js';
import controller from 'infinitymint-client/dist/src/classic/controller.js';
import tokenMethods from 'infinitymint-client/dist/src/classic/tokenMethods.js';
import modController from 'infinitymint-client/dist/src/classic/modController.js';
import Token from './Token.js';
import NavigationLink from './NavigationLink.js';

const GalleryItem = ({ token }) => {
    if (token.token !== undefined) {
        token = token.token;
    }

    useEffect(() => {
        tokenMethods.onWindowResize(controller);
    }, []);

    return (
        <Col
            style={{
                minWidth: 256,
            }}
        >
            <Card
                body
                className={
                    token.owner === controller.accounts[0]
                        ? 'border-primary'
                        : ''
                }
            >
                <div
                    hidden={token.owner !== controller.accounts[0]}
                    className="div"
                    style={{
                        position: 'absolute',
                        zIndex: 99,
                        marginTop: -42,
                        marginLeft: -16,
                        textShadow: '1px 1px black',
                        transform: 'rotate(-5deg)',
                    }}
                >
                    <p className="display-6 neonText text-white">⭐️ Yours</p>
                </div>
                <p className="text-center fs-5">
                    {cutLongString(token.name, 32)}
                </p>
                <div
                    className="d-grid mb-2 neonTextBlue"
                    style={{ cursor: 'pointer' }}
                >
                    <Token
                        theToken={token}
                        settings={{
                            opaqueDetails: true,
                            hideTokenId: true,
                            hideName: true,
                            hideDescription: true,
                            hideAllBadges: true,
                            enableThreeJS: false,
                            showEditButton:
                                token.owner === controller.accounts[0],
                            downsampleRate3D: 1.6,
                            selectable3D: true,
                            disableFloor3D: true,
                            // ForceBackground: ModelBackground,
                            showHelpers3D: false,
                            lightIntensity3D: 100,
                            lightColour3D: 0xff_ff_ff,
                            ambientLightIntensity3D: 50,
                            ambientLightColour3D: 0xff_ff_ff,
                            rotationSpeed3D: 0.001,
                        }}
                        onClick={() => {
                            window.location.href = '/view/' + token.tokenId;
                        }}
                    />
                </div>
                <p className="text-center">
                    <span className="badge bg-light">
                        TokenId #{token.tokenId}
                    </span>{' '}
                    <span
                        className={
                            'badge ' +
                            (token.owner === controller.accounts[0]
                                ? 'bg-primary'
                                : 'bg-dark')
                        }
                    >
                        {cutLongString(token.owner, 24)}
                    </span>
                </p>
                <div className="d-grid gap-2">
                    {modController.isModEnabled('redemption') ? (
                        <NavigationLink
                            variant="light"
                            disabled={
                                token.owner !==
                                controller.getProjectSettings()?.contracts
                                    .Mod_Redemption
                            }
                            location={'/redemption?tokenId=' + token.tokenId}
                            size="md"
                        >
                            {resources.$.UI.Action.Redeem}
                        </NavigationLink>
                    ) : (
                        <></>
                    )}
                    <NavigationLink
                        variant="light"
                        location={'/view/' + token.tokenId}
                        size="md"
                    >
                        {resources.$.UI.Action.View}
                    </NavigationLink>
                    {modController.isModEnabled('marketplace') ? (
                        <NavigationLink
                            variant="light"
                            location={'/offers/' + token.tokenId}
                            size="md"
                        >
                            {resources.$.UI.Action.SendOffer}
                        </NavigationLink>
                    ) : (
                        <></>
                    )}
                    <NavigationLink
                        variant="light"
                        location={'/advertise/' + token.tokenId}
                        disabled={!hasDestination(token, 1)}
                        size="md"
                    >
                        {resources.$.UI.Action.PlaceSticker}
                    </NavigationLink>
                </div>
            </Card>
        </Col>
    );
};

export default GalleryItem;
