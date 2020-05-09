import React from "react";
import styled from "../../typed-components";
import Button from "../Button";

interface IProps {
  pickUpAddress: string;
  dropOffAddress: string;
  price: number;
  distance: string;
  passengerName: string;
  passengerPhoto: string;
  acceptRideFn: any;
  id: number;
}

const Container = styled.div`
  background-color: white;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 80%;
  height: 50%;
  z-index: 9;
  padding: 20px;
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
  width: 41px;
  height: 41px;
`;

const Passenger = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ExtendedButton = styled(Button)`
  border-radius: 10px;
  background-color: dodgerblue;
`;

const RidePopUp: React.SFC<IProps> = ({
  pickUpAddress,
  dropOffAddress,
  price,
  distance,
  passengerName,
  passengerPhoto,
  acceptRideFn,
  id,
}) => (
  <Container>
    <Title>타는 곳</Title>
    <Data>{pickUpAddress}</Data>
    <Title>내리는 곳</Title>
    <Data>{dropOffAddress}</Data>
    <Title>가격</Title>
    <Data>{price}원</Data>
    <Title>주행 거리</Title>
    <Data>{distance}</Data>
    <Title>탑승객:</Title>
    <Passenger>
      <Img src={passengerPhoto} />
      <Data>{passengerName}</Data>
    </Passenger>
    <ExtendedButton
      onClick={() => acceptRideFn({ variables: { rideId: id } })}
      value={"탑승요청 승인"}
    />
  </Container>
);

export default RidePopUp;
