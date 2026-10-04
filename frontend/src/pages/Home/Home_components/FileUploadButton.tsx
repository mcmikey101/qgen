import React from 'react';
import { Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface FileUploadButtonProps {
  file: File | null;
  onChange: (file: File) => void;
  accept: string;
  placeholder: string;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  file,
  onChange,
  accept,
  placeholder,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
      {file ? file.name : placeholder}
      <input type="file" hidden accept={accept} onChange={handleChange} />
    </Button>
  );
};

export default FileUploadButton;