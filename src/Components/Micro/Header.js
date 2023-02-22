import React from 'react';
import resources from 'infinitymint-client/dist/src/classic/resources.js';
import { Col, Container } from 'react-bootstrap';
import NavigationLink from '../../Components/NavigationLink.js';

const Header = ({ buyButton, className = '' }) => (
    <Container className={className}>
        {/* <Card fluid lg className={'p-0 mt-3 py-2 text-center justify-content-center text-uppercase d-flex ' + className}>
			<Col>
				{/* This was the original image. Time to remake it. */}
        {/* <img src={Config.getHeaderBackground()} alt='#'
					style={{maxWidth: '100vw', minWidth: '100%'}}
				/> 
			</Col>
		</Card> */}
        <Col className="mt-4 text-center justify-content-center text-uppercase">
            <h3 className="subtitle-text">
                metaversal women's empowerment conference
            </h3>
            <h2 className="header-text heading-text my-1">awedacity</h2>
            <h3 className="subtitle-text mt-4">
                ignite your passion & fuel your audacious goals
            </h3>
            <br />
            <h3>
                {buyButton ? (
                    <NavigationLink
                        className="bounce"
                        variant="success"
                        size={'lg'}
                        location="mint"
                    >
                        {resources.$.UI.Action.MintToken}
                    </NavigationLink>
                ) : (
                    <></>
                )}
            </h3>
            <br />
        </Col>
    </Container>
);

export default Header;
