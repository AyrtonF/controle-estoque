
import { app } from '../infrastructure/app';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
