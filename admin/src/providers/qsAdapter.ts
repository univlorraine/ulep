import qs from 'qs';

const qsAdapter = () => {
    const parse = (value: string) => qs.parse(value);

    const stringify = (obj: any) => qs.stringify(obj);

    return { parse, stringify };
};

export default qsAdapter;
