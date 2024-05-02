import React from 'react';

const NutritionLabel = ({ nutritionData }) => {
  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '300px', margin: '20px', border: '2px solid black', padding: '10px' }}>
      <h1 style={{ fontSize: '22px', textAlign: 'center' }}>Nutrition Facts</h1>
      <p style={{ fontSize: '16px', marginBottom: '5px', borderTop: '2px solid black', borderBottom: '2px solid black', paddingTop: '5px', paddingBottom: '5px' }}>
        Serving Size {nutritionData.servingSize}
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td>Calories</td>
            <td style={{ textAlign: 'right' }}>{nutritionData.calories}</td>
            <td style={{ textAlign: 'right' }}>Fat Cal. {nutritionData.fatCalories}</td>
          </tr>
          <tr style={{ borderTop: '1px solid black' }}>
            <th colSpan="3" style={{ textAlign: 'left' }}>% Daily Value*</th>
          </tr>
          {nutritionData.nutrients && Object.entries(nutritionData.nutrients).map(([key, { amount, dailyValue }]) => (
            <tr key={key}>
              <td>{key}</td>
              <td style={{ textAlign: 'right' }}>{amount}</td>
              <td style={{ textAlign: 'right' }}>{dailyValue}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: '10px', marginTop: '10px' }}>*Percent Daily Values are based on a 2,000 calorie diet.</p>
    </div>
  );
};

export default NutritionLabel;