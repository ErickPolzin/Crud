import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import axios from 'axios';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book details:', error);
    }
  };

  if (!book) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to List
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {book.title}
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Author
            </Typography>
            <Typography variant="body1">{book.author}</Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              ISBN
            </Typography>
            <Typography variant="body1">{book.isbn}</Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Publication Year
            </Typography>
            <Typography variant="body1">{book.publicationYear}</Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Genre
            </Typography>
            <Typography variant="body1">{book.genre}</Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/edit/${id}`)}
          >
            Edit Book
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BookDetails; 