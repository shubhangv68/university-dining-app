import React from 'react';
import "../App.css";
import { useAuthData } from '../DataContext/AuthDataContext';
import UserNav from './UserNav';

export default function Events() {
  const { user, logout } = useAuthData();

  return (
    <div>
      <div style={{"padding": "30px"}}>
      <h1 id="content_title">UMass Amherst News & Events</h1>
            <img src="https://www.umassdining.com/sites/default/files/8003194459_4451a12bd7_z.jpg" alt="UMass Dining Events" />
            <p>
                Stay up to date with all the new and exciting happenings at UMass Dining. Check back often as our blog, photo gallery, and news page are ever changing. Go UMass!
            </p>
      </div>
      <div style={{ zIndex: 1000, alignSelf: 'flex-start', position: 'absolute', right: 20, top: 20 }}>
        <UserNav userName={user.name} onClick={logout} />
      </div>
    </div>
  );
}