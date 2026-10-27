// ==========================================
// 1. SINGLETON PATTERN: Cart Manager
// ==========================================
class CartManager {
    constructor() {
        if (CartManager.instance) {
            return CartManager.instance; // Returns existing single instance
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
            cartItemsDiv.innerHTML = this.items.map(item => `
                <div class="cart-item-row">
                    <span>${item.name}</span>
                    <span>₹${item.price}</span>
                </div>
            `).join('');
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
    { 
        id: 1, 
        name: 'Chicken Biryani', 
        price: 299, 
        desc: 'Authentic Hyderabadi Dum Biryani with tender chicken', 
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' 
    },
    { 
        id: 2, 
        name: 'Paneer Butter Masala', 
        price: 249, 
        desc: 'Rich and creamy cottage cheese curry with butter naan', 
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60' 
    },
    { 
        id: 3, 
        name: 'Veg Fried Rice', 
        price: 199, 
        desc: 'Wok-tossed rice with fresh vegetables and sauces', 
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=60' 
    },
    { 
        id: 4, 
        name: 'Chocolate Brownie', 
        price: 129, 
        desc: 'Warm gooey chocolate treat topped with fudge', 
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60' 
    },
    { 
        id: 5, 
        name: 'Cheeseburger', 
        price: 179, 
        desc: 'Juicy grilled patty with melted cheese and crisp lettuce', 
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' 
    },
    { 
        id: 6, 
        name: 'Margherita Pizza', 
        price: 349, 
        desc: 'Classic Italian pizza with fresh mozzarella and basil', 
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=60' 
    },
    { 
        id: 7, 
        name: 'Masala Dosa', 
        price: 149, 
        desc: 'Crispy South Indian crepe stuffed with spiced potatoes', 
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60' 
    },
    { 
        id: 8, 
        name: 'Hakka Noodles', 
        price: 219, 
        desc: 'Stir-fried noodles tossed with garlic and crunchy veggies', 
        image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60' 
    }
];

function renderMenu() {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = menuItems.map(item => `
        <div class="menu-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-content">
                <div>
                    <h3>${item.name}</h3>
                    <p>${item.desc}</p>
                </div>
                <div class="price-row">
                    <span class="price">₹${item.price}</span>
                    <button onclick="window.addToCart(${item.id})">Add +</button>
                </div>
            </div>
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
        // Factory Method pattern execution
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

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    renderMenu();
});
