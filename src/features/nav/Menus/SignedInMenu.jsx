import React from "react";
import { Menu, Image, Dropdown } from "semantic-ui-react";
import {Link} from 'react-router-dom';

const SignedInMenu = ({ SignOut, profile, auth }) => {
  return (
    <Menu.Item position='right'>
      <Image avatar spaced='right' src={`https://i.pravatar.cc/150?u=${auth.uid}`} />
      <Dropdown pointing='top left' text={profile.displayName}>
        <Dropdown.Menu>
          <Dropdown.Item text='Create Event' icon='plus' />
          <Dropdown.Item onClick={SignOut} text='Sign Out' icon='power' />
          <Dropdown.Item
            as={Link}
            to={`/profile/${auth.uid}`}
            text='Profile'
            icon='address card'
          />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
};

export default SignedInMenu;
