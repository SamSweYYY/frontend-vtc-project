import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Localisation from './components/Localisation';
import LoginForm from './components/LoginDriver';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import Reservation from './components/Reservation';
import MesReservations from './components/MesReservations';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/localisation" element={<Localisation />} />
                <Route path="/Login" element={<LoginForm />} />
                <Route path="/SignUp" element={<SignUp/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/reserver" element={<Reservation />} />
                <Route path="/mes-reservations" element={<MesReservations />} />
            </Routes>
        </Router>
    )
}

export default App;
