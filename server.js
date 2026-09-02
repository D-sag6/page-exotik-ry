const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const DATA_FILE = path.join(__dirname, 'data_store.json');

app.use(express.static(__dirname));

function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        return { orders: [], sales: [] };
    }
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data || '{"orders":[],"sales":[]}');
    } catch (error) {
        return { orders: [], sales: [] };
    }
}

function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error al guardar datos:', error);
    }
}

io.on('connection', (socket) => {
    const currentData = readData();
    socket.emit('initial_data', currentData);

    socket.on('new_order', (order) => {
        const data = readData();
        data.orders.push(order);
        saveData(data);
        io.emit('order_added', order);
    });

    socket.on('complete_order', (orderId) => {
        const data = readData();
        const index = data.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            const completed = data.orders.splice(index, 1)[0];
            data.sales.push({ ...completed, completedAt: new Date().toISOString() });
            saveData(data);
            io.emit('order_completed', orderId);
            io.emit('sales_updated', data.sales);
        }
    });
});

// Asignación de puerto compatible con Render y Local
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});