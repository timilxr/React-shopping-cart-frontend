import React, {useContext} from 'react';
import { addToOrders, orderDispatchContext } from '../contexts/order';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import { useHistory } from "react-router-dom";

export default function App({ order, err, ...props}) {
    // const [err, setErr] = useState(null);
    // useEffect(()=>{
    //     console.log(order)
    // });
    const orderDispatch = useContext(orderDispatchContext);
    const history = useHistory();
   const config = {
    public_key: process.env.REACT_APP_PUBLIC_KEY,
    tx_ref: Date.now(),
    amount: order.totalPrice,
    currency: 'USD',
    payment_options: order.paymentMethod,
    customer: {
      email: order.shippingAddress.email,
      phonenumber: order.shippingAddress.phoneNumber,
      name: order.shippingAddress.fullName,
    },
    customizations: {
      title: 'Place Order',
      description: 'Payment for items in your cart',
      logo: "https://res.cloudinary.com/ayorinde-timilehin/image/upload/v1624458327/Urbanc3tre_logo_uv65cf.jpg",
    },
  };

  const fwConfig = {
    ...config,
    text: 'Make Payment',
    callback: (response) => {
        if(response.status === "successful"){
            let newOrder = {
                ...order,
                paymentResult: response
            };
            addToOrders(newOrder, orderDispatch);
            err(response.message);
            console.log(response)
        } 
        err(response.message);
        // console.log(`error is: ${response}`);
      closePaymentModal() // this will close the modal programmatically
    },
    onClose: () => {
        // history.push("/");
    },
  };

  return <FlutterWaveButton {...fwConfig} />

}