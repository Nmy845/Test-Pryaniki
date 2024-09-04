import './styles/App.css';
import SignIn from "./pages/sign-in/SignIn";
import {Route, Routes, Navigate} from "react-router-dom";
import MainPage from "./pages/main-page/MainPage";
import {useSelector} from "react-redux";


function App() {
    const { token } = useSelector((state) => state.auth);
    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<SignIn />} />
                <Route
                    path="/main"
                    element={token ? <MainPage /> : <Navigate to="/login" replace />}
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </div>
    );
}

export default App;