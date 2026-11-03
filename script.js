
// PRODUCT LIST
const products = [
    { id: 1, name: "T-Shirt", price: 350, emoji: "👕" },
    { id: 2, name: "Shoes", price: 1200, emoji: "👟" },
    { id: 3, name: "Watch", price: 800, emoji: "⌚" },
    { id: 4, name: "Backpack", price: 650, emoji: "🎒" },
    { id: 5, name: "Headphones", price: 950, emoji: "🎧" },
    { id: 6, name: "Cap", price: 250, emoji: "🧢" }
];

let cart = [];

// SHOW REGISTER
function showRegister() {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("registerPage").classList.remove("hidden");
}

// SHOW LOGIN
function showLogin() {
    document.getElementById("registerPage").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
}

// REGISTER
function register() {
    let username = document.getElementById("regUsername").value.trim();
    let password = document.getElementById("regPassword").value;
    let confirm = document.getElementById("confirmPassword").value;

    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

    if (!username || !password || !confirm) {
        alert("Please complete all fields!");
        return;
    }

    if (password !== confirm) {
        alert("Passwords do not match!");
        return;
    }

    if (accounts.some(user => user.username === username)) {
        alert("Username already exists!");
        return;
    }

    accounts.push({ username, password });

    localStorage.setItem("accounts", JSON.stringify(accounts));

    alert("Registration successful!");

    showLogin();
}

// LOGIN
function login() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;

    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

    let user = accounts.find(account =>
        account.username === username &&
        account.password === password
    );

    if (!user) {
        document.getElementById("loginMessage").textContent =
            "Invalid username or password!";
        return;
    }

    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("storePage").classList.remove("hidden");

    displayProducts();
    displayCart();
}

// LOGOUT
function logout() {
    cart = [];

    document.getElementById("storePage").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    displayCart();
}

// DISPLAY PRODUCTS
function displayProducts() {
    const productContainer = document.getElementById("products");

    productContainer.innerHTML = products.map(product => `
        <div class="product">
            <div class="emoji">${product.emoji}</div>
            <h3>${product.name}</h3>
            <p>Price: ₱${product.price}</p>
            <button onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join("");
}

// ADD TO CART
function addToCart(id) {
    let item = cart.find(product => product.id === id);

    if (item) {
        item.quantity++;
    } else {
        let product = products.find(product => product.id === id);
        cart.push({ ...product, quantity: 1 });
    }

    displayCart();
}

// DISPLAY CART
function displayCart() {
    let output = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        output += `
            <div class="cart-item">
                <span>${item.name} - ₱${item.price}</span>

                <div>
                    <button onclick="changeQuantity(${item.id}, -1)">-</button>
                    ${item.quantity}
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
    });

    document.getElementById("cart").innerHTML =
        output || "Your cart is empty.";

    document.getElementById("total").textContent = total;
}

// CHANGE QUANTITY
function changeQuantity(id, amount) {
    let item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    displayCart();
}

// CHECKOUT
function placeOrder() {
    let name = document.getElementById("customer").value.trim();
    let address = document.getElementById("address").value.trim();

    if (!name || !address) {
        alert("Please enter your name and address!");
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    alert(
        "ORDER SUCCESSFUL!\n\n" +
        "Customer: " + name +
        "\nAddress: " + address +
        "\nTotal: ₱" + total
    );

    cart = [];
    displayCart();

    document.getElementById("customer").value = "";
    document.getElementById("address").value = "";
}
