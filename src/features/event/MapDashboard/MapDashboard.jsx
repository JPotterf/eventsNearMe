import React, { Fragment } from "react";
import MainMap from "./MainMap";
import { Grid } from "semantic-ui-react";

const MapDashboard = () => {
  return (
    <Fragment className='mapDashboard'>
      <Grid>
        <Grid.Column width={16}>
          <MainMap />
        </Grid.Column>
      </Grid>
    </Fragment>
  );
};

export default MapDashboard;
