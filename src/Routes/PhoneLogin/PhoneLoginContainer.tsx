import React, { ChangeEventHandler } from "react";
import { Mutation, MutationUpdaterFn } from "react-apollo";
import PhoneLoginPresenter from "./PhoneLoginPresenter";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { PHONE_SIGN_IN } from "./PhoneQueries.queries";
import { StartPhoneVerificationVariables, StartPhoneVerification } from "src/types/api";

interface IState {
  countryCode: string;
  phoneNumber: string;
}

class PhoneSignInMutation extends Mutation<StartPhoneVerification, StartPhoneVerificationVariables> {}

class PhoneLoginContainer extends React.Component<
  RouteComponentProps<any>,
  IState
> {
  public state = {
    countryCode: "+82",
    phoneNumber: "",
  };

  public render() {
    const { countryCode, phoneNumber } = this.state;
    return (
      <PhoneSignInMutation
        mutation={PHONE_SIGN_IN}
        variables={{
          phoneNumber: `${countryCode}${phoneNumber}`,
        }}
        update={this.afterSubmit}
      >
        {(mutation, { loading }) => {
          const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
            event.preventDefault();

            const isValid = /^\+[1-9]{1}[0-9]{7,11}$/.test(
              `${countryCode}${phoneNumber}`
            );

            if (isValid) {
              mutation();
            } else {
              toast.error("Please write a valid phone number");
            }
          };

          return (
            <PhoneLoginPresenter
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onInputChange={this.onInputChange}
              onSubmit={onSubmit}
              loading={loading}
            />
          );
        }}
      </PhoneSignInMutation>
    );
  }
  public onInputChange: ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (event) => {
    const {
      target: { name, value },
    } = event;

    this.setState({
      [name]: value,
    } as any);
  };

  public afterSubmit: MutationUpdaterFn = (cache, data) => {
    console.log(data);
  };
}

export default PhoneLoginContainer;
