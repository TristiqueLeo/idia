function formatterCart(priceSum) {
  let price = priceSum.toString();
  let formattedPrice = "";
  for (let i = 0; i < price.length; i++) {
    if (i > 0 && i % 3 === 0) {
      formattedPrice = " " + formattedPrice;
    }
    formattedPrice = price[price.length - 1 - i] + formattedPrice;
  }
  return formattedPrice;
}

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
});

let btnLocation = document.getElementById("open_cart_btn");
btnLocation.addEventListener("click", function () {
  showCart();
});

function showCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Корзина пуста");
    return;
  }

  const existingCart = document.querySelector(".jqcart_layout");
  if (existingCart) {
    document.body.removeChild(existingCart);
  }

  const divElement = document.createElement("div");
  divElement.classList.add("jqcart_layout");

  let cartHTML = `
    <div class="jqcart_content">
        <div class="jqcart_table_wrapper">
            <div class="jqcart_manage_order">
                <ul class="jqcart_thead">
                    <li></li>
                    <li>ТОВАР</li>
                    <li></li>
                    <li>ЦЕНА</li>
                    <li>КОЛИЧЕСТВО</li>
                    <li>СТОИМОСТЬ</li>
                </ul>
  `;

  let totalSum = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalSum += itemTotal;

    cartHTML += `
            <ul class="jqcart_tbody" data-id="${item.code}">
                <li class="jqcart_small_td">
                    <img src="${item.img}" alt="Img">
                </li>
                <li>
                    <div class="jqcart_nd">
                        <a href="#${item.code}.html">${item.title}</a>
                    </div>
                </li>
                <li>${item.code}</li>
                <li>${formatterCart(item.price)} ₸</li>
                <li>
                    <button class="decrease" data-code="${item.code}">-</button>
                    ${item.quantity}
                    <button class="increase" data-code="${item.code}">+</button>
                </li>
                <li>${formatterCart(itemTotal)} ₸</li>
            </ul>
        `;
  });

  cartHTML += `
                </div>
                <div class="jqcart_total">
                    <button id="continue_shopping" class="jqcart_return_btn" type="reset">Продолжить покупки</button>
                    <button id="checkout" class="jqcart_return_btn" type="reset">Оформить заказ</button>
                    <p>Общая сумма: <strong>${formatterCart(
                      totalSum
                    )} ₸</strong></p>
                </div>
            </div>
        </div>
    </div>
  `;

  divElement.innerHTML = cartHTML;
  document.body.appendChild(divElement);

  divElement.addEventListener("click", (e) => {
    if (e.target === divElement) {
      document.body.removeChild(divElement);
    }
  });

  document.querySelectorAll(".increase").forEach((button) => {
    button.addEventListener("click", function () {
      const code = this.getAttribute("data-code");
      updateQuantity(code, 1);
    });
  });

  document.querySelectorAll(".decrease").forEach((button) => {
    button.addEventListener("click", function () {
      const code = this.getAttribute("data-code");
      updateQuantity(code, -1);
    });
  });

  document.getElementById("continue_shopping").addEventListener("click", () => {
    document.body.removeChild(divElement);
  });

  document.getElementById("checkout").addEventListener("click", () => {
    alert("Оформление заказа пока не реализовано");
  });
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existingProduct = cart.find((item) => item.code === product.code);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Товар добавлен в корзину");
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart_count").textContent = totalItems;
}

function updateQuantity(code, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let product = cart.find((item) => item.code === code);
  if (product) {
    product.quantity += change;

    if (product.quantity <= 0) {
      cart = cart.filter((item) => item.code !== code);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    if (cart.length === 0) {
      alert("Корзина пуста");
      document.querySelector(".jqcart_layout").remove();
    } else {
      showCart();
    }

    updateCartCount();
  }
}
