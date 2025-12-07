// script.js - نظام متكامل لمطعم نوادر

document.addEventListener('DOMContentLoaded', function() {
    // المتغيرات العامة
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentPage = 'home';
    
    // عناصر DOM
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    const floatingCart = document.getElementById('floatingCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartPageItems = document.getElementById('cartPageItems');
    const menuGrid = document.getElementById('menuGrid');
    const orderForm = document.getElementById('orderForm');
    const orderModal = document.getElementById('orderModal');
    const cartCount = document.querySelector('.cart-count');
    const cartLink = document.querySelector('.cart-link');
    
    // بيانات المنتجات (وهمية)
    const products = {
        burgers: [
            { id: 1, name: "برجر الكلاسيك", description: "برجر لحم بقري 200 جرام مع جبنة شيدر وخضروات طازجة", price: 45, category: "burgers", rating: 4.8, image: "burger1" },
            { id: 2, name: "برجر الدجاج المقرمش", description: "دجاج مقرمش مع صلصة العسل والخس والطماطم", price: 40, category: "burgers", rating: 4.6, image: "burger2" },
            { id: 3, name: "برجر الفطر السحري", description: "برجر لحم مع فطر مشوي وجبنة موزاريلا", price: 50, category: "burgers", rating: 4.9, image: "burger3" }
        ],
        appetizers: [
            { id: 4, name: "بطاطس التوابل", description: "بطاطس مقلية مع مزيج من التوابل الخاصة", price: 25, category: "appetizers", rating: 4.5, image: "fries1" },
            { id: 5, name: "حلقات البصل الذهبية", description: "حلقات بصل مقرمشة مع صلصة خاصة", price: 20, category: "appetizers", rating: 4.3, image: "onion1" },
            { id: 6, name: "أجنحة الدجاج الحارة", description: "أجنحة دجاج مشوية بصلصة حارة", price: 35, category: "appetizers", rating: 4.7, image: "wings1" }
        ],
        drinks: [
            { id: 7, name: "ميلك شيك الفراولة", description: "ميلك شيك بالفراولة الطازجة والقشطة", price: 30, category: "drinks", rating: 4.8, image: "milkshake1" },
            { id: 8, name: "عصير البرتقال الطازج", description: "عصير برتقال طازج 100%", price: 18, category: "drinks", rating: 4.6, image: "juice1" },
            { id: 9, name: "مشروب الطاقة الأحمر", description: "مشروب منعش بطعم الفواكه الحمراء", price: 22, category: "drinks", rating: 4.4, image: "energy1" }
        ],
        desserts: [
            { id: 10, name: "كيك الشوكولاتة", description: "كيك شوكولاتة ناعم مع صوص الشوكولاتة", price: 28, category: "desserts", rating: 4.9, image: "cake1" },
            { id: 11, name: "آيس كريم الفانيليا", description: "آيس كريم فانيليا مع قطع شوكولاتة", price: 25, category: "desserts", rating: 4.7, image: "icecream1" },
            { id: 12, name: "تشيز كيك التوت", description: "تشيز كيك كريمي مع توت طازج", price: 32, category: "desserts", rating: 4.8, image: "cheesecake1" }
        ]
    };

    // تهيئة التطبيق
    function initApp() {
        updateCartCount();
        loadMenuItems();
        loadFeaturedDishes();
        updateCartDisplay();
        
        // تفعيل التنقل بين الصفحات
        setupNavigation();
        
        // تفعيل فلاتر القائمة
        setupMenuFilters();
        
        // تفعيل سلة الطلبات
        setupCartFunctionality();
        
        // تفعيل نموذج الطلب
        setupOrderForm();
    }

    // تفعيل التنقل بين الصفحات
    function setupNavigation() {
        // زر القائمة للموبايل
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            this.innerHTML = navbarMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // روابط التنقل
        document.querySelectorAll('.navbar-link, .footer-section a, .hero-buttons a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page');
                if (pageId) {
                    changePage(pageId);
                }
            });
        });

        // رابط السلة
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            floatingCart.classList.add('active');
            updateCartDisplay();
        });

        // إغلاق السلة
        document.querySelector('.close-cart').addEventListener('click', function() {
            floatingCart.classList.remove('active');
        });
    }

    // تغيير الصفحة
    function changePage(pageId) {
        // إخفاء جميع الصفحات
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // تحديث روابط التنقل
        document.querySelectorAll('.navbar-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });

        // إظهار الصفحة المحددة
        document.getElementById(pageId).classList.add('active');
        currentPage = pageId;

        // إغلاق قائمة الموبايل
        if (window.innerWidth <= 768) {
            navbarMenu.classList.remove('active');
            navbarToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }

        // تحديث المحتوى حسب الصفحة
        switch(pageId) {
            case 'cart':
                updateCartPage();
                break;
            case 'menu':
                updateMenuPage();
                break;
        }

        // التمرير للأعلى
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // تحميل الأطباق المميزة
    function loadFeaturedDishes() {
        const dishesGrid = document.querySelector('.dishes-grid');
        if (!dishesGrid) return;

        const featuredDishes = [
            products.burgers[0],
            products.appetizers[0],
            products.drinks[0]
        ];

        dishesGrid.innerHTML = '';
        featuredDishes.forEach(dish => {
            dishesGrid.appendChild(createDishCard(dish));
        });
    }

    // تحميل عناصر القائمة
    function loadMenuItems() {
        if (!menuGrid) return;
        
        menuGrid.innerHTML = '';
        
        // جمع جميع المنتجات
        const allProducts = [
            ...products.burgers,
            ...products.appetizers,
            ...products.drinks,
            ...products.desserts
        ];
        
        allProducts.forEach(product => {
            menuGrid.appendChild(createMenuItem(product));
        });
    }

    // إنشاء بطاقة طبق
    function createDishCard(product) {
        const card = document.createElement('div');
        card.className = 'dish-card';
        card.innerHTML = `
            <div class="dish-image"></div>
            <div class="dish-info">
                <div class="dish-header">
                    <div>
                        <h3 class="dish-title">${product.name}</h3>
                        <p class="dish-description">${product.description}</p>
                    </div>
                    <div class="dish-price">${product.price} ر.س</div>
                </div>
                <div class="dish-footer">
                    <div class="dish-rating">
                        ${generateStars(product.rating)}
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-plus"></i>
                        أضف للسلة
                    </button>
                </div>
            </div>
        `;
        
        // إضافة حدث النقر
        card.querySelector('.add-to-cart-btn').addEventListener('click', function() {
            addToCart(product.id);
        });
        
        return card;
    }

    // إنشاء عنصر قائمة
    function createMenuItem(product) {
        const item = document.createElement('div');
        item.className = 'menu-item';
        item.setAttribute('data-category', product.category);
        
        item.innerHTML = `
            <div class="menu-item-image"></div>
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <h3 class="menu-item-title">${product.name}</h3>
                    <div class="menu-item-price">${product.price} ر.س</div>
                </div>
                <p class="menu-item-description">${product.description}</p>
                <div class="menu-item-footer">
                    <div class="menu-item-rating">
                        ${generateStars(product.rating)}
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-plus"></i>
                        أضف للسلة
                    </button>
                </div>
            </div>
        `;
        
        // إضافة حدث النقر
        item.querySelector('.add-to-cart-btn').addEventListener('click', function() {
            addToCart(product.id);
        });
        
        return item;
    }

    // توليد النجوم للتقييم
    function generateStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    // تفعيل فلاتر القائمة
    function setupMenuFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // إزالة النشاط من جميع الأزرار
                filterBtns.forEach(b => b.classList.remove('active'));
                // إضافة النشاط للزر المحدد
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                filterMenuItems(filter);
            });
        });
    }

    // تصفية عناصر القائمة
    function filterMenuItems(category) {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'flex';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    // تفعيل وظائف السلة
    function setupCartFunctionality() {
        // زر إرسال الطلب في السلة العائمة
        document.getElementById('checkoutBtn').addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('السلة فارغة، أضف بعض المنتجات أولاً', 'error');
                return;
            }
            floatingCart.classList.remove('active');
            changePage('cart');
        });
        
        // إغلاق النافذة المنبثقة بالضغط خارجها
        document.addEventListener('click', function(e) {
            if (!floatingCart.contains(e.target) && 
                !cartLink.contains(e.target) && 
                !e.target.closest('.cart-link')) {
                floatingCart.classList.remove('active');
            }
        });
    }

    // تحديث صفحة القائمة
    function updateMenuPage() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
        filterMenuItems(activeFilter);
    }

    // إضافة منتج إلى السلة
    function addToCart(productId) {
        // البحث عن المنتج
        let product = null;
        for (const category in products) {
            const found = products[category].find(p => p.id === productId);
            if (found) {
                product = found;
                break;
            }
        }
        
        if (!product) return;
        
        // البحث عن المنتج في السلة
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image
            });
        }
        
        // حفظ السلة في localStorage
        saveCart();
        
        // تحديث العرض
        updateCartCount();
        updateCartDisplay();
        
        // عرض إشعار
        showNotification(`تمت إضافة ${product.name} إلى السلة`, 'success');
        
        // إظهار السلة تلقائياً
        if (window.innerWidth > 768) {
            setTimeout(() => {
                floatingCart.classList.add('active');
            }, 300);
        }
    }

    // تحديث عدد العناصر في السلة
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    // تحديث عرض السلة
    function updateCartDisplay() {
        if (cartItemsContainer) {
            updateCartItemsContainer(cartItemsContainer);
        }
    }

    // تحديث صفحة السلة
    function updateCartPage() {
        if (cartPageItems) {
            updateCartItemsContainer(cartPageItems, true);
            updateOrderSummary();
        }
    }

    // تحديث حاوية عناصر السلة
    function updateCartItemsContainer(container, isPage = false) {
        if (cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket"></i>
                    <p>السلة فارغة</p>
                    <a href="#" class="btn btn-outline" data-page="menu">تصفح القائمة</a>
                </div>
            `;
            
            // إضافة حدث النقر لزر التصفح
            container.querySelector('a').addEventListener('click', function(e) {
                e.preventDefault();
                changePage('menu');
                if (!isPage) {
                    floatingCart.classList.remove('active');
                }
            });
            
            return;
        }
        
        let html = '';
        cart.forEach(item => {
            html += `
                <div class="cart-item">
                    <div class="cart-item-image"></div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price * item.quantity} ر.س</div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                            ${isPage ? `<button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // إضافة أحداث للتحكم بالكمية
        container.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const isMinus = this.classList.contains('minus');
                updateCartItem(productId, isMinus);
            });
        });
        
        // إضافة أحداث لحذف العناصر (في صفحة السلة فقط)
        if (isPage) {
            container.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    removeCartItem(productId);
                });
            });
        }
    }

    // تحديث عنصر في السلة
    function updateCartItem(productId, isMinus) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex === -1) return;
        
        if (isMinus) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity--;
            } else {
                cart.splice(itemIndex, 1);
            }
        } else {
            cart[itemIndex].quantity++;
        }
        
        saveCart();
        updateCartCount();
        updateCartDisplay();
        updateCartPage();
    }

    // إزالة عنصر من السلة
    function removeCartItem(productId) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex === -1) return;
        
        const itemName = cart[itemIndex].name;
        cart.splice(itemIndex, 1);
        
        saveCart();
        updateCartCount();
        updateCartDisplay();
        updateCartPage();
        
        showNotification(`تمت إزالة ${itemName} من السلة`, 'warning');
    }

    // تحديث ملخص الطلب
    function updateOrderSummary() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const delivery = 15;
        const tax = subtotal * 0.05;
        const grandTotal = subtotal + delivery + tax;
        
        // تحديث القيم
        const subtotalEl = document.querySelector('.subtotal');
        const deliveryEl = document.querySelector('.delivery');
        const taxEl = document.querySelector('.tax');
        const grandTotalEl = document.querySelector('.grand-total');
        
        if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} ر.س`;
        if (deliveryEl) deliveryEl.textContent = `${delivery.toFixed(2)} ر.س`;
        if (taxEl) taxEl.textContent = `${tax.toFixed(2)} ر.س (5%)`;
        if (grandTotalEl) grandTotalEl.textContent = `${grandTotal.toFixed(2)} ر.س`;
    }

    // حفظ السلة في localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // تفعيل نموذج الطلب
    function setupOrderForm() {
        if (!orderForm) return;
        
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // التحقق من وجود عناصر في السلة
            if (cart.length === 0) {
                showNotification('السلة فارغة، أضف بعض المنتجات أولاً', 'error');
                return;
            }
            
            // جمع بيانات الطلب
            const orderData = {
                customerName: document.getElementById('customerName').value,
                customerPhone: document.getElementById('customerPhone').value,
                customerAddress: document.getElementById('customerAddress').value,
                orderNotes: document.getElementById('orderNotes').value || 'لا توجد ملاحظات',
                cart: cart,
                subtotal: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
                delivery: 15,
                tax: cart.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.05,
                total: cart.reduce((total, item) => total + (item.price * item.quantity), 0) + 15 + (cart.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.05),
                orderNumber: generateOrderNumber(),
                orderDate: new Date().toLocaleString('ar-SA')
            };
            
            // هنا سنرسل الطلب (نستخدم console.log لمحاكاة الإرسال)
            sendOrder(orderData);
            
            // إظهار نافذة التأكيد
            showOrderConfirmation(orderData);
            
            // تفريغ السلة
            cart = [];
            saveCart();
            updateCartCount();
            updateCartDisplay();
            
            // إعادة تعيين النموذج
            orderForm.reset();
        });
    }

    // إرسال الطلب (محاكاة)
    function sendOrder(orderData) {
        console.log('📦 تم إرسال الطلب:', orderData);
        
        // في الواقع الفعلي، هنا سنرسل البيانات إلى الخادم
        // مثال: fetch('/api/orders', { method: 'POST', body: JSON.stringify(orderData) })
        
        // نعرض الإشعار للمستخدم
        showNotification('تم إرسال طلبك بنجاح! رقم الطلب: ' + orderData.orderNumber, 'success');
    }

    // توليد رقم طلب عشوائي
    function generateOrderNumber() {
        return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
    }

    // إظهار تأكيد الطلب
    function showOrderConfirmation(orderData) {
        const orderNumberEl = document.getElementById('orderNumber');
        if (orderNumberEl) {
            orderNumberEl.textContent = orderData.orderNumber;
        }
        
        orderModal.classList.add('active');
        
        // إغلاق النافذة
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                orderModal.classList.remove('active');
                changePage('home');
            });
        });
        
        // إغلاق النافذة عند الضغط خارجها
        orderModal.addEventListener('click', function(e) {
            if (e.target === orderModal) {
                orderModal.classList.remove('active');
                changePage('home');
            }
        });
    }

    // عرض الإشعارات
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#27AE60' : type === 'error' ? '#E74C3C' : '#3498DB'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: var(--shadow-lg);
            z-index: 2001;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(150%);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;
        
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // عرض الإشعار
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // إخفاء الإشعار بعد 4 ثواني
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 4000);
    }

    // طباعة الطلب
    window.printOrder = function() {
        const printContent = `
            <div style="font-family: 'Cairo', sans-serif; padding: 20px; direction: rtl;">
                <h2 style="text-align: center; color: #2C3E50;">إيصال طلب مطعم نوادر</h2>
                <hr>
                <p><strong>رقم الطلب:</strong> ${document.getElementById('orderNumber').textContent}</p>
                <p><strong>التاريخ والوقت:</strong> ${new Date().toLocaleString('ar-SA')}</p>
                <hr>
                <h3>الطلبات:</h3>
                <ul style="list-style: none; padding: 0;">
                    ${cart.map(item => `
                        <li>${item.name} - ${item.quantity} × ${item.price} ر.س = ${item.quantity * item.price} ر.س</li>
                    `).join('')}
                </ul>
                <hr>
                <p><strong>المجموع الفرعي:</strong> ${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)} ر.س</p>
                <p><strong>رسوم التوصيل:</strong> 15.00 ر.س</p>
                <p><strong>الضريبة:</strong> ${(cart.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.05).toFixed(2)} ر.س</p>
                <h3><strong>المجموع الكلي:</strong> ${(cart.reduce((total, item) => total + (item.price * item.quantity), 0) + 15 + (cart.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.05)).toFixed(2)} ر.س</h3>
                <hr>
                <p style="text-align: center; margin-top: 30px;">شكراً لطلبك من مطعم نوادر</p>
                <p style="text-align: center;">☎ 0112345678</p>
            </div>
        `;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    // بدء التطبيق
    initApp();
});
