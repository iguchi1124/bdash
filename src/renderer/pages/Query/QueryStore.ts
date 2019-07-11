import Setting from "../../../lib/Setting";
import Store from "../../flux/Store";

export interface QueryState {
  setting: any;
  queries: any[];
  dataSources: any[];
  charts: any[];
  selectedQueryId: number | null;
  editor: {
    height: number | null;
    line: number | null;
    showParameterList: boolean;
  };
}

export default class QueryStore extends Store<QueryState> {
  constructor() {
    super();
    this.state = {
      setting: Setting.getDefault(),
      queries: [],
      dataSources: [],
      charts: [],
      selectedQueryId: null,
      editor: {
        height: null,
        line: null,
        showParameterList: false
      }
    };
  }

  reduce(type, payload) {
    switch (type) {
      case "initialize": {
        return this.merge("setting", payload.setting)
          .mergeList("queries", payload.queries)
          .mergeList("charts", payload.charts)
          .mergeList("dataSources", payload.dataSources);
      }
      case "selectQuery": {
        const idx = this.findQueryIndex(payload.id);
        return this.set("selectedQueryId", payload.id)
          .set("editor.line", null)
          .merge(`queries.${idx}`, payload.query);
      }
      case "addNewQuery": {
        return this.set("selectedQueryId", payload.query.id)
          .set("editor.line", null)
          .prepend("queries", payload.query);
      }
      case "updateQuery": {
        const idx = this.findQueryIndex(payload.id);
        return this.merge(`queries.${idx}`, payload.params);
      }
      case "deleteQuery": {
        const idx = this.findQueryIndex(payload.id);
        return this.set("selectedQueryId", null)
          .set("editor.line", null)
          .del(`queries.${idx}`, payload.id);
      }
      case "addNewQueryParameter": {
        const idx = this.findQueryIndex(payload.queryId);
        return this.append(`queries.${idx}.parameters`, payload.parameter);
      }
      case "updateQueryParameter": {
        const queryIdx = this.findQueryIndex(payload.queryId);
        const idx = this.findQueryParameterIndex(payload.queryId, payload.id);
        return this.merge(`queries.${queryIdx}.parameters.${idx}`, payload.params);
      }
      case "deleteQueryParameter": {
        const queryIdx = this.findQueryIndex(payload.queryId);
        const idx = this.findQueryParameterIndex(payload.queryId, payload.id);
        return this.del(`queries.${queryIdx}.parameters.${idx}`, payload.id);
      }
      case "updateEditor": {
        return this.merge("editor", payload);
      }
      case "selectResultTab": {
        const idx = this.findQueryIndex(payload.id);
        return this.set(`queries.${idx}.selectedTab`, payload.name);
      }
      case "addChart": {
        return this.append("charts", payload.chart);
      }
      case "updateChart": {
        const idx = this.findChartIndex(payload.id);
        return this.merge(`charts.${idx}`, payload.params);
      }
      case "toggleParameterList": {
        return this.set("editor.showParameterList", !this.state.editor.showParameterList);
      }
    }
  }

  findQueryIndex(id) {
    const idx = this.state.queries.findIndex(q => q.id === id);

    if (idx === -1) {
      throw new Error(`query id:${id} not found`);
    }

    return idx;
  }

  findQueryParameterIndex(queryId, id) {
    const queryIdx = this.findQueryIndex(queryId);
    const idx = this.state.queries[queryIdx].parameters.findIndex(p => p.id == id);

    if (idx === -1) {
      throw new Error(`query parameter id:${id} not found`);
    }

    return idx;
  }

  findChartIndex(id) {
    const idx = this.state.charts.findIndex(c => c.id === id);

    if (idx === -1) {
      throw new Error(`chart id:${id} not found`);
    }

    return idx;
  }
}

const { store, dispatch } = Store.create(QueryStore);
export { store, dispatch };
