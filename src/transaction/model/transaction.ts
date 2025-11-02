import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Transaction {
    @Field()
    description: string
    @Field(() => Int)
    amount: number


}

@InputType()
export class CreatTransaction {
    @Field()
    description: string

    
}
