const APIURL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280/";
const main = document.querySelector("main");

async function getMovies() {
  const resp = await fetch(APIURL);
  const respData = await resp.json();
  console.log(resData)

  respData.results.forEach((movie) => {
    const { poster_path, title, vote_average } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.innerHTML = `
      <div class="movie">
        <div class="shadow">
          <img src="${IMGPATH + poster_path}" alt="${title}">
          <div class="movie-info">
            <div style="display:flex;justify-content:space-between;">
              <h3>${title}</h3>
              <span>${vote_average}</span>
            </div>
          </div>
        </div>
      </div>`;

    main.appendChild(movieEl);
  });

  return respData;
}

getMovies();
