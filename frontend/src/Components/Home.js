import React from 'react';
import "../App.css";
import MenuBar from './MenuBar';
import UserNav from './UserNav';
import { useAuthData } from '../DataContext/AuthDataContext';

export default function Home() {
  const { user, logout } = useAuthData();

  return (
    <div>
      <div>
      <MenuBar />
      </div>
      <div style={{ zIndex: 1000, alignSelf: 'flex-start', position: 'absolute', right: 20, top: 20 }}>
        <UserNav userName={user.name} onClick={logout} />
      </div>
    </div>
  );
}