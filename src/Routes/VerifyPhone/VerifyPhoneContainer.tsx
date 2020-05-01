import React from "react";
import { Mutation } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { verifyPhone, verifyPhoneVariables } from "../../types/api";
import VerifyPhonePresenter from "./VerifyPhonePresenter";
import { VERIFY_PHONE } from "./VerifyPhoneQueries";
import { toast } from "react-toastify";
import { LOG_USER_IN } from "src/sharedQueries";

interface IState {
  verificationKey: string;
  phoneNumber: string;
}

interface IProps extends RouteComponentProps<any> {
  location: any
}

class VerifyMutation extends Mutation<verifyPhone, verifyPhoneVariables> {}

class VerifyPhoneContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    if (!props.location.state) {
      props.history.push("/");
    }
      this.state = {
        verificationKey: "",
        phoneNumber: props.location.state.phone,
      };
  }
  public render() {
    const { verificationKey, phoneNumber } = this.state;
    return (
      // Mutation 안의 param logUserIn은 client query의 name과 일치해야함
      <Mutation mutation={LOG_USER_IN}>
        {(logUserIn) => (
          <VerifyMutation
            mutation={VERIFY_PHONE}
            variables={{
              key: verificationKey,
              phoneNumber,
            }}
            onCompleted={(data) => {
              const { CompletePhoneVerification } = data;

              if (CompletePhoneVerification.ok) {
                if (CompletePhoneVerification.token) {
                  logUserIn({
                    variables: {
                      token: CompletePhoneVerification.token,
                    },
                  });
                }
                toast.success("You're verified, loggin in now");
              } else {
                toast.error(CompletePhoneVerification.error);
              }
            }}
          >
            {(mutation, { loading }) => (
              <VerifyPhonePresenter
                onSubmit={mutation}
                onChange={this.onInputChange}
                verificationKey={verificationKey}
                loading={loading}
              />
            )}
          </VerifyMutation>
        )}
      </Mutation>
    );
  }

  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const {
      target: { name, value },
    } = event;
    this.setState({
      [name]: value,
    } as any);
  };
}


export default VerifyPhoneContainer;



// option 2

// 첫번째는 incoming props
// 두번째는 response props
// *여기의 response props는 client instruction이라서 response가 없음 그래서 any
// 만약 server api이고 response가 존재하면 generic type을 defenition 해야함
// export default graphql<IProps, any>(LOG_USER_IN, {
//   name: "logUserIn",
// })(VerifyPhoneContainer);

