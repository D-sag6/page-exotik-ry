const socket = io('https://page-exotik-ry.onrender.com');

// Usamos var o comprobamos si ya existe para evitar colisiones de recarga en caliente del navegador
if (typeof exactMenuData === 'undefined') {
    var exactMenuData = [
        { id: 1, name: "Hamburguesa Exotik", price: 25000, category: "hamburguesas", description: "Carne angus, queso cheddar, tocino crujiente y salsa de la casa." },
        { id: 2, name: "Perro Caliente Monster", price: 18000, category: "perros", description: "Salchicha artesanal, queso fundido, papa ripio y piña caramelizada." },
        { id: 3, name: "Salchipapa Mixta", price: 30000, category: "salchipapas", description: "Papas francesas, chorizo, pollo desmechado, carne y queso gratinado." },
        { id: 4, name: "Gaseosa 400ml", price: 5000, category: "bebidas", description: "Sabor manzana, uva o kola." },
        { id: 5, name: "Cerveza Club Colombia", price: 7000, category: "bebidas", description: "Dorada o Roja 330ml." }
    ];
}

if (typeof cart === 'undefined') {
    var cart = [];
}

if (typeof currentTable === 'undefined') {
    var currentTable = null;
}

if (typeof currentRole === 'undefined') {
    var currentRole = 'client';
}

function loadMenu() {
    renderMenu();
    renderManagerProducts();
}

function renderMenu(filter = 'all') {
    const container = document.getElementById('menuContainer');
    if (!container) return;
    
    container.innerHTML = '';
    const filtered = filter === 'all' ? exactMenuData : exactMenuData.filter(item => item.category === filter);
    
    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p class="price">$${item.price.toLocaleString()}</p>
            <button class="btn-primary" onclick="addToCart(${item.id})">Agregar al pedido</button>
        `;
        container.appendChild(card);
    });
}

function addToCart(id) {
    const product = exactMenuData.find(p => p.id === id);
    if (!product) return;
    
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1, note: '' });
    }
    renderCart();
}

function renderCart() {
    const cartContainer = document.getElementById('cartItems');
    const totalContainer = document.getElementById('cartTotal');
    if (!cartContainer || !totalContainer) return;
    
    cartContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>$${(item.price * item.quantity).toLocaleString()}</span>
            <input type="text" placeholder="Nota (ej. sin cebolla)" value="${item.note}" onchange="updateNote(${index}, this.value)">
            <button onclick="removeFromCart(${index})">❌</button>
        `;
        cartContainer.appendChild(div);
    });
    
    totalContainer.innerText = `$${total.toLocaleString()}`;
}

function updateNote(index, value) {
    if (cart[index]) {
        cart[index].note = value;
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function submitOrder() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    const order = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        table: currentTable || 'General',
        items: [...cart],
        timestamp: new Date().toLocaleTimeString()
    };
    
    socket.emit('new_order', order);
    cart = [];
    renderCart();
    alert('¡Pedido enviado con éxito a cocina!');
}

function switchRole(role) {
    currentRole = role;
    document.querySelectorAll('.view-section').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.role-btn').forEach(el => el.classList.remove('active'));

    if (role === 'client') {
        document.getElementById('clientView').style.display = 'block';
    } else if (role === 'kitchen') {
        document.getElementById('kitchenView').style.display = 'block';
    } else if (role === 'manager') {
        document.getElementById('managerView').style.display = 'block';
        renderManagerProducts();
    }
}

function renderManagerProducts() {
    const tbody = document.getElementById('managerProductsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    exactMenuData.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.category}</td>
            <td><input type="text" value="${item.name}" id="m-name-${index}"></td>
            <td><input type="number" value="${item.price}" id="m-price-${index}"></td>
            <td><input type="text" value="${item.description}" id="m-desc-${index}"></td>
            <td><button class="btn-primary" onclick="saveProduct(${index})">Guardar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function saveProduct(index) {
    const name = document.getElementById(`m-name-${index}`).value;
    const price = Number(document.getElementById(`m-price-${index}`).value);
    const desc = document.getElementById(`m-desc-${index}`).value;

    if (exactMenuData[index]) {
        exactMenuData[index].name = name;
        exactMenuData[index].price = price;
        exactMenuData[index].description = desc;
        alert('¡Producto actualizado localmente!');
        renderMenu();
    }
}

socket.on('initial_data', (data) => {
    if (data && data.orders) {
        renderKitchenOrders(data.orders);
    }
});

socket.on('order_added', (order) => {
    appendKitchenOrder(order);
});

socket.on('order_completed', (orderId) => {
    const el = document.getElementById(`order-${orderId}`);
    if (el) el.remove();
});

function renderKitchenOrders(orders) {
    const kitchenContainer = document.getElementById('kitchenOrders');
    if (!kitchenContainer) return;
    
    kitchenContainer.innerHTML = '';
    orders.forEach(order => {
        appendKitchenOrder(order);
    });
}

function appendKitchenOrder(order) {
    const kitchenContainer = document.getElementById('kitchenOrders');
    if (!kitchenContainer) return;
    
    const card = document.createElement('div');
    card.className = 'kitchen-card';
    card.id = `order-${order.id}`;
    card.innerHTML = `
        <h4>Pedido: ${order.id} - Mesa: ${order.table}</h4>
        <p><small>${order.timestamp}</small></p>
        <ul>
            ${order.items.map(i => `<li>${i.quantity}x ${i.name} ${i.note ? `(Nota: ${i.note})` : ''}</li>`).join('')}
        </ul>
        <button class="btn-primary" onclick="completeOrder('${order.id}')">Marcar como Completado</button>
    `;
    kitchenContainer.prepend(card);
}

function completeOrder(orderId) {
    socket.emit('complete_order', orderId);
}

window.onload = () => {
    loadMenu();
};