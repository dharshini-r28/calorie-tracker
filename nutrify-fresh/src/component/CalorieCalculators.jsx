import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const CalorieCalculator = () => {
  const { loggedUser } = useContext(UserContext);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('sedentary');
  const [calories, setCalories] = useState(null);
  const formRef = useRef(null);

  const handleSubmit = async () => {
    // Calculate BMR and total calories
    let BMR;
    if (gender === 'male') {
      BMR = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      BMR = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    const activityFactor = getActivityFactor(activity);
    const totalCalories = BMR * activityFactor;
    setCalories(totalCalories);

    // Prepare request data
    const requestData = {
      userId: loggedUser ? loggedUser.userid : null, // Ensure loggedUser is defined
      calories: totalCalories,
    };

    try {
      // Send POST request to backend
      const response = await axios.post('http://localhost:8000/calories', requestData, {
        headers: {
          Authorization: `Bearer ${loggedUser.token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to get activity factor based on selected activity
  const getActivityFactor = (activity) => {
    switch (activity) {
      case 'sedentary':
        return 1.2;
      case 'lightly':
        return 1.375;
      case 'moderately':
        return 1.55;
      case 'very':
        return 1.725;
      case 'extra':
        return 1.9;
      default:
        return 1.2;
    }
  };

  const handleClick = () => {
    console.log('Button clicked!');
    console.log('User ID:', loggedUser ? loggedUser.userid : null); // Log userId if available
    const BMR = gender === 'male' ? 10 * weight + 6.25 * height - 5 * age + 5 : 10 * weight + 6.25 * height - 5 * age - 161;
    const activityFactor = getActivityFactor(activity);
    const totalCalories = BMR * activityFactor;
    setCalories(totalCalories);
    console.log('Total Daily Calories:', totalCalories.toFixed(2)); // Log total calories
    handleSubmit();
  };

  return (
    <div>
      <h1>Daily Calorie Calculator</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div>
          <label>Weight (kg): </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Height (cm): </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Age (years): </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Gender: </label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Activity Level: </label>
          <select value={activity} onChange={(e) => setActivity(e.target.value)}>
            <option value="sedentary">Sedentary (little or no exercise)</option>
            <option value="lightly">Lightly active (light exercise 1-3 days/week)</option>
            <option value="moderately">Moderately active (moderate exercise 3-5 days/week)</option>
            <option value="very">Very active (hard exercise 6-7 days/week)</option>
            <option value="extra">Extra active (very hard exercise & physical job or 2x training)</option>
          </select>
        </div>
        <button type="button" onClick={handleClick}>Calculate</button>
        <Link to="/track">Go to tracking</Link>
      </form>
      {calories !== null && (
        <div>
          <h2>Total Daily Calories: {calories.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
};

export default CalorieCalculator;
