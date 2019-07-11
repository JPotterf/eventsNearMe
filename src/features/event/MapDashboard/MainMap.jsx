import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { Icon } from "semantic-ui-react";

//const AnyReactComponent = () => <Icon name='marker' size='big' color='red' />;

class MainMap extends Component {
  static defaultProps = {
    center: {
      lat: 60.168218,
      lng: 24.93795
    },
    zoom: 13
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "80vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "APIKEY" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          {/* <AnyReactComponent lat={latlng.lat} lng={latlng.lng} /> */}
        </GoogleMapReact>
      </div>
    );
  }
}

export default MainMap;
