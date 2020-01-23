import React from "react";
import "./componentsCSS/OfficialsBoard.css";

import UserCard from "./UserCard";

class OfficialsBoard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <OfficialsBoard>
        {({ user }) => (
          <React.Fragment>
            <UserCard>/></UserCard>
          </React.Fragment>
        )}
      </OfficialsBoard>
    );
  }
}
export default OfficialsBoard;
