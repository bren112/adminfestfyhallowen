import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseclient';
import './Dashboard.css';

const Dashboard = () => {
  const [totalArrecadado, setTotalArrecadado] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const fetchTotalArrecadado = async () => {
      try {
        const { data, error } = await supabase
          .from('aprovados')
          .select('valor');

        if (error) {
          console.error('Erro ao buscar dados:', error);
        } else {
          const total = data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
          setTotalArrecadado(total);
        }
      } catch (err) {
        console.error('Erro ao buscar total arrecadado:', err);
      }
    };

    fetchTotalArrecadado();
  }, []);

  useEffect(() => {
    const calculateCountdown = () => {
      const targetDate = new Date('2024-10-05T21:00:00');
      const now = new Date();
      const timeDifference = targetDate - now;

      if (timeDifference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    const countdownInterval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(countdownInterval);
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="countdown-container">
        <div className="countdown-box">
          <span className="countdown-number">{countdown.days}</span>
          <span className="countdown-label">Dias</span>
        </div>
        <div className="countdown-box">
          <span className="countdown-number">{countdown.hours}</span>
          <span className="countdown-label">Horas</span>
        </div>
        <div className="countdown-box">
          <span className="countdown-number">{countdown.minutes}</span>
          <span className="countdown-label">Minutos</span>
        </div>
        <div className="countdown-box">
          <span className="countdown-number">{countdown.seconds}</span>
          <span className="countdown-label">Segundos</span>
        </div>
      </div>
      <br/>
      <p>Total Arrecadado:</p>
      <h1 id='h1'>R$ {totalArrecadado.toFixed(2)}</h1>
  
    </div>
  );
};

export default Dashboard;
