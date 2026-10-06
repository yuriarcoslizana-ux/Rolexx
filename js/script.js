const productos = [
    { id: 1, nombre: "Rolex Submariner Date 41mm", precio: 12325 },
    { id: 2, nombre: "Rolex Cosmograph Daytona 'Panda'", precio: 31050 },
    { id: 3, nombre: "Rolex GMT-Master II 'Pepsi' 40mm", precio: 20250 },
    { id: 4, nombre: "Rolex Datejust 41 Oystersteel", precio: 11520 },

    { id: 5, nombre: "Omega Speedmaster Moonwatch", precio: 7380 },
    { id: 6, nombre: "Omega Seamaster Diver 300M", precio: 5310 },
    { id: 7, nombre: "Omega Aqua Terra 150M Co-Axial", precio: 5440 },

    { id: 8, nombre: "Cartier Tank Louis Cartier Oro 18k", precio: 11900 },
    { id: 9, nombre: "Cartier Santos de Cartier Large", precio: 7110 },
    { id: 10, nombre: "Cartier Ballon Bleu de Cartier 42mm", precio: 6705 },

    { id: 11, nombre: "TAG Heuer Carrera Chronograph 42mm", precio: 5525 },
    { id: 12, nombre: "TAG Heuer Aquaracer Professional 300", precio: 3060 },
    { id: 13, nombre: "TAG Heuer Monaco Calibre 11 'McQueen'", precio: 6630 },

    { id: 14, nombre: "Tissot PRX Powermatic 80 40mm", precio: 682 },
    { id: 15, nombre: "Tissot Gentleman Powermatic 80", precio: 726 },
    { id: 16, nombre: "Tudor Black Bay 58 39mm Acero", precio: 3690 }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const carrPane = document.getElementById("carr-pane");
const carrFond = document.getElementById("carr-fond");
const btnCarrito = document.getElementById("btn-carrito");
const btnCerr = document.getElementById("btn-cerr");
const carrElem = document.getElementById("carr-elem");
const carrTota = document.getElementById("carr-tota");
const carrNum = document.getElementById("carr-num");
const btnVaci = document.getElementById("btn-vaci");

function abrirCarrito() {
    if (carrPane) carrPane.classList.add("activo");
    if (carrFond) carrFond.classList.add("activo");
}

function cerrarCarrito() {
    if (carrPane) carrPane.classList.remove("activo");
    if (carrFond) carrFond.classList.remove("activo");
}

if (btnCarrito) btnCarrito.addEventListener("click", abrirCarrito);
if (btnCerr) btnCerr.addEventListener("click", cerrarCarrito);
if (carrFond) carrFond.addEventListener("click", cerrarCarrito);

function agregarAlCarrito(idProducto) {
    const productoEnCarrito = carrito.find(item => item.id === idProducto);

    if (productoEnCarrito && productoEnCarrito.precio > 10000 && productoEnCarrito.cantidad >= 2) {
        alert("⚠️ solo se permite un máximo de 2 unidades para piezas mayores a $10,000 USD.");
        return;
    }

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        const productoOriginal = productos.find(p => p.id === idProducto);
        if (productoOriginal) {
            carrito.push({
                ...productoOriginal,
                cantidad: 1
            });
        }
    }

    actualizarInterfazCarrito();
    abrirCarrito();
}

function cambiarCantidad(idProducto, cambio) {
    const producto = carrito.find(item => item.id === idProducto);

    if (producto) {
        if (cambio > 0 && producto.precio > 10000 && producto.cantidad >= 2) {
            alert("⚠️ Límite de 2 unidades alcanzado para esta pieza de alta gama.");
            return;
        }

        producto.cantidad += cambio;
        if (producto.cantidad <= 0) {
            eliminarDelCarrito(idProducto);
            return;
        }
    }
    actualizarInterfazCarrito();
}

function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter(item => item.id !== idProducto);
    actualizarInterfazCarrito();
}

if (btnVaci) {
    btnVaci.addEventListener("click", () => {
        carrito = [];
        actualizarInterfazCarrito();
    });
}

function actualizarInterfazCarrito() {
    if (!carrElem) return;

    carrElem.innerHTML = "";

    if (carrito.length === 0) {
        carrElem.innerHTML = "<p style='text-align:center; color:#7f8c8d; padding:20px 0;'>El carrito está vacío</p>";
        if (carrTota) carrTota.innerText = "0.00";
        if (carrNum) carrNum.innerText = "0";
        localStorage.setItem("carrito", JSON.stringify(carrito));
        return;
    }

    let cuentaTotal = 0;
    let totalItems = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        cuentaTotal += subtotal;
        totalItems += item.cantidad;

        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item-carr");

        itemDiv.innerHTML = `
            <div style="flex:1; padding-right:10px;">
                <h4 style="margin:0 0 5px; font-size:0.85rem; color:#fff;">${item.nombre}</h4>
                <p style="margin:0; font-size:0.75rem; color:#aaa;">$${item.precio.toLocaleString()} USD c/u</p>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
                <button class="btn-cant" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                <span style="color:#fff; font-size:0.85rem; min-width:18px; text-align:center;">${item.cantidad}</span>
                <button class="btn-cant" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                <button class="btn-elim" onclick="eliminarDelCarrito(${item.id})">✕</button>
            </div>
        `;

        carrElem.appendChild(itemDiv);
    });

    if (carrTota) carrTota.innerText = cuentaTotal.toLocaleString();
    if (carrNum) carrNum.innerText = totalItems;

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

actualizarInterfazCarrito();
