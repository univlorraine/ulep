import React from 'react';
import { Layout } from 'react-admin';
import CustomAppBar from '../menu/CustomAppBar';
import CustomMenu from '../menu/CustomMenu';

const CustomLayout = (props: any) => <Layout {...props} appBar={CustomAppBar} menu={CustomMenu} />;

export default CustomLayout;
