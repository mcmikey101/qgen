import React from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

interface DeckFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterTag: string;
  onFilterTagChange: (value: string) => void;
  tags: string[];
  onCreateClick: () => void;
}

const DeckFilters: React.FC<DeckFiltersProps> = ({
  search,
  onSearchChange,
  filterTag,
  onFilterTagChange,
  tags,
  onCreateClick,
}) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 2 }}>
    <TextField
      label="Поиск"
      variant="outlined"
      fullWidth
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      sx={{ flex: '1 1 200px' }}
    />
    <FormControl sx={{ minWidth: 150, flex: '0 1 auto' }}>
      <InputLabel>Фильтр по тегу</InputLabel>
      <Select
        value={filterTag}
        onChange={(e) => onFilterTagChange(e.target.value)}
        label="Фильтр по тегу"
      >
        <MenuItem value="">Все</MenuItem>
        {tags.map((tag) => (
          <MenuItem key={tag} value={tag}>
            {tag}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <Button
      variant="contained"
      onClick={onCreateClick}
      sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
    >
      Создать колоду
    </Button>
  </Box>
);

export default DeckFilters;