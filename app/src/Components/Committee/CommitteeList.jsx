import React from 'react';

class CommitteeList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      committees: [],
    };
  }

  componentDidMount() {
    fetch('/api/committee').then((response) => response.json())
      .then((data) => {
        this.setState({ committees: data });
      });
  }

  render() {
    return (
      <div>
        {this.state.committees.map((value, index) => (
          <div>
            <p key={index}>{value.name}</p>
          </div>
        ))}
      </div>
    );
  }
}

export default CommitteeList;
