import { Document as TypeORMDocument } from '../model/document.entity';
import { Document as DomainDocument } from '../../../../domain/organization/model/document.entity';

export class DocumentMapper {
    static toDomain(document: TypeORMDocument): DomainDocument {
        return {
            id: document.id,
            name: document.name,
            url: document.url,
            organization: document.organization,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
            deletedAt: document.deletedAt || null,
        };
    }

    static toTypeORM(domainDocument: DomainDocument): TypeORMDocument {
        const typeORMDocument = new TypeORMDocument();
        typeORMDocument.id = domainDocument.id;
        typeORMDocument.name = domainDocument.name;
        typeORMDocument.url = domainDocument.url;
        typeORMDocument.organization = domainDocument.organization;
        typeORMDocument.createdAt = domainDocument.createdAt;
        typeORMDocument.updatedAt = domainDocument.updatedAt;
        typeORMDocument.deletedAt = domainDocument.deletedAt || null;
        return typeORMDocument;
    }
}
