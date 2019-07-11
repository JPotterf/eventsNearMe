import React, { Component } from "react";
import { Segment, Item, List, Button, Label } from "semantic-ui-react";
import EventListAttendee from "./EventListAttendee";
import { Link } from "react-router-dom";

class EventListItem extends Component {
  render() {
    const { event } = this.props;
    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size='tiny' circular src={event.hostPhotoURL} />
              <Item.Content>
                <Item.Header as='a'>{event.title}</Item.Header>
                <Item.Description>Hosted by {event.hostedBy}</Item.Description>
                <Item.Description>{event.date}</Item.Description>
                {event.cancelled && (
                  <Label
                    style={{ top: "-30px" }}
                    ribbon='right'
                    color='red'
                    content='This Event has been Cancelled'
                  />
                )}
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment secondary>
          <List horizontal>
            {/* firebase db saves attendees as object not array  */}
            {/* index === index of array in db */}
            {event.attendees &&
              Object.values(event.attendees).map((attendee, index) => (
                <EventListAttendee key={index} attendee={attendee} />
              ))}
          </List>
        </Segment>
        <Segment clearing>
          <span>{event.description}</span>

          <Button
            as={Link}
            to={`/events/${event.id}`}
            color='teal'
            floated='right'
            content='View The Event Details'
          />
        </Segment>
      </Segment.Group>
    );
  }
}

export default EventListItem;
