import React from "react";
import {
  Segment,
  Container,
  Header,
  Image,
  Button,
  Icon
} from "semantic-ui-react";

//accessing 'history' object property to push the events route to the main button
//history is destructured from props.history.push()
const HomePage = ({ history }) => {
  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text>
        <Header as='h1' inverted>
          <Image
            size='massive'
            src='/assets/logo.png'
            alt='logo'
            style={{ marginBottom: 12 }}
          />
          Event Tracker
        </Header>
        <h3>
          Find an event and make some new friends! Start an event and invite
          people you know!
        </h3>
        <Button onClick={() => history.push("/events")} size='huge' inverted>
          Get started
          <Icon name='right arrow' inverted />
        </Button>
      </Container>
    </Segment>
  );
};

export default HomePage;
