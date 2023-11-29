import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';

export default function expiryCheck() {
  const router = useRouter();
  const storedUser = JSON.parse(localStorage.getItem('myUser'));

  if (storedUser && storedUser.token) {
    const expirationTime = jwt.verify(storedUser.token, "Iam@User");

    if (expirationTime.exp) {
      const currentTime = new Date().getTime() / 1000;

      if (currentTime > expirationTime.exp) {
        // Token has expired, remove it from local storage and redirect to login page
        localStorage.removeItem('myUser');
        router.push('/login');
      }
    }
  }
}
