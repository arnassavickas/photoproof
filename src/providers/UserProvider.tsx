import firebase from 'firebase/app';
import React, { createContext, useState, useEffect } from 'react';
import { auth /* , generateUserDocument */ } from '../firebase';

export const UserContext = createContext<null | UserWithUid>(null);

interface UserWithUid {
  uid: string;
  photoURL: string;
  displayName: string;
  email: string;
}

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<null | UserWithUid>(null);

  useEffect(() => {
    /* auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const firebaseUser = await generateUserDocument(userAuth);
        if (firebaseUser) {
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
    }); */
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default UserProvider;
