import React, { useState } from 'react';
import "../App.css";
import {Link} from "react-router-dom";

export default function UserNav({ userName, onClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  const getInitials = (name) => {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  return (
    <div className="user-avatar-container">
      <div className="user-avatar-inner">
        <div onClick={toggleMenu} className="avatar-circle" style={{ backgroundColor: stringToColor(userName) }}>
          {getInitials(userName)}
        </div>
        <span onClick={toggleMenu}>{userName.toUpperCase()}</span>
      </div>
      {isMenuOpen && (
        <ul className="avatar-menu">
          <li className="avatar-menu-item" ><Link to="/preferences" onClick={() => { toggleMenu(); }}>PREFERENCES</Link></li>
          <li className="avatar-menu-item" onClick={() => { onClick(); toggleMenu(); }}>LOGOUT</li>
        </ul>
      )}
    </div>
  );
}
