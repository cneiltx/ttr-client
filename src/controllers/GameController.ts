import { Player } from "../model/Player";
import { DestinationCard } from "../model/DestinationCard";
import { TrainCard } from "../model/TrainCard";
import { USCities } from "../model/USCities";
import { GameStatus } from "../model/GameStatus";
import { TrainCardColor } from "../model/TrainCardColor";

export class GameController {
  gameID: string;
  status = GameStatus.Initializing;
  players: Player[] = [];
  trainCardDeck: TrainCard[] = [];
  faceUpTrainCards: TrainCard[] = [];
  discardedTrainCards: TrainCard[] = [];
  destinationCardDeck: DestinationCard[] = [];

  constructor(gameID: string) {
    this.gameID = gameID;
  }

  startGame() {
    this.status = GameStatus.Playing;
    this.initializeTrainCards();
    this.initializeDestinationCards();
    this.dealTrainCards();
  }

  initializeTrainCards() {
    for (const color of this.getEnumValues<TrainCardColor>(TrainCardColor)) {
      for (let i = 0; i < 12; i++) {
        this.trainCardDeck.push(new TrainCard(color));
      }
    }

    this.trainCardDeck.push(new TrainCard(TrainCardColor.Rainbow));
    this.trainCardDeck.push(new TrainCard(TrainCardColor.Rainbow));
    this.shuffle(this.trainCardDeck);
  }

  initializeDestinationCards() {
    this.destinationCardDeck.push(new DestinationCard(USCities.Billings, USCities.LosAngeles, 8));
    this.destinationCardDeck.push(new DestinationCard(USCities.Boston, USCities.Miami, 12));
    this.destinationCardDeck.push(new DestinationCard(USCities.Calgary, USCities.Phoenix, 13));
    this.destinationCardDeck.push(new DestinationCard(USCities.Calgary, USCities.SaltLakeCity, 7));
    this.destinationCardDeck.push(new DestinationCard(USCities.Chicago, USCities.NewOrleans, 7));
    this.destinationCardDeck.push(new DestinationCard(USCities.Chicago, USCities.SantaFe, 9));
    this.destinationCardDeck.push(new DestinationCard(USCities.Dallas, USCities.NewYork, 11));
    this.destinationCardDeck.push(new DestinationCard(USCities.Denver, USCities.ElPaso, 4));
    this.destinationCardDeck.push(new DestinationCard(USCities.Denver, USCities.Pittsburgh, 11));
    this.destinationCardDeck.push(new DestinationCard(USCities.KansasCity, USCities.Houston, 5));
    this.destinationCardDeck.push(new DestinationCard(USCities.LosAngeles, USCities.Chicago, 16));
    this.destinationCardDeck.push(new DestinationCard(USCities.LosAngeles, USCities.Miami, 20));
    this.destinationCardDeck.push(new DestinationCard(USCities.LosAngeles, USCities.NewYork, 21));
    this.destinationCardDeck.push(new DestinationCard(USCities.Minneapolis, USCities.ElPaso, 10));
    this.destinationCardDeck.push(new DestinationCard(USCities.Minneapolis, USCities.Houston, 8));
    this.destinationCardDeck.push(new DestinationCard(USCities.Montreal, USCities.Atlanta, 9));
    this.destinationCardDeck.push(new DestinationCard(USCities.Montreal, USCities.NewOrleans, 13));
    this.destinationCardDeck.push(new DestinationCard(USCities.NewYork, USCities.Atlanta, 6));
    this.destinationCardDeck.push(new DestinationCard(USCities.Portland, USCities.Nashville, 17));
    this.destinationCardDeck.push(new DestinationCard(USCities.Portland, USCities.Phoenix, 11));
    this.destinationCardDeck.push(new DestinationCard(USCities.SanFrancisco, USCities.Atlanta, 17));
    this.destinationCardDeck.push(new DestinationCard(USCities.SaultSteMarie, USCities.Nashville, 8));
    this.destinationCardDeck.push(new DestinationCard(USCities.SaultSteMarie, USCities.OklahomaCity, 9));
    this.destinationCardDeck.push(new DestinationCard(USCities.Seattle, USCities.LosAngeles, 9));
    this.destinationCardDeck.push(new DestinationCard(USCities.Seattle, USCities.NewYork, 22));
    this.destinationCardDeck.push(new DestinationCard(USCities.Toronto, USCities.Miami, 10));
    this.destinationCardDeck.push(new DestinationCard(USCities.Vancouver, USCities.SantaFe, 13));
    this.destinationCardDeck.push(new DestinationCard(USCities.Winnipeg, USCities.Houston, 12));
    this.destinationCardDeck.push(new DestinationCard(USCities.Winnipeg, USCities.LittleRock, 11));
    this.destinationCardDeck.push(new DestinationCard(USCities.Vancouver, USCities.Montreal, 20));
    this.shuffle(this.destinationCardDeck);
  }

  dealTrainCards() {
    for (let i = 0; i < 4; i++) {
      for (const player of this.players) {
        const card = this.drawTrainCard();
        if (card) {
          player.trainCards.push(card);
        }
      }
    }

    for (let i = 0; i < 5; i++) {
      const card = this.drawTrainCard();
      if (card) {
        this.faceUpTrainCards.push(card);
      }
    }
  }

  dealDestinationCards() {
    for (let i = 0; i < 3; i++) {
      for (const player of this.players) {
        const card = this.drawDestinationCard();
        if (card) {
          player.destinationCards.push(card);
        }
      }
    }
  }

  drawTrainCard() {
    if (this.trainCardDeck.length === 0 && this.discardedTrainCards.length > 0) {
      this.trainCardDeck.push(...this.discardedTrainCards);
      this.discardedTrainCards.length = 0;
      this.shuffle(this.trainCardDeck);
    }

    return this.trainCardDeck.pop();
  }

  drawDestinationCard() {
    return this.destinationCardDeck.pop();
  }

  getEnumValues<T>(enumType: object) {
    return Object.values(enumType).filter(value => !isNaN(Number(value))) as T[];
  }

  shuffle(array: Array<any>) {
    let currentIndex = array.length;

    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  }
}