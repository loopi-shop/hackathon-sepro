import { AbstractRepository } from "./abstract.repository";

class TestsRepository extends AbstractRepository {
    COLLECTION_NAME = 'tests';
}

export default new TestsRepository();