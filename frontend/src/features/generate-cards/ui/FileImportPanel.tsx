import React, { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Collapse, Snackbar, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.md', '.txt'];
const MAX_FILE_SIZE_MB = 10;

function validateFile(file: File): string | null {
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    return `Неподдерживаемый формат «${extension}». Допустимы: ${ACCEPTED_EXTENSIONS.join(', ')}.`;
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `Файл слишком большой: максимум ${MAX_FILE_SIZE_MB} МБ.`;
  }
  return null;
}

const FileImportPanel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [noticeOpen, setNoticeOpen] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (!selected) return;
    const fileError = validateFile(selected);
    setError(fileError ?? '');
    setFile(fileError ? null : selected);
  };

  return (
    <Card variant="outlined" className="file-import-panel">
      <CardContent>
        <Box className="file-import-content">
          <Box>
            <Typography variant="h6">Добавить карточки из файла</Typography>
            <Typography variant="body2" color="text.secondary">
              PDF, DOCX, Markdown или TXT до {MAX_FILE_SIZE_MB} МБ. Файл будет обработан и карточки добавятся в эту колоду.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button component="label" variant="outlined" startIcon={<UploadFileIcon />}>
              {file?.name ?? 'Выбрать файл'}
              <input hidden type="file" accept={ACCEPTED_EXTENSIONS.join(',')} onChange={handleChange} />
            </Button>
            <Button variant="contained" disabled={!file} onClick={() => setNoticeOpen(true)}>
              Сгенерировать карточки
            </Button>
          </Box>
        </Box>
        <Collapse in={Boolean(error)}>
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>{error}</Alert>
        </Collapse>
      </CardContent>
      <Snackbar open={noticeOpen} autoHideDuration={5000} onClose={() => setNoticeOpen(false)}>
        <Alert severity="info" onClose={() => setNoticeOpen(false)}>
          test error placeholder
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default FileImportPanel;
