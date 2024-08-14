import { Box, Button, Input } from '@mui/material';

const ChatInputSender = () => (
    <Box>
        <Input maxRows={4} multiline />
        <Button>Envoyer</Button>
    </Box>
);

export default ChatInputSender;
