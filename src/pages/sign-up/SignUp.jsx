import React from 'react'
import './sign-up.css'
import logo from '../../images/logo-black.svg'
import { withRouter } from 'react-router-dom'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const Wrapper = withRouter(({ history }) => (
  <SignUp history={history} />
))

function SignUp(props) {
  return (
    <div className="sign-up">
      <div className="content">
        <img className="logo" src={logo} alt="" />
        <div className="sign-up-form">
          <p className="heading">SIGN UP</p>
          <form>
            <input type="text" name="Username" placeholder="Username" /><br />
            <input type="text" name="Email Address" placeholder="Email Address" /><br />
            <input type="text" name="Password" placeholder="Password" /><br />
            <div className="already-have-account">
              <div className="">Already have an account? </div>
              <Link to="/">
                <div id="orange">Sign in here</div>
              </Link>
            </div>
            <button className="sign-up-button" onClick={() => props.history.push('/Todo')}>Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Wrapper
