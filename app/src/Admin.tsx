import AddIcon from '@mui/icons-material/Add';
import { Button, ButtonGroup, TableFooter, TablePagination, Typography, styled } from "@mui/material";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from "axios";
import { FunctionComponent, useEffect, useState } from "react";
import { AddCard } from "./AddCard";
import "./AdminStyles.css";
import appConfig from './config/config.json';
import { Chunk } from "./models/Chunk";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const Admin: FunctionComponent = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [chunksData, setChunksData] = useState([]);


  useEffect(() => {
    loadChunks();
  }, []);

  const loadChunks = () => {
    const url = `${appConfig.backendUrl}/api/chunks`;
    axios.get(url).then((response) => {
      setChunksData(response.data);
    });
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleClick = () => {
    setOpenDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenDialog(false);
  };

  const onPostChunkCreated = (success: boolean) => {
    if (success) {
      loadChunks();
    }
  };

  return (
    <>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Chunk
      </Button>
      <TableContainer component={Paper}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="right">Title</StyledTableCell>
              <StyledTableCell align="right">Category</StyledTableCell>
              <StyledTableCell>Content</StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chunksData.map((row: Chunk, idx) => (
              <TableRow
                key={idx}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="right">{row.title}</TableCell>
                <TableCell align="right">{row.category}</TableCell>
                <TableCell>
                  <Typography className='contentCell'>
                    {row.content}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <ButtonGroup variant="text" aria-label="text button group">
                    <Button id="edit">Edit</Button>
                    <Button id="delete">Delete</Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={chunksData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <AddCard open={openDialog} onClose={handleCloseAddDialog} postSubmit={onPostChunkCreated}></AddCard>
    </>
  )
}

