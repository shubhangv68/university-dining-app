import axios from "axios";
import React, { useState, useEffect } from 'react';
import { useAuthData } from '../DataContext/AuthDataContext';
import UserNav from './UserNav';
import '../App.css';

axios.defaults.withCredentials = true;

export default function Preferences() {
  const { user, logout } = useAuthData();

  const [checkedListAllergen, setCheckedListAllergen] = useState([]);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        console.log("Sending GET request...");
        const response = await axios.get('http://localhost:5000/user/me');
        const { allergens } = response.data.preferences;

        setCheckedListAllergen(allergens || []);
      } catch (error) {
        console.error('Failed to fetch preferences:', error);
      }
    };

    fetchPreferences();
  }, []);

  const updatePreferences = async () => {
    try {
      console.log("Sending POST request...");
      const response = await axios.post('http://localhost:5000/user/update_preferences', {
        allergens: checkedListAllergen,
      });
      console.log('Preferences updated successfully:', response.data);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const onChangeHandler = (name) => (e) => {
    const { checked } = e.target;
    if (checked) {
      setCheckedListAllergen(prev => [...prev, name]);
    } else {
      setCheckedListAllergen(prev => prev.filter(item => item !== name));
    }
  };

  const allergens = ['Milk', 'Peanuts', 'Shellfish', 'Eggs', 'Gluten', 'Tree Nuts', 'Fish', 'Soy', 'Corn', 'Sesame'];

  const optionContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '50px',
    justifySelf: 'flex-start',
    marginLeft: '10px'
  };

  const labelStyle = {
    marginRight: '20px',
    marginLeft: '10px',
    alignItems: 'center',
    fontSize: '18px',
    cursor: 'pointer'
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginLeft: '50px'}}>
        <div style={{ position: 'absolute', right: '20px', top: '20px' }}>
          <UserNav userName={user.name} onLogout={logout} />
        </div>
        <div>
          <h1>Allergens</h1>
        </div>
        <div style={optionContainerStyle}>
          {allergens.map((item, index) => (
            <label style={labelStyle} key={index}>
              <input
                marginRight= '5px'
                type="checkbox"
                name={item}
                value={item}
                checked={checkedListAllergen.includes(item)}
                onChange={onChangeHandler(item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>
      <div className='pref-button-container'>
        <button className='google-login-button' onClick={updatePreferences}>Submit</button>
      </div>
    </div>
  );
}
