import React, { useState } from 'react';
import { Box, Chip, TextField } from '@mui/material';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange }) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleDelete = (tagToDelete: string) => {
    onChange(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Box>
      <TextField
        label="Добавить тег"
        variant="outlined"
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        helperText="Нажмите Enter, чтобы добавить тег"
      />
      {tags.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 1 }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleDelete(tag)}
              size="small"
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TagInput;