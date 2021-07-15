import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import {
  orderStateContext,
  orderDispatchContext,
  removeFromOrders,
  toggleOrdersPopup
} from "contexts/order";

const OrderPreview = () => {
  const { orders, isOrderOpen } = useContext(orderStateContext);
  const dispatch = useContext(orderDispatchContext);
  const history = useHistory();

  const handleRemove = (transactionId) => {
    return removeFromOrders(dispatch, transactionId);
  };

  const handleProceedCheckout = () => {
    toggleOrdersPopup(dispatch);
    history.push("/checkout");
  };

  return (
    <div className={classNames("cart-preview", { active: isOrderOpen })}>
      <ul className="cart-items">
        {orders.map((order) => {
          return (
            <li className="cart-item" key={order.paymentResult.transaction_id}>
              {/* <img className="product-image" src={product.image} /> */}
              <div className="product-info">
                <p className="product-name">{order.paymentResult.customer.name}</p>
                <p className="product-price"><time dateTime={order.paidAt}>{order.paidAt}</time></p>
              </div>
              <div className="product-total">
                <p className="quantity">
                  {`${order.orderItems.length} ${
                    order.orderItems.length > 1 ? "Items" : "Item"
                  }`}
                </p>
                <p className="amount">{order.totalPrice}</p>
              </div>
              <button
                className="product-remove"
                onClick={() => handleRemove(order.paymentResult.transaction_id)}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
      <div className="action-block">
        <button
          type="button"
          className={classNames({ disabled: orders && orders.length === 0 })}
          onClick={handleProceedCheckout}
        >
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default OrderPreview;
