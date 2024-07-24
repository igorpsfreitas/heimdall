import React, {
  useEffect
} from 'react';
import logo from '../logo.svg';
import './App.css';
import { getProducts } from '../API/projectServices';

function Apps() {
  
  // Teste de chamada de API
  useEffect(() => {
    const fetchData = async () => {
      const products = await getProducts();
      console.log(products);
    };
    fetchData();
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default Apps;