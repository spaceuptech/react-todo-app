import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SignIn from './pages/sign-in/SignIn'
import SignUp from './pages/sign-up/SignUp'
import Todo from './pages/todo/Todo'

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/todo" component={Todo} />
      </Router>
    </div>
  );
}

export default App;
