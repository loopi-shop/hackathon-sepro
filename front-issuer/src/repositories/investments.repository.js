import { AbstractRepository } from "./abstract.repository";

class InvestmentsRepository extends AbstractRepository {
    COLLECTION_NAME = 'investments';
}

export default new InvestmentsRepository();