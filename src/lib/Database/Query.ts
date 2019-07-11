import { connection } from "./Connection";
import QueryParameter from "./QueryParameter";

export default class Query {
  static getAll() {
    return connection.all("select id, title from queries order by createdAt desc");
  }

  static async find(id) {
    const query = await connection.get("select * from queries where id = ?", id);

    query.parameters = await QueryParameter.getAll(id);

    if (query.fields) {
      query.fields = JSON.parse(query.fields);
    }

    if (query.rows) {
      query.rows = JSON.parse(query.rows);
    }

    // For backword compatibility with beta version data structure.
    if (query.fields && typeof query.fields[0] === "object") {
      query.fields = query.fields.map(f => f.name);
    }
    if (query.rows && typeof query.rows[0] === "object" && !Array.isArray(query.rows[0])) {
      query.rows = query.rows.map(r => Object.values(r));
    }

    return query;
  }

  static async create({ title, dataSourceId }) {
    const sql = `
      insert into queries
      (dataSourceId, title, updatedAt, createdAt)
      values (?, ?, datetime('now'), datetime('now'))
    `;
    const id = await connection.insert(sql, dataSourceId, title);

    return { id, dataSourceId, title };
  }

  static update(id, params) {
    const fields: string[] = [];
    const values: string[] = [];

    Object.keys(params).forEach(field => {
      fields.push(field);
      values.push(params[field]);
    });
    values.push(id);

    const sql = `
      update queries
      set ${fields.map(f => `${f} = ?`).join(", ")}, updatedAt = datetime('now')
      where id = ?
    `;

    return connection.run(sql, values);
  }

  static del(id) {
    return connection.run("delete from queries where id = ?", id);
  }
}
