import { connection } from "./Connection";

export default class QueryParameter {
  static getAll(queryId) {
    return connection.all("select id, queryId, key, value from query_parameters where queryId = ? order by createdAt asc", queryId);
  }

  static async create({ key, value, queryId }) {
    const sql = `
      insert into query_parameters
      (queryId, key, value, updatedAt, createdAt)
      values (?, ?, ?, datetime('now'), datetime('now'))
    `;
    const id = await connection.insert(sql, queryId, key, value);

    return { id, queryId, key, value };
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
      update query_parameters
      set ${fields.map(f => `${f} = ?`).join(", ")}, updatedAt = datetime('now')
      where id = ?
    `;

    return connection.run(sql, values);
  }

  static del(id) {
    return connection.run("delete from query_parameters where id = ?", id);
  }
}
