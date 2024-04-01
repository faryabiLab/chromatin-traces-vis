import { Table, Thead, Tbody, Tr, Th, Td,Text } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel
} from "@tanstack/react-table";
import {useState} from "react";

const DataTable = ({ data,columns }) => {
  const [sorting,setSorting]=useState([]);
  const [columnFilters,setColumnFilters]=useState([]);
  const [globalFilter,setGlobalFilter]=useState("");
  const table=useReactTable({
    data,
    columns,
    getCoreRowModel:getCoreRowModel(),
    onSortingChange:setSorting,
    getSortedRowModel:getSortedRowModel(),
    onColumnFiltersChange:setColumnFilters,
    onGlobalFilterChange:setGlobalFilter,
    state:{
      sorting,
      columnFilters,
      globalFilter,
    }
  });
  return(
    <Table>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const meta=header.column.columnDef.meta;
            return(
              <Th
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                isNumeric={meta?.isNumeric}
                >
              {flexRender(
                header.column.columnDef.header,
                header.getContext()
              )}
              <Text as='span'>
                {header.column.getIsSorted() ? (
                  header.column.getIsSorted() === "asc" ? (
                    <TriangleDownIcon aria-label="sorted ascending" />
                  ) : (
                    <TriangleUpIcon aria-label="sorted descending" />
                  )
                ) : null}
              </Text>
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
          <Tr key={row.id}>
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
  );
}
export default DataTable;
