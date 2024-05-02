import axios from "axios";
axios.defaults.withCredentials = true;

const fetchRecommendedDishes = async (locationID, mealName) => {
  try {
    const baseUrl = "http://localhost:5000/menu";
    const encodedLocation = encodeURIComponent(locationID);
    const encodedMealName = encodeURIComponent(mealName);
    const apiURL = `${baseUrl}/${encodedLocation}/${encodedMealName}/recommended`;
    console.log(apiURL)
    const response = await axios.get(apiURL);
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended dishes:", error);
    return ["me"]
  }
};

export default fetchRecommendedDishes;