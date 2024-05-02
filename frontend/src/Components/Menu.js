import React, { useEffect, useState } from "react";
import "../App.css";
import DishItem from "./DishItem";
import FoodInfoModal from "./FoodInfoModal";
import getMenu from "./MenuAPI";
import fetchRecommendedDishes from "./fetchRecDishes";

const Menu = ({ locationID }) => {
  const [meals, setMeals] = useState({});
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [recommendedDishes, setRecommendedDishes] = useState([]);

  useEffect(() => {
    if (!selectedMealType) {
      getMenu(locationID).then((data) => {
        setMeals(data); // Assuming data structure matches your JSON structure
        const firstMealType = Object.keys(data)[0];
        setSelectedMealType(firstMealType);
        const firstSection = Object.keys(data[firstMealType].sections)[0];
        setSelectedSection(firstSection);
      });
    }
    console.log(locationID, selectedMealType);
    fetchRecommendedDishes(locationID, selectedMealType).then((data) => {
      console.log(data)
      setRecommendedDishes(data);
    });
  }, [locationID, selectedMealType]);

  const handleOpenModal = (item) => {
    setSelectedItem({
      name: item.name,
      servingSize: item.serving_size,
      calories: item.calories,
      fatCalories: item.calories_from_fat,
      nutrients: {
        TotalFat: {
          amount: item.total_fat_g + "g",
          dailyValue: item.total_fat_g_dv,
        },
        SaturatedFat: {
          amount: item.sat_fat_g + "g",
          dailyValue: item.sat_fat_g_dv,
        },
        TransFat: { amount: item.trans_fat_g + "g", dailyValue: "-" },
        Cholesterol: {
          amount: item.cholesterol_mg + "mg",
          dailyValue: item.cholesterol_mg_dv,
        },
        Sodium: {
          amount: item.sodium_mg + "mg",
          dailyValue: item.sodium_mg_dv,
        },
        Carbohydrates: {
          amount: item.total_carb_g + "g",
          dailyValue: item.total_carb_g_dv,
        },
        Fiber: {
          amount: item.dietary_fiber_g + "g",
          dailyValue: item.dietary_fiber_g_dv,
        },
        Sugars: { amount: item.sugars_g + "g", dailyValue: item.sugars_g_dv },
        Protein: {
          amount: item.protein_g + "g",
          dailyValue: item.protein_g_dv,
        },
      },
      carbonFootPrint: item.carbon_footprint,
      allergens: item.allergens,
      diet: item.diet,
      ingredientList: item.ingredient_list,
    });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <div style={{ top: 420, position: "absolute" }}>
      <h1>Today's Menu</h1>
      <div className="meal-nav-bar">
        {Object.keys(meals).map((mealType) => (
          <button key={mealType} onClick={() => setSelectedMealType(mealType)}>
            {mealType}
          </button>
        ))}
      </div>
      <div>
        <h1> Recommended Dishes</h1>
        {recommendedDishes.length > 0 && recommendedDishes.map((item) => (
          <td>
            <DishItem item={item} onClick={() => handleOpenModal(item.dish)}/>
          </td>
        ))}
      </div>
      {selectedMealType && (
        <div>
          {Object.keys(meals[selectedMealType].sections).map((section) => (
            <div key={section}>
              <h2 style={{ fontFamily: "Oswald" }}>{section}</h2>
              <ul className="dish-item">
                {meals[selectedMealType].sections[section].map(
                  (item, index) => (
                    <li key={index}>
                      <DishItem
                        item={item}
                        onClick={() => handleOpenModal(item)}
                      />
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
      {modalVisible && (
        <FoodInfoModal item={selectedItem} closeModal={handleCloseModal} />
      )}
    </div>
  );
};

export default Menu;
