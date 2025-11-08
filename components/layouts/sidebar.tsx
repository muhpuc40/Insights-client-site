'use client';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '@/store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '@/store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '@/components/icon/icon-carets-down';
import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard';
import IconCaretDown from '@/components/icon/icon-caret-down';
import IconMinus from '@/components/icon/icon-minus';
import IconMenuChat from '@/components/icon/menu/icon-menu-chat';
import IconMenuMailbox from '@/components/icon/menu/icon-menu-mailbox';
import IconMenuTodo from '@/components/icon/menu/icon-menu-todo';
import IconMenuNotes from '@/components/icon/menu/icon-menu-notes';
import IconMenuScrumboard from '@/components/icon/menu/icon-menu-scrumboard';
import IconMenuContacts from '@/components/icon/menu/icon-menu-contacts';
import IconMenuInvoice from '@/components/icon/menu/icon-menu-invoice';
import IconMenuCalendar from '@/components/icon/menu/icon-menu-calendar';
import IconMenuComponents from '@/components/icon/menu/icon-menu-components';
import IconMenuElements from '@/components/icon/menu/icon-menu-elements';
import IconMenuCharts from '@/components/icon/menu/icon-menu-charts';
import IconMenuWidgets from '@/components/icon/menu/icon-menu-widgets';
import IconMenuFontIcons from '@/components/icon/menu/icon-menu-font-icons';
import IconMenuDragAndDrop from '@/components/icon/menu/icon-menu-drag-and-drop';
import IconMenuTables from '@/components/icon/menu/icon-menu-tables';
import IconMenuDatatables from '@/components/icon/menu/icon-menu-datatables';
import IconMenuForms from '@/components/icon/menu/icon-menu-forms';
import IconMenuUsers from '@/components/icon/menu/icon-menu-users';
import IconMenuPages from '@/components/icon/menu/icon-menu-pages';
import IconMenuAuthentication from '@/components/icon/menu/icon-menu-authentication';
import IconMenuDocumentation from '@/components/icon/menu/icon-menu-documentation';
import { usePathname } from 'next/navigation';
import { getTranslation } from '@/i18n';
import dynamic from 'next/dynamic';

const PerfectScrollbar = dynamic(() => import('react-perfect-scrollbar'), {
    ssr: false,
});

const sidebarMenuItems = [

    {
        name: 'IoT Device',
        key: 'iotdevice',
        icon: IconMenuFontIcons,
        subItems: [
            { name: 'Add New Device', href: '/iotdevice/add-or-edit' },
         //   { name: 'Device Operator', href: '/iotdevice/operator' },
            { name: 'Device List', href: '/iotdevice/list' },

        ],
    },

/*   {
        name: 'Reports',
        key: 'reports',
        icon: IconMenuCharts,
        subItems: [
            { name: 'Down Time', href: '/reports/down-time' },
        ],
    },
        {
        name: 'Operator',
        key: 'operator',
        icon: IconMenuUsers,
        subItems: [
            { name: 'All Operator', href: '/operator/operator' },
            // { name: 'Operator List', href: '/operator/list' },
            // { name: 'Add Or Edit', href: '/operator/add-or-edit' },
        ],
    },
    {
        name: 'Locations',
        key: 'locations',
        icon: IconMenuContacts,
        subItems: [
            { name: 'Locations Operator', href: '/locations/operator' },
            { name: 'Location List', href: '/locations/list' },
            { name: 'Add Or Edit', href: '/locations/add-or-edit' },
        ],
    },
    {
        name: 'Machine',
        key: 'machine',
        icon: IconMenuElements,
        subItems: [
            { name: 'Machine Operator', href: '/machine/operator' },
            { name: 'Machine List', href: '/machine/list' },
            { name: 'Add Or Edit', href: '/machine/add-or-edit' },
        ],
    },
    {
        name: 'Line',
        key: 'line',
        icon: IconMenuDragAndDrop,
        subItems: [
            { name: 'Line Operator', href: '/line/operator' },
            { name: 'Line List', href: '/line/list' },
            { name: 'Add Or Edit', href: '/line/add-or-edit' },
        ],
    },
    {
        name: 'Status',
        key: 'status',
        icon: IconMenuDatatables,
        subItems: [
            { name: 'Status Operator', href: '/status/operator' },
            { name: 'Status List', href: '/status/list' },
            { name: 'Add Or Edit', href: '/status/add-or-edit' },
        ],
    },
    {
        name: 'Task',
        key: 'task',
        icon: IconMenuTodo,
        subItems: [
            { name: 'Task Operator', href: '/task/operator' },
            { name: 'Task List', href: '/task/list' },
            { name: 'Add Or Edit', href: '/task/add-or-edit' },
        ],
    },
    {
        name: 'Task Detail',
        key: 'taskdetail',
        icon: IconMenuNotes,
        subItems: [
            { name: 'Task Operator', href: '/task-detail/operator' },
            { name: 'Task List', href: '/task-detail/list' },
            { name: 'Add Or Edit', href: '/task-detail/add-or-edit' },
        ],
    },
    */
];

