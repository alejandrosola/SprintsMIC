import { Organization } from './organization.entity';

export class Document {
    id: string;

    name: string;

    url: string;

    organization: Organization

    createdAt: Date;

    updatedAt: Date;

    deletedAt: Date;
}
