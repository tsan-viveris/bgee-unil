/* eslint-disable react/no-array-index-key */
import React from 'react';
import classnames from '../../helpers/classnames';
import { hasColumnsTableHidden } from '../../helpers/constants/mediaQueries';
import useWindowSize from '../../hooks/useWindowSize';
import TableHead from './TableHead';
import TableTitle from './TableTitle';
import TableBody from './TableBody';
import { TableProvider } from '../../contexts/TableContext';
import TableHeader from './TableHeader';
import Input from '../Form/Input';
import Select from '../Select';
import { monoSort, multiSort } from '../../helpers/sortTable';
import TablePagination from './TablePagination';

const Table = ({
  fullwidth = true,
  classNames = '',
  title,
  columns = [],
  data = [],
  onFilter,
  sortable = false,
  multiSortable = false,
  onSortCustom,
  initialSorting,
  onRenderCell,
  onRenderRow,
  striped = true,
  pagination = false,
  defaultPaginationSize = 10,
  customHeader,
  mappingObj = (obj) => obj,
  name,
  identifierAtFilter = false,
  emptyTableMessage = 'No data',
}) => {
  const mappedData = React.useMemo(
    () =>
      data
        .map((obj, key) => ({ ...obj, identifierRow: key + 1 }))
        .map(mappingObj),
    [data, mappingObj]
  );
  const table = React.useRef();
  const { width } = useWindowSize();
  const usedWidth = React.useMemo(
    () => table?.current?.offsetWidth || width,
    [table, width]
  );

  const [sortOption, setSortOption] = React.useState(initialSorting);
  const defineSortOption = React.useCallback(
    (key) => (event) => {
      if (sortable) {
        if (multiSortable && event.shiftKey) {
          let newSort;
          if (!Array.isArray(sortOption))
            newSort = [{ key, sort: 'ascending' }];
          else {
            newSort = [...sortOption];
            const pos = newSort.findIndex((f) => f.key === key);
            if (pos >= 0) {
              if (newSort[pos].sort === 'ascending')
                newSort[pos].sort = 'descending';
              else newSort.splice(pos, 1);
            } else {
              newSort.push({ key, sort: 'ascending' });
            }
          }
          setSortOption(newSort);
        } else {
          let newSortOpt;
          if (!sortOption || sortOption.key !== key) {
            newSortOpt = { key, sort: 'ascending' };
          } else if (sortOption.sort === 'ascending') {
            newSortOpt = { key, sort: 'descending' };
          }
          setSortOption(newSortOpt);
        }
      }
    },
    [multiSortable, sortOption, sortable]
  );

  const [isExpanded, setIsExpanded] = React.useState({});
  const expandAction = React.useCallback(
    (key) => () =>
      setIsExpanded((prev) => ({
        ...prev,
        [key]: !prev[key],
      })),
    []
  );

  const showTableModalButton = React.useMemo(
    () => hasColumnsTableHidden(usedWidth, columns),
    [usedWidth, columns]
  );

  const [currentPage, setPage] = React.useState(1);
  const setCurrentPage = React.useCallback((page) => {
    setPage(page);
    setIsExpanded({});
  }, []);
  const [pageSize, setPageSize] = React.useState(
    pagination ? defaultPaginationSize : mappedData.length
  );

  const [search, setSearch] = React.useState('');
  const definiteColumns = React.useMemo(
    () =>
      search !== '' && identifierAtFilter
        ? [{ key: 'identifierRow', text: 'Row Number' }, ...columns]
        : [...columns],
    [identifierAtFilter, columns, search]
  );
  const searchInput = React.useMemo(
    () => (
      <div className="control table-search is-flex is-flex-direction-row is-align-items-center">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <p className="mr-1">Filter:</p>
        <Input
          value={search}
          onChange={(e) => {
            if (currentPage !== 1) setCurrentPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>
    ),
    [search, currentPage]
  );

  const pageSizeSelector = React.useMemo(
    () =>
      pagination ? (
        <div className="is-flex is-flex-direction-row is-align-items-center is-justify-content-flex-end">
          <p className="mr-2">Show</p>
          <Select
            defaultValue={pageSize}
            options={[10, 20, 50, { value: 100, text: 100 }]}
            onChange={(p) => {
              setCurrentPage(1);
              setPageSize(parseInt(p, 10));
            }}
          />
          <p className="ml-2">entries</p>
        </div>
      ) : null,
    [pageSize, currentPage, mappedData, pagination]
  );
  const processedData = React.useMemo(() => {
    const clone = JSON.parse(JSON.stringify(mappedData));
    const filtered =
      search === '' || !onFilter ? clone : clone.filter(onFilter(search));
    if (sortOption) {
      filtered.sort(
        (Array.isArray(sortOption)
          ? onSortCustom || multiSort
          : onSortCustom || monoSort)(sortOption)
      );
    }
    return filtered;
  }, [mappedData, search, sortOption, onSortCustom]);

  return (
    <TableProvider
      data={{
        name,
        table,
        title,
        columns: definiteColumns,
        data: processedData,
        expandAction,
        isExpanded,
        onRenderRow,
        onRenderCell,
        showTableModalButton,
        usedWidth,
        sortable,
        sortOption,
        defineSortOption,
        pagination,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        customHeader,
        searchInput,
        pageSizeSelector,
        mappingObj,
      }}
    >
      <TableHeader />
      <TableTitle />
      {processedData.length > 0 ? (
        <div className="table-container">
          <table
            ref={table}
            className={classnames(
              'table',
              { sortable, 'is-fullwidth': fullwidth, 'is-striped': striped },
              classNames
            )}
          >
            <TableHead />
            <TableBody />
          </table>
        </div>
      ) : (
        emptyTableMessage
      )}
      <TablePagination />
    </TableProvider>
  );
};

export default Table;
