import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header";
import Message from "./components/Message";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Message>Hello there</Message>
      </div>
    );
  }
}

export default App;
