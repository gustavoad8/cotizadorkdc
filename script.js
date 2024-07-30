document.addEventListener('DOMContentLoaded', () => {
    const { jsPDF } = window.jspdf;
    const nombreCliente = document.getElementById('nombreCliente');
    const emailCliente = document.getElementById('emailCliente');
    const telefonoCliente = document.getElementById('telefonoCliente');
    const fechaElement = document.getElementById('fecha');
    const consecutivoElement = document.getElementById('consecutivo');
    const listaProductos = document.getElementById('listaProductos');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const envioInput = document.getElementById('envioInput');
    const actualizarEnvioButton = document.getElementById('actualizarEnvio');
    const envioDisplay = document.getElementById('envioDisplay');
    const generarPDFButton = document.getElementById('generarPDF');
    const observaciones = document.getElementById('observaciones');

    // Array para almacenar productos
    const productos = [];

    // Establecer fecha actual
    const fechaActual = new Date().toLocaleDateString('es-CO');
    fechaElement.textContent = fechaActual;

    // Establecer número consecutivo aleatorio
    const consecutivo = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
    consecutivoElement.textContent = consecutivo;

    // Actualizar datos del cliente
    const formularioCliente = document.getElementById('formularioCliente');
    formularioCliente.addEventListener('input', () => {
        nombreCliente.textContent = document.getElementById('cliente').value;
        emailCliente.textContent = document.getElementById('email').value;
        telefonoCliente.textContent = document.getElementById('telefono').value;
    });

    // Función para formatear números con puntos de miles y sin decimales
    function formatearNumero(numero) {
        return numero.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    // Agregar producto a la lista
    document.getElementById('agregarProducto').addEventListener('click', () => {
        const producto = document.getElementById('producto').value;
        const cantidad = parseInt(document.getElementById('cantidad').value, 10);
        const precio = parseFloat(document.getElementById('precio').value);

        if (producto && cantidad && !isNaN(precio)) {
            const total = Math.round(cantidad * precio);
            productos.push({ producto, cantidad, precio: Math.round(precio), total });
            actualizarListaProductos();
        }
    });

    // Actualizar lista de productos
    function actualizarListaProductos() {
        listaProductos.innerHTML = ''; // Limpiar tabla
        let subtotal = 0;

        productos.forEach((prod, index) => {
            subtotal += prod.total;
            listaProductos.innerHTML += `
                <tr>
                    <td>${prod.producto}</td>
                    <td>${prod.cantidad}</td>
                    <td>${formatearNumero(prod.precio)}</td>
                    <td>${formatearNumero(prod.total)}</td>
                    <td><button onclick="eliminarProducto(${index})">Eliminar</button></td>
                </tr>
            `;
        });

        const subtotalFormateado = formatearNumero(subtotal);
        subtotalElement.textContent = `$${subtotalFormateado}`;
        actualizarTotal();
    }

    // Eliminar producto de la lista
    window.eliminarProducto = function(index) {
        productos.splice(index, 1);
        actualizarListaProductos();
    };

    // Actualizar total
    function actualizarTotal() {
        const envio = parseInt(envioInput.value, 10) || 0;
        const subtotal = parseInt(subtotalElement.textContent.replace('$', '').replace(/\./g, ''), 10) || 0;
        const total = subtotal + envio;
        envioDisplay.textContent = `$${formatearNumero(envio)}`;
        totalElement.textContent = `$${formatearNumero(total)}`;
    }

    actualizarEnvioButton.addEventListener('click', actualizarTotal);

    // Generar PDF
    generarPDFButton.addEventListener('click', () => {
        const pdf = new jsPDF();
        const cotizacionElement = document.getElementById('cotizacionContainer');

        // Establecer el contenido del PDF
        pdf.html(cotizacionElement, {
            callback: (doc) => {
                doc.save('cotizacion.pdf');
            },
            x: 10,
            y: 10
        });
    });
});
