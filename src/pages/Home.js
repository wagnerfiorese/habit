import React, { useState, useEffect, useMemo } from 'react';
import '../styles/styles.css'; // Importando o arquivo de estilos

function Home() {
  const [habits, setHabits] = useState({});
  const [newHabit, setNewHabit] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [quotesIndex, setQuotesIndex] = useState(0);

  const funnyQuotes = useMemo(() => [
    "\"So I'm breaking the rabit... tonight!\" - Linkin Park",
    "Don't be a lazy rabit, build a new habit!",
    "A good habit is like a smart rabit—fast and consistent!",
    "Hop into a healthy habit, just like a rabit!",
    "Bad habits multiply faster than rabits!",
    "Train your habits before they run away like a rabit!",
    "If you chase too many habits, you'll end up like a lost rabit!",
    "A habit a day keeps the lazy rabit away!",
    "Be quick like a rabit when forming a good habit!",
    "Rabit or habit? Both require speed and consistency!",
    "One small habit can lead to a giant rabit hole!",
    "Don't let bad habits hop around like wild rabits!",
    "Make it a habit, not a rabit chase!",
    "Stay on track, or your habits will rabit away!",
    "Good habits grow like rabits—quick and steady!",
    "No need to race like a rabit, just build habits step by step!"
  ], []);

  // Carregar hábitos salvos ao iniciar
  useEffect(() => {
    const savedHabits = JSON.parse(localStorage.getItem('habits')) || {};
    setHabits(savedHabits);
  }, []);

  // Salvar hábitos no localStorage sempre que houver mudança
  useEffect(() => {
    if (Object.keys(habits).length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuotesIndex((prevIndex) => (prevIndex + 1) % funnyQuotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [funnyQuotes]);

  const handleAddHabit = () => {
    if (newHabit.trim() !== '') {
      const updatedHabits = { ...habits };
      if (!updatedHabits[selectedDate]) {
        updatedHabits[selectedDate] = [];
      }
      updatedHabits[selectedDate].push({
        name: newHabit,
        startTime: null,
        endTime: null,
        isActive: false
      });
      setHabits(updatedHabits);
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
  };

  const endHabit = (index) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedHabits = { ...habits };
    updatedHabits[selectedDate][index].endTime = now;
    updatedHabits[selectedDate][index].isActive = false;
    setHabits(updatedHabits);
  };

  const deleteHabit = (index) => {
    const updatedHabits = { ...habits };
    updatedHabits[selectedDate].splice(index, 1);
    if (updatedHabits[selectedDate].length === 0) {
      delete updatedHabits[selectedDate];
    }
    setHabits(updatedHabits);
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const duration = (end - start) / 60000;
    return `${Math.floor(duration / 60)}h ${duration % 60}m`;
  };

  return (
    <div>
      <header className="fun-header">
        <h1>{funnyQuotes[quotesIndex]}</h1>
      </header>
      <h1>Habit</h1>
      <button onClick={() => setShowInput(true)} className="start-btn">
        Adicionar Habit
      </button>

      {showInput && (
        <div className="input-container">
          <input
            type="text"
            maxLength="255"
            placeholder="Digite o nome do Habit"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
          />
          <button onClick={handleAddHabit} className="start-btn">
            Salvar
          </button>
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
                  <strong>Duração: </strong>
                  {calculateDuration(habit.startTime, habit.endTime)}
                </p>
              )}
            </div>
            {!habit.endTime && habit.isActive && (
              <button onClick={() => endHabit(index)} className="end-btn">
                Terminar Habit
              </button>
            )}
            {!habit.isActive && !habit.endTime && (
              <button onClick={() => startHabit(index)} className="start-btn">
                Iniciar Habit
              </button>
            )}
            {habit.endTime && (
              <button onClick={() => deleteHabit(index)} className="delete-btn">
                Deletar
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Calendário na parte inferior */}
      <div className="calendar-container">
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>
    </div>
  );
}

export default Home;
