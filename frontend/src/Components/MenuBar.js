import React, { useState } from 'react';
import Menu from './Menu';

function MenuBar() {
  const [location, setLocation] = useState("Worcester");

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

   const getLocationID = () => {
    switch (location) {
      case "Worcester":
        return "1";
      case "Berkshire":
        return "4";
      case "Hampshire":
        return "3";
      case "Franklin":
        return "2";
      default:
        return "";
    }
  };

  return (
    <div>
      <div className="menu-nav-bar">
        <button onClick={() => handleLocationChange("Worcester")}>Worcester</button>
        <button onClick={() => handleLocationChange("Berkshire")}>Berkshire</button>
        <button onClick={() => handleLocationChange("Hampshire")}>Hampshire</button>
        <button onClick={() => handleLocationChange("Franklin")}>Franklin</button>
        <Menu locationID={getLocationID()} />
      </div>
    </div>
  );
}

export default MenuBar;