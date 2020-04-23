import Proptypes from "prop-types";
import React from "react";

interface IProps {
  isLoggedIn: boolean;
}

const AppPresenter: React.SFC<IProps> = ({ isLoggedIn }) =>
  isLoggedIn ? <span>you are in</span> : <span>your are out</span>;

AppPresenter.propTypes = {
  isLoggedIn: Proptypes.bool.isRequired,
};

export default AppPresenter;
