import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { database, firebaseAuth } from '../config/constants';
import Staging from './Staging';
import AddStaging from './AddStaging';

export default class App extends Component {

  constructor (props) {
    super(props);

    this.login = this.login.bind(this);
    this.hideErrors = this.hideErrors.bind(this);
    this.state = {
      isLoading: true,
      isAuthenticated: false,
      loadingStagings: true,
      user: null,
      showError: false,
      errorText: '',
      stagings: null
    };
  }

  componentWillMount () {
    firebaseAuth().onAuthStateChanged(user => {

      if (user) {

        if (!user || !user.email) {
          this.setState({
            isAuthenticated: false,
            isLoading: false
          });
        }

        if (user.email.split('@')[1] !== 'wingify.com') {
          this.setState({
            isAuthenticated: false,
            isLoading: false,
            showError: true,
            errorText: 'You need a @wingify.com email address to continue.'
          });
          setTimeout(() => {
            this.logout();
          }, 3000);
          return;
        }

        this.setState({
          isAuthenticated: true,
          isLoading: false,
          user,
        });
      } else {
        this.setState({
          isAuthenticated: false,
          isLoading: false
        });
      }
    });

    firebaseAuth().getRedirectResult().then(result => {

      if (!result.user || !result.user.email) {
        this.setState({
          isAuthenticated: false,
          isLoading: false
        });
        return;
      }

      if (result.user.email.split('@')[1] !== 'wingify.com') {
        this.setState({
          isAuthenticated: false,
          isLoading: false,
          showError: true,
          errorText: 'You need a @wingify.com email address to continue.'
        });
        setTimeout(() => {
          this.logout();
        }, 3000);
        return;
      }

      this.setState({
        isAuthenticated: true,
        isLoading: false,
        user: result.user
      });
    }).catch(error => {
      this.setState({
        showError: true,
        errorText: error.message
      });
    });

    database.ref('stagings').on('value', snapshot => {
      let stagings = [];
      snapshot.forEach(function(data) {
        stagings[data.key] = data.val();
      });
      this.setState({
        loadingStagings: false,
        stagings
      });
    });
  }
  
  hideErrors () {
    this.setState({
      showError: false
    });
  }

  login (e) {
    e.preventDefault();
    this.hideErrors();
    let provider = new firebaseAuth.GoogleAuthProvider();

    provider.addScope('https://www.googleapis.com/auth/plus.login');
    firebaseAuth().signInWithRedirect(provider);
  }

  logout (e) {
    if (e) {
      e.preventDefault();
    }
    firebaseAuth().signOut();
    this.setState({
      isAuthenticated: false,
      showError: false,
      errorText: ''
    });
  }

  render () {

    if (this.state.showError) {
      return (
        <div>
          <h2 className="text-danger">Something went wrong!</h2>
          <h3 className="text-danger">{this.state.errorText}</h3>

        </div>
      );
    }

    if (this.state.isLoading) {
      return (
        <h2>Loading..</h2>
      );
    }

    if (!this.state.isAuthenticated) {
      return (
        <h2>
          You need to <a href="#" onClick={this.login}>log in</a> to access this page.
        </h2>
      );
    }

    let displayStagings = '';
    if (this.state.stagings) {
      const stagings = this.state.stagings;
      displayStagings = Object.keys(stagings).map((k, i) => (
        <Staging staging={stagings[k]} key={'staging_' + i} user={this.state.user} firebaseKey={k} />
      ));
    } else if (this.state.loadingStagings) {
      displayStagings = (
        <div class="col-xs-12">
          <h4>Loading Stagings..</h4>
        </div>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="col-xs-12 col-lg-8">
            <h3>PushCrew Staging</h3>
          </div>
          <div className="col-xs-12 col-lg-4">
            <h3><a href="#" onClick={this.logout} className="pull-right">Log out</a></h3>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <h4>Stagings</h4>
          </div>
        </div>
        {displayStagings}
        <AddStaging />
      </div>
    );
  }
}