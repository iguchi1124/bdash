import React from "react";

export default class Frame extends React.Component<any, any> {
  frameElement: HTMLDivElement | null;

  handleResizeStart(e) {
    e.preventDefault();
    if (this.frameElement === null) return;

    const param = this.props.width ? this.frameElement.clientWidth : this.frameElement.clientHeight;
    const posProp = this.props.width ? "pageX" : "pageY";
    const pos = e[posProp];

    const handleResize = e => {
      if (this.frameElement !== null) {
        let newParam = param + (e[posProp] - pos);
        if (newParam < 5) newParam = 5;
        this.frameElement.style[this.props.width ? "width" : "height"] = `${newParam}px`;
      }
    };

    const handleResizeStop = () => {
      document.removeEventListener("mouseup", handleResizeStop);
      document.removeEventListener("mousemove", handleResize);
    };

    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", handleResizeStop);
  }

  render() {
    const style: React.CSSProperties = { position: "relative" };
    let resizeBar;

    if (this.props.height === "auto" || this.props.width === "auto") {
      style.flex = 1;
    } else if (this.props.width) {
      style.width = `${this.props.width}px`;
    } else if (this.props.height) {
      style.height = `${this.props.height}px`;
    }

    if (this.props.resizable) {
      const style: React.CSSProperties = { position: "absolute" };

      if (this.props.width) {
        Object.assign(style, {
          right: "0",
          top: "0",
          width: "5px",
          height: "100%",
          cursor: "col-resize"
        });
      } else {
        Object.assign(style, {
          left: "0",
          bottom: "0",
          width: "100%",
          height: "5px",
          cursor: "row-resize"
        });
      }
      resizeBar = <div style={style} onMouseDown={e => this.handleResizeStart(e)} />;
    }

    return (
      <div style={style} className={this.props.className} ref={node => (this.frameElement = node)}>
        {this.props.children}
        {resizeBar}
      </div>
    );
  }
}
