import { io } from "socket.io-client";

const URL = 'https://bimbus.info';

const socket = io(URL);


export default socket;