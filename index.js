import {createClient} from '@libsql/client';

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

console.log('dropping table if exists');

await client.execute({
  sql: `
  -- sqlite
  -- first drop the table "test_items" if it exists:
  drop table if exists test_items;
  `,
  args: []
})

console.log('creating table');

await client.execute({
  sql: `
  -- sqlite
  -- create table "test_items" with the following columns: id (numeric, auto incrementing), name, description
  create table test_items (
    id integer primary key autoincrement,
    name text,
    description text
  );
  `,
  args: []
});

console.log('inserting 2000 rows');

await client.execute({
  sql: `
  -- sqlite
  -- insert 2000 rows into the "test_items" table
  insert into test_items (name, description)
  select randomblob(10), randomblob(100)
  from generate_series(1, 2000);
  `,
  args: []
});

console.log('beginning fetch');

const res = await client
  .execute({
    sql: `
    -- sqlite
    -- select all rows from the "test_items" table
    select * from test_items;
  `,
    args: [],
  });

console.log('query complete', res);
