import React from "react";
import { Helmet } from "react-helmet";
import styled from "../../typed-components";
import Sidebar from "react-sidebar";
import Menu from "src/Components/Menu";
import Button from "src/Components/Button";
import AddressBar from "src/Components/AddressBar";
import { userProfile, requestRide, requestRideVariables, getRides, acceptRide, acceptRideVariables } from "src/types/api";
import { MutationFn } from "react-apollo";
import RidePopUp from "src/Components/RidePopUp";

const Container = styled.div``;

const MenuButton = styled.button`
  appearance: none;
  padding: 10px;
  position: absolute;
  top: 10px;
  left: 10px;
  text-align: center;
  font-weight: 800;
  border: 0;
  cursor: pointer;
  font-size: 20px;
  transform: rotate(90deg);
  z-index: 2;
  background-color: transparent;
`;

const Map = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

const ExtendedButton = styled(Button)`
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 10;
  height: auto;
  width: 80%;
`;

const RequestButton = styled(ExtendedButton)`
  bottom: 250px;
`;

interface IProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  loading: boolean;
  mapRef: any;
  toAddress: string;
  onAddressSubmit: () => void;
  price?: string;
  data?: userProfile;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  requestRideFn?: MutationFn<requestRide, requestRideVariables>,
  acceptRideFn?: MutationFn<acceptRide, acceptRideVariables>,
  nearbyRide?: getRides,
}

const HomePresenter: React.SFC<IProps> = ({
  isMenuOpen,
  toggleMenu,
  loading,
  toAddress,
  mapRef,
  onInputChange,
  onAddressSubmit,
  price,
  data: { GetMyProfile: { user = null } = {} } = {},
  requestRideFn,
  nearbyRide: { GetNearbyRide: { ride = null } = {} } = {},
  acceptRideFn,
}) => (
  <Container>
    <Helmet>
      <title>Home | Number</title>
    </Helmet>
    <Sidebar
      sidebar={<Menu />}
      open={isMenuOpen}
      onSetOpen={toggleMenu}
      styles={{
        sidebar: {
          width: "80%",
          backgroundColor: "white",
          zIndex: "10",
        },
      }}
    >
      {!loading && <MenuButton onClick={toggleMenu}>|||</MenuButton>}

      {user && !user.isDriving && (
        <>
          <AddressBar
            name={"toAddress"}
            onChange={onInputChange}
            value={toAddress}
            onBlur={null}
          />
          <ExtendedButton
            onClick={onAddressSubmit}
            disabled={toAddress === ""}
            value={price ? "Change Address" : "Pick Address"}
          />
        </>
      )}

      {price && (
        <RequestButton
          onClick={requestRideFn}
          disabled={toAddress === ""}
          value={`Request Ride ($${price})`}
        />
      )}
      {ride && (
        <RidePopUp
          id={ride.id}
          pickUpAddress={ride.pickUpAddress}
          dropOffAddress={ride.dropOffAddress}
          price={ride.price}
          distance={ride.distance}
          passengerName={ride.passenger.fullName!}
          passengerPhoto={ride.passenger.profilePhoto!}
          acceptRideFn={acceptRideFn}
        />
      )}
      <Map ref={mapRef} />
    </Sidebar>
  </Container>
);

export default HomePresenter;
