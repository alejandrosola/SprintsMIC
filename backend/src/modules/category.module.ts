import { Module } from '@nestjs/common';
import { CategoryController } from '../infrastructure/category/rest/controller/category.controller';
import { FindAllCategory } from '../domain/category/case/findAllCategory.case';
import { FindCategoryByFather } from '../domain/category/case/findCategoryByFather.case';
import { ICategoryRepository } from '../domain/category/port/iCategoryRepository';
import { CategoryRepository } from '../infrastructure/category/typeorm/repository/category.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../infrastructure/category/typeorm/model/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    controllers: [CategoryController],
    providers: [
        FindAllCategory,
        FindCategoryByFather,
        {
            provide: ICategoryRepository,
            useClass: CategoryRepository,
        },
    ],
})
export class CategoryModule { }
