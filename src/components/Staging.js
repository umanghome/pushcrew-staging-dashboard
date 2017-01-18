import React, { Component } from 'react';
import { database } from '../config/constants';

export default class Staging extends Component {
  constructor (props) {
    super(props);

    this.claimStaging = this.claimStaging.bind(this);
    this.releaseStaging = this.releaseStaging.bind(this);
    this.state = {
      purpose: ''
    };
  }

  claimStaging (e) {
    if (e) {
      e.preventDefault();
    }
    database.ref('stagings/' + this.props.firebaseKey).update({
      free: false,
      occupant: this.props.user.displayName,
      purpose: this.state.purpose,
      occupant_email: this.props.user.email
    });
    this.setState({
      purpose: ''
    });
  }

  releaseStaging (e) {
    if (e) {
      e.preventDefault();
    }
    database.ref('stagings/' + this.props.firebaseKey).update({
      free: true,
      occupant: '',
      purpose: '',
      occupant_email: ''
    });
  }

  render () {

    let occupiedBy = '';
    if (!this.props.staging.free) {
      occupiedBy = (
        <span>
          In use by {this.props.staging.occupant}
        </span>
      );
    } else {
      occupiedBy = (
          <strong>Unused</strong>
      )
    }

    let claim = '';
    if (this.props.staging.free) {
      claim = (
        <div className="col-xs-12">
          <div className="form-group">
            <input className="form-control" placeholder="What do you want to use this staging for?" value={this.state.purpose} onChange={e => { this.setState({purpose: e.target.value}); }} />
          </div>
          <button className="btn btn-primary btn-sm" disabled={this.state.purpose.length < 1} onClick={this.claimStaging}>
            Use Staging
          </button>
        </div>
      );
    } else if (this.props.staging.occupant_email === this.props.user.email) {
      claim = (
        <div className="col-xs-12">
          <button className="btn btn-primary btn-sm" onClick={this.releaseStaging}>
            Release Staging
          </button>
        </div>
      );
    }

    let beingUsedFor = '';
    if (!this.props.staging.free) {
      beingUsedFor = (
        <p>
          Staging being used for: {this.props.staging.purpose}
        </p>
      );
    }

    return (
      <div className="row" style={{marginBottom: '15px'}}>
        <div className="col-xs-12">
          <p>
            <strong>{this.props.staging.name}</strong> - {occupiedBy}
          </p>
          <p>
            IP Address: {this.props.staging.ip}
          </p>
          {beingUsedFor}
        </div>
        {claim}
      </div>
    );
  }
}