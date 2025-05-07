export const logOut = async () => {
    try {
      const resp = await fetch("/api/logout", {
        method: "POST", // lub "GET", zależnie od Twojego API
        credentials: "include",
      });
  
      if (!resp.ok) {
        throw new Error("Logout failed");
      }
  
      const rawResponse = await resp.json();

      return rawResponse;
    
    } catch (error) {
      console.error("Error during logout:", error);
      return null;
    }
  };
  