import React from 'react';
import "../App.css";
import UserNav from './UserNav'
import { useAuthData } from '../DataContext/AuthDataContext';

export default function Sustainability() {
  const { user, logout } = useAuthData();

  return (
    <div>
      <div style={{'padding': '30px'}}>
            <div id="content" className="column col15 tagmike" role="main">
                <h1 id="content_title">UMass Dining Sustainability Initiatives</h1>
                <div id="content_text">
                    <p>
                        <img src="https://umassdining.com/sites/default/files/carbon-rating-umass.png" style={{ width: '100%' }} alt="Carbon Rating UMass" />
                    </p>
                    <p>
                        In partnership with My Emissions, UMass Dining is launching an A-E carbon footprint rating system on menu identifiers that will be accompanied by an educational campaign on Dining for a Cooler Planet. Calculations are done in partnership with My Emissions. For more information visit: <a href="https://www.localumass.com/low-carbon-dining.html" target="_blank" rel="noopener noreferrer">Low Carbon Dining at UMass</a>
                    </p>
                    <p>
                        <iframe frameborder="0" height="800px" scrolling="no" src="https://umass-amherst.maps.arcgis.com/apps/Shortlist/index.html?appid=6862dae90da54139b331935421366c1a" style={{ width: '100%' }} title="UMass Interactive Map"></iframe>
                    </p>
                    <p>
                        <strong>Visit Our Permaculture Gardens</strong><br />
                        UMass Dining has 5 Permaculture Gardens on campus located next to each of the Dining Commons and the Chancellor’s House. Our chefs utilize most of the ingredients in our award-winning dining halls. Download this interactive map <a href="https://umassdining.com/sites/default/files/PERMACULTURE%20Map%20Trifold-2.pdf" target="_blank" rel="noopener noreferrer">HERE</a> and stop by to see what’s in season.
                    </p>
                    <p>
                        <strong>Donations to the UMass Permaculture Initiative</strong><br />
                        Help support current and future permaculture garden projects, educational programming, and community engagement. <a href="https://www.localumass.com/donate-today.html" target="_blank" rel="noopener noreferrer">DONATE HERE</a>
                    </p>
                    <p>
                        <strong>Eating Local Food</strong><br />
                        The Pioneer Valley has some of the best farming soil, and some of the best farmers! Our partnerships with local farms are a huge part of why UMass Dining's food is so good. Local means fresh, more nutrient-dense, and delicious! UMass Dining makes it easy to choose local -- look for the yellow L on food labels!
                    </p>
                    <p>
                        <strong>Having a Plant-Forward Diet</strong><br />
                        Plant-forward does not mean being vegetarian or vegan, it means eating mostly plants. Choosing to eat more plant proteins such as beans and less red meat has countless health and environmental benefits. All campus dining locations have a variety of plant-forward menu items!
                    </p>
                    <p>
                        <strong>Organic Options</strong><br />
                        Many of our farm partners are certified organic. This means they take their role in preserving the soil and the environment very seriously. Using methods such as cover crops, little to no soil tillage, crop rotations with a focus on biodiversity, and only using organic pesticides as a last resort, ensures your organic choices on campus are helping to care for the earth as well as your body!
                    </p>
                    <p>
                        <strong>Look for Fair Trade</strong><br />
                        Fair Trade Certified means you can be sure your food came from farms that treat their workers humanely, pay them a fair wage, and care about being environmental stewards. Much of the chocolate, all of the coffee, and all bananas on campus are Fair Trade Certified!
                    </p>
                    <p>
                        <strong>Follow Waste Disposal Signs</strong><br />
                        UMass Amherst Dining has taken huge steps in reducing waste. In all Dining Commons and Retail locations, food scraps are composted and single use take out containers should be recycled whenever possible. All of this is made easier and more efficient when you throw your waste away in the correct receptacle. Look to signage in the DCs, Retail, and Residential locations to guide your trash disposal! <a href="https://www.umass.edu/sustainability/waste-recycling" target="_blank" rel="noopener noreferrer">Learn More</a>
                    </p>
                    <p>
                        <strong>Keeping Food Waste to a Minimum</strong><br />
                        As great as composting is, it is important to reduce the initial food waste created. UMass Dining already makes efforts to do this by having tray-less dining commons, smaller portion sizes, and more meals made to order. You can do your part by sampling food before you get it, grabbing only what you know you will eat, and eating all the food on your plate!
                    </p>
                    <p>
                        <strong>Eating Food That Gives Back to the Environment</strong><br />
                        The Permaculture program here grows food to provide nutritious food to the dining commons, improve the quality of the land, and creates hands-on learning opportunities for students and anyone who walks through the edible landscapes on campus.
                    </p>
                    <p>
                        <strong>Green Cleaning</strong><br />
                        This program works to maintain the cleanliness of UMass Dining buildings while creating a healthy, eco-friendly, nontoxic built environment. Our cleaning crew is trained periodically at Berkshire Dining Commons to ensure that their knowledge is up to date.
                    </p>
                    <p>
                        Stay updated on our Sustainability Program &amp; Initiatives by visiting <a href="http://www.LocalUMass.com" target="_blank" rel="noopener noreferrer">www.LocalUMass.com</a>!
                    </p>
                </div>
            </div>
        </div>
      <div style={{ zIndex: 1000, alignSelf: 'flex-start', position: 'absolute', right: 20, top: 20 }}>
        <UserNav userName={user.name} onClick={logout} />
      </div>
    </div>
  );
}