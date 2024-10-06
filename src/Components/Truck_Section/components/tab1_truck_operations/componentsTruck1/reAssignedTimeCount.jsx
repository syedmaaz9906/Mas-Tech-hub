import { useState, useEffect } from 'react';

const NoDriverTimer = ({ unassignedStartAt, noDriverTimeCount = 0 }) => {
    const [elapsedTime, setElapsedTime] = useState('00:00:00');

    useEffect(() => {
        // If unassignedStartAt is null or undefined, set the timer to '00:00:00'
        if (!unassignedStartAt) {
            setElapsedTime('00:00:00');
            return;
        }

        const calculateTimeElapsed = () => {
            const now = new Date();
            const unassignedTime = new Date(unassignedStartAt);
            const diffInSeconds = Math.floor((now - unassignedTime) / 1000);

            // Add previously saved no driver time count
            const totalElapsedTime = diffInSeconds + noDriverTimeCount;

            const hours = Math.floor(totalElapsedTime / 3600);
            const minutes = Math.floor((totalElapsedTime % 3600) / 60);
            const seconds = totalElapsedTime % 60;

            setElapsedTime(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        };

        const intervalId = setInterval(calculateTimeElapsed, 1000);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [unassignedStartAt, noDriverTimeCount]);

    return <td>{elapsedTime}</td>;
};

export default NoDriverTimer;
