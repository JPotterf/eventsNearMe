import React, { Component } from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import { NavLink, Link, withRouter } from "react-router-dom";
import SignedOutMenu from "../Menus/SignedOutMenu";
import SignedInMenu from "../Menus/SignedInMenu";

class NavBar extends Component {
  state = {
    authenticated: false
  };

  handleSignIn = () => this.setState({ authenticated: true });
  handleSignOut = () => {
    this.setState({ authenticated: false });
    this.props.history.push("/");
  };

  render() {
    const { authenticated } = this.state;
    return (
      <Menu inverted fixed='top'>
        <Container>
          <Menu.Item as={NavLink} exact to='/' header>
            <img src='assets/logo.png' alt='logo' />
            Events Near Me
          </Menu.Item>
          <Menu.Item as={NavLink} exact to='/events' name='Events' />
          <Menu.Item as={NavLink} to='/people' name='People' />
          <Menu.Item as={NavLink} to='/map' name='Map' />
          <Menu.Item as={NavLink} to='/test' name='test' />
          <Menu.Item>
            <Button
              as={Link}
              to='/createEvent'
              floated='right'
              positive
              inverted
              content='Create Event'
            />
          </Menu.Item>
          {authenticated ? (
            <SignedInMenu SignOut={this.handleSignOut} />
          ) : (
            <SignedOutMenu SignIn={this.handleSignIn} />
          )}
        </Container>
      </Menu>
    );
  }
}
//higher order component, withRouter, nec. due to navbar not having
//history prop to route user to home page
export default withRouter(NavBar);
