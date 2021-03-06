import React, { useContext } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import {
  CartStateContext,
  CartDispatchContext,
  toggleCartPopup
} from "contexts/cart";
import {
  orderStateContext,
  orderDispatchContext,
  toggleOrdersPopup
} from "contexts/order";
import { CommonDispatchContext, setSearchKeyword } from "contexts/common";
import CartPreview from "components/CartPreview";
import OrderPreview from "components/OrderPreview";

const Header = (props) => {
  const { items: cartItems, isCartOpen } = useContext(CartStateContext);
  const {orders, isOrderOpen} = useContext(orderStateContext);
  const orderDispatch = useContext(orderDispatchContext);
  const commonDispatch = useContext(CommonDispatchContext);
  const cartDispatch = useContext(CartDispatchContext);
  const cartQuantity = cartItems.length;
  const cartTotal = cartItems
    .map((item) => item.price * item.quantity)
    .reduce((prev, current) => prev + current, 0);
    

  const handleSearchInput = (event) => {
    return setSearchKeyword(commonDispatch, event.target.value);
  };
  const handleSubmit = (event) => {
    return event.preventDefault();
  };

  const handleOrderButton = (event) => {
    event.preventDefault();
    return toggleOrdersPopup(orderDispatch);
  }

  const handleCartButton = (event) => {
    event.preventDefault();
    return toggleCartPopup(cartDispatch);
  };

  return (
    <header>
      <div className="container">
        <div className="brand">
          <Link to="/">
            <img
              className="logo"
              src="https://res.cloudinary.com/ayorinde-timilehin/image/upload/v1624458327/Urbanc3tre_logo_uv65cf.jpg"
              alt="Urbanc3tre Brand Logo"
            />
          </Link>
        </div>

        <div className="search">
          <a
            className="mobile-search"
            href="#"
            // onClick={this.handleMobileSearch.bind(this)}
          >
            <img
              src="https://res.cloudinary.com/ayorinde-timilehin/image/upload/v1624473949/search_ez31ma.png"
              width="30"
              alt="search"
            />
          </a>
          <form action="#" method="get" className="search-form">
            <a
              className="back-button"
              href="#"
              // onClick={this.handleSearchNav.bind(this)}
            >
              <img
                src="https://res.cloudinary.com/sivadass/image/upload/v1494756030/icons/back.png"
                alt="back"
              />
            </a>
            <input
              type="search"
              placeholder="Search for Clothes and Caps"
              className="search-keyword"
              onChange={handleSearchInput}
            />
            <button
              className="search-button"
              type="submit"
              onClick={handleSubmit}
            />
          </form>
        </div>

        <div className="cart">
          <div className="cart-info">
            <table>
              <tbody>
                <tr>
                  <td>No. of items</td>
                  <td>:</td>
                  <td>
                    <strong>{cartQuantity}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Sub Total</td>
                  <td>:</td>
                  <td>
                    <strong>{cartTotal}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <a className="cart-icon" href="#" onClick={handleCartButton}>
            <img
              className={props.cartBounce ? "tada" : " "}
              src="https://res.cloudinary.com/ayorinde-timilehin/image/upload/v1625838617/shopping-cart_cwj6fp.png"
              width="30"
              alt="Cart"
            />
            {cartQuantity ? (
              <span className="cart-count">{cartQuantity}</span>
            ) : (
              ""
            )}
          </a>
          <CartPreview />
        </div>
        {orders.length > 1 && <div className="cart">
          {/* <div className="cart-info">
            <table>
              <tbody>
                <tr>
                  <td>No. of items</td>
                  <td>:</td>
                  <td>
                    <strong>{cartQuantity}</strong>
                  </td>
                </tr>
                <tr>
                  <td>Sub Total</td>
                  <td>:</td>
                  <td>
                    <strong>{cartTotal}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div> */}
          <a className="cart-icon" href="#" onClick={handleOrderButton}>
            <img
              className={props.cartBounce ? "tada" : " "}
              src="https://res.cloudinary.com/ayorinde-timilehin/image/upload/v1624473949/shopping-bag_l8cojq.png"
              width="30"
              alt="My Orders"
            />
            {orders ? (
              <span className="cart-count">{orders.length}</span>
            ) : (
              ""
            )}
          </a>
          <OrderPreview />
        </div>}
      </div>
    </header>
  );
};

export default Header;
