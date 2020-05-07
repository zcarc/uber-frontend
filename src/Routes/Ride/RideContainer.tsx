import React from "react";
import RidePresenter from "./RidePresenter";
import { RouteComponentProps } from "react-router-dom";

interface IProps extends RouteComponentProps<any> {}

class RideContainer extends React.Component<IProps> {
  public render() {
    return <RidePresenter />;
  }
}
export default RideContainer;
