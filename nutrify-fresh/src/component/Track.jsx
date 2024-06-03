// Track.jsx

import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import Food from './Food';
import Header from './Header';
import Vizual from './Vizual';

const Track = () => {
  const loggedData = useContext(UserContext);
  const [foodItems, setFoodItems] = useState([]);
  const [food, setFood] = useState(null);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0); // State for consumed calories

  function searchFood(event) {
    const inputValue = event.target.value.trim(); // Trim white spaces
    if (inputValue.length !== 0) {
      fetch(`http://localhost:8000/foods/${inputValue}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${loggedData.loggedUser.token}`
        }
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === undefined) {
            setFoodItems(data);
            setFood(null); // Clear selected food when searching
          } else {
            setFoodItems([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setFoodItems([]);
    }
  }

  // Function to update caloriesConsumed state
  function updateCaloriesConsumed(calories) {
    setCaloriesConsumed(prevCalories => prevCalories + calories);
  }

  return (
    <>
      <section className="container track-container">
        <Header />
        <div className="search">
          <input
            className="search-inp"
            onChange={searchFood}
            type="search"
            placeholder="Search Food Item"
          />
          {foodItems.length !== 0 ? (
            <div className="search-results">
              {foodItems.map((item) => (
                <p
                  className="item"
                  onClick={() => {
                    setFood(item);
                    setFoodItems([]);
                  }}
                  key={item._id}
                >
                  {item.name}
                </p>
              ))}
            </div>
          ) : null}
        </div>
        {food !== null ? (
          <Food food={food} updateCaloriesConsumed={updateCaloriesConsumed} />
        ) : null}
      </section>
      {/* Pass caloriesConsumed to Vizual component */}
      <Vizual caloriesConsumed={caloriesConsumed} />
    </>
  );
};

export default Track;
