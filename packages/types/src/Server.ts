import ServerBase from "./ServerBase";
import Regex from "./Regex";

export default interface Server extends ServerBase {
    regexes: Regex[];
    liveCount: number;
}
