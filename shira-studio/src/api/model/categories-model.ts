import {CategoryEntry} from '../../app/models/category';

export class Category {
  categoryID: number;
  categoryName: string;
  descriptionHE: string;
  descriptionEN: string;
  displayNameHE: string;
  displayNameEN: string;
  imagePath: string;
  parentCategoryPromise: Promise<any>;
  parentCategoryID: number;

  constructor() {}

  public setup(dbSession: any,
               categoryID: number,
               categoryName: string,
               descriptionHE: string,
               descriptionEN: string,
               displayNameHE: string,
               displayNameEN: string,
               imagePath: string,
               parentCategoryName: string): Promise<undefined> {
    return new Promise<undefined>((resolve, reject) => {
      this.categoryID = categoryID;
      this.categoryName = categoryName;
      this.descriptionHE = descriptionHE;
      this.descriptionEN = descriptionEN;
      this.displayNameHE = displayNameHE;
      this.displayNameEN = displayNameEN;
      this.imagePath = imagePath;
      this.parentCategoryPromise = getCategoryByName(dbSession, parentCategoryName).then((category) => {
        // Gets category ID if found.
        if (category === undefined || category.length === 0) {
          this.parentCategoryID = null;
        } else {
          this.parentCategoryID = category[0];
        }
        resolve(undefined);
      });
    });
  }

  public async run(dbSession: any,
                   categoryID: number,
                   categoryName: string,
                   descriptionHE: string,
                   descriptionEN: string,
                   displayNameHE: string,
                   displayNameEN: string,
                   imagePath: string,
                   parentCategoryName: string): Promise<void> {
    await this.setup(dbSession,
      categoryID,
      categoryName,
      descriptionHE,
      descriptionEN,
      displayNameHE,
      displayNameEN,
      imagePath,
      parentCategoryName);
  }
}

function convertEntryToCategory(categoryEntry: Array<any>, parentEntry: string) {
  return {
    id: categoryEntry[0],
    name: categoryEntry[1],
    descriptionHE: categoryEntry[2],
    descriptionEN: categoryEntry[3],
    displayNameHE: categoryEntry[4],
    displayNameEN: categoryEntry[5],
    imagePath: categoryEntry[6],
    parentCategoryID: categoryEntry[7],
    isVisible: categoryEntry[8],
    parentCategoryName: (parentEntry) ? parentEntry[0] : '-'
  };
}

export function getAllCategories(dbSession, count = 10, offset = 0): Promise<Category[]> {
  const table = dbSession.getTable('categories');
  // TODO: add limit: return table.select().limit(count, offset).execute()
  return table.select().execute()
    .then((res) => {
      const entries = res.fetchAll();
      return entries.map((data) => {
        return {
          id: data[0],
          name: data[1],
          descriptionHE: data[2],
          descriptionEN: data[3],
          displayNameHE: data[4],
          displayNameEN: data[5],
          imagePath: data[6],
          parentCategoryID: data[7],
          isVisible: data[8]
        };
      });
    });
}

export function getCategory(dbSession, categoryId): Promise<Category> {
  const table = dbSession.getTable('categories');
  return table.select().where('id = :id').bind('id', categoryId).execute()
    .then((categoryEntry) => {
      categoryEntry = categoryEntry.fetchOne();
      const parentId = categoryEntry[7];
      // If parentId is null, call where which will find no parent, because the code is simpler like that
      return table.select('name').where('id = :id').bind('id', parentId).execute()
        .then((res) => {
          const parentEntry = res.fetchOne();
          return {
            id: categoryEntry[0],
            name: categoryEntry[1],
            descriptionHE: categoryEntry[2],
            descriptionEN: categoryEntry[3],
            displayNameHE: categoryEntry[4],
            displayNameEN: categoryEntry[5],
            imagePath: categoryEntry[6],
            parentCategoryID: categoryEntry[7],
            isVisible: categoryEntry[8],
            parentCategoryName: (parentEntry) ? parentEntry[0] : '-'
          };
        });
    });
}

export function getSubcategories(dbSession, categoryID): Promise<Category[]> {
  const table = dbSession.getTable('categories');
  return table.select().where('parent_category_id = :parent_id').bind('parent_id', categoryID).execute()
    .then((result) => {
      const parentEntries = result.fetchAll();
      console.log(parentEntries);
      return parentEntries;
    });
}

function getCategoryByName(dbSession, categoryName): Promise<Array<any>> {
  if (categoryName === undefined) {
    return new Promise((resolve, reject) => resolve(undefined));
  }
  const table = dbSession.getTable('categories');
  return table.select().where('name = :name').bind('name', categoryName).execute()
    .then((res) => {
      return res.fetchOne();
    })
    .catch((error) => console.error(error));
}

export function addCategory(dbSession, category): Promise<number> {
  // TODO: Validate there are no parent category circles
  const table = dbSession.getTable('categories');
  return table.insert(
    'name', 'description_he', 'description_en', 'display_name_he', 'display_name_en', 'image_path', 'parent_category_id')
    .values(
      category.categoryName,
      category.descriptionHE,
      category.descriptionEN,
      category.displayNameHE,
      category.displayNameEN,
      category.imagePath,
      category.parentCategoryID)
    .execute()
    .then((res) => {
      if (res.getAffectedItemsCount() === 0) {
        throw new Error('No items were added');
      }
      return res.getAutoIncrementValue();
    }).catch((err) => {
      console.error('Failed adding Category:', category);
      console.error('Error: ', err);
      throw new Error('Failed adding category');
    });
}

export function updateCategoryByID(dbSession, categoryId, newCategory): Promise<number> {
  // TODO: Validate there are no parent category circles
  const table = dbSession.getTable('categories');
  return table.update()
    .set('name', newCategory.categoryName)
    .set('description_he', newCategory.descriptionHE)
    .set('description_en', newCategory.descriptionEN)
    .set('display_name_he', newCategory.displayNameHE)
    .set('display_name_en', newCategory.displayNameEN)
    .set('image_path', newCategory.imagePath)
    .set('parent_category_id', newCategory.parentCategoryID)
    .where('id = :id')
    .bind('id', categoryId)
    .execute()
    .then((res) => {
      return res.getAffectedItemsCount();
    })
    .catch((err) => {
      console.log(err);
      throw new Error('Failed updating category');
    });
}

export function deleteCategoryByID(dbSession, categoryId): Promise<number> {
  const table = dbSession.getTable('categories');
  return table.delete().where('id = :id').bind('id', categoryId).execute()
    .then((res) => {
      return res.getAffectedItemsCount();
    });
}
