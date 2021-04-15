import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD, CART_CLEAR_ITEMS } from '../constants/cartConstants'


export const cartReducer = (state = { cartItems:[], shippingAddress: {} }, action) => {
    switch(action.type) {
        case CART_ADD_ITEM:
            const item = action.payload;
            const existItem = state.cartItems.find(x => x.product === item.product); // tim san pham da ton tai trong gio hang

            if (existItem) { // kiem tra
                return {
                    ...state,
                    cartItems: state.cartItems.map(x => // neu tim thay sp da ton tai -> thay sp cu bang sp moi
                        x.product === existItem.product ? item : x
                    )
                }

            } else {
                return {
                    ...state, // state hien tai
                    cartItems:[...state.cartItems, item]
                }
            }

        case CART_REMOVE_ITEM:
            return {
                ...state, // state hien
                cartItems:state.cartItems.filter(x => x.product !== action.payload)
            };

        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload
            };

        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload
            };

        case CART_CLEAR_ITEMS:
            return {
                ...state,
                cartItems: []
            };

        default:
            return state
    }
};