import React, { createContext, useEffect, useState } from "react";
import { supabase } from '../utils/config';

const GlobalContext = createContext();

export default GlobalContext;

export const GlobalProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openQuizAnswerModal, setOpenQuizAnswerModal] = useState(false);
  const [email, setEmail] = useState("");
  const [session, setSession] = useState(null)

  function onCloseModal() {
    setOpenModal(false);
    setEmail("");
  }

  function onCloseQuizAnswerModal() {
    setOpenModal(false);
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.log('Error logging out:', error.message)

    setSession(null)
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setOpenModal(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setOpenModal(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <GlobalContext.Provider
      value={{session, logout, openModal, setOpenModal, email, setEmail, onCloseModal, openQuizAnswerModal, setOpenQuizAnswerModal, onCloseQuizAnswerModal}}
    >
      {children}
    </GlobalContext.Provider>
  );
};
