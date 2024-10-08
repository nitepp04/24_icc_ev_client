import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Context 생성
export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [vehicleData, setVehicleData] = useState(null);
  const [hvData, setHvData] = useState(null);
  const [motorData, setMotorData] = useState(null);
  const [gpsData, setGpsData] = useState(null);
  const [rtc_module, setRtc_module] = useState(null);

  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_SERVER_URL}`,{
    // const socket = io('http://localhost:2004',{
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 100,
      reconnectionDelayMax: 5000,
      transports: ['websocket']
    });
    // 소켓 연결

    // 소켓 연결 성공 시
    socket.on('connect', () => {
      console.log('WebSocket 연결 성공');
      socket.emit('requestData');
    });

    // 소켓 연결 종료 시
    socket.on('disconnect', () => {
      console.log('WebSocket 연결 종료');
    });

    // 소켓 에러 발생 시
    socket.on('error', (error) => {
      console.error('WebSocket 오류', error);
      setLoading(true);
    });

    // 데이터 수신 시
    socket.on('dataReceived', (message) => {
      console.log('서버로부터 받은 데이터 : ', message);
      try {
          const _data = message;

          setVehicleData({ velocity: _data.SPEED });
          setHvData({ voltage: _data.BATTERY_VOLTAGE, current: _data.MOTOR_CURRENT, battery_percent: _data.BATTERY_PERCENT });
          setMotorData({ throttle: _data.THROTTLE_SIGNAL, rpm: _data.RPM, controller_temperature: _data.CONTROLLER_TEMPERATURE });
          setRtc_module({ timestamp : _data.timestamp });
          setGpsData({ lat: _data.lat || 0, lng: _data.lng || 0});

          setLoading(false);
      } catch (error) {
        console.error('데이터 처리 오류!!!!', error);
      }
    });

    // 컴포넌트 언마운트 시 소켓 해제
    return () => {
      socket.disconnect();
      console.log("소켓 연결 해제");
    };
  }, []); // 빈 배열을 넣어 한 번만 실행되도록 설정

  return (
    <SocketContext.Provider value={{ loading, vehicleData, hvData, motorData, gpsData, rtc_module }}>
      {children}
    </SocketContext.Provider>
  );
}
