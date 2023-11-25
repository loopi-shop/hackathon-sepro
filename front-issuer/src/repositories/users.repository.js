import { AbstractRepository } from "./abstract.repository";

class UsersRepository extends AbstractRepository {
    COLLECTION_NAME = 'users';
}

export default new UsersRepository();