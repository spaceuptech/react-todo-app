import React from 'react'
import './sign-in.css'
import logo from '../../images/logo-black.svg'
import { withRouter } from 'react-router-dom'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const Wrapper = withRouter(({ history }) => (
  <SignIn history={history} />
))

function SignIn(props) {
  return (
    <div className="sign-in">
      <div className="content">
        <img className="logo" src={logo} alt="" />
        <div className="sign-in-form">
          <p className="heading">SIGN IN</p>
          <form>
            <input type="text" name="Email Address" placeholder="Email Address" /><br />
            <input type="text" name="Password" placeholder="Password" /><br />
            <div className="dont-have-account">
              <div className="">Don't have an account? </div>
              <Link to="/sign-up">
                <div id="orange">Sign up here</div>
              </Link>
            </div>
            <button className="sign-in-button" onClick={() => props.history.push('/Todo')}>Sign in</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Wrapper;
