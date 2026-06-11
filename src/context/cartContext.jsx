// import React, { createContext, useContext, useState } from 'react';  

// const initialState = {  
//   newValue: 'Initial Value', 
// };  

// const GlobalStateContext = createContext();  

// export const GlobalStateProvider = ({ children }) => {  
//   const [state, setState] = useState(initialState);  
//    console.log({state});
   
//   return (  
//     <GlobalStateContext.Provider value={{ state, setState }}>  
//       {children}  
//     </GlobalStateContext.Provider>  
//   );  
// };  

// export const useGlobalState = () => useContext(GlobalStateContext);  

