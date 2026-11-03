import * as Joi from 'joi';
import { StatusesEnum } from '../enums/statuses.enum';
import { CoursesEnum } from '../enums/courses.enum';
import { FormatsEnum } from '../enums/formats.enum';
import { TypesEnum } from '../enums/types.enum';

export const editOrderSchema = Joi.object({
  name: Joi.string().min(2).max(25).allow(null, ''),
  surname: Joi.string().min(2).max(25).allow(null, ''),
  email: Joi.string()
    .max(100)
    .email({ tlds: { allow: false } })
    .allow(null, ''),
  phone: Joi.string()
    .max(12)
    .pattern(/^(\+)?[\d\s()+-]{1,12}$/)
    .allow(null, '')
    .messages({
      'string.max': 'Phone number must not exceed 12 characters',
      'string.pattern.base':
        'Please enter a valid phone number (up to 12 characters).',
    }),
  age: Joi.number().integer().min(1).max(99).allow(null),
  sum: Joi.number().min(0).allow(null),
  alreadyPaid: Joi.number()
    .min(0)
    .allow(null)
    .custom((value, helpers) => {
      if (value === null || value === undefined || value === 0) {
        return value;
      }
      const sum = helpers.state.ancestors[0]?.sum;
      if (sum === null || sum === undefined || Number(value) > Number(sum)) {
        return helpers.error('number.max');
      }
      return value;
    })
    .messages({
      'number.max': 'Already paid cannot be greater than total sum',
    }),
  status: Joi.string()
    .valid(...Object.values(StatusesEnum))
    .allow(null, ''),
  group: Joi.any().allow(null),
  course: Joi.string()
    .valid(...Object.values(CoursesEnum))
    .allow(null, ''),
  course_format: Joi.string()
    .valid(...Object.values(FormatsEnum))
    .allow(null, ''),
  course_type: Joi.string()
    .valid(...Object.values(TypesEnum))
    .allow(null, ''),
});