export const HYBRID_MAX_WIDTH = 768;

export const BACKGROUND_HYBRID_STYLE_INLINE = {
    backgroundPosition: '-100px top', // Negative position for "outside box" effect
    backgroundRepeat: 'no-repeat',
    backgroundSize: '150%', // Increase size on mobile for "outside box" effect
};

export const BACKGROUND_WEB_STYLE_INLINE = {
    backgroundPosition: 'right top',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100%',
};

export const isPasswordCorrect = (password: string) => {
    const regex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    return regex.test(password);
};

export const isEmailCorrect = (email: string) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    return regex.test(email);
};

export const isNameCorrect = (firstname: string) => {
    const regex = /^[a-zA-Zà-ÿÀ-Ý-]+$/;

    return regex.test(firstname);
};
