import React from "react";
import Button from "../Button";

export default class ParameterList extends React.Component<any, any> {
  newParameterKeyInputElement: HTMLInputElement | null;
  newParameterValueInputElement: HTMLInputElement | null;

  handleAddParameter() {
    if (this.newParameterKeyInputElement !== null && this.newParameterValueInputElement !== null) {
      this.props.onAddParameter(this.newParameterKeyInputElement.value, this.newParameterValueInputElement.value);
      this.newParameterKeyInputElement.value = "";
      this.newParameterValueInputElement.value = "";
    }
  }

  handleChange(e, parameter) {
    parameter[e.target.name] = e.target.value;
    this.props.onUpdateParameter(parameter.id, parameter);
  }

  render() {
    const parameters = this.props.parameters;

    return (
      <div className="ParameterList">
        <div className="ParameterList-list">
          {parameters.map(parameter => {
            return (
              <div className="ParameterList-item" key={parameter.id}>
                <input className="ParameterList-input" name="key" value={parameter.key} onChange={e => this.handleChange(e, parameter)}/>
                <input className="ParameterList-input" name="value" value={parameter.value} onChange={e => this.handleChange(e, parameter)} />
                <span onClick={() => this.props.onDeleteParameter(parameter.id)}>
                  <i className="fa fa-remove" />
                </span>
              </div>
            );
          })}
        </div>

        <div className="ParameterList-new">
          <input className="ParameterList-input" ref={node => (this.newParameterKeyInputElement = node)} placeholder="KEY" />
          <input className="ParameterList-input" ref={node => (this.newParameterValueInputElement = node)} placeholder="VALUE" />
          <Button className="ParameterList-addBtn" onClick={() => this.handleAddParameter()}>
              Add
          </Button>
        </div>
      </div>
    );
  }
}
