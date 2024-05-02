const getMenu = async (locationID) => {
    const locationIDStr = Object.values(locationID)[0]
    let api = "http://localhost:5000/menu/" + locationIDStr;
    console.log(api);
    try {
      const response = await fetch(api);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching menu:", error);
      return [];
    }
};

const getLocations = async () => {
    const api = "http://localhost:locations/";
    try {
      const response = await fetch(api);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
};

export default getMenu;