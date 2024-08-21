import { Box, Typography } from '@mui/material';

interface OGCardProps {
    imageUrl?: string;
    title: string;
    description: string;
}

const OGCard = ({ imageUrl, title, description }: OGCardProps) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {imageUrl && <img alt="" src={imageUrl} />}
        <Box>
            <Typography>{title}</Typography>
            <Typography sx={{ fontSize: 10, textDecoration: 'none' }}>{description}</Typography>
        </Box>
    </Box>
);

export default OGCard;
