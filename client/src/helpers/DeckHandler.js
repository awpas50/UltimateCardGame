import CardBack from "../cards/CardBack";
import Boolean from "../cards/Boolean";
import Ping from "../cards/Ping";
import ICard from "../cards/ICard";
import WCard from "../cards/WCard";
import HCard from "../cards/HCard";
import AuthorCard from "../cards/AuthorCard";
import AuthorCard2 from "../cards/AuthorCard2";

export default class DeckHandler {
    constructor(scene) {
        //x, y: position
        //name: card name
        //side: determine if draggable

        //InstantiateCard: function
        this.InstantiateCard = (x, y, cardType, cardID, side) => {
            let voidCard = {
                // decideCardType by the keys
                ICard: new ICard(scene),
                WCard: new WCard(scene),
                HCard: new HCard(scene),
                cardBack: new CardBack(scene)
            }
            // In this case, newCard can refer to an instance of any class that extends the Card class, such as CardBack, Boolean, or Ping.
            // CardBack, Boolean, or Ping has a name, in newCard if it cataches the particular name it automatically refers to its inherited class.
            
            //If cardType = ICard, than the script knows it refers to new ICard(scene).
            let newCard;
            if(cardType == "ICard" || cardType == "WCard" || cardType == "HCard") {
                newCard = voidCard[cardType];
                newCard.id = cardID;
                newCard.playerCardSprite = cardID;
                newCard.opponentCardSprite = cardID;
            }
            if(cardType == "cardBack") {
                newCard = voidCard[cardType];
            }

            //console.log("A new card (object) is generated in DeckHandler");
            // returns an object. 
            return(newCard.render(x, y, cardType, side));
        }
    }
}