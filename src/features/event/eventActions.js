import { FETCH_EVENTS } from "./eventConstants";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions";

import { toastr } from "react-redux-toastr";
import { createNewEvent } from "../../app/common/util/helpers";
import firebase from "../../app/config/firebase";

export const createEvent = event => {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    const user = firebase.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL;
    const newEvent = createNewEvent(user, photoURL, event);
    try {
      let createdEvent = await firestore.add("events", newEvent);
      // use event id and user id as event attendee object to stop user from
      //double attending an event
      await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: event.date,
        host: true
      });
      toastr.success("Success!", "Event Created");
      return createdEvent;
    } catch (error) {
      toastr.error("Oops", "Something went wrong");
    }
  };
};

export const updateEvent = event => {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    try {
      await firestore.update(`events/${event.id}`, event);
      toastr.success("Success!", "Event Updated");
    } catch (error) {
      toastr.error("Oops", "Something went wrong");
    }
  };
};

export const cancelToggle = (cancelled, eventId) => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  //if cancelled ==true || false -> modal message
  const message = cancelled
    ? "Would you like to cancel the event?"
    : "Would you like to reactive the event?";
  try {
    toastr.confirm(message, {
      onOk: async () =>
        await firestore.update(`events/${eventId}`, {
          //set firebase cancelled property to value of cancelled parameter
          cancelled: cancelled
        })
    });
  } catch (error) {
    console.log(error);
  }
};



export const goingToEvent = event => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firestore = getFirestore();
  const firebase = getFirebase();
  const user = firebase.auth().currentUser;
  const profile = getState().firebase.profile;
  const attendee = {
    going: true,
    joinDate: firestore.FieldValue.serverTimestamp(),
    photoURL: profile.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
    displayName: profile.displayName,
    host: false
  };
  try {
    await firestore.update(`events/${event.id}`, {
      //add new object into attendees object
      //attendees is appended with users id as new key entered into attendee object
      [`attendees.${user.uid}`]: attendee
    });
    await firestore.set(`event_attendee/${event.id}_${user.uid}`, {
      eventId: event.id,
      userUid: user.uid,
      eventDate: event.date,
      host: false
    });
    toastr.success("Success", "You've been added to the event");
  } catch (error) {
    console.log(error);
    toastr.error("Ooops", "The sign-up failed");
  }
};

export const cancelGoingToEvent = event => async (
  dispatch,
  getState,
  { getFirestore, getFirebase }
) => {
  const firestore = getFirestore();
  const firebase = getFirebase();
  const user = firebase.auth().currentUser;

  try {
    await firestore.update(`events/${event.id}`, {
      [`attendees.${user.uid}`]: firestore.FieldValue.delete()
    });
    await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
    toastr.success("Success", "You have been removed from the event");
  } catch (error) {
    console.log(error);
    toastr.error("Oops", "There has been an error");
  }
};

// lastEvent is last event returned that is displayed in event dashboard
// and used as a start point for all other events displayed in the dashboard
// orderd by event.date
export const getEventsForDashboard = lastEvent => async (
  dispatch,
  getState
) => {
  //let today = new Date();
  const firestore = firebase.firestore();
  const eventsRef = firestore.collection("events");
  try {
    dispatch(asyncActionStart());
    let startAfter =
      lastEvent &&
      (await firestore
        .collection("events")
        .doc(lastEvent.id)
        .get());
    let query;

    //building the firebase query
    //on initial load load all events from today ordered by date
    //on pagination event start at lastEvent prop.
    lastEvent
      ? (query = eventsRef
          // .where("date", ">=", today)
          .orderBy("date")
          .startAfter(startAfter)
          .limit(2))
      : (query = eventsRef
          // .where("date", ">=", today)
          .orderBy("date")
          .limit(3));
    //send the query
    let querySnap = await query.get();

    //if no events to retrieve break out of func
    if (querySnap.docs.length === 0) {
      dispatch(asyncActionFinish());
      return querySnap;
    }

    let events = [];
    //pushing every event recieved from the querySnap to the empty events array
    for (let i = 0; i < querySnap.docs.length; i++) {
      //data() retrieves all fields in documents as object
      let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
      events.push(evt);
    }
    //send the events array using eventReducer FETCH_EVENTS
    dispatch({ type: FETCH_EVENTS, payload: { events } });
    dispatch(asyncActionFinish());
    return querySnap;
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};

