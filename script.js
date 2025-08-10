let cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  updateCart();
}

function updateCart() {
  let cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    let li = document.createElement("li");
    li.textContent = `${item.name} - ${item.price} تومان`;
    cartItems.appendChild(li);
    total += item.price;
  });
  document.getElementById("total").textContent = `جمع کل: ${total} تومان`;
}

document.getElementById("checkout").addEventListener("click", () => {
  alert("پرداخت آنلاین به زودی فعال می‌شود!");
});
