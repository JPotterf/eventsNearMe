import { createReducer } from "../../app/common/util/reducerUtils";
import {
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  FETCH_EVENTS
} from "./eventConstants";

const initialState = [];

const createEvent = (state, payload) => {
  return [...state, payload.event];
};

//adds updated event to a new array created from filter
const updateEvent = (state, payload) => {
  return [
    ...state.filter(event => event.id !== payload.event.id),
    payload.event
  ];
};

const deleteEvent = (state, payload) => {
  return [...state.filter(event => event.id !== payload.eventId)];
};

//overwrites the initial state of empty array -> events with
//all events consumed from api
const fetchEvents = (state, payload) => {
  return payload.events;
};

export default createReducer(initialState, {
  [CREATE_EVENT]: createEvent,
  [UPDATE_EVENT]: updateEvent,
  [DELETE_EVENT]: deleteEvent,
  [FETCH_EVENTS]: fetchEvents
});
