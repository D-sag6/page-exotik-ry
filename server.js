const socket = io('https://page-exotik-ry.onrender.com');

let menuData = [];
let cart = [];
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const ORDERS_FILE = path.join(__dirname, 'orders.json');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Evitar error 404 del favicon
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Leer comandas desde archivo JSON
function getOrdersFromFile() {
    try {
        if (!fs.existsSync(ORDERS_FILE)) {
            fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
            return [];
        }
        const data = fs.readFileSync(ORDERS_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error('Error al leer pedidos:', err);
        return [];
    }
}

// Guardar comandas en archivo JSON
function saveOrdersToFile(orders) {
    try {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    } catch (err) {
        console.error('Error al guardar pedidos:', err);
    }
}

// Conexión Socket.IO en tiempo real
io.on('connection', (socket) => {
    console.log('⚡ Nuevo cliente conectado:', socket.id);

    // Enviar pedidos pendientes
    socket.emit('initial_data', { orders: getOrdersFromFile() });

    // Recibir nuevo pedido desde el cliente
    socket.on('new_order', (newOrder) => {
        const orders = getOrdersFromFile();
        orders.unshift(newOrder);
        saveOrdersToFile(orders);
        io.emit('order_added', newOrder);
    });

    // Marcar pedido como completado en cocina
    socket.on('complete_order', (orderId) => {
        let orders = getOrdersFromFile();
        orders = orders.filter(o => o.id !== orderId);
        saveOrdersToFile(orders);
        io.emit('order_completed', orderId);
    });

    socket.on('disconnect', () => {
        console.log('❌ Cliente desconectado:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});