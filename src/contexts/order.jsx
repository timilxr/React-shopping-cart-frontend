import React, { useReducer, createContext, useEffect } from "react";
import useLocalStorage from "hooks/useLocalStorage";

const initialState = {
    isOrderOpen : false,
    orders: []
};

export const orderStateContext = createContext();
export const orderDispatchContext = createContext();

const reducer = (state, action) => {
    switch(action.type){
        case "TOGGLE_ORDERS_POPUP":
            return{
                ...state,
                isOrderOpen: !state.isOrderOpen
            };
        case "ADD_TO_ORDERS":
            // const id = action.payload.order.paymentResult.transaction_id;
            return{
                ...state,
                orders: [...state.orders, action.payload.order]
            };
        case "REMOVE_FROM_ORDERS":
            const id = action.payload.transaction_id;
            return{
                ...state,
                orders: state.orders.filter(order => order.paymentResult.transaction_id !== id)
            };
        case "CLEAR_ORDERS":
            return {};
        default:
            throw new Error(`Unknown action: ${action.type}`);
    }
}

export const toggleOrdersPopup = (dispatch) => {
    return dispatch({
        type: "TOGGLE_ORDERS_POPUP"
    });
};

export const addToOrders = (order, dispatch) => {
    return dispatch({
        type: "ADD_TO_ORDERS",
        payload: {
            order
        }
    })
}

export const removeFromOrders = (transaction_id, dispatch) => {
    return dispatch({
        type: "REMOVE_FROM_ORDERS",
        payload: {
            transaction_id
        }
    });
};

export const clearOrders = (dispatch) =>{
    return dispatch({
        type: "CLEAR_ORDERS"
    });
};

const OrderProvider = ({children}) => {
    const [persistedOrders, setPersistedOrders] = useLocalStorage("orders", []);
    const persistedOrderState = {
        isOrderOpen: false,
        orders: persistedOrders || [],
    };
    const [state, dispatch] = useReducer(reducer, persistedOrderState);
    useEffect(()=>{
        setPersistedOrders(state.orders);
    }, [state.orders, setPersistedOrders]);

    return(
        <orderDispatchContext.Provider value={dispatch}>
            <orderStateContext.Provider value={state}>
                {children}
            </orderStateContext.Provider>
        </orderDispatchContext.Provider>
    );
}

export default OrderProvider;