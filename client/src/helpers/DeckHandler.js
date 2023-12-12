import CardBack from "../cards/CardBack";
import Boolean from "../cards/Boolean";
import Ping from "../cards/Ping";
import AuthorCard from "../cards/AuthorCard";
import AuthorCard2 from "../cards/AuthorCard2";

export default class DeckHandler {
    constructor(scene) {
        this.dealCard = (x, y, name, type) => {
            let cards = {
                cardBack: new CardBack(scene),
                boolean: new Boolean(scene),
                ping: new Ping(scene)
            }
            let newCard = cards[name];

            console.log("A new card is generated in DeckHandler");
            return(newCard.render(x, y, type));
        }
    }
}