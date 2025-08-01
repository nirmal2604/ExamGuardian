import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  useTheme,
  keyframes,
  Chip,
} from '@mui/material';
import { CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const floatAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
`;

export default function ExamCard({ exam }) {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        boxShadow: theme.shadows[2],
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[6],
          animation: `${floatAnimation} 3s ease-in-out infinite`,
        },
      }}
    >
      <CardActionArea onClick={() => navigate(`/exam/${exam.examId}`)} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          height="180"
          image={
            exam.imageUrl ||
            'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNvbXB1dGVyJTIwc2NpZW5jZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80'
          }
          alt={exam.examName}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
            {exam.examName}
          </Typography>
          <Stack direction="row" spacing={1} mb={2}>
            <Chip label="MCQ" size="small" color="primary" />
            <Chip label={`${exam.totalQuestions} Qs`} size="small" variant="outlined" />
            <Chip label={`${exam.duration} mins`} size="small" variant="outlined" />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {new Date(exam.liveDate).toLocaleDateString()} -{' '}
            {new Date(exam.deadDate).toLocaleDateString()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
