import { useState, useEffect } from 'react';

const DriverAssignedTimer = ({ driverAssignedAt, totalTimeCount = 0 }) => {
    const [elapsedTime, setElapsedTime] = useState('00:00:00');

    useEffect(() => {
        // If driverAssignedAt is undefined or null, show '00:00:00'
        if (!driverAssignedAt) {
            setElapsedTime('00:00:00');
            return;
        }

        const calculateTimeElapsed = () => {
            const now = new Date();
            const assignedTime = new Date(driverAssignedAt);

            // Calculate the difference only if driverAssignedAt is valid
            if (isNaN(assignedTime.getTime())) {
                setElapsedTime('00:00:00');
                return;
            }

            const diffInSeconds = Math.floor((now - assignedTime) / 1000);
            
            // Add previously saved time count
            const totalElapsedTime = diffInSeconds + (totalTimeCount || 0);

            const hours = Math.floor(totalElapsedTime / 3600);
            const minutes = Math.floor((totalElapsedTime % 3600) / 60);
            const seconds = totalElapsedTime % 60;

            setElapsedTime(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        };

        const intervalId = setInterval(calculateTimeElapsed, 1000);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [driverAssignedAt, totalTimeCount]);

    return <td>{elapsedTime}</td>;
};

export default DriverAssignedTimer;
