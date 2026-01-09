import { useEffect, useState, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from './Pages/Public/Home';
import Contact from './Pages/Public/Contact';
import About from './Pages/Public/About';

interface ComponentProps {
  children ?: React.ReactNode;
}

type Props = ComponentProps;

function App(props: Props) {

  return (
    <Router>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
