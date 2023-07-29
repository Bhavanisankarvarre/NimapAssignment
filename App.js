import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const Api_key = 'c45a857c193f6302f2b5061c3b85e743';
const baseImageUrl = 'https://image.tmdb.org/t/p/w500';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const history = useHistory();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/search?query=${searchQuery}`);
  };

  return (
    <nav className="navbar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search movies..."
        />
        <button type="submit">Search</button>
      </form>
    </nav>
  );
}

function HomePage() {
  const [popularMovies, setPopularMovies] = useState([]);

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  const fetchPopularMovies = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${Api_key}&language=en-US&page=1`);
      setPopularMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
    }
  };

  return (
    <div className="page">
      <h1>Popular Movies</h1>
      <div className="movie-list">
        {popularMovies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <Link to={`/movie/${movie.id}`}>
              <img src={`${baseImageUrl}/${movie.poster_path}`} alt={movie.title} />
            </Link>
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopRatedPage() {
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  useEffect(() => {
    fetchTopRatedMovies();
  }, []);

  const fetchTopRatedMovies = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${Api_key}&language=en-US&page=1`);
      setTopRatedMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching top-rated movies:', error);
    }
  };

  return (
    <div className="page">
      <h1>Top Rated Movies</h1>
      <div className="movie-list">
        {topRatedMovies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <Link to={`/movie/${movie.id}`}>
              <img src={`${baseImageUrl}/${movie.poster_path}`} alt={movie.title} />
            </Link>
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingMoviePage() {
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  useEffect(() => {
    fetchUpcomingMovies();
  }, []);

  const fetchUpcomingMovies = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${Api_key}&language=en-US&page=1`);
      setUpcomingMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
    }
  };

  return (
    <div className="page">
      <h1>Upcoming Movies</h1>
      <div className="movie-list">
        {upcomingMovies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <Link to={`/movie/${movie.id}`}>
              <img src={`${baseImageUrl}/${movie.poster_path}`} alt={movie.title} />
            </Link>
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SingleMovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);

  useEffect(() => {
    fetchMovieDetail();
    fetchMovieCastDetail();
  }, []);

  const fetchMovieDetail = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${Api_key}&language=en-US`);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie detail:', error);
    }
  };

  const fetchMovieCastDetail = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${Api_key}&language=en-US`);
      setCast(response.data.cast);
    } catch (error) {
      console.error('Error fetching movie cast detail:', error);
    }
  };

  return (
    <div className="page">
      {movie && (
        <>
          <h1>{movie.title}</h1>
          <img src={`${baseImageUrl}/${movie.poster_path}`} alt={movie.title} />
          <h2>Overview</h2>
          <p>{movie.overview}</p>
          {cast.length > 0 && (
            <>
              <h2>Cast</h2>
              <ul>
                {cast.map((actor) => (
                  <li key={actor.id}>{actor.name}</li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}

function SearchedMoviePage() {
  const [searchedMovies, setSearchedMovies] = useState([]);
  const history = useHistory();
  const queryParams = new URLSearchParams(history.location.search);
  const query = queryParams.get('query');

  useEffect(() => {
    if (query) {
      fetchSearchedMovies();
    } else {
      setSearchedMovies([]);
    }
  }, [query]);

  const fetchSearchedMovies = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${Api_key}&language=en-US&query=${query}&page=1`);
      setSearchedMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching searched movies:', error);
    }
  };

  return (
    <div className="page">
      {query && <h1>Search Results for "{query}"</h1>}
      <div className="movie-list">
        {searchedMovies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <Link to={`/movie/${movie.id}`}>
              <img src={`${baseImageUrl}/${movie.poster_path}`} alt={movie.title} />
            </Link>
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="content">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/top-rated" component={TopRatedPage} />
            <Route exact path="/upcoming" component={UpcomingMoviePage} />
            <Route exact path="/movie/:id" component={SingleMovieDetailPage} />
            <Route exact path="/search" component={SearchedMoviePage} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;

