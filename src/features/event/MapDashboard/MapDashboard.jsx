import React, { Component } from "react";

import axios from "axios";

class Map extends Component {
  state = {
    HelsinkiEvents: [],
    UserCreatedEvents: []
  };

  componentDidMount() {
    this.getHelsinkiEvents();
    this.getUserCreatedEvents();
  }

  renderMap = () => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${
        process.env.REACT_APP_GOOGLE_KEY
      }&callback=initMap`
    );
    window.initMap = this.initMap;
  };

  getHelsinkiEvents = () => {
    const endPoint =
      "https://api.hel.fi/linkedevents/v1/place/?page_size=30&event=true";

    axios
      .get(endPoint)
      .then(response => {
        this.setState(
          {
            HelsinkiEvents: response.data.data
          },
          this.renderMap()
        );
      })
      .catch(error => {
        console.log("Error: " + error);
      });
  };

  getUserCreatedEvents = () => {
    const endPoint =
      "https://firestore.googleapis.com/v1/projects/eventsnearme-e5981/databases/(default)/documents/events";

    axios
      .get(endPoint)
      .then(response => {
        //console.log(response.data.documents);
        this.setState(
          {
            UserCreatedEvents: response.data.documents
          },
          this.renderMap()
        );
      })
      .catch(error => {
        console.log("Error: " + error);
      });
  };

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 60.170992, lng: 24.940776 },
      zoom: 13
    });

    //creating infowindow
    let infowindow = new window.google.maps.InfoWindow();

    this.state.HelsinkiEvents.map(event => {
      let contentString = `<h3>${event.name.en}</h3>` 

      if (event.position === null) {
        let marker = new window.google.maps.Marker({
          position: {
            lat: 0,
            lng: 0
          }
        });
      } else {
        let marker = new window.google.maps.Marker({
          position: {
            lat: event.position.coordinates[1],
            lng: event.position.coordinates[0]
          },
          map: map,
          title: event.name.en
        });
        //open infowindow on markerclick
        marker.addListener("click", function() {
          infowindow.setContent(contentString);
          infowindow.open(map, marker);
        });
      }
    });

    

    
    // ////creating markers from user created evevnts
    this.state.UserCreatedEvents.map(event => {
      //console.log(event.fields.venueLatLng.mapValue)
      let eventType = event.fields.category.stringValue;
      let eventId = event.name.slice(-20);
      let contentString = `
        <h3>${event.fields.title.stringValue}</h3>
        <p><b>Category:</b>  ${eventType}</p>
        <p>${event.fields.description.stringValue}</p>
        <a href="./events/${eventId}" <p>Event Page for more information </p></a>
        `;
        const basePath = "https://jacobpotterf.com/css/img/"
        const icons = {
          food:{
            icon: basePath+"food.png"
          },
          drinks:{
            icon: basePath+"drink.png"
          },
          film:{
            icon: basePath+"film.png"
          },
          music:{
            icon: basePath+"music.png"
          },
          sport:{
            icon: basePath+"sport.png"
          },
          travel:{
            icon: basePath+"travel.png"
          },
          culture:{
            icon: basePath+"culture.png"
          }
        }   
        

        let icon ={
          url: icons[eventType].icon, // url
          scaledSize: new window.google.maps.Size(30, 30), // scaled size
          origin: new window.google.maps.Point(0,0), // origin
          anchor: new window.google.maps.Point(0, 0) // anchor
        }

        let marker = new window.google.maps.Marker({
            position: {
            lat: event.fields.venueLatLng.mapValue.fields.lat.doubleValue,
            lng: event.fields.venueLatLng.mapValue.fields.lng.doubleValue
            },  
            icon: icon,      
            title: event.title,
            map: map,
        });
        
    //open infowindow on markerclick
        marker.addListener("click", function() {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
        });
    });


  
    ////////
  };
  render() {
    return (
      <main>
        <div id='map' />
      </main>
    );
  }
}

function loadScript(url) {
  const index = window.document.getElementsByTagName("script")[0];
  const script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default Map;
