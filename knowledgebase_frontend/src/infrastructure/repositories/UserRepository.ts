import User from "../../domain/entities/User";
import UserRepositoryInterface from "@/domain/interfaces/userInterfaces";

class UserRepository  implements UserRepositoryInterface{
  async getById(id:string) {
    // Logic to fetch user from database or API
    return new User(id, 'John Doe', 'john.doe@example.com');
  }
}

export default UserRepository;
