import CardBack from "../cards/CardBack";
import Boolean from "../cards/Boolean";
import Ping from "../cards/Ping";
import AuthorCard from "../cards/AuthorCard";
import AuthorCard2 from "../cards/AuthorCard2";

export default class DeckHandler {
    constructor(scene) {
        //x, y: position
        //name: card name
        //type: determine if draggable

        //InstantiateCard: function
        this.InstantiateCard = (x, y, name, type) => {
            let cards = {
                cardBack: new CardBack(scene),
                boolean: new Boolean(scene),
                ping: new Ping(scene)
            }
            // In this case, newCard can refer to an instance of any class that extends the Card class, such as CardBack, Boolean, or Ping.
            // CardBack, Boolean, or Ping has a name, in newCard if it cataches the particular name it automatically refers to its inherited class.
            let newCard = cards[name];

            console.log("A new card is generated in DeckHandler");
            return(newCard.render(x, y, type));
        }
    }
}