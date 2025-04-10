import { Model, Types, FilterQuery, UpdateQuery, UpdateWriteOpResult, DeleteResult } from 'mongoose';

interface IBaseRepository<T extends Document> {
  // find 
  findById(id: Types.ObjectId): Promise<T | null>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findAll(): Promise<T[]>;
  find(filter: FilterQuery<T>): Promise<T[]>;
  
  // create 
  create(data: Partial<T>): Promise<T>;
  
  // update 
  update(id: Types.ObjectId, data: Partial<T>): Promise<T | null>;
  updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<UpdateWriteOpResult>;
  
  // delete 
  delete(id: Types.ObjectId): Promise<T | null>;
  deleteOne(filter: FilterQuery<T>): Promise<DeleteResult>;
}

export default IBaseRepository;