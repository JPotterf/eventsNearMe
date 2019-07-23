
const functions = require("firebase-functions");
const admin = require("firebase-admin");
//provides full read/write rights to the app
admin.initializeApp(functions.config().firebase);

const newActivity = (type, event, id) => {
  return {
    type: type,
    eventDate: newEvent.date,
    title: newEvent.title,
    hostedBy: newEvent.hostedBy,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    eventId: event.id
  };
};

exports.createActivity = functions.firestore
  .document("events/{eventId}")
  .onCreate(event => {
    //the event data document being created
    let newEvent = event.data();
    console.log(newEvent);

    const activity = newActivity("newEvent", newEvent, event.id);
    console.log(activity);
    return admin
      .firestore()
      .collection("activity")
      .add(activity) //firebase generates a random id
      .then(docRef => {
        return console.log("Activity created with ID:", docRef.id);
      })
      .catch(err => {
        return console.log("Error adding the activity", err);
      });
  });

//when an event is updated get prev. and updated event data, verify event is not cancelled, or if the
//prev and new event are the same, create new activiyt object, return admin function that creates the item in the
//activity collection in firebase
exports.cancelActivity = functions.firestore
  .document("events/{eventId}")
  .onUpdate((event, context) => {
    let updatedEvent = event.after.date();
    let previousEventData = event.before.date();
    console.log({ event });
    console.log({ context });
    console.log({ updatedEvent });
    console.log({ previousEventData });
    //only run if the event is cancelled
    if (
      !updatedEvent.cancelled ||
      updatedEvent.cancelled === previousEventData.cancelled
    )
      return false;

    const activity = newActivity(
      "cancelledEvent",
      updatedEvent,
      context.params.eventId
    );
    console.log({ activity });
    return admin
      .firestore()
      .collection("activity")
      .add(activity) //firebase generates a random id
      .then(docRef => {
        return console.log("Activity created with ID:", docRef.id);
      })
      .catch(err => {
        return console.log("Error adding the activity", err);
      });
  });
