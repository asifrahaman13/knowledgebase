import { AuthInterface } from "@/domain/interfaces/authInterface";
import { SuccessEntity, TokenEntity } from "@/domain/entities/Success";
import axios from "axios";

class AuthRepository implements AuthInterface {
  // This is the repository to deal with the authentication data.
  // The repository is responsible for fetching, uploading and deleting authentication data from the database or API etc.

  async signup(email: string, username: string, password: string) {
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

    const response = await axios.post(`${backend_url}/auth/signup`, {
      email,
      username,
      password,
    });

    if (response.status === 200) {
      return new SuccessEntity(200, response.data.data);
    }
  }

  async login(username: string, password: string) {
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

    const response = await axios.post(`${backend_url}/auth/login`, {
      username,
      password,
    });

    if (response.status === 200) {
      return new SuccessEntity(200, response.data);
    }
  }
}

export { AuthRepository };
