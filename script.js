const productosData = [
  {
    id: 1,
    nombre: "Barolo DOCG 2021",
    tipo: "tinto",
    precio: 320000,
    imagen: "images/vino1.jpg",
    descripcion: "Vino tinto elegante, ideal para carnes rojas y cenas especiales.",
    etiqueta: "Premium"
  },
  {
    id: 2,
    nombre: "Chardonnay 2022",
    tipo: "blanco",
    precio: 180000,
    imagen: "images/vino2.jpg",
    descripcion: "Vino blanco fresco, perfecto para pescados, pastas y mariscos.",
    etiqueta: "Nuevo"
  },
  {
    id: 3,
    nombre: "Rosé Provence 2021",
    tipo: "rosado",
    precio: 150000,
    imagen: "images/vino3.jpg",
    descripcion: "Rosado suave y aromático, ideal para tardes cálidas y regalos.",
    etiqueta: "Más vendido"
  },
  {
    id: 4,
    nombre: "Malbec Reserva 2020",
    tipo: "tinto",
    precio: 210000,
    imagen: "images/vino4.jpg",
    descripcion: "Tinto intenso con cuerpo, recomendado para asados y quesos maduros.",
    etiqueta: "Reserva"
  },
  {
    id: 5,
    nombre: "Cabernet Sauvignon",
    tipo: "tinto",
    precio: 165000,
    imagen: "images/vino1.jpg",
    descripcion: "Vino tinto seco, con notas a frutos rojos y especias.",
    etiqueta: "Oferta"
  },
  {
    id: 6,
    nombre: "Sauvignon Blanc",
    tipo: "blanco",
    precio: 135000,
    imagen: "images/vino2.jpg",
    descripcion: "Blanco ligero y cítrico, ideal para acompañar comida fresca.",
    etiqueta: "Fresco"
  },
  {
    id: 7,
    nombre: "Rosado Especial",
    tipo: "rosado",
    precio: 120000,
    imagen: "images/vino3.jpg",
    descripcion: "Vino rosado delicado, con aromas frutales y final suave.",
    etiqueta: "Especial"
  },
  {
    id: 8,
    nombre: "Merlot Clásico",
    tipo: "tinto",
    precio: 145000,
    imagen: "images/vino4.jpg",
    descripcion: "Tinto amable, equilibrado y fácil de disfrutar.",
    etiqueta: "Clásico"
  }
];

const productosContainer = document.getElementById("productos");
const tipoSelect = document.getElementById("tipo");
const precioRange = document.getElementById("precio");
const precioValue = document.getElementById("precio-value");
const buscador = document.getElementById("buscador");

const cartIcon = document.getElementById("cart-icon");
const cartModal = document.getElementById("cart-modal");
const closeCart = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
const comprarWhatsappBtn = document.getElementById("comprar-whatsapp");

const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");

let carrito = JSON.parse(localStorage.getItem("carritoLassos")) || [];

function formatoPrecio(valor) {
  return valor.toLocaleString("es-CO");
}

function mostrarProductos() {
  const tipo = tipoSelect.value;
  const precioMax = Number(precioRange.value);
  const textoBusqueda = buscador.value.toLowerCase();

  precioValue.textContent = `$${formatoPrecio(precioMax)}`;
  productosContainer.innerHTML = "";

  const productosFiltrados = productosData.filter(producto => {
    const coincideTipo = tipo === "todos" || producto.tipo === tipo;
    const coincidePrecio = producto.precio <= precioMax;
    const coincideBusqueda = producto.nombre.toLowerCase().includes(textoBusqueda);

    return coincideTipo && coincidePrecio && coincideBusqueda;
  });

  if (productosFiltrados.length === 0) {
    productosContainer.innerHTML = `<p>No se encontraron productos con esos filtros.</p>`;
    return;
  }

  productosFiltrados.forEach(producto => {
    const card = document.createElement("article");
    card.classList.add("producto");

    card.innerHTML = `
      <span class="badge">${producto.etiqueta}</span>
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p class="descripcion">${producto.descripcion}</p>
      <p class="precio">$${formatoPrecio(producto.precio)}</p>
      <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
    `;

    productosContainer.appendChild(card);
  });
}

function agregarAlCarrito(id) {
  const producto = productosData.find(item => item.id === id);
  carrito.push(producto);
  guardarCarrito();
  actualizarCarrito();
}

function actualizarCarrito() {
  cartItems.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    cartItems.innerHTML = "<p>Tu carrito está vacío.</p>";
  }

  carrito.forEach((producto, index) => {
    total += producto.precio;

    const item = document.createElement("div");
    item.classList.add("cart-item");

    item.innerHTML = `
      <span>${producto.nombre}</span>
      <strong>$${formatoPrecio(producto.precio)}</strong>
      <button onclick="eliminarDelCarrito(${index})">X</button>
    `;

    cartItems.appendChild(item);
  });

  cartTotal.textContent = formatoPrecio(total);
  cartCount.textContent = carrito.length;
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  actualizarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
}

function guardarCarrito() {
  localStorage.setItem("carritoLassos", JSON.stringify(carrito));
}

function comprarPorWhatsapp() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  let mensaje = "Hola, quiero comprar estos vinos:%0A%0A";
  let total = 0;

  carrito.forEach(producto => {
    mensaje += `- ${producto.nombre}: $${formatoPrecio(producto.precio)}%0A`;
    total += producto.precio;
  });

  mensaje += `%0ATotal: $${formatoPrecio(total)}`;

  const telefono = "573001234567";
  window.open(`https://wa.me/${telefono}?text=${mensaje}`, "_blank");
}

tipoSelect.addEventListener("change", mostrarProductos);
precioRange.addEventListener("input", mostrarProductos);
buscador.addEventListener("input", mostrarProductos);

cartIcon.addEventListener("click", () => {
  cartModal.style.display = "flex";
});

closeCart.addEventListener("click", () => {
  cartModal.style.display = "none";
});

vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
comprarWhatsappBtn.addEventListener("click", comprarPorWhatsapp);

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
});

document.querySelectorAll(".nav a[data-tipo]").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    tipoSelect.value = link.dataset.tipo;
    mostrarProductos();
    nav.classList.remove("active");
  });
});

mostrarProductos();
actualizarCarrito();