const Sidebar = () => {
    const dispatch = useDispatch();
    const { t } = getTranslation();
    const pathname = usePathname();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [pathname]);

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        selector?.classList.add('active');
    };

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="h-full bg-white dark:bg-black">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            <div className='ml-[5px] w-8 flex-none'>
                                <svg
                                    version="1.1"
                                    id="Layer_1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    x="0px"
                                    y="0px"
                                    viewBox="0 0 500 500"
                                    className="w-full h-full"
                                >
                                    <style type="text/css">
                                        {`
                                    .st0{fill:#941A1D;stroke:#941A1D;stroke-width:0.5;stroke-miterlimit:10;}
                                    .st1{font-family:'Century';}
                                    .st2{font-size:41.1211px;}
                                    .st3{fill:#2E3192;}
                                    .st4{font-family:'CooperBlack';}
                                    .st5{font-size:55.4427px;}
                                    .st6{font-size:52.7221px;}
                                    .st7{fill:#662D91;}
                                    `}
                                    </style>
                                    <g>
                                        <g>
                                            <text
                                                transform="matrix(1 0 0 1 120.7153 432.4428)"
                                                className="st0 st1 st2"
                                            >
                                                AUTOMATA
                                            </text>
                                            <g>
                                                <text transform="matrix(0.8399 0 0 1 125.7168 379.767)">
                                                    <tspan x="0" y="0" className="st3 st4 st5">
                                                        INS
                                                    </tspan>
                                                    <tspan x="104.71" y="0" className="st3 st4 st6">
                                                        I
                                                    </tspan>
                                                    <tspan x="126.52" y="0" className="st3 st4 st5">
                                                        GHTS
                                                    </tspan>
                                                </text>
                                                <circle className="st7" cx="223.32" cy="390.13" r="6.59" />
                                            </g>
                                        </g>
                                        <g>
                                            <g>
                                                <g>
                                                    <polygon
                                                        className="st7"
                                                        points="283.47,170.44 283.47,170.43 270.78,148.45 258.08,170.43 178.02,309.11 156.3,309.11 
                                            242.46,159.87 229.76,137.88 130.91,309.11 118.21,331.09 143.6,331.09 165.32,331.09 190.72,331.09 203.41,309.11 
                                            203.41,309.11 270.78,192.42 309.74,259.91 322.43,281.9 338.15,309.11 250.47,309.11 266.18,281.9 312.91,281.9 
                                            300.22,259.91 253.48,259.91 212.38,331.09 212.38,331.09 376.23,331.09"
                                                    />
                                                </g>
                                            </g>
                                            <polygon
                                                className="st3"
                                                points="245.17,112.55 232.47,134.54 245.17,156.53 257.87,134.54"
                                            />
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <span className="align-middle text-base font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">Insights Automata</span>
                        </Link>

                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar containerRef={() => { }} className="relative h-[calc(100vh-80px)]">
                        <ul className="relative space-y-0.5 p-4 py-0 font-semibold">

                            <li className="nav-item">
                                <Link href="/" className="group">
                                    <div className="flex items-center">
                                        <IconMenuDashboard className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#fff] dark:group-hover:text-white-dark">{t('dashboard')}</span>
                                    </div>
                                </Link>
                            </li>

                            {sidebarMenuItems.map((menu) => (
                                <li className="menu nav-item" key={menu.key}>
                                    <button
                                        type="button"
                                        className={`${currentMenu === menu.key ? 'active' : ''} nav-link group w-full`}
                                        onClick={() => toggleMenu(menu.key)}
                                    >
                                        <div className="flex items-center">
                                            <menu.icon className="shrink-0 group-hover:!text-primary" />
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#fff] dark:group-hover:text-white-dark">
                                                {t(menu.name)}
                                            </span>
                                        </div>
                                        <div className={currentMenu !== menu.key ? '-rotate-90 rtl:rotate-90' : ''}>
                                            <IconCaretDown />
                                        </div>
                                    </button>

                                    <AnimateHeight duration={300} height={currentMenu === menu.key ? 'auto' : 0}>
                                        <ul className="sub-menu text-gray-500">
                                            {menu.subItems.map((subItem, index) => (
                                                <li key={index}>
                                                    <Link href={subItem.href}>{t(subItem.name)}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </AnimateHeight>
                                </li>
                            ))}

                            {/* <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                <span>{t('apps')}</span>
                            </h2>

                            <li className="nav-item">
                                <ul>
                                    <li className="menu nav-item">
                                        <button type="button" className={`${currentMenu === 'invoice' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('invoice')}>
                                            <div className="flex items-center">
                                                <IconMenuInvoice className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('invoice')}</span>
                                            </div>

                                            <div className={currentMenu !== 'invoice' ? '-rotate-90 rtl:rotate-90' : ''}>
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={currentMenu === 'invoice' ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <li>
                                                    <Link href="/apps/invoice/list">{t('list')}</Link>
                                                </li>
                                                <li>
                                                    <Link href="/apps/invoice/preview">{t('preview')}</Link>
                                                </li>
                                                <li>
                                                    <Link href="/apps/invoice/add">{t('add')}</Link>
                                                </li>
                                                <li>
                                                    <Link href="/apps/invoice/edit">{t('edit')}</Link>
                                                </li>
                                            </ul>
                                        </AnimateHeight>
                                    </li>
                                </ul>
                            </li> */}

                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
