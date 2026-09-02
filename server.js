const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data_store.json');

// Servir archivos estáticos
app.use(express.static(__dirname));
app.use(express.json());

// Leer pedidos almacenados
function getOrdersFromFile() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error("Error al leer data_store.json:", err);
    }
    return [];
}

// Guardar pedidos
function saveOrdersToFile(orders) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2));
    } catch (err) {
        console.error("Error al escribir en data_store.json:", err);
    }
}

// CONEXIÓN SOCKET.IO EN TIEMPO REAL
io.on('connection', (socket) => {
    console.log('⚡ Nuevo cliente conectado:', socket.id);

    // 1. Enviar pedidos actuales al nuevo dispositivo que se conecta
    const currentOrders = getOrdersFromFile();
    socket.emit('initial_data', { orders: currentOrders });

    // 2. Escuchar cuando el celular (Mesero) envía una comanda
    socket.on('new_order', (orderData) => {
        console.log('📥 Nuevo pedido recibido:', orderData.id);
        
        let orders = getOrdersFromFile();
        orders.unshift(orderData);
        saveOrdersToFile(orders);

        // Emitir el nuevo pedido a TODOS los dispositivos conectados (incluida la Cocina)
        io.emit('order_added', orderData);
    });

    // 3. Escuchar cuando la cocina marca un pedido como listo
    socket.on('complete_order', (orderId) => {
        console.log('✅ Pedido completado:', orderId);
        
        let orders = getOrdersFromFile();
        orders = orders.filter(o => o.id !== orderId);
        saveOrdersToFile(orders);

        // Notificar a todos los dispositivos que la comanda finalizó
        io.emit('order_completed', orderId);
    });

    socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});