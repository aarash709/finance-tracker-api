import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { Transaction } from './model/transaction';

@Resolver()
export class TransactionResolver {
    @Query(() => Transaction)
    transactions() {

    }

    @Query(() => Transaction)
    transaction() {

    }

    @Query(() => Transaction)
    accounts() {

    }
    @Query(() => Transaction)
    account() {

    }

    @Mutation(() => Transaction)
    createTransaction() {

    }
    @Mutation(() => Transaction)
    createAccount() {

    }

    //add update transaction and account


}
