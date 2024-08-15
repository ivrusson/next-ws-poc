import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const clients = sqliteTable('clients', {
  id: text('id').primaryKey(),
  roomId: text('roomId').notNull(),
});

export type Client = InferSelectModel<typeof clients>;
export type ClientInsert = InferInsertModel<typeof clients>;

export const rooms = sqliteTable('rooms', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export type Room = InferSelectModel<typeof rooms>;
export type RommInsert = InferInsertModel<typeof rooms>;

