import React from 'react';
import "../App.css";
import { useAuthData } from '../DataContext/AuthDataContext';
import UserNav from './UserNav';

export default function FSI() {
  const { user, logout } = useAuthData();

  return (
    <div>
      <div style={{'padding': '30px'}}>
            <div className="row">
                <div className="col-lg-12">
                    <h1 id="content_title">No Student Goes Hungry</h1>
                    <div id="content_text">
                        <h3>Food Security Initiatives include:</h3>
                        <p><strong>1. Contact the Dean of Students Office and find Single Stop Resources:</strong></p>
                        <p>
                            <a href="https://www.umass.edu/studentlife/single-stop/food" target="_blank" rel="noopener noreferrer">
                                <img src="https://umassdining.com/sites/default/files/i-need-food.png" style={{ width: '100%' }} alt="I Need Food" />
                            </a>
                        </p>
                        <p>UMass Dining works closely with the Dean of Students Office to identify, prioritize, and allocate resources to students most in need of assistance. If you are a student experiencing personal, financial, or life challenges, contact the Dean of Students Office <a href="https://www.umass.edu/studentlife/single-stop" target="_blank" rel="noopener noreferrer">HERE</a> to learn more about all of their resources.</p>
                        <p>
                            <a href="https://www.umass.edu/dean_students/contact-us" target="_blank" rel="noopener noreferrer">
                                <img src="https://umassdining.com/sites/default/files/contact-dean-students.png" style={{ width: '100%' }} alt="Contact Dean of Students" />
                            </a>
                        </p>
                        <p><strong>Emergency Supplemental Meals</strong><br />The supplemental meal swipe program provides immediate assistance to any UMass student experiencing food insecurity. The program is intended for meal plan students without meal swipes. To access the meals, log into SPIRE and activate the supplemental meal option under the main menu, finance tab; three days of meals automatically loaded to your U-Card; meal swipes can be used in any of the dining commons on campus. Once activated, your meals expire in 3 days and the Dean of Students office will be notified and reach out to you with additional resources. For instructions, reference our How-To Guide <a href="https://umassdining.com/sites/default/files/Supplemental%20Meal%20Summary%20SPIRE.pdf" target="_blank" rel="noopener noreferrer">HERE</a>.</p>
                        <p><strong>2. Retail & Cafe Value Meals</strong><br />Value meals at Retail locations with prices starting at $5.00. Reduced food prices at all cafés one hour before close; menu items include sandwiches, salads, and baked goods and are 50% off one hour before close. The program allows students to stretch their dining dollars and meal exchanges. Additionally, graduate students can take advantage of the half-priced items one hour before close at the campus cafes—the half price brings many menu items down to $2.50 to $4.00.</p>
                        <p><strong>3. Meal Plan Assistance Fund</strong><br />The UMass Amherst Undergraduate Student Meal Plan Assistance Program seeks to provide emergency support to matriculated undergraduate students in good standing for unexpected emergencies, hardship, and/or unforeseen personal/family emergencies. The Assistance Program is an emergency supplement designed to assist current meal plan students facing food insecurity. The Meal Plan Assistance is not a cash award and is not tied to financial aid or grants. Students applying for the assistance are eligible to receive meal swipes/dining access. A student may be awarded Meal Plan assistance funds only once per academic year. Contact the Dean of Students Office to get more information about eligibility for these funds.</p>
                        <p>
                            <a href="https://minutefund.umass.edu/project/15705" target="_blank" rel="noopener noreferrer">
                                <img src="https://umassdining.com/sites/default/files/donate-here.png" style={{ width: '100%' }} alt="Donate Here" />
                            </a>
                        </p>
                        <h3>Other Partners</h3>
                        <p><strong>Food Recovery Network</strong><br />UMass Dining has partnered with the Food Recovery Network to recover and distribute leftover food. The Food Recovery Network (FRN) is a Student Lead Organization that recovers leftover food from the UMass Amherst’s dining halls and donates it to people in Amherst who are in need. This organization plans to raise awareness in the campus community about food waste, both at UMass Amherst and in the greater community. In turn, the organization hopes to foster a mutually beneficial relationship between the university and individuals in the community positively influenced by our efforts. The Food Recovery Network goal is to reduce food waste on campus in every aspect. Contact them directly <a href="https://umassamherst.campuslabs.com/engage/organization/foodrecoverynetwork" target="_blank" rel="noopener noreferrer">HERE</a> to volunteer.</p>
                        <p><strong>UMass Gives On-Going Donations</strong><br />The Food Security funds are not limitless and are made up of generous donations by members of our broader campus community. We invite you to be a part of supporting food security on campus. Please join us with a donation of any amount. Your donation helps support sustainable food access solutions for students.</p>
                    </div>
                </div>
            </div>
        </div>
      <div style={{ zIndex: 1000, alignSelf: 'flex-start', position: 'absolute', right: 20, top: 20 }}>
        <UserNav userName={user.name} onClick={logout} />
      </div>
    </div>
  );
}