import React, {
  useState,
  useEffect,
  useContext,
  Fragment,
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
import { FormSchema } from "../forms/SchemaForm";
import CoreTableHead, { HeadRow, TableHeaderOrder } from "./CoreTableHead";
import { AuthContext } from "../../Auth";
import { EditModalRef, EditModal } from "../forms/EditModal";
import EditMenu from "../forms/EditMenu";
import AppSnackbar from "../AppSnackbar";
import AddModal from "../forms/AddModal";
import { ObjectEntity } from "../forms/ObjectEntityType";
import schemaTableReducer from "./SchemaTableReducer";
import CoreTableToolbar from "./CoreTableToolbar";
import { LookupEntityFilter } from "../forms/lookups/LookupEntity.interface";
import SchemaTableCell from "./SchemaTableCell";

export type PaginatedResult = { count: number; items: ObjectEntity[] };
export type TableFilter = { [key: string]: any };
export interface SchemaTableConfig {
  pageNumber: number;
  order: TableHeaderOrder;
  orderBy: string;
  sort: string;
  rowsPerPage: number;
  filter: TableFilter;
}

export const schemaTableConfig = {
  pageNumber: 0,
  sort: "id_desc",
  orderBy: "id",
  order: "desc",
  rowsPerPage: 15,
  filter: {} as LookupEntityFilter,
} as SchemaTableConfig;

interface SchemaTableProps<T> {
  filterSchema?: FormSchema<T>;
  page: PaginatedResult;
  title: string;
  onPage: (config: SchemaTableConfig) => void;
  onFilter?: (obj: T) => void;
  config: SchemaTableConfig;
  getEntitySchema(obj?: T): FormSchema<T>;
  deleteEntity(obj: T): Promise<void>;
  onChange?: (
    schema: FormSchema<T>,
    obj: { [key: string]: any },
    changeObj: { [key: string]: any }
  ) => Promise<FormSchema<T> | undefined>;
}

function SchemaTable<T extends ObjectEntity>({
  filterSchema,
  onFilter,
  onPage,
  onChange,
  title,
  getEntitySchema,
  deleteEntity,
  page,
  config,
}: SchemaTableProps<T>) {
  const reducer = schemaTableReducer<T>();
  const [state, dispatch] = useReducer(reducer, { rows: [], count: 0 });

  // table
  const [headRows, setHeadRows] = useState<HeadRow[]>([]);
  const [schema, setEditSchema] = useState<FormSchema<ObjectEntity>>(() =>
    getEntitySchema()
  );

  useEffect(() => dispatch({ type: "LOAD", page: page }), [page]);

  function handleChangePage(
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) {
    onPage({ ...config, pageNumber: newPage });
  }

  function handleRequestSort(
    event: React.MouseEvent<unknown>,
    property: string
  ) {
    const isDesc = config.orderBy === property && config.order === "desc";
    const newOrder = isDesc ? "asc" : "desc";
    onPage({
      ...config,
      order: newOrder,
      orderBy: property,
      sort: `${property}_${newOrder}`,
      pageNumber: 0,
    });
  }

  //editing
  const authContext = useContext(AuthContext);
  const modalRef = useRef<EditModalRef>(null);
  const [appMessage, setAppMessage] = React.useState("");

  useEffect(() => {
    const createHeadRows = () => {
      const rows = Object.entries(schema.properties).map(
        ([property, fieldSchema]) =>
          ({
            id: property,
            numeric: false,
            disablePadding: false,
            label: fieldSchema.title,
          } as HeadRow)
      );
      if (authContext.authenticated) {
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

  function handleEdit(row?: T) {
    if (row && onChange) {
      const asyncNewSchema = onChange(getEntitySchema(row), row, row);
      asyncNewSchema.then((newSchema) =>
        newSchema ? setEditSchema(newSchema) : getEntitySchema(row)
      );
    } else {
      setEditSchema(getEntitySchema(row));
    }
    if (modalRef && modalRef.current) {
      modalRef.current.handleOpen();
    }
  }

  function handleDelete(row: T) {
    deleteEntity(row)
      .then(() => {
        setAppMessage("Entity deleted.");
        dispatch({ type: "DELETE", row: row });
      })
      .catch((err) => {
        console.error(err);
        setAppMessage("Delete failed, unexpected error.");
      });
  }

  function handleOnEditSaveSuccess(row: T) {
    if (schema.type === "ADD") {
      setAppMessage("Entity added.");
      dispatch({ type: "ADD", row: row });
    } else if (schema.type === "EDIT") {
      setAppMessage("Entity saved.");
      dispatch({ type: "EDIT", row: row });
    }
    getEntitySchema();
  }

  /**
   * Purpose of this is allow an asyncronous call to be made to then update the schema
   * such as in updating the help text
   * @param obj
   * @param changeObj
   */
  function handleOnFormChange(
    obj: { [key: string]: any },
    changeObj: { [key: string]: any }
  ): void {
    if (onChange) {
      const asyncNewSchema = onChange(schema as FormSchema<T>, obj, changeObj);
      asyncNewSchema.then((newSchema) =>
        newSchema !== undefined ? setEditSchema(newSchema) : undefined
      );
    }
  }

  return (
    <Fragment>
      <Paper sx={{ width: "100%", marginTop: 3, overflowX: "auto" }}>
        <CoreTableToolbar
          title={title}
          filterSchema={filterSchema}
          onFilter={onFilter}
        />
        <Table sx={{ minWidth: 650 }}>
          <CoreTableHead
            headRows={headRows}
            order={config.order}
            orderBy={config.orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {state.rows.map((row) => (
              <TableRow key={row.id}>
                {Object.entries(schema.properties).map(
                  ([property, fieldSchema]) => (
                    <SchemaTableCell
                      key={property}
                      property={property}
                      fieldSchema={fieldSchema}
                      row={row}
                    />
                  )
                )}
                {authContext.authenticated && (
                  <TableCell>
                    <EditMenu
                      onEdit={() => handleEdit(row)}
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
        schema={schema}
        onSaveSuccess={handleOnEditSaveSuccess}
        onChange={handleOnFormChange}
      />
      <AddModal onAdd={() => handleEdit()} />
    </Fragment>
  );
}

export default SchemaTable;
