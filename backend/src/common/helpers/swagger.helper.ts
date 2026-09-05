import { OpenAPIObject } from '@nestjs/swagger';

type OperationObject = {
  responses?: Record<string | number, { description: string }>;
  security?: unknown[];
};

const pathMethods = ['get', 'post', 'put', 'delete', 'patch'];

const generalResponses = {
  200: { description: 'OK' },
  201: { description: 'Created' },
  400: { description: 'Bad Request' },
  422: { description: 'Unprocessable Entity' },
  500: { description: 'Internal Server Error' },
};

const authResponses = {
  401: { description: 'Unauthorized' },
  403: { description: 'Forbidden' },
};

const deleteResponses = {
  204: { description: 'No Content' },
};

export class SwaggerHelper {
  static setDefaultResponses(document: OpenAPIObject): void {
    for (const key of Object.keys(document.paths)) {
      for (const method of pathMethods) {
        const route = document.paths[key]?.[method] as
          OperationObject | undefined;
        if (!route) continue;

        const baseErrors = {
          400: generalResponses[400],
          422: generalResponses[422],
          500: generalResponses[500],
        };

        if (method === 'post') {
          const isLogin = key.includes('login') || key.includes('auth');

          route.responses = {
            ...baseErrors,
            [isLogin ? 200 : 201]: { description: isLogin ? 'OK' : 'Created' },
          };
          continue;
        }

        if (method === 'delete') {
          route.responses = {
            ...baseErrors,
            ...deleteResponses,
          };
          continue;
        }

        if (['get', 'put', 'patch'].includes(method)) {
          route.responses = {
            ...baseErrors,
            200: { description: 'OK' },
          };
        }

        if (route.security && route.responses) {
          Object.assign(route.responses, authResponses);
        }
      }
    }
  }
}
