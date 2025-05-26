import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';


export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  const handleGoogleClick = async () => {
    // Handle Google Sign-In
    try {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        const result = await signInWithPopup(auth, provider);

        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          }),
        });
        const data = await res.json();
        dispatch(signInSuccess(data));
        navigate("/");
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      // Handle error (e.g., show a notification)
        
    }
  };

  return (
        <button onClick={handleGoogleClick}
        type='button' 
        className='bg-red-600 text-white p-3 rounded-lg uppercase hover:opacity-95'>
        continue with google
        </button>
  )
}
