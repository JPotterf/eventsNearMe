//firebase returns attendees list as object.
//this converts object to array
export const objectToArray = object => {
  if (object) {
    //returns new array then assigns into empty object copies from e.index1 and takes
    //another source into new object for id -> id.e.indexPosition
    return Object.entries(object).map(e =>
      Object.assign({}, e[1], { id: e[0] })
    );
  }
};
//  //date: firebase.firestore.Timestamp.fromDate(event.date)
export const createNewEvent = (user, photoURL, event) => {
  return {
    ...event,
    date: new Date(event.date),
    hostUid: user.uid,
    hostedBy: user.displayName,
    hostPhotoURL: photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
    created: new Date(),
    attendees: {
      [user.uid]: {
        going: true,
        joinDate: Date.now(),
        photoURL: photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
        displayName: user.displayName,
        host: true
      }
    }
  };
};
