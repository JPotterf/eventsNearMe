import React from "react";
import { Segment, Button, Header, Icon } from "semantic-ui-react";
import {withRouter} from 'react-router';
const NotFound = ({ history }) => {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name='search' />
        Sorry, this page does not exist.
      </Header>
      <Segment.Inline>
        <Button onClick={() => history.push("/events")} primary>
          Return to the Events Page
        </Button>
      </Segment.Inline>
    </Segment>
  );
};
export default withRouter(NotFound);
