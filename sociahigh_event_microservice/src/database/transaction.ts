import {TDatabaseTransaction} from '../abstractions/types';
import knex from './conn';

export async function beginTransaction(): Promise<TDatabaseTransaction> {
  return knex.transaction();
}

export async function commitTransaction(transaction: TDatabaseTransaction) {
  return transaction.commit();
}

export async function rollbackTransaction(transaction: TDatabaseTransaction) {
  return transaction.rollback();
}
