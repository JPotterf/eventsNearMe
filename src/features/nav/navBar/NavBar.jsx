import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Menu, Container, Button, Responsive } from "semantic-ui-react";
import { NavLink, Link, withRouter } from "react-router-dom";
import { withFirebase } from "react-redux-firebase";
import SignedOutMenu from "../Menus/SignedOutMenu";
import SignedInMenu from "../Menus/SignedInMenu";
import { openModal } from "../../modals/modalActions";

const actions = {
  openModal
};

const mapState = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile
});

class NavBar extends Component {
  handleSignIn = () => {
    this.props.openModal("LoginModal");
  };

  handleRegister = () => {
    this.props.openModal("RegisterModal");
  };

  handleSignOut = () => {
    this.props.firebase.logout();
    this.props.history.push("/");
  };

  render() {
    const { auth, profile } = this.props;
    // uses withFirebase props to check login === true
    const authenticated = auth.isLoaded && !auth.isEmpty;
    return (
      <Fragment>
        <Responsive minWidth={800}>
          <Menu inverted fixed='top'>
            <Container>
              <Menu.Item style={{}} as={NavLink} exact to='/' header>
                Helsinki Events
              </Menu.Item>
              <Menu.Item as={NavLink} exact to='/events' name='Events' />
              <Menu.Item as={NavLink} to='/map' name='Map' />
              {authenticated && (
                <Fragment>
                  <Menu.Item>
                    <Button
                      as={Link}
                      to='/createEvent'
                      floated='right'
                      inverted
                      content='Create Event'
                    />
                  </Menu.Item>
                </Fragment>
              )}

              {authenticated ? (
                <SignedInMenu
                  auth={auth}
                  profile={profile}
                  SignOut={this.handleSignOut}
                />
              ) : (
                <SignedOutMenu
                  SignIn={this.handleSignIn}
                  register={this.handleRegister}
                />
              )}
            </Container>
          </Menu>
        </Responsive>

        <Responsive maxWidth={799}>
          <Menu inverted fixed='top'>
            <Container>
              <Menu.Item as={NavLink} exact to='/events' name='Events' />
              <Menu.Item as={NavLink} to='/map' name='Map' />
              {authenticated ? (
                <SignedInMenu
                  auth={auth}
                  profile={profile}
                  SignOut={this.handleSignOut}
                />
              ) : (
                <SignedOutMenu
                  SignIn={this.handleSignIn}
                  register={this.handleRegister}
                />
              )}
            </Container>
          </Menu>
        </Responsive>
      </Fragment>
    );
  }
}
//higher order component, withRouter, nec. due to navbar not having
//history prop to route user to home page
export default withRouter(
  withFirebase(
    connect(
      mapState,
      actions
    )(NavBar)
  )
);
