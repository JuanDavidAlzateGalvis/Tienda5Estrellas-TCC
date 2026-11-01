// Funciones de interactividad de Tienda 5 Estrellas
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar la librería AOS para animaciones suaves al desplazarse.
  if (window.AOS) AOS.init({ duration: 650, once: true, offset: 60 });

  // Mantener el contador del carrito durante la navegación de esta página.
  let carrito = 0;
  const contador = document.getElementById("contador-carrito");
  document.querySelectorAll(".agregar-carrito").forEach((boton) => {
    boton.addEventListener("click", () => {
      carrito += 1;
      if (contador) contador.textContent = carrito;
      const nombre = boton.dataset.nombre || "Producto";
      if (window.Swal) {
        Swal.fire({
          icon: "success",
          title: "¡Producto agregado!",
          text: `${nombre} se agregó al carrito de demostración.`,
          confirmButtonColor: "#198754",
          timer: 1800,
          showConfirmButton: false
        });
      }
    });
  });

  // Búsqueda instantánea del catálogo mediante manipulación del DOM.
  const buscador = document.getElementById("buscar");
  const limpiar = document.getElementById("limpiar-busqueda");
  const productos = [...document.querySelectorAll(".product-item")];
  const sinResultados = document.getElementById("sin-resultados");
  const resultado = document.getElementById("resultado-busqueda");
  function filtrarProductos() {
    if (!buscador) return;
    const consulta = buscador.value.trim().toLocaleLowerCase("es");
    let visibles = 0;
    productos.forEach((tarjeta) => {
      const texto = `${tarjeta.dataset.producto} ${tarjeta.dataset.categoria} ${tarjeta.textContent}`.toLocaleLowerCase("es");
      const coincide = texto.includes(consulta);
      tarjeta.classList.toggle("d-none", !coincide);
      if (coincide) visibles++;
    });
    if (sinResultados) sinResultados.classList.toggle("d-none", visibles !== 0);
    if (resultado) resultado.textContent = consulta ? `${visibles} producto(s) encontrado(s).` : `${visibles} productos disponibles.`;
  }
  if (buscador) {
    buscador.addEventListener("input", filtrarProductos);
    filtrarProductos();
  }
  if (limpiar) limpiar.addEventListener("click", () => {
    buscador.value = "";
    filtrarProductos();
    buscador.focus();
  });

  // Mostrar detalles de cada producto en el modal de Bootstrap.
  document.querySelectorAll(".ver-detalle").forEach((boton) => {
    boton.addEventListener("click", () => {
      const nombre = boton.dataset.nombre;
      const descripcion = boton.dataset.descripcion;
      const imagen = boton.dataset.imagen;
      const categoria = boton.dataset.categoria;
      const titulo = document.getElementById("modalProductoTitulo");
      const contenido = document.getElementById("modalProductoContenido");
      if (titulo && contenido) {
        titulo.textContent = nombre;
        contenido.innerHTML = `<img src="${imagen}" alt="${nombre}" class="img-fluid rounded mb-3" style="max-height:220px;object-fit:contain;width:100%"><p>${descripcion}</p><p><strong>Categoría:</strong> ${categoria}</p><p class="text-secondary small">Precio por confirmar en tienda.</p>`;
      }
    });
  });

  // Validación del formulario de contacto: el envío es simulado, no usa servidor.
  const formulario = document.getElementById("form-contacto");
  if (formulario) {
    const campos = [...formulario.querySelectorAll("input, textarea")];
    campos.forEach((campo) => {
      campo.addEventListener("input", () => {
        if (campo.checkValidity()) {
          campo.classList.add("is-valid");
          campo.classList.remove("is-invalid");
        } else {
          campo.classList.add("is-invalid");
          campo.classList.remove("is-valid");
        }
      });
    });
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();
      campos.forEach((campo) => {
        campo.classList.toggle("is-valid", campo.checkValidity());
        campo.classList.toggle("is-invalid", !campo.checkValidity());
      });
      formulario.classList.add("was-validated");
      const invalido = campos.find((campo) => !campo.checkValidity());
      if (invalido) {
        invalido.focus();
        if (window.Swal) Swal.fire({
          icon: "warning",
          title: "Revisa el formulario",
          text: "Completa los campos correctamente antes de continuar.",
          confirmButtonColor: "#198754"
        });
        return;
      }
      if (window.Swal) {
        Swal.fire({
          icon: "success",
          title: "¡Mensaje recibido!",
          text: "La demostración de envío finalizó correctamente. No se transmitieron datos a un servidor.",
          confirmButtonColor: "#198754"
        }).then(() => {
          formulario.reset();
          formulario.classList.remove("was-validated");
          campos.forEach((campo) => campo.classList.remove("is-valid", "is-invalid"));
        });
      } else {
        formulario.reset();
        alert("Mensaje recibido en la demostración.");
      }
    });
  }
});
