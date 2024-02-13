import { Box, Stack } from '@mui/material';
import { YupExample } from './YupExample';
import { ZodExample } from './ZodExample';

export function App() {
  return (
    <Box display={'flex'} gap={4} maxWidth={'100vw'}>
      <Box sx={{ flex: 1 }}>
        <YupExample />
      </Box>
      <Box sx={{ flex: 1 }}>
        <ZodExample />
      </Box>
    </Box>
  );
}
