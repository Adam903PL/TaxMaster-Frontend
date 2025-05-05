

interface FormData {
    email: string;
    password: string;
  }
  

export const RegisterFunction = async (data: FormData) => {
  try {
    const body = JSON.stringify({
      email: data.email,
      password: data.password,
    });
    

    
    const resp = await fetch(`/api/register`, {
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
      console.log("Parsed response data:", responseData.message);
       
      if (responseData.message === "User registered successfully") {
        return true;
      }
      else if(responseData.detail === "Email already registered"){
        return "Email already registered"
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