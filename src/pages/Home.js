import React, { useState, useEffect, useMemo } from 'react';
import '../styles/styles.css';
import { database } from '../firebaseConfig';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

function Home() {
  const [habits, setHabits] = useState({});
  const [newHabit, setNewHabit] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const habitsCollectionRef = useMemo(() => collection(database, 'habits'), []);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const storedHabits = localStorage.getItem('habits');
        if (storedHabits) {
          setHabits(JSON.parse(storedHabits));
        }

        const querySnapshot = await getDocs(habitsCollectionRef);
        const habitsData = {};
        querySnapshot.forEach((doc) => {
          habitsData[doc.id] = { id: doc.id, ...doc.data() };
        });

        setHabits(habitsData);
        localStorage.setItem('habits', JSON.stringify(habitsData));
      } catch (error) {
        console.error("Erro ao buscar hábitos:", error);
      }
    };

    fetchHabits();
  }, [habitsCollectionRef]);

  const handleAddHabit = async () => {
    if (newHabit.trim() !== '') {
      const newHabitData = {
        name: newHabit,
        startTime: null,
        endTime: null,
        duration: null,
        isActive: false,
        date: selectedDate
      };

      const tempId = `temp-${Date.now()}`;
      const newHabits = { ...habits, [tempId]: { id: tempId, ...newHabitData } };
      setHabits(newHabits);
      localStorage.setItem('habits', JSON.stringify(newHabits));
      setNewHabit('');
      setShowInput(false);

      try {
        const docRef = await addDoc(habitsCollectionRef, newHabitData);
        const finalHabits = { ...newHabits };
        finalHabits[docRef.id] = { id: docRef.id, ...newHabitData };
        delete finalHabits[tempId];

        setHabits(finalHabits);
        localStorage.setItem('habits', JSON.stringify(finalHabits));
      } catch (error) {
        console.error("Erro ao adicionar habit:", error);
      }
    }
  };

  const startHabit = async (id) => {
    const now = new Date().toISOString();
    const updatedHabits = { ...habits, [id]: { ...habits[id], startTime: now, isActive: true } };
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));

    const habitRef = doc(database, 'habits', id);
    try {
      await updateDoc(habitRef, { startTime: now, isActive: true });
    } catch (error) {
      console.error("Erro ao iniciar habit:", error);
    }
  };

  const endHabit = async (id) => {
    const now = new Date().toISOString();
    const startTime = new Date(habits[id].startTime);
    const endTime = new Date(now);
    const duration = Math.round((endTime - startTime) / 60000);

    const updatedHabits = { ...habits, [id]: { ...habits[id], endTime: now, duration, isActive: false } };
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));

    const habitRef = doc(database, 'habits', id);
    try {
      await updateDoc(habitRef, { endTime: now, duration, isActive: false });
    } catch (error) {
      console.error("Erro ao finalizar habit:", error);
    }
  };

  const deleteHabit = async (id) => {
    const updatedHabits = { ...habits };
    delete updatedHabits[id];
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));

    try {
      await deleteDoc(doc(database, 'habits', id));
    } catch (error) {
      console.error("Erro ao deletar habit:", error);
    }
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
                {habit.startTime && <p>Início: {new Date(habit.startTime).toLocaleTimeString()}</p>}
                {habit.endTime && <p>Fim: {new Date(habit.endTime).toLocaleTimeString()}</p>}
                {habit.duration !== null && <p>Duração: {habit.duration} minutos</p>}
              </div>
              {!habit.endTime && habit.isActive && (
                <button onClick={() => endHabit(id)} className="end-btn">
                  Terminar Habit
                </button>
              )}
              {!habit.isActive && !habit.endTime && (
                <button onClick={() => startHabit(id)} className="start-btn">
                  Iniciar Habit
                </button>
              )}
              {habit.endTime && (
                <button onClick={() => deleteHabit(id)} className="delete-btn">
                  Deletar
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
            placeholder="Digite o nome do Habit"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
          />
          <button onClick={handleAddHabit} className="start-btn">
            Salvar
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
