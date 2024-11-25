import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Localisation from './components/Localisation';
import LoginForm from './components/LoginDriver';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <div>
                <div className='bar_nav'>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/localisation" element={<Localisation />} /> {/* Route pour la page de localisation */}
                        <Route path="/Login" element={<LoginForm />} />
                        <Route path="/SignUp" element={<SignUp/>} />
                        <Route path="/profile" element={<Profile/>} />
                    </Routes>
                </div>
            </div>
        </Router>
    )
}

export default App;
