import { loadStripe } from '@stripe/stripe-js';
export const stripePromise = (process.env.REACT_APP_STRIPE_KEY) ? loadStripe(process.env.REACT_APP_STRIPE_KEY) : null;
