import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <p className="footer-links">
        <a
          href="https://github.com/timilxr/React-shopping-cart-frontend"
          target="_blank"
        >
          View Source on Github
        </a>
        <span> / </span>
        <a href="mailto:ayorindeoluwatimilehin@gmail.com" target="_blank">
          Need any help?
        </a>
        <span> / </span>
        <a href="https://twitter.com/timilxr" target="_blank">
          Say Hi on Twitter
        </a>
        <span> / </span>
        <a href="https://sivadass.in" target="_blank">
          Read My Blog
        </a>
      </p>
      <p>
        &copy; {currentYear} <strong>Urbanc3ntre</strong> - Clothing Store
      </p>
    </footer>
  );
};

export default Footer;
