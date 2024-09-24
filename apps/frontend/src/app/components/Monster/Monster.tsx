import React from "react";

const Monster: React.FC = ({ monster }) => (
  <div>
    <h2>{monster.name}</h2>
    <p>Health: {monster.health}</p>
  </div>
);

export default Monster;
