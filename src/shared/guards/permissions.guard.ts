// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { parseContext } from '../utils/parse-context';

// @Injectable()
// export class PermissionsGuard implements CanActivate {
//   constructor(private readonly reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const handler = context.getHandler();
//     const permissions = this.reflector.get<string[]>('permissions', handler);
//     console.log('HITT1');
//     if (!permissions) {
//       return true;
//     }

//     const { request } = parseContext(context);
//     console.log('HIT4');
//     console.log(request);

//     const user = request.user as any;

//     const hasPermission = () =>
//       user.permissions.some((permission: string) =>
//         permissions.includes(permission),
//       );

//     return user && user.permissions && hasPermission();
//   }
// }
