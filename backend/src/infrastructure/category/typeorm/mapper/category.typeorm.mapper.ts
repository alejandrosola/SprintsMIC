import { Category as TypeORMCategory } from '../model/category.entity';
import { Category as DomainCategory } from '../../../../domain/category/model/category.entity';

export class CategoryMapper {
    static toDomain(category: TypeORMCategory): DomainCategory {
        const domainCategory: DomainCategory = new DomainCategory();
        domainCategory.id = category.id;
        domainCategory.name = category.name;

        if (category.father) {
            domainCategory.father = new DomainCategory();
            domainCategory.father.id = category.father.id;
            domainCategory.father.name = category.father.name;
        }

        return domainCategory;
    }

    static toTypeORM(domainCategory: DomainCategory): TypeORMCategory {
        const typeORMCategory = new TypeORMCategory();
        typeORMCategory.id = domainCategory.id;
        typeORMCategory.name = domainCategory.name;

        return typeORMCategory;
    }
}
