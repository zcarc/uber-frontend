import React from "react";
import SocialLoginPresenter from "./SocialLoginPresenter";
import { Mutation, MutationFn } from "react-apollo";
import { facebookConnect, facebookConnectVariables, emailSignInVariables, emailSignIn } from "src/types/api";
import { FACEBOOK_CONNECT, EMAIL_SIGN_IN } from "./SocialLoginQueries";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { LOG_USER_IN } from "src/sharedQueriesClient";

class LoginMutation extends Mutation<facebookConnect, facebookConnectVariables> {}

class SignInMutation extends Mutation<emailSignIn, emailSignInVariables> {}

interface IState {
  firstName: string;
  lastName: string;
  email: string;
  fbId: string;
  password: string;
}

interface IProps extends RouteComponentProps<any> {}

class SocialLoginContainer extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      fbId: "",
      firstName: "",
      lastName: "",
      password: "",
    };
  }

  public facebookMutation:
    | MutationFn<facebookConnect, facebookConnectVariables>
    | any;

  public render() {
    const { email, password } = this.state;
    return (
      <Mutation mutation={LOG_USER_IN}>
        {(logUserIn) => (
          <LoginMutation
            mutation={FACEBOOK_CONNECT}
            onCompleted={(data) => {
              const { FacebookConnect } = data;
              if (FacebookConnect.ok) {
                logUserIn({
                  variables: {
                    token: FacebookConnect.token,
                  },
                });
              } else {
                toast.error(FacebookConnect.error);
              }
            }}
          >
            {(facebookMutation, { loading }) => (
              <SignInMutation
                mutation={EMAIL_SIGN_IN}
                variables={{
                  email,
                  password,
                }}
                onCompleted={(data) => {
                  const { EmailSignIn } = data;
                  if (EmailSignIn.ok) {
                    logUserIn({
                      variables: {
                        token: EmailSignIn.token,
                      },
                    });
                  } else {
                    toast.error(EmailSignIn.error);
                  }
                }}
              >
                {(SignInMutation) => {
                  this.facebookMutation = facebookMutation;
                  return (
                    <SocialLoginPresenter
                      loginCallback={this.loginCallback}
                      email={email}
                      password={password}
                      onChange={this.onChange}
                      onSubmit={SignInMutation}
                    />
                  );
                }}
              </SignInMutation>
            )}
          </LoginMutation>
        )}
      </Mutation>
    );
  }

  public loginCallback = (response) => {
    const { name, first_name, last_name, email, id, accessToken } = response;
    if (accessToken) {
      toast.success(`Welcome ${name}!`);
      this.facebookMutation({
        variables: {
          firstName: first_name,
          lastName: last_name,
          email,
          fbId: id,
        },
      });
    } else {
      toast.error("로그인할 수 없습니다. 😔");
    }
  };

  public onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    this.setState({
      [name]: value,
    } as any);
  };
}

export default SocialLoginContainer;
