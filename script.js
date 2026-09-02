// --- BASE DE DATOS FIEL AL MENÚ IMPRESO REAL ---
const exactMenuData = [
    {
        category: "Hamburguesas",
        items: [
            { id: "h1", name: "DELUXE EXOTIK", price: 28000, desc: "Carne, chuleta ahumada, Tocineta, queso cheddar, ensalada, lechuga, tomate, ripio y salsa.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60" },
            { id: "h2", name: "DOBLE PECADO", price: 27500, desc: "Doble Carne, Tocineta, ensalada, queso cheddar, lechuga, tomate, ripio y salsa.", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60" },
            { id: "h3", name: "LA SALVAJE BBQ", price: 22000, desc: "Carne jugosa bañada en bbq, Tocineta, ensalada, queso cheddar, lechuga, tomate, ripio y salsa.", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60" },
            { id: "h4", name: "LA SENCILLA SABROSA", price: 18000, desc: "Carne jugosa, ensalada, queso cheddar, lechuga, tomate, ripio y salsa.", image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&auto=format&fit=crop&q=60" }
        ]
    },
    {
        category: "Combos",
        items: [
            { id: "c1", name: "COMBO para 2 personas", price: 29500, desc: "LAS TRAVIESAS: 4 minis juguetonas con su porción de Papas.", image: "https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=500&auto=format&fit=crop&q=60" },
            { id: "c2", name: "COMBO para 4 personas", price: 56500, desc: "EXOTIK SHOTS: 8 minis al estilo shot con su porción de Papas.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60" }
        ]
    },
    {
        category: "Salchipapas",
        items: [
            { id: "s1", name: "LA SUPREMA EXOTIK", price: 29500, desc: "Carne esmechada, chorizo, huevo, Pico de gallo, guacamole, queso, maduritos, maicitos y salsas.", image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&auto=format&fit=crop&q=60" },
            { id: "s2", name: "LA SIFRINA", price: 25500, desc: "Pollo esmechado, chorizo, maduro, queso, arepita, guacamole y salsas.", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&auto=format&fit=crop&q=60" },
            { id: "s3", name: "LA CRIOLLA", price: 25500, desc: "Salchicha, huevo, Tocineta, maicitos y queso.", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&auto=format&fit=crop&q=60" },
            { id: "s4", name: "LA CALLEJERA", price: 22000, desc: "Salchicha, huevo, Tocineta, maicitos y queso.", image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500&auto=format&fit=crop&q=60" }
        ]
    },
    {
        category: "Perras",
        items: [
            { id: "p1", name: "LA LOCA", price: 18500, desc: "Tocineta, trocitos de salchicha, ensalada, queso, ripio y salsas.", image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=500&auto=format&fit=crop&q=60" },
            { id: "p2", name: "LA BRAVA", price: 22000, desc: "Tocineta entera, trocitos de chuleta ahumada, ripio, ensalada, queso, maicitos, huevos y full salsas.", image: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=500&auto=format&fit=crop&q=60" }
        ]
    },
    {
        category: "La Chicky",
        items: [
            { id: "p3", name: "LA CHICKY", price: 15500, desc: "Papas, salchicha, huevitos y salsas de la casa.", image: "https://images.unsplash.com/photo-1612392062631-9bdae8832714?w=500&auto=format&fit=crop&q=60" }
        ]
    },
    {
        category: "Alitas",
        items: [
            { id: "a1", name: "Alitas a la BBQ", price: 24000, desc: "6 Alitas, Ensalada y una porción de Papas.", image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=60" }
        ]
    },
    {
        category: "Bebidas & Adiciones",
        items: [
            { id: "b1", name: "Gaseosas / Jugos / Hatsu / Hit / Agua", price: 6000, desc: "Selección de bebidas frías de la casa.", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60" },
            { id: "ad1", name: "Adición Carne Esmechada / Pollo", price: 7000, desc: "Porción adicional.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60" },
            { id: "ad2", name: "Adición Queso / Maíz / Huevo / Maduro", price: 4000, desc: "Adición al gusto.", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=60" }
        ]
    }
];

// --- INICIALIZACIÓN DE SOCKET.IO ---
const socket = io();

// Estado global de la aplicación
let menuData = JSON.parse(localStorage.getItem('exotik_menu_v2')) || exactMenuData;
let orders = [];
let isCashRegisterOpen = localStorage.getItem('exotik_cash_open') !== 'false';
let currentWaitstaff = localStorage.getItem('exotik_current_waiter') || 'Mesero General';
let cart = [];

// --- CONEXIÓN DE EVENTOS SOCKET.IO EN TIEMPO REAL ---
socket.on('initial_data', (data) => {
    if (data && data.orders) {
        orders = data.orders;
        reloadDataAndViews();
    }
});

socket.on('order_added', (order) => {
    const exists = orders.some(o => o.id === order.id);
    if (!exists) {
        orders.unshift(order);
        reloadDataAndViews();
    }
});

socket.on('order_completed', (orderId) => {
    orders = orders.filter(o => o.id !== orderId);
    reloadDataAndViews();
});

function reloadDataAndViews() {
    renderMenu();
    renderKitchenOrders();
    renderManagerStats();
    renderManagerProductsTable();
}

// --- NAVEGACIÓN Y LOGIN ---
function login(role, name = null) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('userNav').style.display = 'flex';

    if (role === 'mesero') {
        const waiterInput = document.getElementById('waiterNameInput');
        const waiterName = name || (waiterInput ? waiterInput.value.trim() : '') || 'Mesero 1';
        currentWaitstaff = waiterName;
        localStorage.setItem('exotik_current_waiter', currentWaitstaff);
        document.getElementById('roleBadge').innerText = `MESERO: ${currentWaitstaff.toUpperCase()}`;
        document.getElementById('waiterView').classList.add('active');
        renderMenu();
    } else if (role === 'cocina') {
        document.getElementById('roleBadge').innerText = 'COCINA';
        document.getElementById('kitchenView').classList.add('active');
        renderKitchenOrders();
    } else if (role === 'gerente') {
        document.getElementById('roleBadge').innerText = 'GERENTE';
        document.getElementById('managerView').classList.add('active');
        renderManagerStats();
        renderManagerProductsTable();
    }
}

function logout() {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('loginView').classList.add('active');
    document.getElementById('userNav').style.display = 'none';
}

function formatCOP(amount) {
    return '$' + amount.toLocaleString('es-CO');
}

// --- RENDERING DEL MENÚ (MESERO) ---
function renderMenu() {
    const container = document.getElementById('menuContainer');
    if (!container) return;
    container.innerHTML = '';

    menuData.forEach(cat => {
        if (cat.items.length === 0) return;
        const catTitle = document.createElement('h3');
        catTitle.className = 'category-title';
        catTitle.innerText = cat.category;
        container.appendChild(catTitle);

        const itemsGrid = document.createElement('div');
        itemsGrid.className = 'menu-items-grid';

        cat.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.onclick = () => addToCart(item);
            card.innerHTML = `
                <img src="${item.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60'}" alt="${item.name}" style="width:100%; height:110px; object-fit:cover; border-radius:8px; margin-bottom:8px;">
                <div>
                    <div class="product-name">${item.name}</div>
                    <div class="product-desc">${item.desc || ''}</div>
                </div>
                <div class="product-price">${formatCOP(item.price)}</div>
            `;
            itemsGrid.appendChild(card);
        });

        container.appendChild(itemsGrid);
    });
}

// --- FUNCIONES DEL CARRITO ---
function addToCart(item) {
    if (!isCashRegisterOpen) {
        alert('⚠️ La caja está cerrada. Un gerente debe abrir la caja para tomar pedidos.');
        return;
    }
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    renderCart();
}

function updateQty(id, delta) {
    const index = cart.findIndex(i => i.id === id);
    if (index !== -1) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) cart.splice(index, 1);
    }
    renderCart();
}

function clearCart() {
    cart = [];
    const tInput = document.getElementById('tableName');
    if (tInput) tInput.value = '';
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById('cartList');
    const totalEl = document.getElementById('cartTotal');
    if (!cartList || !totalEl) return;

    if (cart.length === 0) {
        cartList.innerHTML = '<p class="cart-empty">No hay productos seleccionados.</p>';
        totalEl.innerText = '$0';
        return;
    }

    cartList.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatCOP(item.price)} x ${item.qty} = ${formatCOP(itemTotal)}</div>
            </div>
            <div class="cart-controls">
                <button class="btn-qty" onclick="updateQty('${item.id}', -1)">-</button>
                <span>${item.qty}</span>
                <button class="btn-qty" onclick="updateQty('${item.id}', 1)">+</button>
            </div>
        `;
        cartList.appendChild(div);
    });

    totalEl.innerText = formatCOP(total);
}

// --- ENVÍO DE COMANDAS A TRAVÉS DE SOCKET.IO ---
function sendOrder() {
    if (!isCashRegisterOpen) {
        alert('⚠️ La caja está cerrada. No se pueden enviar comandas.');
        return;
    }
    const tableName = document.getElementById('tableName').value.trim();
    if (!tableName) return alert('Por favor ingresa la mesa o el nombre del cliente.');
    if (cart.length === 0) return alert('Agrega al menos un producto al pedido.');

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const now = new Date();

    const newOrder = {
        id: 'ORD-' + Date.now().toString().slice(-4),
        table: tableName,
        waiter: currentWaitstaff,
        items: [...cart],
        total: total,
        status: 'Pendiente',
        timestamp: now.toISOString(),
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Emitir el pedido al servidor Node/Express
    socket.emit('new_order', newOrder);

    alert('🚀 ¡Pedido enviado a la cocina en tiempo real!');
    clearCart();
}

// --- VISTA COCINA (RECEPCIÓN DE PEDIDOS) ---
function renderKitchenOrders() {
    const container = document.getElementById('kitchenOrdersContainer');
    if (!container) return;
    container.innerHTML = '';

    if (orders.length === 0) {
        container.innerHTML = '<p class="empty-kitchen-msg">No hay comandas pendientes en cocina. 🎉</p>';
        return;
    }

    orders.forEach(order => {
        const card = document.createElement('div');
        card.className = `order-card ${order.status === 'En Preparación' ? 'status-prep' : ''}`;
        let itemsHtml = order.items.map(i => `<div class="order-item-detail"><span><strong>${i.qty}x</strong> ${i.name}</span></div>`).join('');

        card.innerHTML = `
            <div>
                <div class="order-card-header">
                    <span class="order-table">${order.table}</span>
                    <span class="order-time">${order.time}</span>
                </div>
                <div style="font-size: 0.85rem; color: #ff9900; font-weight: bold; margin-bottom: 8px;">
                    👤 Atendido por: ${order.waiter || 'Mesero'}
                </div>
                <div class="order-items-list">${itemsHtml}</div>
            </div>
            <div style="margin-top: 15px;">
                <button class="btn-status btn-status-ready" onclick="changeOrderStatus('${order.id}')">✅ Marcar como Listo</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function changeOrderStatus(orderId) {
    socket.emit('complete_order', orderId);
}

// --- CONTROLES DE CAJA ---
function openCashRegister() {
    isCashRegisterOpen = true;
    localStorage.setItem('exotik_cash_open', 'true');
    renderManagerStats();
    alert('🟢 La caja se ha abierto correctamente.');
}

function closeCashRegister() {
    if (!confirm('¿Estás seguro de que deseas cerrar la caja del día?')) return;
    
    isCashRegisterOpen = false;
    localStorage.setItem('exotik_cash_open', 'false');
    orders = [];

    reloadDataAndViews();
    alert('🔒 Caja cerrada exitosamente.');
}

// --- CREAR NUEVO PRODUCTO DESDE GERENCIA ---
function addNewProduct() {
    const category = document.getElementById('newProdCategory').value;
    const name = document.getElementById('newProdName').value.trim();
    const price = parseFloat(document.getElementById('newProdPrice').value);
    const desc = document.getElementById('newProdDesc').value.trim();
    const image = document.getElementById('newProdImage').value.trim() || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60';

    if (!name || isNaN(price) || price <= 0) {
        alert('Por favor ingresa un nombre y precio válidos.');
        return;
    }

    const newId = 'prod-' + Date.now().toString().slice(-5);
    const newProduct = { id: newId, name, price, desc, image };

    let targetCat = menuData.find(c => c.category === category);
    if (targetCat) {
        targetCat.items.push(newProduct);
    } else {
        menuData.push({ category: category, items: [newProduct] });
    }

    localStorage.setItem('exotik_menu_v2', JSON.stringify(menuData));

    document.getElementById('newProdName').value = '';
    document.getElementById('newProdPrice').value = '';
    document.getElementById('newProdDesc').value = '';
    document.getElementById('newProdImage').value = '';

    renderManagerProductsTable();
    renderMenu();
    alert(`✨ Producto "${name}" creado exitosamente en ${category}.`);
}

// --- VISTA GERENTE: FORMULARIO + TABLA DE EDICIÓN Y ELIMINACIÓN ---
function renderManagerProductsTable() {
    const managerSection = document.getElementById('managerProductsTable');
    if (!managerSection) return;

    let container = document.getElementById('managerCrudContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'managerCrudContainer';
        managerSection.parentElement.insertBefore(container, managerSection);
    }

    container.innerHTML = `
        <div style="background: var(--bg-card, #1e1e1e); padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 1px solid #333;">
            <h3 style="margin-top:0; color:var(--primary, #ff9900);">➕ Agregar Nuevo Producto al Menú</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 15px;">
                <div>
                    <label style="font-size:0.8rem; color:#aaa;">Categoría</label>
                    <select id="newProdCategory" style="width:100%; padding:8px; border-radius:5px; background:#2a2a2a; color:#fff; border:1px solid #444;">
                        <option value="Hamburguesas">Hamburguesas</option>
                        <option value="Combos">Combos</option>
                        <option value="Salchipapas">Salchipapas</option>
                        <option value="Perras">Perras</option>
                        <option value="La Chicky">La Chicky</option>
                        <option value="Alitas">Alitas</option>
                        <option value="Bebidas & Adiciones">Bebidas & Adiciones</option>
                    </select>
                </div>
                <div>
                    <label style="font-size:0.8rem; color:#aaa;">Nombre</label>
                    <input type="text" id="newProdName" placeholder="Nombre producto" style="width:100%; padding:8px; border-radius:5px; background:#2a2a2a; color:#fff; border:1px solid #444;">
                </div>
                <div>
                    <label style="font-size:0.8rem; color:#aaa;">Precio (COP)</label>
                    <input type="number" id="newProdPrice" placeholder="Ej: 22000" style="width:100%; padding:8px; border-radius:5px; background:#2a2a2a; color:#fff; border:1px solid #444;">
                </div>
                <div>
                    <label style="font-size:0.8rem; color:#aaa;">Descripción</label>
                    <input type="text" id="newProdDesc" placeholder="Ingredientes..." style="width:100%; padding:8px; border-radius:5px; background:#2a2a2a; color:#fff; border:1px solid #444;">
                </div>
                <div>
                    <label style="font-size:0.8rem; color:#aaa;">URL Imagen (Opcional)</label>
                    <input type="text" id="newProdImage" placeholder="https://..." style="width:100%; padding:8px; border-radius:5px; background:#2a2a2a; color:#fff; border:1px solid #444;">
                </div>
            </div>
            <button onclick="addNewProduct()" style="margin-top:15px; background:#28a745; color:white; border:none; padding:10px 20px; border-radius:6px; font-weight:bold; cursor:pointer;">
                ➕ Guardar y Agregar Producto
            </button>
        </div>
    `;

    managerSection.innerHTML = '';

    menuData.forEach(cat => {
        cat.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${cat.category}</strong></td>
                <td>
                    <input type="text" id="name-${item.id}" value="${item.name}" style="padding:4px 8px; width:90%; background:#2a2a2a; color:#fff; border:1px solid #444; border-radius:4px;">
                </td>
                <td>
                    <input type="number" id="price-${item.id}" value="${item.price}" style="padding:4px 8px; width:90px; background:#2a2a2a; color:#fff; border:1px solid #444; border-radius:4px;">
                </td>
                <td>
                    <input type="text" id="desc-${item.id}" value="${item.desc || ''}" style="padding:4px 8px; width:90%; background:#2a2a2a; color:#fff; border:1px solid #444; border-radius:4px;">
                </td>
                <td>
                    <button onclick="saveSingleProduct('${item.id}')" style="background:#007bff; color:white; border:none; padding:6px 10px; border-radius:4px; font-weight:bold; cursor:pointer; margin-right:4px;">💾</button>
                    <button onclick="deleteProduct('${item.id}')" style="background:#dc3545; color:white; border:none; padding:6px 10px; border-radius:4px; font-weight:bold; cursor:pointer;">🗑️</button>
                </td>
            `;
            managerSection.appendChild(tr);
        });
    });
}

function saveSingleProduct(productId) {
    const newName = document.getElementById(`name-${productId}`).value.trim();
    const newPrice = parseFloat(document.getElementById(`price-${productId}`).value);
    const newDesc = document.getElementById(`desc-${productId}`).value.trim();

    if (!newName || isNaN(newPrice)) {
        alert('Por favor ingresa un nombre y un precio válido.');
        return;
    }

    menuData.forEach(cat => {
        const item = cat.items.find(i => i.id === productId);
        if (item) {
            item.name = newName;
            item.price = newPrice;
            item.desc = newDesc;
        }
    });

    localStorage.setItem('exotik_menu_v2', JSON.stringify(menuData));
    renderMenu();
    alert(`✅ Producto "${newName}" actualizado correctamente.`);
}

function deleteProduct(productId) {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    menuData.forEach(cat => {
        cat.items = cat.items.filter(i => i.id !== productId);
    });
    localStorage.setItem('exotik_menu_v2', JSON.stringify(menuData));
    renderManagerProductsTable();
    renderMenu();
}

// --- ESTADÍSTICAS Y VENTAS (GERENTE) ---
function renderManagerStats() {
    const statusText = document.getElementById('cashRegisterStatus');
    const statusInfo = document.getElementById('cashRegisterInfo');
    const btnOpen = document.getElementById('btnOpenCash');
    const btnClose = document.getElementById('btnCloseCash');

    if (statusText) {
        if (isCashRegisterOpen) {
            statusText.innerText = 'ABIERTA';
            statusText.style.color = '#28a745';
            if (statusInfo) statusInfo.innerText = 'Jornada activa. Los meseros pueden registrar pedidos.';
            if (btnOpen) btnOpen.style.display = 'none';
            if (btnClose) btnClose.style.display = 'inline-block';
        } else {
            statusText.innerText = 'CERRADA';
            statusText.style.color = '#dc3545';
            if (statusInfo) statusInfo.innerText = 'Caja cerrada. Las comandas están bloqueadas.';
            if (btnOpen) btnOpen.style.display = 'inline-block';
            if (btnClose) btnClose.style.display = 'none';
        }
    }

    const salesToday = orders.reduce((sum, o) => sum + o.total, 0);
    const salesTodayEl = document.getElementById('statSales');
    if (salesTodayEl) salesTodayEl.innerText = formatCOP(salesToday);

    const ordersCountEl = document.getElementById('statOrders');
    if (ordersCountEl) ordersCountEl.innerText = orders.length;

    const monthSalesEl = document.getElementById('statMonthSales');
    if (monthSalesEl) monthSalesEl.innerText = formatCOP(salesToday);

    const tbody = document.getElementById('managerOrdersTable');
    if (!tbody) return;
    tbody.innerHTML = '';

    orders.slice(0, 10).forEach(o => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${o.id}</strong></td>
            <td>${o.table}</td>
            <td>${o.waiter || 'Mesero'}</td>
            <td>${o.time}</td>
            <td><span class="badge-status ${o.status === 'Listo' ? 'ready' : 'pending'}">${o.status}</span></td>
            <td><strong>${formatCOP(o.total)}</strong></td>
        `;
        tbody.appendChild(row);
    });
}

// Carga inicial al refrescar la página
reloadDataAndViews();