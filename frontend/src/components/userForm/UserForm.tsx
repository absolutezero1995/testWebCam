import React, { useState } from 'react';

const UserForm = ({ onJoin }) => {
  const [userName, setUserName] = useState('');

  const handleJoin = () => {
    if (userName.trim() !== '') {
      onJoin(userName);
    } else {
      alert('Пожалуйста, введите ваше имя перед присоединением.');
    }
  };

  return (
    <div>
      <label>
        Ваше имя:
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
      </label>
      <button onClick={handleJoin}>Присоединиться к видеочату</button>
    </div>
  );
};

export default UserForm;