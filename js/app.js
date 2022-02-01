const formulario = document.querySelector('#formulario')
      resultado = document.querySelector('#resultado'),
      paginadorDiv = document.querySelector('#paginacion'),
      registroPorPagina = 40;

let totalPaginas;
let iterador;
let paginaActual;

window.onload = () => {
  formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e){
  e.preventDefault();
  const terminoBusqueda = document.querySelector('#termino').value;
  if (terminoBusqueda === '') {
    mostrarAlerta('Agrega un termino de busqueda');
    return;
  }
  buscarImagenes();
}

function buscarImagenes() {

  const termino = document.querySelector('#termino').value;

  const key = '25355099-f8625b2974a551a40a9d3eb9c';
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`;
  fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => {
      totalPaginas = calcularPaginas(resultado.totalHits);
      mostrarImagenes( resultado.hits );
    })
}

function calcularPaginas(total) {
  return parseInt( Math.ceil( total / registroPorPagina ) );
}

// Gernrador de paginacion
function *crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function mostrarImagenes(imagenes) {

  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
  // Iterar sobre el arreglo de imagenes
  imagenes.forEach( imagen => {
    const { previewURL, likes, views, largeImageURL  } = imagen;
    resultado.innerHTML += `
    <div class="card">
      <div class="img">
        <img src="${previewURL}">
      </div>
      <div class="card-info">
        <div class="info-text">
          <p><span class="bold">${views}</span> <i class='bx bx-show'></i></p>
          <p><span class="bold">${likes}</span> <i class='bx bx-like'></i></p>
        </div>
        <a class="btn-card" target="_blank" href=${largeImageURL} rel="noopener noreferrer">Ver Imagen <i class='bx bx-link-external'></i></a>
      </div>
    </div>
    `;
  });

  // Limpia el paginador previo
  while (paginadorDiv.firstChild) {
    paginadorDiv.removeChild(paginadorDiv.firstChild);
  }

  imprimirPaginador();
}

function mostrarAlerta(mensaje){
  if (!document.querySelector('.alerta')) {
    const alerta = document.createElement('p');
    alerta.classList.add('alerta');
    alerta.innerHTML = ` 
      <strong class="font-bold error">Ups!</strong> 
      <span class="block sm:inline">${mensaje}</span>
    `;
    
    formulario.appendChild(alerta);
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function imprimirPaginador() {
  iterador = crearPaginador(totalPaginas);
  while (true) {
    const { value, done } = iterador.next();
    
    if (done) return;

    const boton = document.createElement('a');
    
    boton.href = '#';
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add('paginador-btn');
    
    boton.onclick = () => {
      paginaActual = value;
      buscarImagenes();
    }
    
    paginadorDiv.appendChild(boton);
  }
}