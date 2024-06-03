// Vizual.jsx

import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const Vizual = ({ caloriesConsumed }) => {
  const { loggedUser } = useContext(UserContext);
  const [totalCalories, setTotalCalories] = useState(0); // Initial total calorie count
  const [caloriesToGo, setCaloriesToGo] = useState(0); // Remaining calories

  useEffect(() => {
    // Fetch the total calorie intake for the logged-in user
    fetch(`http://localhost:8000/calories/${loggedUser.userid}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${loggedUser.token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        // Update the state with the total calorie count
        setTotalCalories(data.calorieEntry.calories);
      })
      .catch(error => {
        console.error('Error fetching total calories:', error);
      });
  }, [loggedUser]); // Fetch total calories whenever loggedUser changes

  // Update caloriesToGo whenever caloriesConsumed or totalCalories change
  useEffect(() => {
    if (caloriesConsumed > totalCalories) {
      setCaloriesToGo(0); // If consumed calories exceed total calories, set to 0
    } else {
      setCaloriesToGo(totalCalories - caloriesConsumed);
    }
  }, [totalCalories, caloriesConsumed]);

  return (
    <div>
      <h2>Total Calorie Intake: {totalCalories}</h2>
      <h2>Calories Consumed: {caloriesConsumed}</h2>
      <h2>Calories To Go: {caloriesToGo}</h2>
    </div>
  );
};

export default Vizual;
