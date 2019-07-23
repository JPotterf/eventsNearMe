import React from "react";
import {
  Segment,
  Container,
  Header,
  Button,
  Icon
} from "semantic-ui-react";

//accessing 'history' object property to push the events route to the main button
//history is destructured from props.history.push()
const HomePage = ({ history }) => {
  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text className='center-text'>
        <Header as='h1' inverted>
          Hey Helsinki!
        </Header>
        <h2>
          Find an event and make some new friends! Start an event and invite
          people you know!
        </h2>
        <Button onClick={() => history.push("/events")} size='huge' style={{color:"black"}}>
          Get started
          <Icon name='right arrow' />
        </Button>
      </Container>
    </Segment>
  );
};

export default HomePage;
