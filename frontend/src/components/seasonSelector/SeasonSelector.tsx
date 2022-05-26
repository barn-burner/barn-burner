import React, { useState } from "react";
import { Radio } from "antd";
import DatePicker from "react-date-picker";

const SessionSelector: React.FC = () => {
  const [startingDate, onStartChange] = useState(new Date());
  const [endingDate, onEndChange] = useState(new Date());

  return (
    <>
      <Radio>Current Season</Radio>
      <Radio>All Seasons</Radio>
      <div>
      <DatePicker onChange={onStartChange} value={startingDate} />
      <DatePicker onChange={onEndChange} value={endingDate} />
      </div>
    </>
  );
};

export default SessionSelector;
