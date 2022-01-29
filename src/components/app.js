import { h } from "preact";
import { Router } from "preact-router";

// Code-splitting is automated for `routes` directory
import Editor from "../routes/editor";

const App = () => (
  <div id="app">
    <Router>
      <Editor path="/" />
    </Router>
  </div>
);

export default App;
