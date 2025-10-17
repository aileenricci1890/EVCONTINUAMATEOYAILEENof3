// CARRITO FUNCIONAL - VERSIÓN MEJORADA CON DETECCIÓN AUTOMÁTICA
document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Página cargada - Iniciando carrito");
    
    // 1. CORREGIR ENLACE DEL CARRITO SI ESTÁ MAL
    corregirEnlaceCarrito();
    
    // 2. CREAR OVERLAY DEL CARRITO SI NO EXISTE
    crearOverlayCarrito();
    
    // 3. CONFIGURAR CONTADOR
    const carritoLink = document.getElementById('carrito-link');
    if (carritoLink) {
        console.log("✅ Enlace del carrito encontrado y corregido");
        
        // Asegurar posición relativa
        carritoLink.style.position = 'relative';
        
        // Crear contador
        if (!document.getElementById('contador-carrito')) {
            const contador = document.createElement('span');
            contador.id = 'contador-carrito';
            contador.textContent = '0';
            contador.style.cssText = `
                position: absolute;
                top: -8px;
                right: -8px;
                background: #ff0055;
                color: white;
                border-radius: 50%;
                width: 22px;
                height: 22px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                z-index: 1001;
            `;
            carritoLink.appendChild(contador);
        }
        
        // Event listener para abrir carrito
        carritoLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("🛒 Click en carrito detectado");
            abrirCarrito();
        });
    } else {
        console.error("❌ ERROR: No se encontró el enlace del carrito");
    }
    
    // 4. CONFIGURAR BOTONES AGREGAR AL CARRITO
    const botonesAgregar = document.querySelectorAll('.agregar-carrito');
    console.log(`✅ ${botonesAgregar.length} botones de agregar encontrados`);
    
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.producto');
            const nombre = card.getAttribute('data-nombre');
            const precio = parseFloat(card.getAttribute('data-precio'));
            
            console.log(`➕ Agregando: ${nombre} - Bs ${precio}`);
            agregarAlCarrito(nombre, precio);
        });
    });
    
    // 5. ACTUALIZAR CONTADOR INICIAL
    actualizarContador();
});

// FUNCIÓN PARA CORREGIR EL ENLACE DEL CARRITO
function corregirEnlaceCarrito() {
    const carritoLink = document.getElementById('carrito-link');
    if (carritoLink && carritoLink.getAttribute('href') !== '#') {
        console.log("🔧 Corrigiendo enlace del carrito...");
        carritoLink.setAttribute('href', '#');
        console.log("✅ Enlace corregido a '#'");
    }
}

// FUNCIÓN PARA CREAR EL OVERLAY DEL CARRITO
function crearOverlayCarrito() {
    // Verificar si ya existe
    if (document.getElementById('carrito-overlay')) {
        console.log("✅ Overlay del carrito ya existe");
        return;
    }
    
    console.log("🔄 Creando overlay del carrito...");
    
    const overlay = document.createElement('div');
    overlay.id = 'carrito-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    overlay.innerHTML = `
        <div style="
            background: #1a1a1a;
            color: white;
            padding: 30px;
            border-radius: 15px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            border: 2px solid #00ff88;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
        ">
            <h2 style="color: #00ff88; text-align: center; margin-bottom: 20px; font-size: 1.5rem;">
                🛒 Tu Carrito de Compras
            </h2>
            
            <div id="lista-carrito" style="min-height: 100px; margin-bottom: 20px;"></div>
            
            <div id="total-carrito" style="
                font-weight: bold; 
                font-size: 1.3rem; 
                color: #00ff88; 
                text-align: center; 
                margin: 20px 0;
                padding: 15px;
                background: rgba(0, 255, 136, 0.1);
                border-radius: 10px;
            ">Total: Bs 0.00</div>
            
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="vaciarCarrito()" style="
                    padding: 12px 25px;
                    background: #ff0055;
                    color: white;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 14px;
                ">Vaciar Carrito</button>
                
                <button onclick="cerrarCarrito()" style="
                    padding: 12px 25px;
                    background: #00ff88;
                    color: #111;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 14px;
                ">Cerrar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    console.log("✅ Overlay del carrito creado exitosamente");
    
    // Agregar evento para cerrar al hacer clic fuera
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            cerrarCarrito();
        }
    });
}

