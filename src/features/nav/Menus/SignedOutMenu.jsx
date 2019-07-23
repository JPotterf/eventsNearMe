import React from "react";
import { Menu, Button } from "semantic-ui-react";

const SignedOutMenu = ({ SignIn, register }) => {
  return (
    <Menu.Item>
      <Button onClick={SignIn} basic inverted content='Login' />
      <Button
        onClick={register}
        basic
        inverted
        content='Register'
          
      />
    </Menu.Item>
  );
};

export default SignedOutMenu;
