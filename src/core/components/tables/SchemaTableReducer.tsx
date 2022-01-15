import { PaginatedResult } from "./SchemaTable";

type State<T> = { rows: T[]; count: number };
type Action<T> =
  | { type: "LOAD"; page: PaginatedResult<T> }
  | { type: "ADD" | "EDIT" | "DELETE"; row: T };

function schemaTableReducer<T>() {
  return (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "LOAD":
        return { rows: action.page.items as T[], count: action.page.count };
      case "ADD":
        return { rows: [action.row, ...state.rows], count: state.count + 1 };
      case "EDIT":
        let editRows = state.rows.map((e: Record<string, any>) => {
          const id = (action.row as Record<string, any>).id;
          if (e.id === id) {
            return action.row;
          }
          return e;
        });
        return { rows: editRows as T[], count: state.count };
      case "DELETE":
        let deleteRows = state.rows.filter(
          (r: Record<string, any>) =>
            r.id !== (action.row as Record<string, any>).id
        );
        return { rows: deleteRows, count: state.count - 1 };
      default:
        return state;
    }
  };
}

export default schemaTableReducer;
