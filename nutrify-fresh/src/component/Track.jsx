import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import Food from './Food';
import Header from './Header';
import Vizual from './Vizual';

const Track = () => {
  const { loggedUser } = useContext(UserContext);
  const [foodItems, setFoodItems] = useState([]);
  const [food, setFood] = useState(null);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    const fetchCalorieData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/calinfo/${loggedUser.userid}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${loggedUser.token}`,
          },
        });

        const data = await response.json();
        const currentDate = new Date().toISOString().split('T')[0];

        if (data.date === currentDate) {
          setCaloriesConsumed(data.caloriesConsumed);
        } else {
          setCaloriesConsumed(0);
        }

        setIsTracking(true);
      } catch (error) {
        console.error('Error fetching calorie info:', error);
      }
    };

    fetchCalorieData();
  }, [loggedUser]);

  function searchFood(event) {
    const inputValue = event.target.value.trim();
    if (inputValue.length !== 0) {
      fetch(`http://localhost:8000/foods/${inputValue}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${loggedUser.token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === undefined) {
            setFoodItems(data);
            setFood(null);
          } else {
            setFoodItems([]);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      setFoodItems([]);
    }
  }

  function updateCaloriesConsumed(calories) {
    setCaloriesConsumed(prevCalories => prevCalories + calories);
    setIsTracking(true);
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
              {foodItems.map(item => (
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
      {isTracking && <Vizual caloriesConsumed={caloriesConsumed} />}
    </>
  );
};

export default Track;
