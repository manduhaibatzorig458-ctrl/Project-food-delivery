// "use client"

// import { createContext, useContext, useEffect, useState } from "react"
// // import { backend } from "@app/_api/api"

// const AuthContext = createContext(null);


// export const AuthProvider = ({children}) => {
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         try{
//            const stored = localStorage.getItem("user");
//            if (stored) setUser(JSON.parse(stored));
//         } catch (err){
//             localStorage.removeItem("user")
//         } finally {
//             setLoading(false)
//         }
//     }, [])

//     return (
//         <AuthContext.Provider value={{user}}>
//           {children}
//         </AuthContext.Provider>
//     )
// } 

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error("useAuth must be within an Authprovider")
//     };
//     return context;

// }