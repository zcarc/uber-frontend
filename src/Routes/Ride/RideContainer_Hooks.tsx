import React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  userProfile,
  updateRide,
  updateRideVariables,
} from "src/types/api";
import { GET_RIDE, RIDE_SUBSCRIPTION, UPDATE_RIDE_STATUS } from "./RideQueries";
import { USER_PROFILE } from "src/sharedQueries";
import { useQuery, useMutation } from "@apollo/react-hooks";
import RidePresenterHooks from "./RidePresenter_Hooks";

interface IProps extends RouteComponentProps<any> {
  props
}

const RideContainer: React.SFC<IProps> = ({ props }) => {

  const { data: userData } = useQuery<userProfile>(USER_PROFILE);

  const { data, loading, subscribeToMore } = useQuery(GET_RIDE, {
    variables: { rideId: parseInt(props?.match?.params?.rideId) },
  });

  const [updateRideFn] = useMutation<updateRide, updateRideVariables>(
    UPDATE_RIDE_STATUS
  );
  return (
    <RidePresenterHooks
      userData={userData}
      loading={loading}
      data={data}
      updateRideFn={updateRideFn}
      rideSubscription={() =>
        subscribeToMore({
          document: RIDE_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }
            const {
              data: {
                RideStatusSubscription: { status },
              },
            } = subscriptionData;

            if (status === "FINISHED") {
              window.location.href = "/";
            }
          },
        })
      }
    />
  );
};
export default RideContainer;
