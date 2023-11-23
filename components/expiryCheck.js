import jwt from 'jsonwebtoken'
export default function expiryCheck(){
    const expirationTime = jwt.verify(JSON.parse(localStorage.getItem('myUser')).token,process.env.NEXT_PUBLIC_JWT_SECRET)
    if (expirationTime.exp) {
      const currentTime = new Date().getTime() /1000;
      if (currentTime > parseInt(expirationTime.exp)) {
        // Token has expired, remove it from local storage
        localStorage.removeItem('myUser');
      }
    }      
}