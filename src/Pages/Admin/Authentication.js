import React from 'react';

function Authentication() {
    return <div>Authenticaiton</div>;
}

Authentication.url = '/admin/authentication';
Authentication.id = 'AdminAuthentication';
Authentication.settings = {
    requireAdmin: true,
    dropdown: {
        admin: '$.UI.Navbar.AdminAuthentication',
    },
};

export default Authentication;
