import React, { Component } from "react";
import { connect } from "react-redux";
import { incrementCounter, decrementCounter } from "./testAction";
import { Button } from "semantic-ui-react";

const mapState = state => ({
  data: state.test.data
});

const actions = {
  incrementCounter,
  decrementCounter
};

class TestComponent extends Component {
  render() {
    const { data, incrementCounter, decrementCounter } = this.props;
    return (
      <div>
        <h1>Test Components</h1>
        <h3>answer is: {data}</h3>
        <Button onClick={incrementCounter} positive content='Increment' />
        <Button onClick={decrementCounter} negative content='Decrement' />
      </div>
    );
  }
}

//higher order function connect is passed mapState as paremeter
//gets data from mapState()
//returns new component with properties from store -> TestComponent
export default connect(
  mapState,
  actions
)(TestComponent);
