import * as Joi from 'joi';
import { StatusesEnum } from '../../database/entities/enums/statuses.enum';
import { CoursesEnum } from '../../database/entities/enums/courses.enum';
import { FormatsEnum } from '../../database/entities/enums/formats.enum';
import { TypesEnum } from '../../database/entities/enums/types.enum';

const editOrderSchema = Joi.object({
  name: Joi.string().min(0).max(25).allow(null, '').optional().messages({
    'string.max': 'Name must not exceed 25 characters',
  }),

  surname: Joi.string().min(0).max(25).allow(null, '').optional().messages({
    'string.max': 'Surname must not exceed 25 characters',
  }),

  email: Joi.string()
    .max(100)
    .email({ tlds: { allow: false } })
    .empty('')
    .allow(null, '')
    .optional(),

  phone: Joi.alternatives()
    .try(
      Joi.string().valid('', null),
      Joi.string().max(12).pattern(/^(\+)?[\d\s()+-]{1,12}$/),
    )
    .optional()
    .messages({
      'string.max': 'Phone number must not exceed 12 characters',
      'string.pattern.base':
        'Please enter a valid phone number (up to 12 characters)',
    }),

  age: Joi.number().integer().min(0).max(99).empty('').allow(null).optional(),

  sum: Joi.number().min(0).empty('').allow(null).optional(),

  alreadyPaid: Joi.number()
    .min(0)
    .empty('')
    .allow(null)
    .optional()
    .when('sum', {
      is: Joi.number().required(),
      then: Joi.number().max(Joi.ref('sum')).optional(),
    }),

  status: Joi.string()
    .valid(...Object.values(StatusesEnum))
    .allow(null, '')
    .optional()
    .messages({
      'any.only': `Status must be one of: ${Object.values(StatusesEnum).join(', ')}`,
    }),

  group: Joi.number().integer().positive().empty('').allow(null, '').optional(),

  course: Joi.string()
    .valid(...Object.values(CoursesEnum))
    .allow(null, '')
    .optional()
    .messages({
      'any.only': `Course must be one of: ${Object.values(CoursesEnum).join(', ')}`,
    }),

  course_format: Joi.string()
    .valid(...Object.values(FormatsEnum))
    .allow(null, '')
    .optional()
    .messages({
      'any.only': `Course format must be one of: ${Object.values(FormatsEnum).join(', ')}`,
    }),

  course_type: Joi.string()
    .valid(...Object.values(TypesEnum))
    .allow(null, '')
    .optional()
    .messages({
      'any.only': `Course type must be one of: ${Object.values(TypesEnum).join(', ')}`,
    }),
});

export default editOrderSchema;