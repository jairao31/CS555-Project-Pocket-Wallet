import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import UserContextProvider from '../Components/Contexts/UserContext'
import { initializeApp } from "firebase/app";
import '../styles/globals.css'
import theme from "../theme"

function MyApp({ Component, pageProps }) {

  const firebaseConfig = {
    apiKey: "AIzaSyBhCnBS7Q-YOVLT-YYqa6NbY2ZoHkS-Koc",
    authDomain: "pocket-wallet-12969.firebaseapp.com",
    databaseURL: "https://pocket-wallet-12969-default-rtdb.firebaseio.com",
    projectId: "pocket-wallet-12969",
    storageBucket: "pocket-wallet-12969.appspot.com",
    messagingSenderId: "484931660463",
    appId: "1:484931660463:web:8a2bad772c72a0f877425a",
    measurementId: "G-GPTKVVVFFE"
    // apiKey: process.env.NEXT_PUBLIC_API_KEY,
    // authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    // databaseURL: process.env.FIREBASE_DATABASE_URL,
    // projectId: process.env.FIREBASE_PROJECT_ID,
    // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    // appId: process.env.FIREBASE_APP_ID,
    // measurementId: process.env.FIREBASE_MEASUREMENT_ID
  };
  
  // Initialize Firebase
    initializeApp(firebaseConfig);


  const queryClient = new QueryClient();


  return  <QueryClientProvider client={queryClient}>
  <ChakraProvider theme={theme}>
          <UserContextProvider>
                  <Component {...pageProps}/>
          </UserContextProvider>
  </ChakraProvider>
</QueryClientProvider>
}

export default MyApp
