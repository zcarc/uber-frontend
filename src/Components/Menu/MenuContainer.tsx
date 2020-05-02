import React from "react";
import MenuPresenter from "./MenuPresenter";
import { Query, Mutation } from "react-apollo";
import { userProfile, toggleDriving } from "src/types/api";
import { USER_PROFILE } from "src/sharedQueries";
import { TOGGLE_DRIVING } from "./MenuQueries";

class ProfileQuery extends Query<userProfile> {}
class ToggleDrivingMutation extends Mutation<toggleDriving> {}

class MenuContainer extends React.Component {
  public render() {
    
    return (
      <ToggleDrivingMutation
        mutation={TOGGLE_DRIVING}
        refetchQueries={[{ query: USER_PROFILE }]}
      >
        {(toggleDrivingFn) => (
          <ProfileQuery query={USER_PROFILE}>
            {({ data, loading }) => (
              <MenuPresenter
                data={data}
                loading={loading}
                toggleDrivingFn={toggleDrivingFn}
              />
            )}
          </ProfileQuery>
        )}
      </ToggleDrivingMutation>
    );
  }
}

export default MenuContainer;
