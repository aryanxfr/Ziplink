let logoutHandler = null;

export const registerLogoutHandler = (handler) => {
  logoutHandler = handler;
};

export const unregisterLogoutHandler = () => {
  logoutHandler = null;
};

export const triggerLogout = () => {
  if (logoutHandler) {
    logoutHandler();
  }
};