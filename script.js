const socket = io();

let menuData = [];
let cart = [];

// Sincronización inicial mediante Socket.IO
socket.on('initial_data', (data) => {
    if (data.menu) {
        menuData = data.menu;
        renderMenu();
        renderManagerProductsTable();
    }
});

socket.on('order_added', (order) => {
    renderKitchenOrder(order);
});

socket.on('order_completed', (orderId) => {
    const el = document.getElementById(`order-${orderId}`);
    if (el) el.remove();
});

// Selector de Rol
function switchRole(role) {
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.view-section').forEach(sec => sec.style.display = 'none');

    if (role === 'client') {
        document.getElementById('clientView').style.display = 'block';
    } else if (role === 'kitchen') {
        document.getElementById('kitchenView').style.display = 'block';
    } else if (role === 'manager') {
        document.getElementById('managerView').style.display = 'block';
        renderManagerProductsTable();
    }
}

// Renderizado del Menú
function renderMenu() {
    const container = document.getElementById('menuContainer');
    if (!container) return;
    container.innerHTML = '';

    menuData.forEach(cat => {
        const catHeader = document.createElement('h3');
        catHeader.className = 'category-title';
        catHeader.textContent = cat.category;
        container.appendChild(catHeader);

        const grid = document.createElement('div');
        grid.className = 'category-grid';

        cat.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <h4>${item.name}</h4>
                <p class="desc">${item.desc || ''}</p>
                <p class="price">$${Number(item.price).toLocaleString('es-CO')}</p>
                <button onclick="addToCart('${item.id}')">Agregar</button>
            `;
            grid.appendChild(card);
        });

        container.appendChild(grid);
    });
}

// Carrito de compras
function addToCart(productId) {
    let product = null;
    menuData.forEach(c => {
        const found = c.items.find(i => i.id === productId);
        if (found) product = found;
    });

    if (product) {
        cart.push(product);
        updateCartUI();
    }
}

function updateCartUI() {
    const cartContainer = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    cartContainer.innerHTML = '';

    let total = 0;
    cart.forEach((item, index) => {
        total += Number(item.price);
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.name} - $${Number(item.price).toLocaleString('es-CO')}</span>
            <button onclick="removeFromCart(${index})">❌</button>
        `;
        cartContainer.appendChild(div);
    });

    totalEl.textContent = `$${total.toLocaleString('es-CO')}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function submitOrder() {
    if (cart.length === 0) return alert('El carrito está vacío');

    const newOrder = {
        id: Date.now().toString(),
        items: [...cart],
        timestamp: new Date().toLocaleTimeString()
    };

    socket.emit('new_order', newOrder);
    cart = [];
    updateCartUI();
    alert('¡Pedido enviado a cocina!');
}

// Panel Administrativo / CRUD de Productos
function renderManagerProductsTable() {
    const managerSection = document.getElementById('managerProductsTable');
    if (!managerSection) return;

    let container = document.getElementById('managerCrudContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'managerCrudContainer';
        managerSection.parentElement.parentElement.insertBefore(container, managerSection.parentElement);
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

function addNewProduct() {
    const category = document.getElementById('newProdCategory').value;
    const name = document.getElementById('newProdName').value;
    const price = Number(document.getElementById('newProdPrice').value);
    const desc = document.getElementById('newProdDesc').value;
    const image = document.getElementById('newProdImage').value;

    if (!name || !price) return alert('Por favor ingresa nombre y precio.');

    const newProd = {
        id: 'p-' + Date.now(),
        name,
        price,
        desc,
        image
    };

    let catObj = menuData.find(c => c.category === category);
    if (!catObj) {
        catObj = { category, items: [] };
        menuData.push(catObj);
    }
    catObj.items.push(newProd);

    renderMenu();
    renderManagerProductsTable();
}

function saveSingleProduct(id) {
    const newName = document.getElementById(`name-${id}`).value;
    const newPrice = Number(document.getElementById(`price-${id}`).value);
    const newDesc = document.getElementById(`desc-${id}`).value;

    menuData.forEach(cat => {
        const item = cat.items.find(i => i.id === id);
        if (item) {
            item.name = newName;
            item.price = newPrice;
            item.desc = newDesc;
        }
    });

    renderMenu();
    alert('Producto actualizado.');
}

function deleteProduct(id) {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;

    menuData.forEach(cat => {
        cat.items = cat.items.filter(i => i.id !== id);
    });

    renderMenu();
    renderManagerProductsTable();
}

function renderKitchenOrder(order) {
    const container = document.getElementById('kitchenOrders');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'order-card';
    div.id = `order-${order.id}`;
    div.innerHTML = `
        <h3>Pedido #${order.id.slice(-4)} - ${order.timestamp}</h3>
        <ul>
            ${order.items.map(i => `<li>${i.name}</li>`).join('')}
        </ul>
        <button onclick="completeOrder('${order.id}')">Despachar</button>
    `;
    container.appendChild(div);
}

function completeOrder(orderId) {
    socket.emit('complete_order', orderId);
}