/* ======= اتصال Supabase (برای فرم ثبت‌نام و جدول دانش‌آموزان) ======= */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://uleqcmugpqhopklnczxl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZXFjbXVncHFob3BrbG5jenhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjgxNDMsImV4cCI6MjA3MDMwNDE0M30.AN5rK88cQYaIOs0CdpTPDF1AB_ToweDg2XUCCMfHQqM'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/* ======= المنت‌ها ======= */
const form = document.getElementById('signupForm')
const result = document.getElementById('result')
const tableBody = document.querySelector('#studentsTable tbody')

/* ======= سبد خرید و محصولات (محلی - ذخیره در localStorage) ======= */
const products = [
    { id: 1, title: "دفتر ۶۰ برگ", price: 120000, img: "https://i.ibb.co/3c0s2zH/notebook.png" },
    { id: 2, title: "خودکار آبی (بسته ۵ تایی)", price: 45000, img: "https://i.ibb.co/0s8bCwz/pen.png" },
    { id: 3, title: "پاک‌کن و تراش", price: 18000, img: "https://i.ibb.co/9s0P7nN/eraser-sharpener.png" },
    { id: 4, title: "کیف مدرسه", price: 520000, img: "https://i.ibb.co/9t1g0mK/schoolbag.png" },
    { id: 5, title: "مداد رنگی ۱۲ رنگ", price: 80000, img: "https://i.ibb.co/7p3Q6gV/colored-pencils.png" }
]

const productsGrid = document.getElementById('productsGrid')
const cartPanel = document.getElementById('cartPanel')
const cartItemsContainer = document.getElementById('cartItems')
const cartTotalEl = document.getElementById('cartTotal')
const cartCountEl = document.getElementById('cartCount')

const openCartBtn = document.getElementById('openCartBtn')
const closeCartBtn = document.getElementById('closeCartBtn')
const clearCartBtn = document.getElementById('clearCartBtn')
const checkoutBtn = document.getElementById('checkoutBtn')

let cart = JSON.parse(localStorage.getItem('school_cart') || '[]')

/* ======= نمایش محصولات ======= */
function renderProducts() {
    productsGrid.innerHTML = ''
    products.forEach(p => {
        const card = document.createElement('div')
        card.className = 'product-card'
        card.innerHTML = `
            <img src="${p.img}" alt="${p.title}">
            <div class="product-title">${p.title}</div>
            <div class="product-price">${formatPrice(p.price)} تومان</div>
            <button class="add-to-cart" data-id="${p.id}">افزودن به سبد</button>
        `
        productsGrid.appendChild(card)
    })
}
renderProducts()

/* ======= هدایت دکمه افزودن به سبد ======= */
productsGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart')
    if (!btn) return
    const id = Number(btn.dataset.id)
    addToCart(id)
})

/* ======= عملکرد سبد خرید ======= */
function saveCart() {
    localStorage.setItem('school_cart', JSON.stringify(cart))
    renderCart()
}

function addToCart(productId) {
    const prod = products.find(p => p.id === productId)
    if (!prod) return
    const existing = cart.find(i => i.id === productId)
    if (existing) {
        existing.qty += 1
    } else {
        cart.push({ ...prod, qty: 1 })
    }
    saveCart()
    openCart()
}

function renderCart() {
    cartItemsContainer.innerHTML = ''
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="padding:12px">سبد خرید خالی است.</p>'
    } else {
        cart.forEach(item => {
            const div = document.createElement('div')
            div.className = 'cart-item'
            div.innerHTML = `
                <img src="${item.img}" alt="${item.title}">
                <div class="cart-item-info">
                    <div style="font-weight:700">${item.title}</div>
                    <div style="color:#555; margin-top:6px">${formatPrice(item.price)} تومان</div>
                    <div class="qty-control" style="margin-top:8px">
                        <button data-action="decrease" data-id="${item.id}">-</button>
                        <div style="padding:4px 8px; border-radius:6px; border:1px solid #eee">${item.qty}</div>
                        <button data-action="increase" data-id="${item.id}">+</button>
                        <button data-action="remove" data-id="${item.id}" style="margin-right:8px; background:#f44336; color:white; border:none; padding:4px 8px; border-radius:6px; cursor:pointer">حذف</button>
                    </div>
                </div>
            `
            cartItemsContainer.appendChild(div)
        })
    }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
    cartTotalEl.textContent = formatPrice(total)
    cartCountEl.textContent = cart.reduce((s, i) => s + i.qty, 0)
    // ذخیره هم انجام میشه
    localStorage.setItem('school_cart', JSON.stringify(cart))
}

/* مدیریت کلیک روی کنترل‌های تعداد و حذف در سبد */
cartItemsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return
    const action = btn.dataset.action
    const id = Number(btn.dataset.id)
    if (action === 'increase') {
        const it = cart.find(x => x.id === id); if (it) it.qty++
    } else if (action === 'decrease') {
        const it = cart.find(x => x.id === id); if (it) { it.qty = Math.max(1, it.qty - 1) }
    } else if (action === 'remove') {
        cart = cart.filter(x => x.id !== id)
    }
    saveCart()
})

clearCartBtn.addEventListener('click', () => { cart = []; saveCart() })
openCartBtn.addEventListener('click', openCart)
closeCartBtn.addEventListener('click', closeCart)

function openCart() { cartPanel.classList.add('open'); renderCart() }
function closeCart() { cartPanel.classList.remove('open') }

/* پرداخت آزمایشی */
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) { alert('سبد خرید خالیست!'); return }
    // در اینجا میشه فرم سفارش، تماس یا اتصال به درگاه اضافه کرد.
    alert('پرداخت آزمایشی — سفارش ثبت شد (محلی).')
    cart = []
    saveCart()
    closeCart()
})

/* فرمت عدد -> قیمت */
function formatPrice(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g

// انتخاب صدا
const chalkSound = document.getElementById("chalkSound");

// تابع پخش صدا
function playChalkSound() {
    chalkSound.currentTime = 0; // از اول صدا پخش شود
    chalkSound.play();
}

// اضافه کردن به همه دکمه‌ها
document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", playChalkSound);
});
