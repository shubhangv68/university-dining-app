import React from 'react';
import "../App.css";
import UserNav from './UserNav'
import { useAuthData } from '../DataContext/AuthDataContext';
import { Link } from 'react-router-dom';

export default function Nutrition() {
  const { user, logout } = useAuthData();

  return (
    <div>
      <div style={{"padding": '30px'}}>
            <h1>Nutrition</h1>
            <h2>Resources</h2>
            <ul>
                <li><Link to="https://www.umass.edu/disability/students">Register with Disability Services</Link></li>
                <li><Link to="https://af-foodpro1.campus.ads.umass.edu/foodpro.net/location.aspx">Navigate Mobile and Web Menus</Link></li>
                <li><Link to="https://umassdining.com/nutrition/food-allery-special-diets">Review UMass Dining’s Allergy/Restriction Information</Link></li>
                <li><Link to="https://m.facebook.com/groups/umassfoodrestriction/">Join our Food Restriction Support Group</Link></li>
                <li><Link to="https://umassdining.com/nutrition/book-appointment">Book an appointment with Dietitian</Link></li>
            </ul>

            <h2>Our Dietitians</h2>
            <p>Welcome to UMass Dining Nutrition! Whether it is coping with the transition of college with diet restrictions or handling the stress of exams or projects, there are times when these life-events can impact your nutrition. Our two registered dietitians Dianne Sutherland and Sabrina Hafner are available to help students attain their dietary needs healthfully and safely on campus. Their assistance ranges from, but is not limited to:</p>
            <ul>
                <li>Sharing general nutrition information and eating healthfully on campus</li>
                <li>Identifying ingredient and allergen information of our campus food</li>
                <li>Assisting with special dietary needs, which includes:</li>
                <ul>
                    <li>food allergies</li>
                    <li>food intolerances</li>
                    <li>celiac disease</li>
                    <li>other medical conditions</li>
                    <li>broken jaw</li>
                    <li>dietary preferences (i.e. vegan, vegetarian)</li>
                    <li>Religious and cultural diets (i.e. kosher, halal)</li>
                </ul>
            </ul>
            <p>Please check out their valuable nutrition resources on this website! If you have further questions that is not covered via the website, please contact the dietitians at <a href="mailto:dietitian@umass.edu">dietitian@umass.edu</a></p>

            <p>In addition, University Health Services offers personalized dietary consults with their Registered Dietitian regarding diagnosed health conditions. Please call 413-577-5101 if you would like to schedule your appointment. Please note that a copay may apply.</p>
        </div>
      <div style={{ zIndex: 1000, alignSelf: 'flex-start', position: 'absolute', right: 20, top: 20 }}>
        <UserNav userName={user.name} onClick={logout} />
      </div>
    </div>
  );
}