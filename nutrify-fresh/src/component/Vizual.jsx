import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import '../cssfile/visual.css'
const Vizual = ({ caloriesConsumed }) => {
  const { loggedUser } = useContext(UserContext);
  const [totalCalories, setTotalCalories] = useState(0);
  const [progress, setProgress] = useState(0);

 
  useEffect(() => {
    const fetchCalorieData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/calories/${loggedUser.userid}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${loggedUser.token}`,
          },
        });

        const data = await response.json();
        const currentDate = new Date().toISOString().split('T')[0];

        if (data.calorieEntry.date === currentDate) {
          setTotalCalories(data.calorieEntry.calories);
        } else {
          setTotalCalories(data.calorieEntry.calories);
        }
      } catch (error) {
        console.error('Error fetching total calories:', error);
      }
    };

    fetchCalorieData();
  }, [loggedUser]);

  useEffect(() => {
    let percentage = (caloriesConsumed / totalCalories) * 100;
    percentage = Math.min(percentage, 100); 
    setProgress(percentage);
  }, [totalCalories, caloriesConsumed]);

  useEffect(() => {
    const postCalorieInfo = async () => {
      const currentDate = new Date().toISOString().split('T')[0]; 

      
      const caloriesToGo = Math.max(totalCalories - caloriesConsumed, 0);

      const data = {
        userId: loggedUser.userid,
        date: currentDate,
        totalCalories,
        caloriesConsumed,
        caloriesToGo,
      };

      try {
        const response = await fetch('http://localhost:8000/calinfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loggedUser.token}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to post calorie data');
        }

        const result = await response.json();
        console.log('Calorie data saved:', result.message);
      } catch (error) {
        console.error('Error posting calorie data:', error);
      }
    };

    if (totalCalories !== 0 || caloriesConsumed !== 0) {
      postCalorieInfo();
    }
  }, [totalCalories, caloriesConsumed, loggedUser]);

  return (
    <div className="vizual-container">
      <div className="vizual-text">
        <div className="vizual-box">
          <h2>Total Calorie Intake: {totalCalories}</h2>
        </div>
        <div className="vizual-box">
          <h2>Calories Consumed: {caloriesConsumed}</h2>
        </div>
        <div className="vizual-box">
          <h2>Calories To Go: {Math.max(totalCalories - caloriesConsumed, 0)}</h2>
        </div>
      </div>
      <svg width="300" height="300">
        <defs>
          <linearGradient id="GradientColor">
            <stop offset="0%" stopColor="#e91e63" />
            <stop offset="100%" stopColor="#673ab7" />
          </linearGradient>
        </defs>
        <circle cx="150" cy="150" r="120" fill="#e6e6e6" />
        <circle
          cx="150"
          cy="150"
          r="120"
          fill="none"
          stroke="url(#GradientColor)"
          strokeWidth="30"
          strokeDasharray={`${progress * 7.54} ${754 - progress * 7.54}`}
          transform="rotate(-90 150 150)"
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
          {progress.toFixed(0)}%
        </text>
      </svg>
    </div>
  );
};

export default Vizual;
