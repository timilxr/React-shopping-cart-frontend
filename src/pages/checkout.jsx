import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import {
  CheckoutStateContext,
  CheckoutDispatchContext,
  CHECKOUT_STEPS,
  setCheckoutStep,
  saveShippingAddress
} from "contexts/checkout";
import PaymentButton from "../components/flutterwavePaymentButton";
import { CartStateContext } from "contexts/cart";
import { AuthStateContext, AuthDispatchContext, signOut } from "contexts/auth";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import _get from "lodash.get";
import Input from "components/core/form-controls/Input";
import { phoneRegExp } from "constants/common";

const AddressSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(phoneRegExp, "Phone Number is not a valid 10 digit number")
    .min(10, "Phone Number is too short")
    .max(10, "Phone Number is too long"),
  addressLine: Yup.string().required("Door No. & Street is required!"),
  city: Yup.string().required("City is required!"),
  email: Yup.string().required("Email is required!"),
  state: Yup.string().required("State is required!"),
  code: Yup.string().required("ZIP/Postal code is required!"),
  country: Yup.string().required("Country is required!")
});

const PaymentMethodSchema = Yup.object().shape({
  paymentMethod: Yup.string()
});

const LoginStep = () => {
  const history = useHistory();
  const { user, isLoggedIn } = useContext(AuthStateContext);
  const authDispatch = useContext(AuthDispatchContext);
  const checkoutDispatch = useContext(CheckoutDispatchContext);
  const handleContinueShopping = () => {
    history.push("/");
  };
  const handleLoginAsDiffUser = () => {
    signOut(authDispatch);
    history.push("/auth");
  };
  const handleLogout = () => {
    signOut(authDispatch);
  };
  const handleGotoLogin = () => {
    history.push("/auth");
  };
  const handleProceed = () => {
    setCheckoutStep(checkoutDispatch, CHECKOUT_STEPS.SHIPPING);
  };
  return (
    <div className="detail-container">
      <h2>Sign In now!</h2>
      <div className="auth-message">
        {isLoggedIn ? (
          <>
            <p>
              Logged in as <span>{user.username}</span>
            </p>
            <button onClick={() => handleLoginAsDiffUser()}>
              Login as Different User
            </button>
            <br />
            <br />
            <button onClick={() => handleLogout()}>
              Logout
            </button>
          </>
        ) : (
          <>
            <p>Please login to continue.</p>
            <button onClick={() => handleGotoLogin()}>Login</button>
          </>
        )}
      </div>
      <div className="actions">
        <button className="outline" onClick={() => handleContinueShopping()}>
          <i className="rsc-icon-arrow_back" /> Continue Shopping
        </button>
        <button
        //  disabled={!isLoggedIn}
          onClick={() => handleProceed()}
        >
          Proceed
          <i className="rsc-icon-arrow_forward" />
        </button>
      </div>
    </div>
  );
};

