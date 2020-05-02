import React from "react";
import { RouteComponentProps } from "react-router-dom";
import EditAccountPresenter from "./EditAccountPresenter";
import { updateProfileVariables, updateProfile } from "src/types/api";
import { Mutation } from "react-apollo";
import { UPDATE_PROFILE } from "./EditAccountQueries";

interface IState {
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
}

interface IProps extends RouteComponentProps<any> {}

class UpdateProfileMutation extends Mutation<
  updateProfile,
  updateProfileVariables
> {}


class EditAccountContainer extends React.Component<IProps, IState> {
  public state = {
    email: "",
    firstName: "",
    lastName: "",
    profilePhoto: "",
  };
  public render() {
    const { email, firstName, lastName, profilePhoto } = this.state;
    return (
      <UpdateProfileMutation
        mutation={UPDATE_PROFILE}
        variables={{
          firstName,
          lastName,
          email,
          profilePhoto,
        }}
      >
        {(updateProfileFn, { loading }) => (
          <EditAccountPresenter
            email={email}
            firstName={firstName}
            lastName={lastName}
            profilePhoto={profilePhoto}
            onInputChange={this.onInputChange}
            loading={loading}
            onSubmit={updateProfileFn}
          />
        )}
      </UpdateProfileMutation>
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

export default EditAccountContainer;
