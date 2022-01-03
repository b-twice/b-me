import { ObjectEntity } from "../forms/ObjectEntityType";

type State<T> = T[];
type Action<T> =
  | { type: "LOAD"; rows: T[] }
  | { type: "ADD" | "EDIT" | "DELETE"; row: T };

const listReducer = <T extends ObjectEntity>() => (
  state: State<T>,
  action: Action<T>
): State<T> => {
  switch (action.type) {
    case "LOAD":
      return action.rows;
    case "ADD":
      return [action.row, ...state];
    case "EDIT":
      return state.map((e) => {
        if (e.id === action.row.id) {
          return action.row;
        }
        return e;
      });
    case "DELETE":
      return state.filter((r) => r.id !== action.row.id);
    default:
      return state;
  }
};

export default listReducer;
