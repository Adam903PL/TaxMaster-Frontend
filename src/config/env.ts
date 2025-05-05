import dotenv from 'dotenv';
dotenv.config();



export const getEnvironment = (name:string) => {

    const environment = process.env[name]?.trim();

    console.log(environment);

    if(!environment){
        console.log("Wyjabeło",environment  )
        throw new Error(`❌ Missing ${name} environment`)
    }
    return environment
}



export const ENV = {
  BACKEND_URL:'http://localhost:8000',
  SECRET_KEY: 'your-very-secret-key'
};