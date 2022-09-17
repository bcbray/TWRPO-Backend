import Regex from "./Regex";

export default interface Server {
    id: number;
    name: string;
    key?: string;
    isVisible: boolean;
    regexes: Regex[];
}
