
export const  sendPasswordResetEmail = async(email:string) => {
    try {
        const body = JSON.stringify({
          email
        });

    
        const resp = await fetch(`/api/check-email`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json', 
          },
          body
        });
        
        const rawResponse = await resp.json();

        console.log(rawResponse)




        if(rawResponse.message){
          // const respCode = await fetch(`/api/send-email`, {
          //   method: 'POST',
          //   credentials: 'include',
          //   headers: {
          //     'Content-Type': 'application/json', 
          //   },
          //   body
          // });

          // const cookie = cookies.set

          return { success: true, message: 'Reset email sent',code:respCode }
        }
        else if (rawResponse.detail === "Email does not exist"){
          return  { success: false, message: 'Email not found' };
        }

        return false

    } catch (error) {
        console.error("Network or fetch error:", error);
        return false;
      }    
}