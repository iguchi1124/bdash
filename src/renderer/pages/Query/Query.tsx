import React from "react";
import QuerySharing from "../../../lib/QuerySharing";
import { store, QueryState } from "./QueryStore";
import Action from "./QueryAction";
import Container from "../../flux/Container";
import QueryList from "../../components/QueryList";
import QueryHeader from "../../components/QueryHeader";
import QueryEditor from "../../components/QueryEditor";
import QueryResult from "../../components/QueryResult";

class Query extends React.Component<any, QueryState> {
  componentDidMount() {
    Action.initialize();
  }

  handleAddQuery() {
    const ds = this.state.dataSources[0];
    if (ds) {
      Action.addNewQuery({ dataSourceId: ds.id });
    } else {
      alert("Please create data source");
    }
  }

  handleExecute(query) {
    const line = this.state.editor.line;
    const dataSource = this.state.dataSources.find(ds => ds.id === query.dataSourceId);

    Action.executeQuery({ query, dataSource, line });
  }

  handleCancel(query) {
    if (query.status === "working") {
      Action.cancelQuery(query);
    }
  }

  async handleShareOnGist(query) {
    const chart = this.state.charts.find(chart => chart.queryId === query.id);
    const setting = this.state.setting.github;
    const dataSource = this.state.dataSources.find(ds => ds.id === query.dataSourceId);

    if (!setting.token) {
      alert("Set your Github token");
      return;
    }

    try {
      await QuerySharing.shareOnGist({ query, chart, setting, dataSource });
    } catch (err) {
      alert(err.message);
    }
  }

  renderMain() {
    const query = this.state.queries.find(query => query.id === this.state.selectedQueryId);
    if (!query) return <div className="page-Query-main" />;

    return (
      <div className="page-Query-main">
        <QueryHeader
          query={query}
          {...this.state}
          onChangeTitle={title => Action.updateQuery(query.id, { title })}
          onChangeDataSource={dataSourceId => Action.updateQuery(query.id, { dataSourceId })}
        />
        <QueryEditor
          query={query}
          {...this.state}
          onChangeQueryBody={body => Action.updateQuery(query.id, { body })}
          onChangeCursorPosition={line => Action.updateEditor({ line })}
          onChangeEditorHeight={height => Action.updateEditor({ height })}
          onExecute={() => this.handleExecute(query)}
          onCancel={() => this.handleCancel(query)}
          onAddQueryParameter={(key, value) => Action.addNewQueryParameter(query.id, key, value)}
          onUpdateQueryParameter={(id, params) => Action.updateQueryParameter(query.id, id, params)}
          onDeleteQueryParameter={id => Action.deleteQueryParameter(query.id, id)}
          onToggleParameterList={() => Action.toggleParameterList()}
        />
        <QueryResult
          query={query}
          {...this.state}
          onClickCopyAsTsv={() => QuerySharing.copyAsTsv(query)}
          onClickCopyAsCsv={() => QuerySharing.copyAsCsv(query)}
          onClickCopyAsMarkdown={() => QuerySharing.copyAsMarkdown(query)}
          onClickShareOnGist={() => this.handleShareOnGist(query)}
          onSelectTab={name => Action.selectResultTab(query, name)}
          onUpdateChart={Action.updateChart}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="page-Query">
        <div className="page-Query-list">
          <QueryList
            {...this.state}
            onAddQuery={() => this.handleAddQuery()}
            onSelectQuery={Action.selectQuery}
            onDeleteQuery={Action.deleteQuery}
          />
        </div>
        {this.renderMain()}
      </div>
    );
  }
}

export default Container.create(Query, store);
