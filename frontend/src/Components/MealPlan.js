import React from 'react';
import "../App.css";
import UserNav from './UserNav'
import { useAuthData } from '../DataContext/AuthDataContext';

export default function MealPlan() {
  const { user, logout } = useAuthData();

  return (
    <div>
      <div style={{'padding': '30px'}}>
            <div id="content" className="column col15 tagmike" role="main">
                <h1 id="content_title">Meal Plan</h1>
                <div id="content_text">
                    <h1 style={{ color: 'rgb(136, 28, 28)' }}>Fall 2023 &amp; Spring 2024 Semester</h1>
                    <p>All semester meal plans follow the residence halls schedule of operations during the academic year. Fall semester meal plans begin on the residence halls move-in day for first year students. Fall semester meal plans conclude at the end of the semester.</p>
                    <p>Fall Early Arrival Meal Plans begin one week before the residence halls move-in day for multi-year students. Early Arrival meals roll forward into the following semester and do not expire until the end of the semester.</p>
                    <p><strong>An Overview of UMass Dining Meal Plans:</strong></p>
                    <ul>
                        <li><a href="https://umassdining.com/faq#Meal-Plans" target="_blank" rel="noopener noreferrer">View FAQ for Meal Plans</a></li>
                        <li><a href="http://www.umassdining.com/meal-plans/residential-meal-plan" target="_blank" rel="noopener noreferrer">Residential Meal Plans</a></li>
                        <li><a href="http://www.umassdining.com/meal-plans/ycmp" target="_blank" rel="noopener noreferrer">YCMP Off-Campus Meal Plans</a></li>
                        <li><a href="http://www.umassdining.com/meal-plans/ycmp-early-arrival" target="_blank" rel="noopener noreferrer">YCMP Intersession, Summer, and Early Arrival Meal Plans</a></li>
                        <li><a href="http://www.umassdining.com/meal-plans/faculty-and-staff" target="_blank" rel="noopener noreferrer">YCMP2 - Faculty, Staff, Graduate Students</a></li>
                        <li><a href="https://umassdining.com/sites/default/files/Updated%2C%20Top%2010-Website-2024.jpg" target="_blank" rel="noopener noreferrer">Top 10 things you need to know about your Meal Plan</a></li>
                    </ul>
                </div>
            </div>
        </div>
      <div style={{ zIndex: 1000, alignSelf: 'flex-start', position: 'absolute', right: 20, top: 20 }}>
        <UserNav userName={user.name} onClick={logout} />
      </div>
    </div>
  );
}