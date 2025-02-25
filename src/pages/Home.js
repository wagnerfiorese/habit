import React, { useState, useEffect } from 'react';
import '../styles/styles.css';

function Home() {
  const [habits, setHabits] = useState(() => {
    const storedHabits = localStorage.getItem('habits');
    return storedHabits ? JSON.parse(storedHabits) : {};
  });

  const [newHabit, setNewHabit] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const handleAddHabit = () => {
    if (newHabit.trim() !== '') {
      const newHabitData = {
        id: `habit-${Date.now()}`,
        name: newHabit,
        startTime: null,
        endTime: null,
        duration: null,
        isActive: false,
        date: selectedDate
      };

      setHabits((prevHabits) => ({
        ...prevHabits,
        [newHabitData.id]: newHabitData
      }));

      setNewHabit('');
      setShowInput(false);
    }
  };

  const startHabit = (id) => {
    setHabits((prevHabits) => ({
      ...prevHabits,
      [id]: { ...prevHabits[id], startTime: new Date().toISOString(), isActive: true }
    }));
  };

  const endHabit = (id) => {
    setHabits((prevHabits) => {
      const startTime = new Date(prevHabits[id].startTime);
      const endTime = new Date();
      const duration = Math.round((endTime - startTime) / 60000);

      return {
        ...prevHabits,
        [id]: { ...prevHabits[id], endTime: endTime.toISOString(), duration, isActive: false }
      };
    });
  };

  const deleteHabit = (id) => {
    setHabits((prevHabits) => {
      const updatedHabits = { ...prevHabits };
      delete updatedHabits[id];
      return updatedHabits;
    });
  };

  return (
    <div>
      <h1>Habit</h1>

      <ul>
        {Object.entries(habits).map(([id, habit]) => (
          habit.date === selectedDate && (
            <li key={id} className={`habit-item ${habit.endTime ? 'habit-card' : habit.isActive ? 'habit-active' : ''}`}>
              <strong>{habit.name}</strong>
              <div>
                {habit.startTime && <p>Start: {new Date(habit.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                {habit.endTime && <p>Finish: {new Date(habit.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                {habit.duration !== null && <p>Duration: {habit.duration} minutes</p>}
              </div>
              {!habit.endTime && habit.isActive && (
                <button onClick={() => endHabit(id)} className="end-btn">
                  Finish Habit
                </button>
              )}
              {!habit.isActive && !habit.endTime && (
                <button onClick={() => startHabit(id)} className="start-btn">
                  Start Habit
                </button>
              )}
              {habit.endTime && (
                <button onClick={() => deleteHabit(id)} className="delete-btn">
                  Delete
                </button>
              )}
            </li>
          )
        ))}
      </ul>

      <div className="calendar-container">
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>

      <button onClick={() => setShowInput(true)} className="add-habit-btn">+</button>

      {showInput && (
        <div className="input-container">
          <input
            type="text"
            maxLength="255"
            placeholder="Type your Habit"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
          />
          <button onClick={handleAddHabit} className="start-btn">
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
