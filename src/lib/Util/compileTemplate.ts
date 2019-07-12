import { template, templateSettings } from "lodash";

templateSettings.interpolate = /\$(\w+)/g;

export default function compileTemplate(text: string, context: object): string {
  const compiled = template(text);
  return compiled(context);
}
