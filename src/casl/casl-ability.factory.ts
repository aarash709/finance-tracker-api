import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { User } from '../users/users.service';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    // if (user.isAdmin) {
    //     can(Action.Manage, 'all'); // read-write access to everything
    // } else {
    //     can(Action.Read, 'all'); // read-only access to everything
    // }

    // can(Action.Update, Article, { authorId: user.id });
    // cannot(Action.Delete, Article, { isPublished: true });

    // return build({
    //     // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
    //     detectSubjectType: (item) =>
    //         item.constructor as ExtractSubjectType<Subjects>,
    // });
  }
}

// type Subjects = InferSubjects<typeof Article | typeof User> | 'all';

// export type AppAbility = MongoAbility<[Action, Subjects]>;

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}
