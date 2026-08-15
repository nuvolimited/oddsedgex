/**
 * The details of a payment option. This includes the account holder name,
 * account number, and bank name.
 */
export type PaymentOptionDetails = {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
};

/**
 * A payment option, which includes the id and details of the option.
 */
export type PaymentOption = {
  id: string;
  details: PaymentOptionDetails;
};

/**
 * Represents a football arbitrage event type, including team names, odds, and arbitrage values.
 */
export type FootBallArbitrageEventType = {
  homeTeam: string;
  awayTeam: string;
  homeTeamOdds: number;
  awayTeamOdds: number;
  drawOdds: number;
  homeTeamArbitrage: number;
  awayTeamArbitrage: number;
  drawArbitrage: number;
};

/**
 * Represents a football prediction event type, including team names and odds.
 */
export type FootBallPredictionEventType = Omit<
  FootBallArbitrageEventType,
  "homeTeamArbitrage" | "awayTeamArbitrage" | "drawArbitrage"
>;
