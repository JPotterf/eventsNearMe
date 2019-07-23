import React, { Fragment } from "react";
import { Segment, Image, Item, Header, Button, } from "semantic-ui-react";

import { format } from "date-fns";



const eventImageStyle = {
  filter: "brightness(30%)"
};

const eventImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white"
};
const EventDetailedHeader = ({
  event,
  isHost,
  isGoing,
  cancelGoingToEvent,
  goingToEvent,
  isUser
}) => {
  return (
    <Segment.Group >
      <Segment basic attached='top' style={{  padding: "0" }}>
        <Image
          src={`/assets/categoryImages/${event.category}.jpg`}
          fluid
          style={eventImageStyle}
        />

        <Segment basic style={eventImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header 
                  content={event.title}
                  style={{color: "white" }}
                />
                <p>
                  {event.date && format(event.date.toDate(), "EEEE do LLLL")}
                </p>
                <p>
                  Hosted by <strong>{event.hostedBy}</strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>

      <Segment attached='bottom' clearing>
        {(!isHost && isUser) && (
          <Fragment>
            {isGoing ? (
              <Button onClick={() => cancelGoingToEvent(event)}>
                Cancel My Place
              </Button>
            ) : (
              <Button onClick={() => goingToEvent(event)}>
                Join The Event
              </Button>
            )}
          </Fragment>
        )}




        {/* 
        
        this feature is currently removed do to an unresolved date/timezone error.
        the manage event form populates with the existing event details however firebase
        stores the event.date as timestamp and it conflicts with the react-date-picker library, 
        causing an app breaking error on load. I'm working on a solution and will implement when resolved.
        {isHost && (  
          <Button
            as={Link}
            to={`/manage/${event.id}`}
            color='orange'
            floated='right'
          >
            Change your event details
          </Button>
        )} */}
      </Segment>

    </Segment.Group>
  );
};

export default EventDetailedHeader;
