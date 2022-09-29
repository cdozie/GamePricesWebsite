import {createRoot} from 'react-dom/client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useEffect } from 'react';
import { Routes, Route, useParams, useNavigate, BrowserRouter, useLocation} from "react-router-dom";
import RegisterForm from './registerform';
import Layout from './layout';
import ResizeLayout from './resizelayout';
import LoginForm from './login';
import Homepage from './hmpg';
import Gamepage from './gamepage';
import Wishlist from './wishlst';
import AccntPG from './accountpg';
import ForgotPassForm from './forgotpass';
import ChangePassForm from './changepass';
import GameSearchPG from './gamesearch';
import ErrPG from './errorpg';
import ErrorLayout from './errorlayout';
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
const container = document.getElementById('react-app');
if (container){
const root = createRoot(container);
root.render(
    <BrowserRouter>
    
    {/* <Header />  */}
      <ScrollToTop/>
      <Routes>
        <Route path="/login" element={<ResizeLayout child = {<LoginForm />} Logged = {false} overflow = {true} form = {true}/>} />
        <Route path="/forgotpassword" element={<ResizeLayout child = {<ForgotPassForm />} Logged = {false} overflow = {true} form = {true}/>} />
        
        <Route path="/register" element={<ResizeLayout child = {<RegisterForm />} Logged = {false} overflow = {true} form = {true}/>} />
        <Route path = "/" element = {<ResizeLayout child = {<Homepage/>} Logged = {true} overflow  = {false}/>}/>
        <Route path = "/game/:gameid" element = {<ResizeLayout child = {<Gamepage/>} Logged = {true} overflow  = {false}/>}/>
        <Route path = "/gamesearch" element = {<ResizeLayout child = {<GameSearchPG/>} Logged = {true} overflow  = {false}/>}/>
        {/* <Route path = "account/wishlist" element = {() => <AccountLayout child = {<AccWishlist />} />} /> */}
        {/* <Route path = "/"  */}
        <Route path = "/wishlist" element = {<ResizeLayout child = {<Wishlist/>} Logged = {true} overflow  = {false}/>}/>
        <Route path = "/account" element = {<ResizeLayout child = {<AccntPG/>} Logged = {true} overflow  = {false}/>}/>
        <Route path = "/account/changepassword" element = {<ResizeLayout child = {<ChangePassForm/>} Logged = {true} overflow  = {false}/>}/>
        {/* <Route path = "/errorhandler" element = {<ResizeLayout child = {<ChangePassForm/>} Logged = {false} overflow  = {false}/>}/> */}
      </Routes>
    </BrowserRouter>

)};
const errorcontainer = document.getElementById('error-app');

if (errorcontainer){
  const errorroot = createRoot(errorcontainer);
  errorroot.render(
    <BrowserRouter>
    <ErrorLayout child = {<ErrPG/>} Logged = {true} overflow  = {false}/> 
    </BrowserRouter>

  );

}

