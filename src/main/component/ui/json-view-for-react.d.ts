declare module 'json-view-for-react' {
  interface JsonViewProps {
    obj: Record<string, unknown>;
    cssPrefix?: string;
    showLineNumbers?: boolean;
    highlightedLineNumbers?: number[];
  }

  const JsonView: React.FunctionComponent<JsonViewProps>;
  export = JsonView;
}
