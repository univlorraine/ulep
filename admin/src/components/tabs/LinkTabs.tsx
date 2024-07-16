import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import React from 'react';
import { useCreatePath, useTranslate } from 'react-admin';
import { Link, useLocation } from 'react-router-dom';
import { LinkPage } from '../menu/CustomMenu';
import useCurrentPathname from '../menu/useCurrentPathname';

type LinkTabsProps = {
    links: LinkPage[];
};

function samePageLinkNavigation(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if (
        event.defaultPrevented ||
        event.button !== 0 || // ignore everything but left-click
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
    ) {
        return false;
    }

    return true;
}

const getLinkKey = (link: LinkPage): string => `${link.resource}-${link.type}`;

const LinkTabs = ({ links }: LinkTabsProps) => {
    const translate = useTranslate();
    const location = useLocation();
    const createPath = useCreatePath();
    const currentPathname = useCurrentPathname();
    const [value, setValue] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        const matchingLinks = links.filter((link) => currentPathname.startsWith(link.resource));
        const currentLink = matchingLinks.sort((a, b) => b.resource.length - a.resource.length)[0];
        if (currentLink) {
            setValue(getLinkKey(currentLink));
        }
        if (!currentLink) {
            const firstPartPathname = location.pathname.split('/')[1]; // Pathname is split because of subpages
            const currentTab = links.filter((link) => link.resource.startsWith(firstPartPathname))[0];
            if (currentTab) {
                setValue(getLinkKey(currentTab));
            }
        }
    }, []);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        if (
            event.type !== 'click' ||
            (event.type === 'click' && samePageLinkNavigation(event as React.MouseEvent<HTMLAnchorElement, MouseEvent>))
        ) {
            setValue(newValue);
        }
    };

    return (
        <Box>
            {value !== undefined ? (
                <TabContext value={value}>
                    <TabList onChange={handleChange}>
                        {links.map((link) => (
                            <Tab
                                key={getLinkKey(link)}
                                component={Link}
                                label={translate(link.label)}
                                to={createPath(link)}
                                value={getLinkKey(link)}
                            />
                        ))}
                    </TabList>
                </TabContext>
            ) : null}
        </Box>
    );
};

export default LinkTabs;
