import { DatePreset } from "./game-utils/draw-date-generator";

const current = new DatePreset().GET_DRAW_DATE();
const initial_path = `/order/${current[0]}`;
const path = {
    order: initial_path,
    signin: '/sign-in',
    login: '/login',
    report: '/dashboard/report',
    winning:'/dashboard/winning',
    dashboard: '/dashboard',
    settings: '/dashboard/settings'
}

export default path;