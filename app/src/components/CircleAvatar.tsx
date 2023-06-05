interface CircleAvatarProps {
    backgroundImage: string;
    color?: string;
    radius?: string;
}

const CircleAvatar: React.FC<CircleAvatarProps> = ({ backgroundImage, color = '#272931', radius = '50%' }) => {
    const avatarStyle = {
        backgroundColor: color,
        borderRadius: radius,
        width: '70px',
        height: '70px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <div style={avatarStyle}>
            <img src={backgroundImage} alt="avatar" className="avatar" />
        </div>
    );
};

export default CircleAvatar;
