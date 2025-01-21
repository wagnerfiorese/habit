import React, { useState, useEffect } from 'react';
import '../styles/styles.css'; // Importando o arquivo de estilos

function Home() {
  const [habits, setHabits] = useState({});
  const [newHabit, setNewHabit] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const savedHabits = JSON.parse(localStorage.getItem('habits')) || {};
    setHabits(savedHabits);
  }, []);

  const handleAddHabit = () => {
    if (newHabit.trim() !== '') {
      const updatedHabits = { ...habits };
      if (!updatedHabits[selectedDate]) {
        updatedHabits[selectedDate] = [];
      }
      updatedHabits[selectedDate].push({ name: newHabit, startTime: null, endTime: null, isActive: false });
      setHabits(updatedHabits);
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      setNewHabit('');
      setShowInput(false);
    }
  };

  const startHabit = (index) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedHabits = { ...habits };
    updatedHabits[selectedDate][index].startTime = now;
    updatedHabits[selectedDate][index].isActive = true;
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const endHabit = (index) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedHabits = { ...habits };
    updatedHabits[selectedDate][index].endTime = now;
    updatedHabits[selectedDate][index].isActive = false;
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const deleteHabit = (index) => {
    const updatedHabits = { ...habits };
    updatedHabits[selectedDate].splice(index, 1);
    if (updatedHabits[selectedDate].length === 0) {
      delete updatedHabits[selectedDate];
    }
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const duration = (end - start) / 60000;
    return `${Math.floor(duration / 60)}h ${duration % 60}m`;
  };

  return (
    <div>
      <h1>Habit</h1>
      <button onClick={() => setShowInput(true)} className="start-btn">Adicionar Habit</button>

      {showInput && (
        <div className="input-container">
          <input
            type="text"
            maxLength="255"
            placeholder="Digite o nome do Habit"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
          />
          <button onClick={handleAddHabit} className="start-btn">Salvar</button>
        </div>
      )}

      <ul>
        {habits[selectedDate]?.map((habit, index) => (
          <li key={index} className={`habit-item ${habit.endTime ? 'habit-card' : habit.isActive ? 'habit-active' : ''}`}>
            <strong>{habit.name}</strong>
            <div>
              {habit.startTime && <p>Início: {habit.startTime}</p>}
              {habit.endTime && <p>Fim: {habit.endTime}</p>}
              {habit.startTime && habit.endTime && (
                <p className="habit-duration">
                  <strong>Duração: </strong>{calculateDuration(habit.startTime, habit.endTime)}
                </p>
              )}
            </div>
            {!habit.endTime && habit.isActive && (
              <button onClick={() => endHabit(index)} className="end-btn">Terminar Habit</button>
            )}
            {!habit.isActive && !habit.endTime && (
              <button onClick={() => startHabit(index)} className="start-btn">Iniciar Habit</button>
            )}
            {habit.endTime && (
              <button onClick={() => deleteHabit(index)} className="delete-btn">Deletar</button>
            )}
          </li>
        ))}
      </ul>

      {/* Calendário movido para parte inferior */}
      <div className="calendar-container">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Home;
