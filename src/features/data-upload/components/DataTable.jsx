import { Table, Thead, Tbody, Tr, Th, Td,Text,Input,Select } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import {useState,useMemo} from "react";

const Filter = ({ column, table }) => {
  const columnFilterValue = column.getFilterValue();
  const sortedUniqueValues = useMemo(
    () =>Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  return <>
    <Select value={columnFilterValue} onChange={(e) => column.setFilterValue(e.target.value)} size='sm'>
    <option value="">All</option>
      {sortedUniqueValues.map((value) => (
        <option value={value} key={value}>
          {value}
        </option>
      ))}
    </Select>
  </>;
};

const DataTable = ({ data,columns }) => {
  const [sorting,setSorting]=useState([]);
  const [columnFilters,setColumnFilters]=useState([]);
  const [globalFilter,setGlobalFilter]=useState("");
  const table=useReactTable({
    data,
    columns,
    getCoreRowModel:getCoreRowModel(),
    getFilteredRowModel:getFilteredRowModel(),
    onSortingChange:setSorting,
    getSortedRowModel:getSortedRowModel(),
    onColumnFiltersChange:setColumnFilters,
    onGlobalFilterChange:setGlobalFilter,
    getFacetedRowModel:getFacetedRowModel(),
    getFacetedUniqueValues:getFacetedUniqueValues(),
    state:{
      sorting,
      columnFilters,
      globalFilter,
    }, 
  
  });
  return(
    <>
    <Input placeholder='Search...' value={globalFilter ?? ''} onChange={(e)=>setGlobalFilter(String(e.target.value))}/>
    <Table>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const meta=header.column.columnDef.meta;
            return(
              <Th
                key={header.id}
                isNumeric={meta?.isNumeric}
                >
                <div onClick={header.column.getToggleSortingHandler()}>
                <Text fontSize={'md'}>
              {flexRender(
                header.column.columnDef.header,
                header.getContext()
              )}
              </Text>
              <Text as='span'>
                {header.column.getIsSorted() ? (
                  header.column.getIsSorted() === "asc" ? (
                    <TriangleDownIcon aria-label="sorted ascending" />
                  ) : (
                    <TriangleUpIcon aria-label="sorted descending" />
                  )
                ) : null}
              </Text>
              </div>
          
              {header.column.getCanFilter() ? (
                <div>
                <Filter column={header.column} table={table} />
                </div>
              ):null}
    
              </Th>
            )
          }
            
          )}
          </Tr>
        ))
        }
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <Tr key={row.id} _hover={{ bg: "teal.50" }}>
            {row.getVisibleCells().map((cell) => {
              const meta=cell.column.columnDef.meta;
              return(
              <Td key={cell.id} isNumeric={meta?.isNumeric}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
              )
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
    </>
  );
}
export default DataTable;
