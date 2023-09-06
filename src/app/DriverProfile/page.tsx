'use client'
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

interface Column {
  id: 'name' | 'code' | 'population' | 'size' | 'density';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Driver Number', minWidth: 170 },
  { id: 'code', label: 'Fisrt Name', minWidth: 100 },
  {
    id: 'population',
    label: 'Middle Name',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'size',
    label: 'Last Name',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'density',
    label: 'Driver Id',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },
  {
    id: 'density',
    label: 'Driver Contact',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },

  {
    id: 'density',
    label: 'Driver Card',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },

  {
    id: 'density',
    label: 'Driver Address 1',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },

  {
    id: 'density',
    label: 'Driver Address 2',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },

  {
    id: 'density',
    label: 'Driver Aviability',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },
];

interface Data {
  name: string;
  code: string;
  population: number;
  size: number;
  density: number;
}

function createData(
  name: string,
  code: string,
  population: number,
  size: number,
): Data {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [
  createData('India', 'IN', 1324171354, 3287263),
  // createData('China', 'CN', 1403500365, 9596961),
  // createData('Italy', 'IT', 60483973, 301340),
  // createData('United States', 'US', 327167434, 9833520),
  // createData('Canada', 'CA', 37602103, 9984670),
  // createData('Australia', 'AU', 25475400, 7692024),
  // createData('Germany', 'DE', 83019200, 357578),
  // createData('Ireland', 'IE', 4857000, 70273),
  // createData('Mexico', 'MX', 126577691, 1972550),
  // createData('Japan', 'JP', 126317000, 377973),
  // createData('France', 'FR', 67022000, 640679),
  // createData('United Kingdom', 'GB', 67545757, 242495),
  // createData('Russia', 'RU', 146793744, 17098246),
  // createData('Nigeria', 'NG', 200962417, 923768),
  // createData('Brazil', 'BR', 210147125, 8515767),
];


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-100%)',
  width: 680,
  bgcolor: 'background.paper',
  boxShadow: 24,
};

export default function DriverProfile() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return <div >

    <Paper sx={{ width: '98%' }} className='bg-green-50 ms-3 mr-3 mt-3'>

      {/* <Button>Add New Driver</Button> */}

      <div className='grid lg:grid-cols-2 md:grid-cols-2  sm:grid-cols-2    p-4'>

        <div className=' lg:grid-col-span-1 md:grid-col-span-1 sm:grid-col-span-1 lg:mb-0 flex lg: justify-center sm:justify-start mb-4 '>
          <button onClick={handleOpen} className="bg-[#00B56C] px-4 py-1  text-white rounded-md">Add To A Vehicle</button>
        </div>

        <div className='lg:grid-col-span-1 md:grid-col-span-1 sm:grid-col-span-1  text-end  flex lg: justify-center sm:justify-end'>
          <input type="text" className='px-4 py-2 shadow-lg border-none outline-none' placeholder='Seacrch' />
        </div>

      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2" className='text-black'>
              <p className='bg-[#00B56C]  p-3 text-white w-full '>Add New Driver</p>
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <div className='grid grid-cols-3 m-6 mt-8'>
                <div className="lg:col-span-2 col-span-1 ">
                  <label className='text-gray-700 '><i className='text-red-500 mt-5'>*</i> Drives:
                    <select className="h-8 w-10/12 border-2 boder-gray-100 bg-white outline-none">
                      <option>Uk</option>
                      <option>Uk</option>
                    </select>
                  </label>
                </div>

                <div className="lg:col-span-1 col-span-1 ">
                  <label> <i className='text-red-500 mt-5'>*</i> Vehicles:
                    <select className="h-8 w-7/12 border-2 boder-gray-100 bg-white outline-none">
                      <option>Uk</option>
                      <option>Uk</option>
                    </select>
                  </label>
                  <br></br>
                  <p className="bg-[#00B56C]    px-4 py-1 mx-12 mt-10  text-center text-white rounded-md " >Submit</p>
                </div>
              </div>

            </Typography>
          </Box>
        </Fade>
      </Modal>
      <TableContainer sx={{ height: 640 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>

  </div >
}


