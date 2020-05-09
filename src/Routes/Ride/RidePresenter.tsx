import React from "react";
import styled from "../../typed-components";
import { getRide, userProfile, updateRide, updateRideVariables, StatusOptions } from "src/types/api";
import { MutationFn } from "react-apollo";
import Button from "src/Components/Button";
import { Link } from "react-router-dom";

const Container = styled.div`
  padding: 40px;
`;

const Title = styled.h4`
  font-weight: 800;
  margin-top: 30px;
  margin-bottom: 10px;
  &:first-child {
    margin-top: 0;
  }
`;

const Data = styled.span`
  color: ${(props) => props.theme.blueColor};
`;

const Img = styled.img`
  border-radius: 50%;
  margin-right: 20px;
  max-width: 50px;
  height: 50px;
`;

const Passenger = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Buttons = styled.div`
  margin: 30px 0px;
`;

const ExtendedButton = styled(Button)`
  margin-bottom: 30px;
`;

interface IProps {
    data?: getRide;
    userData?: userProfile;
    loading: boolean;
    updateRideFn: MutationFn<updateRide, updateRideVariables>;
}

const RidePresenter: React.SFC<IProps> = ({
  data: { GetRide: { ride = null } = {} } = {},
  userData: { GetMyProfile: { user = null } = {} } = {},
  updateRideFn,
}) => (
  <Container>
    {ride && user && (
      <React.Fragment>
        <Title>탑승객</Title>
        <Passenger>
          <Img src={ride.passenger.profilePhoto!} />
          <Data>{ride.passenger.fullName!}</Data>
        </Passenger>
        {ride.driver && (
          <React.Fragment>
            <Title>운전자</Title>
            <Passenger>
              <Img src={ride.driver.profilePhoto!} />
              <Data>{ride.driver.fullName!}</Data>
            </Passenger>
          </React.Fragment>
        )}
        <Title>타는 곳</Title>
        <Data>{ride.pickUpAddress}</Data>
        <Title>내리는 곳</Title>
        <Data>{ride.dropOffAddress}</Data>
        <Title>가격</Title>
        <Data>{ride.price}원</Data>
        <Title>주행 거리</Title>
        <Data>{ride.distance}</Data>
        {/* <Title>소요 시간</Title>
        <Data>{ride.duration.replace(" mins", "분")}</Data> */}
        <Title>상태</Title>
        <Data>
          {ride.status === "REQUESTING" ? "승인 대기중..." : ride.status}
        </Data>
        <Buttons>
          {ride.driver &&
            ride.driver.id === user.id &&
            ride.status === "ACCEPTED" && (
              <ExtendedButton
                value={"Picked Up"}
                onClick={() =>
                  updateRideFn({
                    variables: {
                      rideId: ride.id,
                      status: "ONROUTE" as StatusOptions,
                    },
                  })
                }
              />
            )}
          {ride.driver &&
            ride.driver.id === user.id &&
            ride.status === "ONROUTE" && (
              <ExtendedButton
                value={"Finished"}
                onClick={() =>
                  updateRideFn({
                    variables: {
                      rideId: ride.id,
                      status: "FINISHED" as StatusOptions,
                    },
                  })
                }
              />
            )}
          {ride.status !== "REQUESTING" && (
            <Link to={`/chat/${ride.chatId}`}>
              <ExtendedButton value={"Chat"} onClick={null} />
            </Link>
          )}
        </Buttons>
      </React.Fragment>
    )}
  </Container>
);

export default RidePresenter;
