import React from 'react';
import { Layout } from 'react-admin';
import CustomMenu from '../menu/CustomMenu';

const CustomLayout = (props: any) => <Layout {...props} menu={CustomMenu} />;

export default CustomLayout;
