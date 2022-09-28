import Server from "./Server"
import Game from "./Game"

export default interface ServerResponse {
    server: Server;
    game: Game;
}
