import { Model, Types, FilterQuery, UpdateQuery } from 'mongoose';

interface IBaseRepository<T extends Document> {
  // find methods
  findById(id: Types.ObjectId): Promise<T | null>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findAll(): Promise<T[]>;
  find(filter: FilterQuery<T>): Promise<T[]>;
  
  // create method
  create(data: Partial<T>): Promise<T>;
  
  // update methods
  update(id: Types.ObjectId, data: Partial<T>): Promise<T | null>;
  updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<any>;
  
  // delete methods
  delete(id: Types.ObjectId): Promise<T | null>;
  deleteOne(filter: FilterQuery<T>): Promise<any>;
}

export default IBaseRepository;