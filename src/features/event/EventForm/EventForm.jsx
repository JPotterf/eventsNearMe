/*global google */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";
import { Segment, Form, Button, Grid, Header, Responsive } from "semantic-ui-react";
import { withFirestore } from "react-redux-firebase";
import { createEvent, updateEvent, cancelToggle } from "../eventActions";
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import DateInput from "../../../app/common/form/DateInput";
import PlaceInput from "../../../app/common/form/PlaceInput";

const mapState = (state, ownProps) => {
  const eventId = ownProps.match.params.id;

  let event = {};

  if (
    state.firestore.ordered.events &&
    state.firestore.ordered.events.length > 0
  ) {
    event =
      state.firestore.ordered.events.filter(event => event.id === eventId)[0] ||
      {}; //OR statement stops event from being assigned as undefined
  }

  return {
    initialValues: event,
    event
  };
};

const actions = {
  createEvent,
  updateEvent,
  cancelToggle
};

const validate = combineValidators({
  title: isRequired({ message: "The event title is required" }),
  category: isRequired({ message: "The catagory is required" }),
  description: composeValidators(
    isRequired({ message: "Please provide description of the event" }),
    hasLengthGreaterThan(2)({
      message: "Please provide a description at least 3 characters long"
    })
  )(),
  venue: isRequired("venue"),
  date: isRequired("date")
});

const category = [
  { key: "drinks", text: "Drinks", value: "drinks" },
  { key: "culture", text: "Culture", value: "culture" },
  { key: "film", text: "Film", value: "film" },
  { key: "food", text: "Food", value: "food" },
  { key: "music", text: "Music", value: "music" },
  { key: "sport", text: "Sport", value: "sport"}
];

class EventForm extends Component {
  state = {
    cityLatLng: {},
    venueLatLng: {lat:0,lng:0}
  };

  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`events/${match.params.id}`);
  }

  async componentWillUnmount() {
    //setListener  (above) resulted in a listener that does not self-delete like a higher order
    //connect function. unsetListerner() is required to clear any setListener() instances
    //when component unmounts(user leaves the page) firestore.listener will killself
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }

  onFormSubmit = async values => {
    values.venueLatLng = this.state.venueLatLng;
    try {
      if (this.props.initialValues.id) {
        //checking the venueLatLng object has latlng
        if (Object.keys(values.venueLatLng).length === 0) {
          values.venueLatLng = this.props.event.venueLatLng;
        }
        this.props.updateEvent(values);
        this.props.history.push(`/events/${this.props.initialValues.id}`);
      } else {
        let createdEvent = await this.props.createEvent(values);
        this.props.history.push(`/events/${createdEvent.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleVenueSelect = selectedVenue => {
    geocodeByAddress(selectedVenue)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          venueLatLng: latlng 
        });
      })
      .then(() => {
        this.props.change("venue", selectedVenue);
      });
  };

  render() {
    const {
      history,
      initialValues,
      invalid,
      submitting,
      pristine,
      event,
      cancelToggle
    } = this.props;
    return (
      <Fragment>
        <Responsive minWidth={800}>
          <Grid>
            <Grid.Column className="centered" width={10}>
              <Segment>
                <Header color='teal' align='center' content='Event Details' />
                <Form
                  onSubmit={this.props.handleSubmit(this.onFormSubmit)}
                  autoComplete='off'
                >
                  <Field
                    name='title'
                    component={TextInput}
                    placeholder='Event Title'
                  />
                  <Field
                    name='category'
                    component={SelectInput}
                    options={category}
                    placeholder='Type of Event'
                  />
                  <Field
                    name='description'
                    component={TextArea}
                    rows={3}
                    placeholder='Describe The Event'
                  />
                  <Header
                    color='teal'
                    align='center'
                    content='Helsinki Event Location Details'
                  />

                  <Field
                    name='venue'
                    component={PlaceInput}
                    options={{
                      location: new google.maps.LatLng(60.170992, 24.940776),
                      //Hard coded Helsinki latlng,
                      radius: 1000,
                      types: ["establishment"]
                    }}
                    onSelect={this.handleVenueSelect}
                    placeholder='Helsinki Venue...'
                  />
                  <Field
                    name='date'
                    component={DateInput}
                    dateFormat='dd LLLL yyyy h:mm a'
                    showTimeSelect
                    timeFormat='HH:mm'
                    placeholder='Event Date?'
                  />

                  <Button
                    disabled={invalid || submitting || pristine}
                    positive
                    type='submit'
                  >
                    Submit
                  </Button>
                  <Button
                    type='button'
                    onClick={
                      initialValues.id
                        ? () => history.push(`/events/${initialValues.id}`)
                        : () => history.push("/events")
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    type='button'
                    color={event.cancelled ? "green" : "red"}
                    floated='right'
                    content={event.cancelled ? "Reactivate Event" : "Cancel Event"}
                    onClick={() => cancelToggle(!event.cancelled, event.id)}
                  />
                </Form>
              </Segment>
            </Grid.Column>
          </Grid>
        </Responsive>
        <Responsive maxWidth={799}>
          <div class="cards" className='centered'>
              <Segment>
                <Header color='teal' align='center' content='Event Details' />
                <Form
                  onSubmit={this.props.handleSubmit(this.onFormSubmit)}
                  autoComplete='off'
                >
                  <Field
                    name='title'
                    component={TextInput}
                    placeholder='Event Title'
                  />
                  <Field
                    name='category'
                    component={SelectInput}
                    options={category}
                    multiple={true}
                    placeholder='Type of Event'
                  />
                  <Field
                    name='description'
                    component={TextArea}
                    rows={3}
                    placeholder='Describe The Event'
                  />
                  <Header
                    color='teal'
                    align='center'
                    content='Helsinki Event Location Details'
                  />

                  <Field
                    name='venue'
                    component={PlaceInput}
                    options={{
                      location: new google.maps.LatLng(60.170992, 24.940776),
                      //Hard coded Helsinki latlng,
                      radius: 1000,
                      types: ["establishment"]
                    }}
                    onSelect={this.handleVenueSelect}
                    placeholder='Whats the name of the venue location?'
                  />
                  <Field
                    name='date'
                    component={DateInput}
                    dateFormat='dd LLLL yyyy h:mm a'
                    showTimeSelect
                    timeFormat='HH:mm'
                    placeholder='Event Date?'
                  />

                  <Button
                    disabled={invalid || submitting || pristine}
                    positive
                    type='submit'
                  >
                    Submit
                  </Button>
                  <Button
                    type='button'
                    onClick={
                      initialValues.id
                        ? () => history.push(`/events/${initialValues.id}`)
                        : () => history.push("/events")
                    }
                  >
                    Cancel
                  </Button>

                </Form>
              </Segment>
          </div>
        </Responsive>  
      </Fragment>
    );
  }
}
//connect( ) takes reduxForm and EventForm as parameter.
//reduxForm() takes eventForm

export default withFirestore(
  connect(
    mapState,
    actions
  )(
    reduxForm({ form: "eventForm", validate, enableReinitialize: true })(
      EventForm
    )
  )
);
