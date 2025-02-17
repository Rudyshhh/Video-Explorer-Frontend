'use client'; // Mark the file as a client-side component

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useTable, usePagination } from 'react-table';
import ReactSlider from 'react-slider';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import debounce from 'lodash.debounce';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    minLikes: 0,
    startDate: null,
    endDate: null,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch data with filters
  const fetchData = async (page = 1) => {
    setLoading(true);
    const { keyword, minLikes, startDate, endDate } = filters;
    let url = `http://127.0.0.1:8000/api/filtered-videos/?page=${page}`;

    if (keyword) url += `&keyword=${keyword}`;
    if (minLikes) url += `&min_likes=${minLikes}`;
    if (startDate && endDate)
      url += `&start_date=${startDate}&end_date=${endDate}`;

    try {
      const response = await axios.get(url);
      setVideos(response.data.results);
      setTotalPages(Math.ceil(response.data.total_count / 10)); // Assuming 10 items per page
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [filters, page]);

  // React-table setup
  const columns = React.useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
        Cell: ({ cell: { value } }) => (
          <a href={`https://www.youtube.com/watch?v=${value}`} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        ),
      },
      {
        Header: 'Likes',
        accessor: 'likes',
      },
      {
        Header: 'Published Date',
        accessor: 'pub_date',
        Cell: ({ cell: { value } }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: 'Description',
        accessor: 'desc',
        Cell: ({ cell: { value } }) => (
          <div>
            {value.length > 100 ? `${value.substring(0, 100)}...` : value}
            {value.length > 100 && <button>Read More</button>}
          </div>
        ),
      },
      {
        Header: 'Thumbnail',
        accessor: 'thumb',
        Cell: ({ cell: { value } }) => <img src={value} alt="Thumbnail" width={100} />,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: videos,
    },
    usePagination
  );

  // Debounced input handler for search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters((prev) => ({ ...prev, keyword: value }));
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  // Handle filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2>Video List</h2>
      <div>
        <input
          type="text"
          placeholder="Search by title"
          onChange={handleSearchChange}
        />
        <div>
          <label>Likes Range</label>
          <ReactSlider
            min={0}
            max={10000000}
            value={filters.minLikes}
            onChange={(value) => setFilters((prev) => ({ ...prev, minLikes: value }))}
            renderTrack={(props, state) => <div {...props} />}
          />
        </div>
        <div>
          <label>Start Date</label>
          <ReactDatePicker
            selected={filters.startDate}
            onChange={(date) => setFilters((prev) => ({ ...prev, startDate: date }))}
          />
          <label>End Date</label>
          <ReactDatePicker
            selected={filters.endDate}
            onChange={(date) => setFilters((prev) => ({ ...prev, endDate: date }))}
          />
        </div>
        <button onClick={() => fetchData(page)}>Apply Filters</button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div>
            <button
              onClick={() => {
                if (page > 1) setPage(page - 1);
              }}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => {
                if (page < totalPages) setPage(page + 1);
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoList;
