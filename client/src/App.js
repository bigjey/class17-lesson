import React, { Component } from 'react';

import { Link, Route, Switch } from 'react-router-dom';

import { HousesList } from './components/HousesList';

class HouseDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      houseDetails: {},
      error: null,
      loading: false
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    this.setState({
      error: null,
      loading: true
    });

    fetch(`http://localhost:4321/api/houses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          this.setState({
            error: data.error,
            loading: false
          });
        } else {
          this.setState({
            houseDetails: data,
            error: null,
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          error: 'something is wrong',
          loading: false
        });
      });
  }
  render() {
    const { houseDetails, error, loading } = this.state;

    if (loading) {
      return <div>loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return (
      <div>
        id: {houseDetails.id}
        <br />
        price: {houseDetails.price}
        <br />
      </div>
    );
  }
}

class AddHouses extends Component {
  state = {
    error: null,
    report: null
  };

  componentDidMount() {
    setInterval(() => {
      this.forceUpdate();
    }, 10000);
  }

  onSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:4321/api/houses`, {
      method: 'POST',
      body: this.dataInput.value,
      headers: {
        'content-type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({ error: null, report: data });
        }
      })
      .catch((err) => {
        this.setState({ error: err.message });
      });
  };

  render() {
    const { error, report } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <textarea
          ref={(input) => (this.dataInput = input)}
          style={{
            width: '90%',
            height: '200px',
            display: 'block'
          }}
          defaultValue={`[{
  "link": "http://funda.nl/url",
  "location_country": "Ukraine",
  "location_city": "Kiev",
  "size_rooms": 2,
  "price_value": 200150,
  "price_currency": "EUR"
}, {
  "link": "hi",
  "location_city": "Kiev",
  "size_rooms": "two",
  "price_value": "$ 200150.00",
  "price_currency": "USD"
}]`}
        />
        <br />
        {error && <div>{error}</div>}
        <button type="submit">asd</button>
        <br />
        {!!report && <Report report={report} />}
      </form>
    );
  }
}

const Report = ({ report }) => (
  <div>
    valid houses: {report.valid}
    <br />
    invalid houses ({report.invalid.length}):{' '}
    {report.invalid.map((data) => (
      <div>
        messages: <pre>{JSON.stringify(data.errors, null, 2)}</pre>
        raw: <pre>{JSON.stringify(data.raw, null, 2)}</pre>
      </div>
    ))}
  </div>
);

class App extends Component {
  render() {
    return (
      <div className="App" style={{ padding: 20 }}>
        <ul>
          <li>
            <Link to="/">home</Link>
          </li>
          <li>
            <Link to="/houses">houses</Link>
          </li>
          <li>
            <Link to="/contribute">contribute</Link>
          </li>
        </ul>
        <Switch>
          <Route exact path="/" render={() => <div>home</div>} />
          <Route exact path="/houses" component={HousesList} />
          <Route exact path="/houses/:id" component={HouseDetails} />
          <Route exact path="/contribute" component={AddHouses} />
          <Route render={() => <div>404</div>} />
        </Switch>
      </div>
    );
  }
}

export default App;
