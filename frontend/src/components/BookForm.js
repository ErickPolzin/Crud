import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
} from '@mui/material';
import axios from 'axios';

const BookForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publicationYear: '',
    genre: '',
  });

  useEffect(() => {
    if (isEditMode) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/books/${id}`);
      setFormData({
        title: response.data.title,
        author: response.data.author,
        isbn: response.data.isbn,
        publicationYear: response.data.publicationYear,
        genre: response.data.genre,
      });
    } catch (error) {
      setError('Error fetching book: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/books/${id}`, {
          title: formData.title,
          author: formData.author,
          isbn: formData.isbn,
          publicationYear: formData.publicationYear,
          genre: formData.genre,
        });
        setSuccess('Book updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/books', {
          title: formData.title,
          author: formData.author,
          isbn: formData.isbn,
          publicationYear: formData.publicationYear,
          genre: formData.genre,
        });
        setSuccess('Book added successfully!');
      }
      
      // Wait a moment to show the success message before navigating
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.error || 'Error saving book: ' + error.message);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'Edit Book' : 'Add New Book'}
      </Typography>
      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                error={!formData.title}
                helperText={!formData.title ? 'Title is required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                error={!formData.author}
                helperText={!formData.author ? 'Author is required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ISBN"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
                error={!formData.isbn}
                helperText={!formData.isbn ? 'ISBN is required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Publication Year"
                name="publicationYear"
                type="number"
                value={formData.publicationYear}
                onChange={handleChange}
                required
                error={!formData.publicationYear}
                helperText={!formData.publicationYear ? 'Publication Year is required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                error={!formData.genre}
                helperText={!formData.genre ? 'Genre is required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!formData.title || !formData.author || !formData.isbn || !formData.publicationYear || !formData.genre}
                >
                  {isEditMode ? 'Update' : 'Save'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default BookForm; 