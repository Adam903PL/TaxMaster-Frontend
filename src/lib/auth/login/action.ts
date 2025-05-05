import { useAuthStore } from '@/hooks/useAuth';

interface FormData {
  email: string;
  password: string;
}

export const LoginFunction = async (data: FormData) => {
  try {
    const body = JSON.stringify({
      email: data.email,
      password: data.password,
    });
    

    
    const resp = await fetch(`/api/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json', 
      },
      body
    });
    
    const rawResponse = await resp.text();

    let responseData;
    try {
      responseData = JSON.parse(rawResponse);
      console.log("Parsed response data:", responseData);
      
      if (responseData.message === "Login successful") {
        const { setLoggedIn, setUserId } = useAuthStore.getState();
        setLoggedIn(true);
        setUserId(responseData.userId);
        return true;
      }
    } catch (parseError) {
      console.error("Could not parse response as JSON:", parseError);
    }
    
    return false;
  } catch (error) {
    console.error("Network or fetch error:", error);
    return false;
  }
}