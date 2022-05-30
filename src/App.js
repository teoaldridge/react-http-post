//To prepare the project for learning 'sending GET requests', 
//we use Firebase. The project (database) I created there is called react-http
//https://console.firebase.google.com/project/react-http-23f25/database/react-http-23f25-default-rtdb/data


import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


    //here we changd the url we fetch from to our firebase database, and add one extra segment at the end-
    //movies.json- This addition will add a new node to my database
    //.jon is important- firebase needs this .json in the url, otherwise you won't be able to send requests from it. 

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      //here we don't specify that the method is GET because GET is the default method when using the fetch API
      const response = await fetch('https://react-http-23f25-default-rtdb.europe-west1.firebasedatabase.app/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      //console.log(data);

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
      
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);


  //this will be an a-synchronous task, so we add async-await here. 
  async function addMovieHandler(movie) {
    //fetch API can be used not only to GET data, but it also can be used to POST data.
    //the fetch API's default is a GET request, 
    //but you can add a second argument to the fetch request
    //and you can configure it to a POST request!
    const response = await fetch('https://react-http-23f25-default-rtdb.europe-west1.firebasedatabase.app/movies.json', {
      method: 'POST',
      //firebase will automatically create a resource when you send a POST request to it.
      //- not all APIs do this- but firebase does. 
      //so you have to add that resource which will be stored-
      // we do this by the body option here in this fetch API configuration object.
      //body wants JSON data
      //To convert a JS object to JSON, we can use the JS utility method JSON.stringify()
      //JSON is built in object in browser side JavaScript, and we call 
      //JSON.stringify() - this turns a JS object or array into a JSON format.
      body: JSON.stringify(movie),
      //we need to add a header
      //technically, this is not required by firebase, this would work even if this is not set
      //but a lot of other REST APIs might require this header, which describes the content that will be sent. 
      headers: {
        'Content-type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
