import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header, Footer } from "./components";
import { Home, GestionIngredientes } from "./pages";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='gestionIngredientes' element={<GestionIngredientes/>}/>
        </Routes>

        <Footer />    
      </BrowserRouter>
    </div>
  );
}

export default App;