// FUNCIÓN PARA ABRIR CARRITO
function abrirCarrito() {
    console.log("🔓 Abriendo carrito...");
    
    const overlay = document.getElementById('carrito-overlay');
    const lista = document.getElementById('lista-carrito');
    const totalElemento = document.getElementById('total-carrito');
    
    if (!overlay) {
        console.error("❌ ERROR: Overlay no encontrado");
        alert("Error: Recarga la página por favor");
        return;
    }
    
    if (!lista || !totalElemento) {
        console.error("❌ ERROR: Elementos internos no encontrados");
        return;
    }
    
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    console.log(`📦 Productos en carrito: ${carrito.length}`);
    
    // Limpiar lista
    lista.innerHTML = '';
    
    if (carrito.length === 0) {
        lista.innerHTML = `
            <div style="text-align: center; color: #888; font-style: italic; padding: 40px;">
                <p style="font-size: 1.1rem; margin-bottom: 10px;">😔 Tu carrito está vacío</p>
                <p>Agrega algunos productos para verlos aquí</p>
            </div>
        `;
        totalElemento.textContent = 'Total: Bs 0.00';
    } else {
        let total = 0;
        
        carrito.forEach((item, index) => {
            const precio = item.precio || 0;
            const cantidad = item.cantidad || 0;
            const itemTotal = precio * cantidad;
            total += itemTotal;
            
            const div = document.createElement('div');
            div.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid #333;
                margin-bottom: 10px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
            `;
            
            div.innerHTML = `
                <div style="flex: 1;">
                    <strong style="display: block; margin-bottom: 5px;">${item.nombre}</strong>
                    <small style="color: #ccc;">Cantidad: ${cantidad} × Bs ${precio.toFixed(2)}</small>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <strong style="color: #00ff88; font-size: 1.1rem;">Bs ${itemTotal.toFixed(2)}</strong>
                    <button onclick="eliminarDelCarrito(${index})" style="
                        background: #ff0055;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        padding: 8px 12px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: bold;
                    ">Eliminar</button>
                </div>
            `;
            
            lista.appendChild(div);
        });
        
        totalElemento.textContent = `Total: Bs ${total.toFixed(2)}`;
    }
    
    // MOSTRAR EL OVERLAY
    overlay.style.display = 'flex';
    console.log("✅ Carrito abierto exitosamente");
}

// FUNCIÓN PARA AGREGAR AL CARRITO
function agregarAlCarrito(nombre, precio) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const productoExistente = carrito.find(item => item.nombre === nombre);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContador();
    mostrarMensaje(`✅ "${nombre}" agregado al carrito`);
}

// FUNCIÓN PARA ACTUALIZAR CONTADOR
function actualizarContador() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// FUNCIÓN PARA ELIMINAR PRODUCTO
function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (index >= 0 && index < carrito.length) {
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        abrirCarrito();
        actualizarContador();
    }
}

// FUNCIÓN PARA VACIAR CARRITO
function vaciarCarrito() {
    localStorage.removeItem('carrito');
    mostrarMensaje('🗑️ Carrito vaciado');
    abrirCarrito();
    actualizarContador();
}

// FUNCIÓN PARA CERRAR CARRITO
function cerrarCarrito() {
    const overlay = document.getElementById('carrito-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        console.log("🔒 Carrito cerrado");
    }
}

// FUNCIÓN PARA MOSTRAR MENSAJES
function mostrarMensaje(mensaje) {
    // Crear toast si no existe
    let toast = document.getElementById('toast-mensaje');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-mensaje';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #00ff88;
            color: #111;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: 600;
            z-index: 10001;
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.3s ease;
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
        `;
        document.body.appendChild(toast);
    }
    
    toast.textContent = mensaje;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(30px)';
    }, 3000);
}

// Limpiar datos corruptos
try {
    JSON.parse(localStorage.getItem('carrito'));
} catch (e) {
    localStorage.removeItem('carrito');
}