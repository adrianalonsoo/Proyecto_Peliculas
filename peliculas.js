
window.onload=()=> {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');
    //No se utiliza el boton por que esta el scroll infinito
    const loadMoreButton = document.getElementById('loadMoreButton');
    const movieDetail = document.getElementById('movieDetail');
    const backButton = document.getElementById('volverBoton');
    const searchRespuesta = document.getElementById('search-results');

    //Variable pagina actual
    let currentPage = 1;
    //Variable busqueda
    let currentSearch = '';

    //Evento para buscar las peliculas
    searchInput.addEventListener('input', function(event){
        const Q = event.target.value;
        if(Q.length >= 3){
            movieDetail.classList.add('d-none');
            currentSearch = searchInput.value;
            currentPage = 1;
            resultsContainer.innerHTML = '';
            fetchMovies(currentSearch, currentPage);
        }
    })
    
    //Evento para la barra de busqueda
    searchButton.addEventListener('click', function() {
        movieDetail.classList.add('d-none');
        //Obtenemos el input de la barra de busqueda
        currentSearch = searchInput.value;
        currentPage = 1;
        resultsContainer.innerHTML = '';
        //Llamamos a la funcion pasandole la pagina actual y la busqueda realizada
        fetchMovies(currentSearch, currentPage);
    });

   /* loadMoreButton.addEventListener('click', function() {
        currentPage++;
        fetchMovies(currentSearch, currentPage);
    }); */

    //Evento para realizar el scroll infinito
    window.addEventListener('scroll', ()=> {
        if(!movieDetail.classList.contains('d-none')){
            return;
        }
        //Calcular cuando el scroll llega al final de la pagina
        if((window.innerHeight + window.scrollY) >= document.body.offsetHeight){
            currentPage++;
            fetchMovies(currentSearch, currentPage);  
        } 
    });

    //Evento para volver a la pantalla principal
    backButton.addEventListener('click', function() {
        backButton.classList.add('d-none');
        movieDetail.classList.add('d-none');
        document.getElementById('search-results').classList.remove('d-none');
    });

    //Funcion Buscar peliculas
    function fetchMovies(search, page) {
        const url = `https://www.omdbapi.com/?apikey=948393d7&s=${search}&page=${page}`;
        //Fetch para obtener la respuesta de la api
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.Response === "True") {
                    //Si la respuesta es true se muestra la funcion mostrar resultados
                    displayResults(data.Search);
                } else {
                    //Si no se encuentran peliculas, lo mostramos en la pantalla
                    resultsContainer.innerHTML = `<p>No se encontraron películas.</p>`;
                }

            })
            //Capturar errores
            .catch(error => {
                console.error('Error:', error);
            });
    }

    //Funcion para mostrar los resultados de las peliculas
    function displayResults(movies) {
        movies.forEach(movie => {
            //Clase del css
            searchRespuesta.classList.remove('d-none');
            //Creamos div para las peliculas
            const movieElement = document.createElement('div');
            movieElement.className = 'col-md-4 mb-3';
            //Insertamos mediante movieElement los datos de las peliculas
            movieElement.innerHTML = `
                <div class="card">
                    <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}" onerror="this.onerror=null; this.src='default-image.jpg';">
                    <div class="card-body">
                        <h5 class="card-title">${movie.Title}</h5>
                        <p class="card-text">${movie.Year}</p>
                        <button onclick="showMovieDetails('${movie.imdbID}')" class="btn btn-primary">Ver detalles</button>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(movieElement);
            
        });
    }
    //Funcion para mostrar los detalles de las peliculas
    window.showMovieDetails = function(imdbID) {
        const url = `https://www.omdbapi.com/?apikey=948393d7&i=${imdbID}`;
        //Fetch para obtener la respuesta de la api
        fetch(url)
            .then(response => response.json())
            .then(data => {
                //Variable numero para saber el numero de ratings que tiene la pelicula
                ratings(data);
                //Quitamos la clase d-none 
                backButton.classList.remove('d-none');
                movieDetail.classList.remove('d-none');
                document.getElementById('search-results').classList.add('d-none');
            })
            //Capturar errores
            .catch(error => {
                console.error('Error:', error);
            });
    };

    //Funcion para crear los ratings e implemetar todos los datos de las peliculas en el html
    function ratings(data){
        var numero=data.Ratings.length;
        //Los ratings son diferentes para cada pelicula los muestra segun los que tenga cada una
        if(numero==1){
            movieDetail.innerHTML = `
            <h2>${data.Title}</h2>
            <p><strong>Director:</strong> ${data.Director}</p>
            <p><strong>Actores:</strong> ${data.Actors}</p>
            <p><strong>Sinopsis:</strong> ${data.Plot}</p>
            <p><strong>Ratings:</strong> ${data.Ratings[0].Source} ${data.Ratings[0].Value}</p>
            <img src="${data.Poster}" alt="${data.Title}" onerror="this.onerror=null; this.src='default-image.jpg';">
        `;
        //Si los ratings son dos se muestran y añadimos los demas aspectos de la pelicula
        }else if(numero==2){
            movieDetail.innerHTML = `
            <h2>${data.Title}</h2>
            <p><strong>Director:</strong> ${data.Director}</p>
            <p><strong>Actores:</strong> ${data.Actors}</p>
            <p><strong>Sinopsis:</strong> ${data.Plot}</p>
            <p><strong>Ratings:</strong> ${data.Ratings[0].Source} ${data.Ratings[0].Value}
            ${data.Ratings[1].Source} ${data.Ratings[1].Value}</p>
            <img src="${data.Poster}" alt="${data.Title}" onerror="this.onerror=null; this.src='default-image.jpg';">
        `;
        }
        //Si los ratings son mas de dos se muestran mas todos los demas detalles de la pelicula
        else{
            movieDetail.innerHTML = `
            <h2>${data.Title}</h2>
            <p><strong>Director:</strong> ${data.Director}</p>
            <p><strong>Actores:</strong> ${data.Actors}</p>
            <p><strong>Sinopsis:</strong> ${data.Plot}</p>
            <p><strong>Ratings:</strong> ${data.Ratings[0].Source} ${data.Ratings[0].Value}<br>
            ${data.Ratings[1].Source} ${data.Ratings[1].Value} <br>${data.Ratings[2].Source} ${data.Ratings[2].Value}</p>
            <img src="${data.Poster}" alt="${data.Title}" onerror="this.onerror=null; this.src='default-image.jpg';">
        `;
        }
        return movieDetail;
    }
};


