import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...props }) => {
  const calc = props.loggedIn
      ? <Component {...props} />
      : <Redirect to="/sign-in" />

/*const calc = () => props.loggedIn ? <Component {...props} /> : <Redirect to="/sign-in" />*/
 /* const testtest = testMain()*/

  return (
      <Route exact path={props.path}>
        {calc}
      </Route>
  );
};

export default ProtectedRoute;