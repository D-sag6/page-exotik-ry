(function () {

    if (window.exotikAppLoaded) return;
    window.exotikAppLoaded = true;

    const socket = io('https://page-exotik-ry.onrender.com');

    // ✅ SOLUCIÓN: usar window para evitar redeclaración
    if (!window.exactMenuData) {
        window.exactMenuData = [
            { id: 1, name: "Hamburguesa Exotik", price: 25000, category: "hamburguesas", description: "Carne angus" },
            { id: 2, name: "Perro Caliente", price: 18000, category: "perros", description: "Grande" }
        ];
    }

    const exactMenuData = window.exactMenuData;

    let cart = [];

    function renderMenu() {
        const container = document.getElementById("menuContainer");
        container.innerHTML = "";

        exactMenuData.forEach(item => {
            const div = document.createElement("div");
            div.innerHTML = `
                <h3>${item.name}</h3>
                <p>$${item.price}</p>
                <button onclick="addToCart(${item.id})">Agregar</button>
            `;
            container.appendChild(div);
        });
    }

    window.addToCart = function(id) {
        const product = exactMenuData.find(p => p.id === id);
        cart.push(product);
        renderCart();
    };

    function renderCart() {
        const cartItems = document.getElementById("cartItems");
        const totalEl = document.getElementById("cartTotal");

        cartItems.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            total += item.price;
            const div = document.createElement("div");
            div.innerText = item.name;
            cartItems.appendChild(div);
        });

        totalEl.innerText = "$" + total;
    }

    window.submitOrder = function() {
        socket.emit("new_order", { items: cart });
        cart = [];
        renderCart();
    };

    window.switchRole = function(role) {
        document.getElementById("clientView").style.display = "none";
        document.getElementById("kitchenView").style.display = "none";
        document.getElementById("managerView").style.display = "none";

        if (role === "client") document.getElementById("clientView").style.display = "block";
        if (role === "kitchen") document.getElementById("kitchenView").style.display = "block";
        if (role === "manager") document.getElementById("managerView").style.display = "block";
    };

    window.onload = renderMenu;

})();