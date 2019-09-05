import React, { Fragment, useContext, useState, useEffect } from 'react';
import { BookSchemaContext, BookSchemaContextProvider, BookFilter } from './BookSchemaContext';
import { Book } from '../common/client';
import withProvider from '../core/components/withProvider';
import SchemaTable, { PaginatedResult, SchemaTableConfig, schemaTableConfig } from '../core/components/tables/SchemaTable';
import BookApi from '../common/client/BookApi';
import { FormSchema } from '../core/components/forms/SchemaForm';
import { ObjectEntity } from '../core/components/forms/ObjectEntityType';

function Books() {
  const schemaContext = useContext(BookSchemaContext);

  const [schema, setSchema] = useState<FormSchema<Book>>(() => schemaContext.get({type:'ADD'}));
  const [filterSchema, setFilterSchema] = useState<FormSchema<BookFilter>>(() => schemaContext.get({type:'FILTER'}));
  const [page, setPage] = React.useState<PaginatedResult>({items:[], count:0} as PaginatedResult);
  const [config, setConfig] = React.useState<SchemaTableConfig>(schemaTableConfig);

  useEffect(
    (() => {
      BookApi.getBooks(
        config.sort, 
        filterSchema.object.bookAuthor.map(b => b.id as number),
        filterSchema.object.bookCategory.map(b => b.id as number),
        filterSchema.object.bookStatus.map(b => b.id as number),
        config.pageNumber + 1, 
        config.rowsPerPage
      ).then(result => setPage(result as PaginatedResult))
    }), 
    [config, filterSchema.object] 
  );


  // the use effect will catch async lookups that need to be bound to the schema
  useEffect(() => {
    setSchema(schemaContext.get({type:'ADD'}));
    setFilterSchema(schemaContext.get({type:'FILTER'}));
  }, [schemaContext]);


  const handleGetEntitySchema = (obj: ObjectEntity) => schemaContext.get({type:'EDIT', obj:obj as Book}) as FormSchema<ObjectEntity>;
  const handleDeleteEntity = (obj: ObjectEntity) => BookApi.deleteBook(obj.id);
  const handleOnPage = (pageConfig: SchemaTableConfig) => setConfig(pageConfig);
  const handleOnFilter = (obj: ObjectEntity) => {
    setFilterSchema({...filterSchema, object:obj as BookFilter});
  };

  return (
    <Fragment>
      <SchemaTable 
        schema={schema as FormSchema<ObjectEntity>} 
        filterSchema={filterSchema as FormSchema<ObjectEntity>} 
        getEntitySchema={handleGetEntitySchema} 
        deleteEntity={handleDeleteEntity} 
        onFilter={handleOnFilter}
        page={page}
        onPage={handleOnPage}
        config={config}
        title="Books"
      />
    </Fragment>
  );
}

export default withProvider(Books, BookSchemaContextProvider);
