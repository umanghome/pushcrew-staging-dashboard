import React, { Component } from 'react';
import { database } from '../config/constants';

export default class AddStaging extends Component {
  constructor (props) {
    super(props);

    this.addStaging = this.addStaging.bind(this);
    this.state = {
      name: '',
      ip: ''
    };
  }

  addStaging (e) {
    e.preventDefault();

    database.ref('stagings/' + (new Date().getTime())).set({
      name: this.state.name,
      ip: this.state.ip,
      free: true,
      occupant: '',
      purpose: '',
      occupant_email: ''
    });

    this.setState({
      name: '',
      ip: ''
    });
  }

  render () {
    return (
      <div className="row">
        <div className="col-xs-12">
          <h4>Add a Staging</h4>
        </div>
        <div className="col-xs-12">
          <div className="form-group">
            <input className="form-control" placeholder="Staging Name" value={this.state.name} onChange={e => { this.setState({name: e.target.value}); }} />
          </div>
          <div className="form-group">
            <input className="form-control" placeholder="IP Address" value={this.state.ip} onChange={e => { this.setState({ip: e.target.value}); }} />
          </div>
          <button className="btn btn-primary" disabled={this.state.name.length < 1 || this.state.ip.length < 1} onClick={this.addStaging}>
            Add
          </button>
        </div>
      </div>
    );
  }
}