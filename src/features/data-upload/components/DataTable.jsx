import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Input,
  Select,
  Flex,
  Button,
  Box,
  Spacer,
  HStack,
  TableContainer,
} from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';

const Filter = ({ column, table }) => {
  const columnFilterValue = column.getFilterValue();
  const sortedUniqueValues = useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  return (
    <>
      <Select
        value={columnFilterValue}
        onChange={(e) => column.setFilterValue(e.target.value)}
        size="sm"
      >
        <option value="">All</option>
        {sortedUniqueValues.map((value) => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </Select>
    </>
  );
};

const DataTable = ({ data, columns }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const table = useReactTable({
    initialState:{
      columnVisibility: {
        filename: false
      }
    },
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
  });
  return (
    <>
      <Input
        placeholder="Search in the table..."
        value={globalFilter ?? ''}
        onChange={(e) => setGlobalFilter(String(e.target.value))}
      />
      <TableContainer>
        <Table>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta;
                  return (
                    <Th key={header.id} isNumeric={meta?.isNumeric}>
                      <div onClick={header.column.getToggleSortingHandler()}>
                        <Text fontSize={'md'}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </Text>
                        <span>
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === 'asc' ? (
                              <TriangleDownIcon aria-label="sorted ascending" />
                            ) : (
                              <TriangleUpIcon aria-label="sorted descending" />
                            )
                          ) : null}
                        </span>
                      </div>

                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id} _hover={{ bg: 'teal.50' }}>
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta;
                  return (
                    <Td key={cell.id} isNumeric={meta?.isNumeric}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex>
        <HStack width={'100%'} justifyContent={'center'}>
          <Button
            variant="ghost"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </Button>
          <Text>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </Text>
          <Button
            variant="ghost"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </Button>
        </HStack>
        <Spacer />
        <Box width="10%">
          <Select
            variant="flushed"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </Box>
      </Flex>
    </>
  );
};
export default DataTable;
