import { AbstractRepository } from "./abstract.repository";
import { RoleEnum } from '../contexts/auth-context';

class UsersRepository extends AbstractRepository {
  COLLECTION_NAME = 'users';

  /**
   * @param auth {User}
   * @param formData {{country: string, name: string, publicKey: string}}
   * @returns {Promise<*>}
   */
  createFromAuth(auth, formData) {
    const cleanUser = {
      createdAt: Date.now().toString(),
      country: formData.country,
      id: auth.uid,
      lastLoginAt: auth.lastLoginAt?.toString() ?? Date.now().toString(),
      name: formData.name,
      publicKey: formData.publicKey,
      role: RoleEnum.COMMON,
    }

    return this.create(cleanUser.id, cleanUser);
  }

  /**
   * @param userId {string}
   * @returns {Promise<*>}
   */
  updateLoginAt(userId) {
    return this.update(userId, { lastLoginAt: Date.now().toString() });
  }
}

export default new UsersRepository();