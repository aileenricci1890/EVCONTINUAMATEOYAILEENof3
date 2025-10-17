// CARRITO FUNCIONAL - VERSIÓN CORREGIDA SIN NaN
document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Página cargada - Carrito inicializado");
    
    // Inicializar contador inmediatamente
    inicializarContador();
    
    // Configurar enlace del carrito
    const carritoLink = document.getElementById('carrito-link');
    if (carritoLink) {
        // Asegurar que el link tenga posición relativa
        carritoLink.style.position = 'relative';
        
        // Crear contador si no existe
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
            console.log("🛒 Abriendo carrito...");
            abrirCarrito();
        });
    }

    // Configurar botones "Agregar al carrito"
    const botonesAgregar = document.querySelectorAll('.agregar-carrito');
    console.log(`✅ Encontrados ${botonesAgregar.length} botones de agregar al carrito`);
    
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
    
    // Inicializar overlay del carrito
    inicializarOverlay();
});

// INICIALIZAR CONTADOR - EVITA NaN
function inicializarContador() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 0), 0);
    
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        contador.textContent = totalItems.toString();
        contador.style.display = totalItems > 0 ? 'flex' : 'none';
        console.log(`🔢 Contador inicializado: ${totalItems} productos`);
    }
}

// INICIALIZAR OVERLAY DEL CARRITO
function inicializarOverlay() {
    // Verificar si el overlay ya existe
    if (!document.getElementById('carrito-overlay')) {
        console.log("❌ Overlay no encontrado, creando...");
        
        const overlay = document.createElement('div');
        overlay.id = 'carrito-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 15, 15, 0.98);
            backdrop-filter: blur(10px);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        overlay.innerHTML = `
            <div class="carrito-content">
                <h2>🛒 Tu Carrito de Compras</h2>
                <div id="lista-carrito"></div>
                <div id="total-carrito">Total: Bs 0.00</div>
                <div class="carrito-botones">
                    <button onclick="vaciarCarrito()">Vaciar Carrito</button>
                    <button onclick="cerrarCarrito()">Cerrar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        console.log("✅ Overlay creado exitosamente");
    }
}

// FUNCIÓN PARA AGREGAR PRODUCTOS AL CARRITO
function agregarAlCarrito(nombre, precio) {
    try {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        // Validar datos
        if (!nombre || !precio) {
            console.error("❌ Datos del producto inválidos");
            return;
        }
        
        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.nombre === nombre);
        
        if (productoExistente) {
            productoExistente.cantidad = (productoExistente.cantidad || 0) + 1;
        } else {
            carrito.push({
                nombre: nombre,
                precio: precio,
                cantidad: 1
            });
        }
        
        // Guardar en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Actualizar interfaz
        actualizarContador();
        mostrarMensaje(`✅ "${nombre}" agregado al carrito`);
        
        console.log("📦 Carrito actualizado:", carrito);
        
    } catch (error) {
        console.error("❌ Error al agregar al carrito:", error);
        mostrarMensaje("❌ Error al agregar producto");
    }
}

// FUNCIÓN PARA ACTUALIZAR CONTADOR - CORREGIDA
function actualizarContador() {
    try {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 0), 0);
        
        const contador = document.getElementById('contador-carrito');
        if (contador) {
            contador.textContent = totalItems.toString(); // Asegurar que sea string
            contador.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    } catch (error) {
        console.error("❌ Error actualizando contador:", error);
    }
}

// FUNCIÓN PARA ABRIR CARRITO
function abrirCarrito() {
    try {
        const overlay = document.getElementById('carrito-overlay');
        const lista = document.getElementById('lista-carrito');
        const totalElemento = document.getElementById('total-carrito');
        
        if (!overlay || !lista || !totalElemento) {
            console.error("❌ Elementos del carrito no encontrados");
            mostrarMensaje("❌ Error: Recarga la página");
            return;
        }
        
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        // Limpiar lista
        lista.innerHTML = '';
        
        if (carrito.length === 0) {
            lista.innerHTML = '<p style="text-align: center; color: #888; font-style: italic; padding: 2rem;">Tu carrito está vacío</p>';
            totalElemento.textContent = 'Total: Bs 0.00';
        } else {
            let total = 0;
            
            carrito.forEach((item, index) => {
                const precio = item.precio || 0;
                const cantidad = item.cantidad || 0;
                const itemTotal = precio * cantidad;
                total += itemTotal;
                
                const div = document.createElement('div');
                div.className = 'carrito-item';
                div.innerHTML = `
                    <div>
                        <strong>${item.nombre || 'Producto'}</strong>
                        <br>
                        <small>Cantidad: ${cantidad} × Bs ${precio.toFixed(2)}</small>
                    </div>
                    <div>
                        <strong style="color: #00ff88;">Bs ${itemTotal.toFixed(2)}</strong>
                        <button onclick="eliminarDelCarrito(${index})" class="btn-eliminar">Eliminar</button>
                    </div>
                `;
                
                lista.appendChild(div);
            });
            
            totalElemento.textContent = `Total: Bs ${total.toFixed(2)}`;
        }
        
        overlay.style.display = 'flex';
        
    } catch (error) {
        console.error("❌ Error abriendo carrito:", error);
        mostrarMensaje("❌ Error al abrir carrito");
    }
}

// FUNCIÓN PARA ELIMINAR PRODUCTOS
function eliminarDelCarrito(index) {
    try {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        if (index >= 0 && index < carrito.length) {
            const productoEliminado = carrito[index].nombre;
            carrito.splice(index, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            
            abrirCarrito();
            actualizarContador();
            mostrarMensaje(`🗑️ "${productoEliminado}" eliminado`);
        }
    } catch (error) {
        console.error("❌ Error eliminando producto:", error);
    }
}

// FUNCIÓN PARA VACIAR CARRITO
function vaciarCarrito() {
    try {
        localStorage.removeItem('carrito');
        mostrarMensaje('🗑️ Carrito vaciado');
        abrirCarrito();
        actualizarContador();
    } catch (error) {
        console.error("❌ Error vaciando carrito:", error);
    }
}

// FUNCIÓN PARA CERRAR CARRITO
function cerrarCarrito() {
    const overlay = document.getElementById('carrito-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// FUNCIÓN PARA MOSTRAR MENSAJES
function mostrarMensaje(mensaje) {
    try {
        let toast = document.getElementById('toast-mensaje');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-mensaje';
            document.body.appendChild(toast);
        }
        
        toast.textContent = mensaje;
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(30px)';
        }, 3000);
        
    } catch (error) {
        console.error("❌ Error mostrando mensaje:", error);
    }
}

// Cerrar carrito al hacer clic fuera
document.addEventListener('click', function(e) {
    const overlay = document.getElementById('carrito-overlay');
    if (overlay && overlay.style.display === 'flex' && e.target === overlay) {
        cerrarCarrito();
    }
});

// Limpiar localStorage si hay datos corruptos (solo para desarrollo)
function limpiarCarritoSiCorrupto() {
    try {
        JSON.parse(localStorage.getItem('carrito'));
    } catch (error) {
        console.log("🔄 Limpiando carrito corrupto...");
        localStorage.removeItem('carrito');
    }
}

// Ejecutar limpieza al cargar
limpiarCarritoSiCorrupto();