import React from "react";

import "./Landing.scss";
import { TeamPicker } from "../components";

const Landing: React.FC = () => {
  return (
    <div className="Landing">
      <TeamPicker />
    </div>
  )
};

export default Landing;
