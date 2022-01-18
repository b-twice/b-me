import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useReducer,
} from "react";
import {
  Paper,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from "@mui/material";
import { FieldSchema, FormSchema, SchemaFormStates } from "../forms/SchemaForm";
import CoreTableHead, { HeadRow, TableHeaderOrder } from "./CoreTableHead";
import { AuthContext } from "../../Auth";
import { EditModalRef, EditModal } from "../forms/EditModal";
import EditMenu from "../forms/EditMenu";
import AppSnackbar from "../AppSnackbar";
import AddModal from "../forms/AddModal";
import schemaTableReducer from "./SchemaTableReducer";
import CoreTableToolbar from "./CoreTableToolbar";
import SchemaTableCell from "./SchemaTableCell";

export interface PaginatedResult<T> {
  count: number;
  items?: T[] | undefined;
}
export type TableFilter = Record<string, any>;
export interface SchemaTableConfig<T> {
  pageNumber: number;
  order: TableHeaderOrder;
  orderBy: string;
  sort: string;
  rowsPerPage: number;
  filter: T | undefined;
}

export function createSchemaTableConfig<
  T = TableFilter
>(): SchemaTableConfig<T> {
  return {
    pageNumber: 0,
    sort: "id_desc",
    orderBy: "id",
    order: "desc",
    rowsPerPage: 15,
    filter: {} as T,
  };
}

interface SchemaTableProps<T, F> {
  filterSchema?: FormSchema<F>;
  schema: FormSchema<T>;
  title: string;
  onPage: (config: SchemaTableConfig<F>) => Promise<PaginatedResult<T>>;
  configOptions?: Partial<SchemaTableConfig<F>>;
  onChange?: (
    schema: FormSchema<T>,
    obj: T,
    changeObj: Partial<T>
  ) => Promise<FormSchema<T> | undefined>;
}

function SchemaTable<T, F>({
  filterSchema,
  onPage,
  onChange,
  schema,
  title,
  configOptions,
}: SchemaTableProps<T, F>) {
  const reducer = schemaTableReducer<T>();
  const [state, dispatch] = useReducer(reducer, { rows: [], count: 0 });
  const [editSchema, setEditSchema] = useState<FormSchema<T>>(() => schema);
  const [editRow, setEditRow] = useState<T>({} as T);
  const [editState, setEditState] = useState<SchemaFormStates | undefined>();
  const [config, setConfig] = useState<SchemaTableConfig<F>>(() => ({
    ...createSchemaTableConfig<F>(),
    ...configOptions,
  }));
  const [page, setPage] = useState<PaginatedResult<T> | undefined>();

  useEffect(() => setEditSchema(schema), [schema]);
  useEffect(() => {
    onPage(config).then(setPage);
  }, [configOptions, config, onPage]);

  // table
  const [headRows, setHeadRows] = useState<HeadRow[]>([]);

  useEffect(() => {
    if (page) dispatch({ type: "LOAD", page: page });
  }, [page]);

  function handleChangePage(
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) {
    setConfig({ ...config, pageNumber: newPage });
  }

  function handleRequestSort(
    event: React.MouseEvent<unknown>,
    property: string
  ) {
    const isDesc = config.orderBy === property && config.order === "desc";
    const newOrder = isDesc ? "asc" : "desc";
    setConfig({
      ...config,
      order: newOrder,
      orderBy: property,
      sort: `${property}_${newOrder}`,
      pageNumber: 0,
    });
  }

  const handleOnFilter = (obj?: F) => {
    setConfig({ ...config, pageNumber: 0, filter: obj });
  };

  //editing
  const authContext = useContext(AuthContext);
  const modalRef = useRef<EditModalRef>(null);
  const [appMessage, setAppMessage] = React.useState("");

  useEffect(() => {
    const createHeadRows = () => {
      const rows = (
        Object.entries(schema.properties) as [string, FieldSchema][]
      ).map(
        ([property, fieldSchema]) =>
          ({
            id: property,
            numeric: false,
            disablePadding: false,
            label: fieldSchema.title,
            sortable: fieldSchema.sortable,
          } as HeadRow)
      );
      if (authContext.authenticated && schema.readonly !== true) {
        rows.push({
          id: "actions",
          numeric: false,
          disablePadding: false,
          label: "",
        });
      }
      return rows;
    };
    setHeadRows(createHeadRows);
  }, [schema, authContext.authenticated]);

  async function startEdit(state: SchemaFormStates, row?: T) {
    if (row && onChange) {
      const newSchema = await onChange(schema, row, row);
      if (newSchema) {
        setEditSchema(newSchema);
      }
    }
    setEditRow(row ?? ({} as T));
    setEditState(state);
    if (modalRef && modalRef.current) {
      modalRef.current.handleOpen();
    }
  }

  function handleDelete(row: T) {
    if (schema.delete) {
      schema
        .delete(row)
        .then(() => {
          setAppMessage("Entity deleted.");
          dispatch({ type: "DELETE", row: row });
        })
        .catch((err) => {
          console.error(err);
          setAppMessage("Delete failed, unexpected error.");
        });
    }
  }

  function handleOnEditSaveSuccess(row: T) {
    if (editState === "ADD") {
      setAppMessage("Entity added.");
      dispatch({ type: "ADD", row: row });
    } else if (editState === "EDIT") {
      setAppMessage("Entity saved.");
      dispatch({ type: "EDIT", row: row });
    }
    setEditSchema(schema);
    if (schema.repeatAdd && editState === "ADD") {
      startEdit("ADD").then();
    }
  }

  /**
   * Purpose of this is allow an asyncronous call to be made to then update the schema
   * such as in updating the help text
   * @param obj
   * @param changeObj
   */
  function handleOnFormChange(obj: T, changeObj: Partial<T>): void {
    if (onChange) {
      const asyncNewSchema = onChange(schema as FormSchema<T>, obj, changeObj);
      asyncNewSchema.then((newSchema) =>
        newSchema ? setEditSchema(newSchema) : newSchema
      );
    }
  }

  return (
    <>
      <Paper sx={{ width: "100%", marginTop: 3, overflowX: "auto" }}>
        <CoreTableToolbar<F>
          title={title}
          filterSchema={filterSchema}
          config={config}
          onFilter={handleOnFilter}
        />
        <Table sx={{ minWidth: 650 }}>
          <CoreTableHead
            headRows={headRows}
            order={config.order}
            orderBy={config.orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {state.rows.map((row, idx) => (
              <TableRow key={idx}>
                {(
                  Object.entries(schema.properties) as [string, FieldSchema][]
                ).map(([property, fieldSchema]) => (
                  <SchemaTableCell
                    key={property}
                    property={property}
                    fieldSchema={fieldSchema}
                    row={row}
                  />
                ))}
                {authContext.authenticated && schema.readonly !== true && (
                  <TableCell>
                    <EditMenu
                      onEdit={() => startEdit("EDIT", row).then()}
                      onDelete={() => handleDelete(row)}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[config.rowsPerPage]}
          count={state.count}
          component="div"
          rowsPerPage={config.rowsPerPage}
          page={config.pageNumber}
          backIconButtonProps={{
            "aria-label": "previous page",
          }}
          nextIconButtonProps={{
            "aria-label": "next page",
          }}
          onPageChange={handleChangePage}
        />
      </Paper>
      <AppSnackbar message={appMessage} onClose={() => setAppMessage("")} />
      <EditModal
        ref={modalRef}
        schema={editSchema}
        editState={editState!}
        obj={editRow}
        onSaveSuccess={handleOnEditSaveSuccess}
        onChange={handleOnFormChange}
      />
      {schema.readonly !== true && (
        <AddModal onAdd={() => startEdit("ADD").then()} />
      )}
    </>
  );
}

export default SchemaTable;
