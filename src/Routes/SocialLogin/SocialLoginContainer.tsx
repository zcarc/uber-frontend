import React from "react";
import SocialLoginPresenter from "./SocialLoginPresenter";
import { Mutation, MutationFn } from "react-apollo";
import { facebookConnect, facebookConnectVariables } from "src/types/api";
import { FACEBOOK_CONNECT } from "./SocialLoginQueries";
import { RouteComponentProps } from "react-router-dom";

class LoginMutation extends Mutation<facebookConnect, facebookConnectVariables> {}

interface IState {
  firstname: string;
  lastName: string;
  email?: string;
  fbId: string;
}

interface IProps extends RouteComponentProps<any> {}

class SocialLoginContainer extends React.Component<IProps, IState> {
  public mutation: MutationFn;
  public render() {
    const { firstname, lastName, email, fbId } = this.state;
    return (
      <LoginMutation
        mutation={FACEBOOK_CONNECT}
        variables={{ email, fbId, firstname, lastName }}
      >
        {(facebookConnect, { loading }) => {
          this.mutation = facebookConnect;
          return <SocialLoginPresenter loginCallback={this.callback} />;
        }}
      </LoginMutation>
    );
  }

  public callback = (fbData) => {
    this.setState({
      email: fbData.email,
    });
    this.mutation();
  };

}

export default SocialLoginContainer;
