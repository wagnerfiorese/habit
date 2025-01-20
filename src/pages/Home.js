import React, { useState } from 'react';
import '../styles/styles.css'; // Importando o arquivo de estilos

function Home() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [showInput, setShowInput] = useState(false);

  // Função para adicionar um novo Habit à lista
  const handleAddHabit = () => {
    if (newHabit.trim() !== '') {
      setHabits([...habits, { name: newHabit, startTime: null, endTime: null, isActive: false }]);
      setNewHabit('');
      setShowInput(false);
    }
  };

  // Função para iniciar o Habit
  const startHabit = (index) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
    const updatedHabits = [...habits];
    updatedHabits[index].startTime = now;
    updatedHabits[index].isActive = true;
    setHabits(updatedHabits);
  };

  // Função para finalizar o Habit
  const endHabit = (index) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
    const updatedHabits = [...habits];
    updatedHabits[index].endTime = now;
    updatedHabits[index].isActive = false;
    setHabits(updatedHabits);
  };

  // Função para calcular a duração entre início e fim
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const duration = (end - start) / 60000; // Converte a diferença para minutos
    return `${Math.floor(duration / 60)}h ${duration % 60}m`; 
  };

  return (
    <div>
      <h1>Habits</h1>
      
      {/* Botão para adicionar Habit */}
      <button onClick={() => setShowInput(true)} className="start-btn">
        Adicionar Habit
      </button>

      {/* Input para adicionar Habit */}
      {showInput && (
        <div className="input-container">
          <input
            type="text"
            placeholder="Digite o nome do Habit"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
          />
          <button onClick={handleAddHabit} className="start-btn">
            Salvar
          </button>
        </div>
      )}

      {/* Lista de Habits */}
      <ul>
  {habits.map((habit, index) => (
    <li
      key={index}
      className={`habit-item ${habit.endTime ? 'habit-card' : habit.isActive ? 'habit-active' : ''}`}
    >
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
        <button onClick={() => endHabit(index)} className="end-btn">
          Terminar Hábito
        </button>
      )}

      {!habit.isActive && !habit.endTime && (
        <button onClick={() => startHabit(index)} className="start-btn">
          Começar Hábito
        </button>
      )}
    </li>
  ))}
</ul>
    </div>
  );
}

export default Home;