const AddressStep = () => {
  const history = useHistory();
  const checkoutDispatch = useContext(CheckoutDispatchContext);

  // const handleBackToLogin = () => {
  //   setCheckoutStep(checkoutDispatch, CHECKOUT_STEPS.AUTH);
  // };
  const handleContinueShopping = () => {
    history.push("/");
  };
  const handleSaveAddress = (addressData) => {
    saveShippingAddress(checkoutDispatch, addressData);
  };
  return (
    <div className="detail-container">
      <h2>Shipping Address</h2>
      <Formik
        initialValues={{
          fullName: "John Doe",
          phoneNumber: "5552229876",
          email: "user@gmail.com",
          addressLine: "L1, Palm Residency",
          city: "Kingston",
          state: "New York",
          code: "12401",
          country: "United States"
        }}
        validationSchema={AddressSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const addressData = { ...values };
            resetForm();
            handleSaveAddress(addressData);
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {() => (
          <Form>
            {/* <div className="field-group"> */}
              <Field
                name="fullName"
                type="text"
                placeholder="Full Name"
                component={Input}
              />
            {/* </div> */}
            <div className="field-group">
              <Field
                name="email"
                type="email"
                placeholder="Email Address"
                component={Input}
              />
              <Field
                name="phoneNumber"
                type="text"
                placeholder="Phone Number"
                component={Input}
              />
            </div>
            <Field
              name="addressLine"
              type="text"
              placeholder="Door No. & Street"
              component={Input}
            />
            <div className="field-group">
              <Field
                name="city"
                type="text"
                placeholder="City"
                component={Input}
              />
              <Field
                name="state"
                type="text"
                placeholder="State"
                component={Input}
              />
            </div>
            <div className="field-group">
              <Field
                name="code"
                type="text"
                placeholder="ZIP/Postal Code"
                component={Input}
              />
              <Field
                name="country"
                type="text"
                placeholder="Country"
                component={Input}
              />
            </div>
            <div className="actions">
              <button
                type="button"
                className="outline"
                onClick={() => handleContinueShopping()}
              >
                <i className="rsc-icon-arrow_back" /> Continue shopping
              </button>
              <button type="submit">
                Save Address
                <i className="rsc-icon-arrow_forward" />
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const PaymentStep = () => {
  const { shippingAddress } = useContext(CheckoutStateContext);
  const { items } = useContext(CartStateContext);
  const cartSubTotal = items
    .map((item) => item.price * item.quantity)
    .reduce((prev, current) => prev + current, 0);
  const shippingPrice = 20.00;
  const taxPrice = 0.00;
  const totalPrice = (cartSubTotal + shippingPrice + taxPrice).toFixed(0);
  // const orderDispatch = useContext(orderDispatchContext);
  const checkoutDispatch = useContext(CheckoutDispatchContext);
  const handleBackToAddress = () => {
    setCheckoutStep(checkoutDispatch, CHECKOUT_STEPS.SHIPPING);
  };
  const [err, setErr] = useState(null);
  const paymentMethods = ['card', 'mobilemoney', 'USSD', "banktransfer", "account", "barter", "payattitude", "qr"];
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [order, setOrder] = useState({
    cartSubTotalPrice: cartSubTotal,
      taxPrice: taxPrice,
      shippingPrice: shippingPrice,
      totalPrice: totalPrice,
      shippingAddress,
      cartItems: [...items],
  });

  const handleInput = (e) => {
    setPaymentMethod(e.target.value);
  }
  useEffect(()=>{
    let newOrder = {
      ...order,
      paymentMethod: paymentMethod
    };
    setOrder(newOrder);
    console.log(newOrder);
  }, [paymentMethod])

  const handlePayment = (e) => {
    e.preventDefault();
  };
  return (
    <div className="detail-container">
      {err && <div>{err}</div>}
      <h2>Payment Method</h2>
      <p>Please select the payment method you want to use</p> <br />
      <Formik
      initialValue={{paymentMethod: "card"}}
      validationSchema={PaymentMethodSchema}
      onSubmit={ (e) => handlePayment(e)}>
        <center>
        <Form>
          <div className="form-group">
            {paymentMethods.map(method => {
              return <div key={method} className={classNames("radio-button", { checked: method === paymentMethods[0] })}>
                <input 
              name="paymentMethod" 
              type="radio" 
              onChange={(e) => handleInput(e)}
              // checked={method === paymentMethods[0]}
              id={`custom-${method}`}
              value={method} />
              <label htmlFor={`custom-${method}`}>
              <i
                className={
                  method === paymentMethods[0]
                    ? "icon-radio-button-checked"
                    : "icon-radio-button-unchecked"
                }
                size={20}
              />{" "}{method}
              </label>
              </div>
            })}
          </div>
        </Form>
        </center>
      </Formik>
      <br />
      <div className="actions">
        <button
          type="button"
          className="outline"
          onClick={() => handleBackToAddress()}
        >
          <i className="rsc-icon-arrow_back" /> Back to Shipping Details
        </button>
        {/* <button disabled={!shippingAddress} onClick={() => handlePayment()}>
          Save Address
          <i className="rsc-icon-arrow_forward" />
        </button> */}
        <PaymentButton order={order} err={setErr} />
      </div>
    </div>
  );
};

const Checkout = () => {
  const { items = [] } = useContext(CartStateContext);
  const { isLoggedIn } = useContext(AuthStateContext);
  const { step, shippingAddress } = useContext(CheckoutStateContext);
  const checkoutDispatch = useContext(CheckoutDispatchContext);
  const totalItems = items.length;
  const cartSubTotal = items
    .map((item) => item.price * item.quantity)
    .reduce((prev, current) => prev + current, 0);

  const handleClickTimeline = (nextStep) => {
    setCheckoutStep(checkoutDispatch, nextStep);
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="order-details">
          <ul className="timeline">
            {/* <li
              className={classNames({
                done: isLoggedIn,
                active: step === CHECKOUT_STEPS.AUTH
              })}
              onClick={() => handleClickTimeline(CHECKOUT_STEPS.AUTH)}
            >
              <h2>Sign In</h2>
              <i className="rsc-icon-check_circle" />
            </li> */}
            <li
              className={classNames({
                done: shippingAddress !== null,
                active: step === CHECKOUT_STEPS.SHIPPING
              })}
              onClick={() => handleClickTimeline(CHECKOUT_STEPS.SHIPPING)}
            >
              <h2>Shipping</h2>
              <i className="rsc-icon-check_circle" />
            </li>
            <li
              className={classNames({
                done: false,
                active: step === CHECKOUT_STEPS.PAYMENT
              })}
              onClick={() => handleClickTimeline(CHECKOUT_STEPS.PAYMENT)}
            >
              <h2>Payment</h2>
              <i className="rsc-icon-check_circle" />
            </li>
          </ul>
          {/* {step === CHECKOUT_STEPS.AUTH && <LoginStep />} */}
          {step === CHECKOUT_STEPS.SHIPPING && <AddressStep />}
          {step === CHECKOUT_STEPS.PAYMENT && <PaymentStep />}
        </div>
        <div className="order-summary">
          <h2>
            Summary
            <span>{` (${totalItems}) Items`}</span>
          </h2>
          <ul className="cart-items">
            {items.map((product) => {
              return (
                <li className="cart-item" key={product.name}>
                  <img className="product-image" src={product.image} alt={product.name} />
                  <div className="product-info">
                    <p className="product-name">{product.name}</p>
                    <p className="product-price">{product.price}</p>
                  </div>
                  <div className="product-total">
                    <p className="quantity">
                      {`${product.quantity} ${
                        product.quantity > 1 ? "Nos." : "No."
                      }`}
                    </p>
                    <p className="amount">{product.quantity * product.price}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <ul className="total-breakup">
            <li>
                <p>Subtotal</p>
                <p className="summary">{cartSubTotal}</p>
            </li>
            <li>
              <p>Tax</p>
              <p className="summary">0</p>
            </li>
            <li>
              <p>Shipping</p>
              <p className="summary">20</p>
            </li>
            <li>
              <h2>Total</h2>
              <h2 className="summary">{cartSubTotal + 3 + 10}</h2>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
