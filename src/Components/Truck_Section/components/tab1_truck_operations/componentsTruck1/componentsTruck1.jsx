import { useState, useEffect } from 'react';

const TimerCell = ({ createdAt }) => {
    const [elapsedTime, setElapsedTime] = useState('');

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const createdTime = new Date(createdAt);
            const diffInSeconds = Math.floor((now - createdTime) / 1000);

            const hours = Math.floor(diffInSeconds / 3600);
            const minutes = Math.floor((diffInSeconds % 3600) / 60);
            const seconds = diffInSeconds % 60;

            setElapsedTime(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        };

        const intervalId = setInterval(updateTimer, 1000); // Update every second

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [createdAt]);

    return <td>{elapsedTime}</td>;
};

export default TimerCell;