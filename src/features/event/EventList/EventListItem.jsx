import React, { Component } from "react";
import { Segment, Item, List, Button, Label, Responsive } from "semantic-ui-react";
import EventListAttendee from "./EventListAttendee";
import { Link } from "react-router-dom";
import { format } from "date-fns";

class EventListItem extends Component {
  render() {
    const { event } = this.props;
    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
            <Responsive minWidth={720}>
              <Item.Image style={{margin:".5em"}} size='tiny' circular src={event.hostPhotoURL} />
            </Responsive>  
              <Item.Content style={{margin:".5em"}} >
                <Item.Header >{event.title}</Item.Header>
                <Item.Description>Hosted by {event.hostedBy}</Item.Description>
                <Item.Description>
                  {format(event.date.toDate(), "EEEE do LLLL")} at{" "}
                  {format(event.date.toDate(), "h:mm a")}
                </Item.Description>
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
            {/* firebase db saves attendees as object  */}
            {/* index === index of array in db */}
            {event.attendees &&
              Object.values(event.attendees).map((attendee, index) => (
                <EventListAttendee key={index} attendee={attendee} />
              ))}
          </List>
        </Segment>
        <Segment clearing>
          <div>
            <span>{event.description}</span>
          </div>      
          <Button 
            style={{margin:"1.5em"}}
            as={Link}
            to={`/events/${event.id}`}
            color= "blue"
            floated='right'
            content='View The Event Details'
          />
        </Segment>
      </Segment.Group>
    );
  }
}

export default EventListItem;
