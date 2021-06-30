import { ItemTempletesModule } from "./item/item.templetes.module";
import { RecipeTempletesModule } from "./recipe/recipe.templetes.module";
import { AttributeTempletesModule } from "./attribute/attribute.templetes.module";
import { InventoryTempletesModule } from "./inventory/inventory.templetes.module";
import { NgModule } from "@angular/core";
import { RelationshipTargetTempletesModule } from "./relationshipTarget/relationshipTarget.templetes.module";
import { WorkOrderTempletesModule } from "./workOrder/workOrder.templetes.module";
import { CategoryTempletesModule } from "./category/category.templetes.module";
 
@NgModule({
    exports: [
        CategoryTempletesModule,
        ItemTempletesModule,
        RecipeTempletesModule,
        AttributeTempletesModule,
        InventoryTempletesModule,
        RelationshipTargetTempletesModule,
        WorkOrderTempletesModule
    ]
})

export class TempletesModule { }
