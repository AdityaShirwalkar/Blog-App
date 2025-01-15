import './App.css';
import Post from './post';
import Header from './Header';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <Layout></Layout>
      }>
        <Route index element={
          <IndexPage></IndexPage>
        } />
        <Route path="/login" element={
          <LoginPage></LoginPage>
        } />
        <Route path="/register" element={
          <RegisterPage></RegisterPage>
        } />
      </Route>
    </Routes>
  );
}

export default App;
