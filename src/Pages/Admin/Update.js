import React from 'react';

function Update() {
    return <div>Authenticaiton</div>;
}

Update.url = '/admin/update';
Update.id = 'AdminUpdate';
Update.settings = {
    requireAdmin: true,
    dropdown: {
        admin: '$.UI.Navbar.AdminUpdate',
    },
};

export default Update;
