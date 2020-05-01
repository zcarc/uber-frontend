import React from 'react';
import {RouteComponentProps} from 'react-router';
import HomePresenter from './HomePresenter';
import { userProfile } from 'src/types/api';
import { Query } from 'react-apollo';
import { USER_PROFILE } from 'src/sharedQueries';

interface IProps extends RouteComponentProps<any> {}

interface IState {
    isMenuOpen: boolean;
}

class ProfileQuery extends Query<userProfile> {}

class HomeContainer extends React.Component<IProps, IState> {
  public state = {
    isMenuOpen: false,
  };

  public render() {
    const { isMenuOpen } = this.state;
    return (
      <ProfileQuery query={USER_PROFILE}>
        <HomePresenter isMenuOpen={isMenuOpen} toggleMenu={this.toggleMenu} />;
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
}

export default HomeContainer;