import React, { createContext, useState } from "react";

export const AuthContext = createContext({
  user: undefined,
  updateAuthUser: () => {},
  //signOut: () => {}, 
});

