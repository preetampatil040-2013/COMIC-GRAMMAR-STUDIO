
import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  return (
    <div className="comic-border bg-white px-4 py-2 transform -rotate-2">
      <p className="comic-text text-2xl text-black">
        STUDIO TIME: {hours}:{minutes}
      </p>
    </div>
  );
};

export default Clock;
