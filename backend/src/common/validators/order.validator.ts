import * as Joi from 'joi';

const editOrderSchema = Joi.object({
  name: Joi.string().min(0).max(50).allow(null, '').optional(),

  surname: Joi.string().min(0).max(50).allow(null, '').optional(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .empty('')
    .allow(null, '')
    .optional(),

  phone: Joi.alternatives()
    .try(
      Joi.string().valid('', null),
      Joi.string().pattern(/^(\+)?[\d\s()+-]{10,25}$/),
    )
    .optional()
    .messages({
      'string.pattern.base':
        'Please enter a valid phone number (10-15 digits). Symbols like +, -, ( ) and spaces are allowed.',
    }),

  age: Joi.number().integer().min(0).max(99).allow(null).optional(),

  sum: Joi.number().min(0).allow(null).optional(),

  alreadyPaid: Joi.number()
    .min(0)
    .allow(null)
    .optional()
    .when('sum', {
      is: Joi.number().required(),
      then: Joi.number().max(Joi.ref('sum')).optional(),
    }),

  status: Joi.string().allow(null, '').optional(),
  group: Joi.any().allow(null).optional(),
  course: Joi.string().allow(null, '').optional(),
  course_format: Joi.string().allow(null, '').optional(),
  course_type: Joi.string().allow(null, '').optional(),
  manager: Joi.number().allow(null).optional(),
});

export default editOrderSchema;
