import React from "react";
import Button from "../Button";
import Editor from "../Editor";
import ParameterList from "../ParameterList";

export default class QueryEditor extends React.Component<any, any> {
  editorElement: HTMLDivElement;

  get options() {
    return {
      mode: "text/x-sql",
      keyMap: this.props.setting.keyBind,
      lineNumbers: true,
      matchBrackets: true,
      indentUnit: 4,
      smartIndent: false
    };
  }

  get style() {
    if (this.props.editor.height == null) {
      return {};
    } else {
      return { height: `${this.props.editor.height}px` };
    }
  }

  handleResizeStart(e) {
    e.preventDefault();
    const height = this.editorElement.clientHeight;
    const y = e.pageY;
    const handleResize = e => {
      let newHeight = height + (e.pageY - y);
      if (newHeight < 0) newHeight = 0;
      this.props.onChangeEditorHeight(newHeight);
    };
    const handleResizeStop = () => {
      document.removeEventListener("mouseup", handleResizeStop);
      document.removeEventListener("mousemove", handleResize);
    };
    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", handleResizeStop);
  }

  renderButton() {
    if (this.props.query.status === "working") {
      return (
        <Button className="QueryEditor-cancelBtn" onClick={() => this.props.onCancel()}>
          Cancel
        </Button>
      );
    } else {
      return (
        <Button className="QueryEditor-executeBtn" onClick={() => this.props.onExecute()}>
          Execute
        </Button>
      );
    }
  }

  renderStatus() {
    switch (this.props.query.status) {
      case "success":
        return this.renderSuccess();
      case "failure":
        return this.renderError();
      case "working":
        return this.renderWorking();
      default:
        return null;
    }
  }

  renderSuccess() {
    const query = this.props.query;
    return (
      <div className="QueryEditor-status">
        <span>
          <i className="fa fa-check" />
        </span>
        <span>runtime: {query.runtime ? `${query.runtime}ms` : "-"}</span>
        <span>rows: {query.rows ? query.rows.length : "-"}</span>
      </div>
    );
  }

  renderError() {
    return (
      <div className="QueryEditor-status is-error">
        <span>
          <i className="fa fa-close" /> Failed
        </span>
      </div>
    );
  }

  renderWorking() {
    return (
      <div className="QueryEditor-status is-working">
        <span>
          <i className="fa fa-spin fa-refresh" />
        </span>
      </div>
    );
  }

  renderToggleParameterListButton() {
    const showParameterList = this.props.editor.showParameterList;

    return (
      <Button className="QueryEditor-parameterToggleBtn" onClick={() => this.props.onToggleParameterList()}>
        {showParameterList ? <i className="fa fa-caret-down" /> : <i className="fa fa-caret-right" />} Parameters
      </Button>
    );
  }

  renderParameterList() {
    const query = this.props.query;
    const showParameterList = this.props.editor.showParameterList;

    if (showParameterList) {
      return (
        <ParameterList
          parameters={query.parameters}
          onAddParameter={this.props.onAddQueryParameter}
          onUpdateParameter={this.props.onUpdateQueryParameter}
          onDeleteParameter={this.props.onDeleteQueryParameter}
        />
      );
    }

    return;
  }

  render() {
    const query = this.props.query;

    return (
      <div className="QueryEditor">
        <Editor
          value={query.body || ""}
          height={this.props.editor.height}
          rootRef={node => (this.editorElement = node)}
          onChange={body => this.props.onChangeQueryBody(body)}
          onChangeCursor={line => this.props.onChangeCursorPosition(line)}
          onSubmit={() => this.props.onExecute()}
          options={this.options}
        />
        <div className="QueryEditor-navbar">
          {this.renderButton()}
          {this.renderToggleParameterListButton()}
          {this.renderStatus()}

          <span onMouseDown={this.handleResizeStart.bind(this)} className="QueryEditor-resize">
            <i className="fa fa-arrows-v" />
          </span>
        </div>

        {this.renderParameterList()}
      </div>
    );
  }
}
