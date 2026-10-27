// ==========================================
// 1. SINGLETON PATTERN: Cart Manager
// ==========================================
class CartManager {
    constructor() {
        if (CartManager.instance) {
            return CartManager.instance; // Returns the existing single instance
        }
        this.items = [];
        CartManager.instance = this;
    }

    addItem(item) {
        this.items.push(item);
        this.updateUI();
    }

    getItems() {
        return this.items;
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + item.price, 0);
    }

    clearCart() {
        this.items = [];
        this.updateUI();
    }

    updateUI() {
        const cartCount = document.getElementById('cart-count');
        const cartItemsDiv = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        cartCount.textContent = this.items.length;
        
        if (this.items.length === 0) {
            cartItemsDiv.innerHTML = '<p>No items in cart.</p>';
        } else {
            cartItemsDiv.innerHTML = this.items.map(item => `<div>• ${item.name} - ₹${item.price}</div>`).join('');
        }
        cartTotal.textContent = this.getTotal();
    }
}

// Enforce Singleton instance
const cartManager = new CartManager();
Object.freeze(cartManager);


// ==========================================
// 2. FACTORY METHOD PATTERN: Order Creation
// ==========================================
class DeliveryOrder {
    processOrder(items, total) {
        const finalTotal = total + 40; // Delivery fee
        return `[Home Delivery Order Successful]\nItems: ${items.map(i => i.name).join(', ')}\nDelivery Fee: ₹40\nTotal Amount: ₹${finalTotal}\nStatus: Out for delivery! 🛵`;
    }
}

class TakeawayOrder {
    processOrder(items, total) {
        return `[Takeaway Order Successful]\nItems: ${items.map(i => i.name).join(', ')}\nTotal Amount: ₹${total}\nStatus: Ready for counter pickup in 15 mins! 🛍️`;
    }
}

class DineInOrder {
    processOrder(items, total) {
        return `[Dine-In Order Successful]\nItems: ${items.map(i => i.name).join(', ')}\nTotal Amount: ₹${total}\nStatus: Table reserved, kitchen notified! 🍽️`;
    }
}

class OrderFactory {
    static createOrder(type) {
        switch (type.toLowerCase()) {
            case 'delivery':
                return new DeliveryOrder();
            case 'takeaway':
                return new TakeawayOrder();
            case 'dinein':
                return new DineInOrder();
            default:
                throw new Error('Invalid order type specified.');
        }
    }
}


// ==========================================
// 3. APP INITIALIZATION & DOM BINDINGS
// ==========================================
const menuItems = [
    { id: 1, name: 'Chicken Biryani', price: 299, desc: 'Authentic Dum Biryani' },
    { id: 2, name: 'Paneer Butter Masala', price: 249, desc: 'Rich cottage cheese curry' },
    { id: 3, name: 'Veg Fried Rice', price: 199, desc: 'Tossed with fresh vegetables' },
    { id: 4, name: 'Chocolate Brownie', price: 129, desc: 'Warm gooey chocolate treat' }
];

function renderMenu() {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = menuItems.map(item => `
        <div class="menu-item">
            <h3>${item.name}</h3>
            <p>${item.desc}</p>
            <p><strong>₹${item.price}</strong></p>
            <button onclick="window.addToCart(${item.id})">Add to Cart</button>
        </div>
    `).join('');
}

window.addToCart = function(id) {
    const item = menuItems.find(i => i.id === id);
    if (item) {
        cartManager.addItem(item);
    }
};

document.getElementById('checkout-btn').addEventListener('click', () => {
    const items = cartManager.getItems();
    if (items.length === 0) {
        alert('Your cart is empty! Add items before placing an order.');
        return;
    }

    const orderType = document.getElementById('order-type-select').value;
    const outputBox = document.getElementById('order-output');

    try {
        // Factory Method execution
        const order = OrderFactory.createOrder(orderType);
        const resultMessage = order.processOrder(items, cartManager.getTotal());
        
        outputBox.style.display = 'block';
        outputBox.textContent = resultMessage;
        
        // Clear cart using Singleton instance
        cartManager.clearCart();
    } catch (error) {
        alert(error.message);
    }
});

// Initialize app on load
window.addEventListener('DOMContentLoaded', () => {
    renderMenu();
});
