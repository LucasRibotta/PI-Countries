import React from "react";
import {useLocation } from "react-router-dom";
import style from "./Footer.module.css";


export default function Footer(){
  const location = useLocation();
  const allowedRoutes = ["/home", "/about"];


  const isAllowedRoute = allowedRoutes.includes(location.pathname) || location.pathname.startsWith("/detail/");

  if (!isAllowedRoute) {
    return null; 
  }

  return (
    <footer>
      <p className={style.footer}>&copy; 2023 Creado por Lucas Ribotta. Todos los derechos reservados.</p>
      
    </footer>
  );
};


