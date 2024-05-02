import React from 'react';
import NutritionLabel from './NutritionLabel';

const FoodInfoModal = ({ item, closeModal }) => {
  if (!item) return null;

  const { name, carbonFootPrint, diet, allergens, ingredientList } = item;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 5,
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button onClick={closeModal} style={{
          float: 'right',
          background: 'none',
          border: 'none',
          fontSize: '1.5em',
          cursor: 'pointer'
        }}>×</button>
        <h1>{name}</h1>
        <NutritionLabel nutritionData={item} />
        <p><strong>Carbon Footprint:</strong> {carbonFootPrint || 'Not available'}</p>
        <p><strong>Diet:</strong> {diet && diet.length > 0 ? diet.join(', ') : 'Not available'}</p>
        <p><strong>Allergens:</strong> {allergens && allergens.length > 0 ? allergens.join(', ') : 'Not available'}</p>
        <p><strong>Ingredients:</strong> {ingredientList || 'Not available'}</p>
      </div>
    </div>
  );
};

export default FoodInfoModal;