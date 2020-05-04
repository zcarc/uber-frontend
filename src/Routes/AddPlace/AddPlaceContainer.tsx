import React from "react";
import { RouteComponentProps } from "react-router-dom";
import AddPlacePresenter from "./AddPlacePresenter";
import { addPlace, addPlaceVariables } from "src/types/api";
import { Mutation } from "react-apollo";
import { ADD_PLACE } from "./AddPlaceQuery";
import { toast } from "react-toastify";
import { GET_PLACES } from "src/sharedQueries";
import { Location } from "history";

interface IState {
  address: string;
  name: string;
  lat: number;
  lng: number;
}

interface MyState {
  lat?: number;
  lng?: number;
  address?: string;
}

interface LProps extends Location<MyState> {
  state: MyState;
}

interface IProps extends RouteComponentProps<any> {
  location: LProps;
}

class AddPlaceQuery extends Mutation<addPlace, addPlaceVariables> {}

class AddPlaceContainer extends React.Component<IProps, IState> {
  public state = {
    address: "",
    name: "",
    lat: 0,
    lng: 0,
  };

  constructor(props: IProps) {
    super(props);

    const {
      location: {
        state: { address = "", lat = 0, lng = 0 } = {},
      },
    } = props;

    this.state = {
      address: address || "",
      name: "",
      lat: lat || 0,
      lng: lng || 0,
    };
  }

  public render() {
    const { address, name, lat, lng } = this.state;
    const { history } = this.props;
    return (
      <AddPlaceQuery
        mutation={ADD_PLACE}
        onCompleted={(data) => {
          const { AddPlace } = data;
          if (AddPlace.ok) {
            toast.success("Place added!");
            setTimeout(() => {
              history.push("/places");
            }, 2000);
          } else {
            toast.error(AddPlace.error);
          }
        }}
        refetchQueries={[{ query: GET_PLACES }]}
        variables={{
          address,
          isFav: false,
          lat,
          lng,
          name,
        }}
      >
        {(addPlaceFn, { loading }) => (
          <AddPlacePresenter
            onInputChange={this.onInputChange}
            address={address}
            name={name}
            loading={loading}
            onSubmit={addPlaceFn}
            pickedAddress={lat !== 0 && lng !== 0}
          />
        )}
      </AddPlaceQuery>
    );
  }

  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = async (
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

export default AddPlaceContainer;
