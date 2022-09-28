import Regex from "./Regex";

export default interface Server {
    id: number;
    name: string;
    tagName?: string;
    key?: string;
    isVisible: boolean;
    isRoleplay: boolean;
    regexes: Regex[];
    liveCount: number;
}
