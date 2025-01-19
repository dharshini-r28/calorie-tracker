import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import '../cssfile/caloriecalculator.css';

const CalorieCalculator = () => {
  const { loggedUser } = useContext(UserContext);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('sedentary');
  const [calories, setCalories] = useState(null);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    let BMR;
    if (gender === 'male') {
      BMR = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      BMR = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    const activityFactor = getActivityFactor(activity);
    const totalCalories = BMR * activityFactor;
    setCalories(totalCalories);

    const requestData = {
      userId: loggedUser ? loggedUser.userid : null,
      calories: totalCalories,
    };

    try {
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

  const validateForm = () => {
    let formErrors = {};

    if (weight < 30 || weight > 300) {
      formErrors.weight = 'Weight must be between 30 and 300 kg.';
    }

    if (height < 100 || height > 270) {
      formErrors.height = 'Height must be between 100 and 270 cm.';
    }

    if (age < 8 || age > 100) {
      formErrors.age = 'Age must be between 8 and 100 years.';
    }

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleClick = () => {
    console.log('Button clicked!');
    console.log('User ID:', loggedUser ? loggedUser.userid : null);
    handleSubmit();
  };

  return (
    <div>
      <div className='caloriebg'>
        <h1>Daily Calorie Calculator</h1>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div>
            <label>Weight (kg): </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              min="30"
              max="300"
            />
            {errors.weight && <p className="error">{errors.weight}</p>}
          </div>
          <div>
            <label>Height (cm): </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
              min="100"
              max="270"
            />
            {errors.height && <p className="error">{errors.height}</p>}
          </div>
          <div>
            <label>Age (years): </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min="8"
              max="100"
            />
            {errors.age && <p className="error">{errors.age}</p>}
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
      </div>
      {calories !== null && (
        <div>
          <h2>Total Daily Calories: {calories.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
};

export default CalorieCalculator;
