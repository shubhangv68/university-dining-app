import React from 'react';
import "../App.css";
import { useAuthData } from '../DataContext/AuthDataContext';
import UserNav from './UserNav'

export default function Jobs() {
  const { user, logout } = useAuthData();

  return (
    <div>
      <div style={{"padding": "30px"}}>
        <h1 id="content_title">Jobs</h1>
        <div id="content_text">
            <div style={{ background: '#881c1b', color: '#fff', width: '100%', textAlign: 'left', display: 'block', fontWeight: 700, marginBottom: '20px'}}><p style={{padding: '15px'}}>STUDENT JOBS</p></div>
            <p style={{ margin: '15px' }}>
                UMass Dining employs 1,200 students per year. We understand your education is a priority, we offer flexible working hours built around your class schedule! Join award-winning UMass Dining today. Click the link to see a full list of dining locations and get started today: <a href="https://umassdining.com/student-jobs">https://umassdining.com/student-jobs</a>
            </p>
            <div style={{ background: '#881c1b', color: '#fff', width: '100%', textAlign: 'left', display: 'block', fontWeight: 700, marginBottom: '20px' }}><p style={{padding: '15px'}}>UMASS DINING, STUDENT AMBASSADORS</p></div>
            <p style={{ margin: '15px' }}>
                The Student Ambassadors are a group of Meal Plan holding UMass students working to provide feedback and valuable insights about the UMass Dining program. In addition to providing weekly feedback, this group takes part in a variety of short projects, attends special events, and monthly meetings. If you are interested in becoming a UMass Dining Student Ambassador, please fill out this survey: <a href="https://www.surveymonkey.com/r/2024AmbasadorSurvey" target="_blank" rel="noopener noreferrer">https://www.surveymonkey.com/r/2024AmbasadorSurvey</a>
            </p>
            <div style={{ background: '#881c1b', color: '#fff',  width: '100%', textAlign: 'left', display: 'block', fontWeight: 700, marginBottom: '20px' }}><p style={{padding: '15px'}}>FULL TIME POSITIONS AT UMASS AMHERST</p></div>
            <p style={{ margin: '15px' }}>
                Full Time Positions at UMass Amherst<br />Visit <a href="https://careers.umass.edu/en-us/filter/?job-mail-subscribe-privacy=agree&amp;search-keyword=&amp;category=food%20service%2fhospitality" target="_blank" rel="noopener noreferrer">UMass Amherst Jobs</a> to learn more about all open full-time positions in the following areas:
            </p>
            <ul style={{ margin: '0 30px' }}>
                <li>Culinary</li>
                <li>Departmental Assistant</li>
                <li>Dietary Worker</li>
                <li>Supervisory</li>
                <li>Maintainer</li>
                <li>Potwasher</li>
                <li>Misc</li>
                <li>Storekeeper</li>
            </ul>
            <div style={{ background: '#881c1b', color: '#fff', width: '100%', textAlign: 'left', display: 'block', fontWeight: 700, marginBottom: '20px' }}><p style={{padding: '15px'}}>FULL TIME POSITIONS AT UMASS MT. IDA</p></div>
            <p style={{ margin: '15px' }}>
                UMass MT. IDA Jobs<br />Hiring Manager: Bill Slavin <a href="mailto:wslavin@umass.edu">wslavin@umass.edu</a><br />Campus Center Dining Common<br />100 Carlson Avenue Newton, MA
            </p>
            <div style={{ background: '#881c1b', color: '#fff', width: '100%', textAlign: 'left', display: 'block', fontWeight: 700, marginBottom: '20px' }}><p style={{padding: '15px'}}>FOR QUESTIONS</p></div>
            <p style={{ margin: '15px' }}>
                For any questions regarding hiring, please call Auxiliary Enterprises Human Resources at:<br />413-577-8070 or you can also visit in person at 920 Campus Center Amherst, MA 01003
            </p>
        </div>
    </div>
      <div style={{ zIndex: 1000, alignSelf: 'flex-start', position: 'absolute', right: 20, top: 20 }}>
        <UserNav userName={user.name} onClick={logout} />
      </div>
    </div>
  );
}