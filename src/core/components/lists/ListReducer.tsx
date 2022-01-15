type State<T> = T[];
type Action<T> =
  | { type: "LOAD"; rows: T[] }
  | { type: "ADD" | "EDIT" | "DELETE"; row: T };

function SchemaListReducer<T>() {
  return (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "LOAD":
        return action.rows;
      case "ADD":
        return [action.row, ...state];
      case "EDIT":
        return state.map((e: Record<string, any>) => {
          if (e.id === (action.row as Record<string, any>).id) {
            return action.row;
          }
          return e as T;
        });
      case "DELETE":
        return state.filter(
          (r: Record<string, any>) =>
            r.id !== (action.row as Record<string, any>).id
        );
      default:
        return state;
    }
  };
}

export default SchemaListReducer;
