import { useEffect, useState, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from './Pages/Public/Home';
import Contact from './Pages/Public/Contact';
import About from './Pages/Public/About';
import Solutions from './Pages/Public/Solutions';
import Materials from './Pages/Public/Materials';
import Careers from './Pages/Public/Careers';
import LogisticsCoordinator from './Pages/Public/LogisticsCoordinator';
import ForkliftDriver from './Pages/Public/ForkliftDriver';
import AccountManager from './Pages/Public/AccountManager';

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
        <Route path='/solutions' element={<Solutions />} />
        <Route path='/materials' element={<Materials />} />
        <Route path='/careers' element={<Careers />} />

        <Route path='/careers/logistics-coordinator' element={<LogisticsCoordinator />} />
        <Route path='/careers/forklift-driver' element={<ForkliftDriver />} />
        <Route path='/careers/account-manager' element={<AccountManager />} />
      </Routes>
    </Router>
  );
}

export default App;
