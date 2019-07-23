import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Grid, Responsive } from "semantic-ui-react";
import EventDetailedHeader from "./EventDetailedHeader";
import EventDetailedInfo from "./EventDetailedInfo";
import EventDetailedSidebar from "./EventDetailedSidebar";
import { withFirestore } from "react-redux-firebase";
import { objectToArray } from "../../../app/common/util/helpers";
import { goingToEvent, cancelGoingToEvent } from "../eventActions";
import NotFound from "../../../app/layout/NotFound";

const mapState = (state, ownProps) => {
  //recieve eventID from props
  const eventId = ownProps.match.params.id;
  //declare event as empty obj to limit null errors
  let event = {};

  //if events in firestore exist
  if (
    state.firestore.ordered.events &&
    state.firestore.ordered.events.length > 0
  ) {
    event =
      state.firestore.ordered.events.filter(event => event.id === eventId)[0] ||
      {}; //OR statement stops event from being assigned as undefined
  }
  return {
    event,
    //for access to user.id
    auth: state.firebase.auth
  };
};

const actions = {
  goingToEvent,
  cancelGoingToEvent
};

class EventDetailedPage extends Component {
  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`events/${match.params.id}`);
  }

  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }

  render() {
    const { event, auth, goingToEvent, cancelGoingToEvent } = this.props;
    const attendees =
      event && event.attendees && objectToArray(event.attendees);
    //check the logged in users id to the event host's id
    const isHost = event.hostUid === auth.uid;
    const isUser = auth.uid;
    //check the array of attendees id's for the users id
    //some() returns true if any of its arguments returns true
    const isGoing = attendees && attendees.some(a => a.id === auth.uid);

    if(Object.keys(event).length === 0)return<NotFound/>
    return (
      <Fragment>
       <Responsive minWidth={800}> 
       <Grid>
         <Grid.Column width={10}>
           <EventDetailedHeader
            event={event}
            isGoing={isGoing}
            isHost={isHost}
            isUser={isUser}
            goingToEvent={goingToEvent}
            cancelGoingToEvent={cancelGoingToEvent}
          />
          <EventDetailedInfo event={event} />
          
        </Grid.Column>
        <Grid.Column width={6}>
            <EventDetailedSidebar attendees={attendees} />
          </Grid.Column>
      </Grid>
      </Responsive>
      
      <Responsive maxWidth={799}>    
        <div class="cards" className="centered">
          <EventDetailedHeader
            event={event}
            isGoing={isGoing}
            isHost={isHost}
            isUser={isUser}
            goingToEvent={goingToEvent}
            cancelGoingToEvent={cancelGoingToEvent}
          />
          <EventDetailedInfo event={event} />
        </div>  
        <div>     
          <EventDetailedSidebar attendees={attendees} />
        </div>
        </Responsive>
    </Fragment>
    );
  }
}

export default withFirestore(
  connect(
    mapState,
    actions
  )(EventDetailedPage)
);
