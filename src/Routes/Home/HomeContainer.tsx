import React from 'react';
import ReactDOM from "react-dom";
import { RouteComponentProps } from "react-router";
import HomePresenter from './HomePresenter';
import {
  userProfile,
  reportMovement,
  reportMovementVariables,
  getDrivers,
  requestRide,
  requestRideVariables,
  getRides,
  acceptRide,
  acceptRideVariables,
} from "src/types/api";
import { Query, graphql, MutationFn, Mutation } from 'react-apollo';
import { USER_PROFILE } from 'src/sharedQueries';
import { geoCode, reverseGeoCode } from 'src/mapHelpers';
import { toast } from 'react-toastify';
import {
  REPORT_LOCATION,
  GET_NEARBY_DRIVERS,
  REQUEST_RIDE,
  GET_NEARBY_RIDE,
  ACCEPT_RIDE,
  SUBSCRIBE_NEARBY_RIDES,
} from "./HomeQueries";
import { SubscribeToMoreOptions } from 'apollo-boost';

interface IProps extends RouteComponentProps<any> {
  google: any;
  reportLocation: MutationFn
}

interface IState {
  isMenuOpen: boolean;
  toAddress: string;
  toLat: number;
  toLng: number;
  lat: number;
  lng: number;
  distance: string;
  duration?: string;
  price?: number;
  fromAddress: string;
  isDriving: boolean;
}

class ProfileQuery extends Query<userProfile> {}
class NearbyQueries extends Query<getDrivers> {}
class RequestRideMutation extends Mutation<requestRide, requestRideVariables> {}
class GetNearbyRides extends Query<getRides> {}
class AcceptRide extends Mutation<acceptRide, acceptRideVariables> {}

class HomeContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map | any;
  public userMarker: google.maps.Marker | any;
  public toMarker: google.maps.Marker | any;
  public directions: google.maps.DirectionsRenderer | any;
  public drivers: google.maps.Marker[] | any;

  public state = {
    isDriving: false,
    fromAddress: "",
    isMenuOpen: false,
    lat: 0,
    lng: 0,
    toAddress: "대한민국 서울특별시 용산구 동자동 43-205 서울역",
    toLat: 0,
    toLng: 0,
    distance: "",
    duration: undefined,
    price: undefined,
  };

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.drivers = [];
  }
  public componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSuccess,
      this.handleGeoError
    );
  }

  public render() {
    const {
      isMenuOpen,
      toAddress,
      price,
      distance,
      fromAddress,
      lat,
      lng,
      toLat,
      toLng,
      duration,
      isDriving,
    } = this.state;
    return (
      <ProfileQuery query={USER_PROFILE} onCompleted={this.handleProfileQuery}>
        {({ data, loading }) => (
          <NearbyQueries
            query={GET_NEARBY_DRIVERS}
            pollInterval={5000}
            skip={isDriving}
            onCompleted={this.handleNearbyDrivers}
          >
            {() => (
              <RequestRideMutation
                mutation={REQUEST_RIDE}
                onCompleted={this.handleRideRequest}
                variables={{
                  distance,
                  pickUpAddress: fromAddress,
                  pickUpLat: lat,
                  pickUpLng: lng,
                  dropOffAddress: toAddress,
                  dropOffLat: toLat,
                  dropOffLng: toLng,
                  price: price || 0,
                  duration: duration || "",
                }}
              >
                {(requestRideFn) => (
                  <GetNearbyRides query={GET_NEARBY_RIDE} skip={!isDriving}>
                    {({ subscribeToMore, data: nearbyRide }) => {
                      const rideSubscriptionOptions: SubscribeToMoreOptions = {
                        document: SUBSCRIBE_NEARBY_RIDES,
                        updateQuery: (prev, { subscriptionData }) => {
                          if (!subscriptionData.data) {
                            return prev;
                          }
                          const newObject = Object.assign({}, prev, {
                            GetNearbyRide: {
                              ...prev.GetNearbyRide,
                              ride:
                                subscriptionData.data.NearbyRideSubscription,
                            },
                          });
                          return newObject;
                        },
                      };

                      if (isDriving) {
                        subscribeToMore(rideSubscriptionOptions);
                      }
                      return (
                        <AcceptRide
                          mutation={ACCEPT_RIDE}
                          onCompleted={this.handleRideAcceptance}
                        >
                          {(acceptRideFn) => (
                            <HomePresenter
                              loading={loading}
                              isMenuOpen={isMenuOpen}
                              toggleMenu={this.toggleMenu}
                              mapRef={this.mapRef}
                              toAddress={toAddress}
                              onInputChange={this.onInputChange}
                              price={price}
                              data={data}
                              onAddressSubmit={this.onAddressSubmit}
                              requestRideFn={requestRideFn}
                              nearbyRide={nearbyRide}
                              acceptRideFn={acceptRideFn}
                            />
                          )}
                        </AcceptRide>
                      );
                    }}
                  </GetNearbyRides>
                )}
              </RequestRideMutation>
            )}
          </NearbyQueries>
        )}
      </ProfileQuery>
    );
  }

  public toggleMenu = () => {
    this.setState((state) => {
      return {
        isMenuOpen: !state.isMenuOpen,
      };
    });
  };

  public handleGeoSuccess = (positon: Position) => {
    const {
      coords: { latitude, longitude },
    } = positon;

    this.setState({
      lat: latitude,
      lng: longitude,
    });
    this.getFromAdress(latitude, longitude);
    this.loadMap(latitude, longitude);
  };

  public getFromAdress = async (lat: number, lng: number) => {
    const address = await reverseGeoCode(lat, lng);
    if (address) {
      this.setState({
        fromAddress: address,
      });
    }
  };

  public loadMap = (lat, lng) => {
    const { google } = this.props;
    const maps = google.maps;
    const mapNode = ReactDOM.findDOMNode(this.mapRef.current);

    if (!mapNode) {
      this.loadMap(lat, lng);
      return;
    }

    const mapConfig: google.maps.MapOptions = {
      center: {
        lat,
        lng,
      },

      disableDefaultUI: true,
      zoom: 13,
    };

    this.map = new maps.Map(mapNode, mapConfig);

    const userMarkerOptions: google.maps.MarkerOptions = {
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
      },
      position: {
        lat,
        lng,
      },
    };

    this.userMarker = new maps.Marker(userMarkerOptions);
    this.userMarker.setMap(this.map);

    const watchOptions: PositionOptions = {
      enableHighAccuracy: true,
    };

    navigator.geolocation.watchPosition(
      this.handleGeoWatchSuccess,
      this.handleGeoWatchError,
      watchOptions
    );
  };

  public handleGeoWatchSuccess = (position: Position) => {
    const { reportLocation } = this.props;
    const {
      coords: { latitude, longitude },
    } = position;

    this.userMarker.setPosition({ lat: latitude, lng: longitude });
    this.map.panTo({ lat: latitude, lng: longitude });
    reportLocation({
      variables: {
        lat: parseFloat(latitude.toFixed(10)),
        lng: parseFloat(longitude.toFixed(10)),
      },
    });
  };

  public handleGeoWatchError = () => {
    console.log("Error watching you");
  };

  public handleGeoError = () => {
    console.log("No location");
  };

  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    this.setState({
      [name]: value,
    } as any);
  };

  public onAddressSubmit = async () => {
    const { toAddress } = this.state;
    const { google } = this.props;
    const maps = google.maps;
    const result = await geoCode(toAddress);

    if (result !== false) {
      const { lat, lng, formatted_address: formatedAddress } = result;

      if (this.toMarker) {
        this.toMarker.setMap(null);
      }

      const toMarkerOptions: google.maps.MarkerOptions = {
        position: {
          lat,
          lng,
        },
      };

      this.toMarker = new maps.Marker(toMarkerOptions);
      this.toMarker.setMap(this.map);

      const bounds = new maps.LatLngBounds();
      bounds.extend({ lat, lng });
      bounds.extend({ lat: this.state.lat, lng: this.state.lng });
      this.map.fitBounds(bounds);

      this.setState(
        {
          toAddress: formatedAddress,
          toLat: lat,
          toLng: lng,
        },
        this.createPath
      );
    }
  };

  public createPath = () => {
    const { toLat, toLng, lat, lng } = this.state;

    if (this.directions) {
      this.directions.setMap(null);
    }

    const renderOptions: google.maps.DirectionsRendererOptions = {
      polylineOptions: {
        strokeColor: "#000",
      },
      suppressMarkers: true,
    };

    this.directions = new google.maps.DirectionsRenderer(renderOptions);
    const directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();
    const to = new google.maps.LatLng(toLat, toLng);
    const from = new google.maps.LatLng(lat, lng);

    const directionsOptions: google.maps.DirectionsRequest = {
      destination: to,
      origin: from,
      travelMode: google.maps.TravelMode.TRANSIT,
    };

    directionsService.route(directionsOptions, this.handleRouteRequest);
  };

  public handleRouteRequest = (
    result: google.maps.DirectionsResult,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === google.maps.DirectionsStatus.OK) {
      const { routes } = result;
      const {
        distance: { text: distance },
        duration: { text: duration },
      } = routes[0].legs[0];

      this.directions.setDirections(result);
      this.directions.setMap(this.map);

      this.setState(
        {
          distance,
          duration,
        },
        this.setPrice
      );
    } else {
      toast.error("There is no route there, you have to swim");
    }
  };

  public setPrice = () => {
    const { distance } = this.state;
    console.log(distance);
    if (distance) {
      this.setState({
        price: parseFloat(
          (parseFloat(distance.replace(",", "")) * 3 * 1000).toFixed(2)
        ),
      });
    }
  };

  public handleNearbyDrivers = (data: {} | getDrivers) => {
    if ("GetNearbyDrivers" in data) {
      const {
        GetNearbyDrivers: { drivers, ok },
      } = data;

      if (ok && drivers) {
        for (const driver of drivers) {
          if (driver && driver.lastLat && driver.lastLng) {
            const exisitingDriver:
              | google.maps.Marker
              | undefined = this.drivers.find(
              (driverMarker: google.maps.Marker) => {
                const markerID = driverMarker.get("ID");
                return markerID === driver.id;
              }
            );

            if (exisitingDriver) {
              exisitingDriver.setPosition({
                lat: driver.lastLat,
                lng: driver.lastLng,
              });
              exisitingDriver.setMap(this.map);
            } else {
              const markerOptions: google.maps.MarkerOptions = {
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 5,
                },
                position: {
                  lat: driver.lastLat,
                  lng: driver.lastLng,
                },
              };
              const newMarker: google.maps.Marker = new google.maps.Marker(
                markerOptions
              );
              newMarker.set("ID", driver.id);
              newMarker.setMap(this.map);
              this.drivers.push(newMarker);
            }
          }
        }
      }
    }
  };

  public handleRideRequest = (data: requestRide) => {
    const { history } = this.props;
    const { RequestRide } = data;
    if (RequestRide.ok) {
      toast.success("Drive requested, fiding a driver");
      history.push(`/ride/${RequestRide.ride!.id}`);
    } else {
      toast.error(RequestRide.error);
    }
  };

  public handleProfileQuery = (data: userProfile) => {
    const { GetMyProfile } = data;
    if (GetMyProfile.user) {
      const {
        user: { isDriving },
      } = GetMyProfile;
      if (isDriving) {
        this.setState({ isDriving });
      }
    }
  };

  public handleRideAcceptance = (data: acceptRide) => {
    const {history} = this.props;
    const { UpdateRideStatus } = data;
    if (UpdateRideStatus.ok) {
      history.push(`/ride/${UpdateRideStatus.rideId}`);
    }
  };
}

export default graphql<any, reportMovement, reportMovementVariables>(REPORT_LOCATION, {
  name: "reportLocation"
})(HomeContainer);