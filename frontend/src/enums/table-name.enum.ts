export const TableNameEnum = {
  ORDERS : 'orders',
  USERS : 'users',
  TOKENS : 'tokens',
  REVIEW : 'review',
  FAVORITE : 'favorite',
  COMMENT : 'comments',
  NEWS : 'news',
  TOPCATEGORY : 'top_category',
  VIEWSTAT : 'view_stat',
  BOOKING : 'booking',
} as const;

export type TableNameEnum = typeof TableNameEnum[keyof typeof TableNameEnum];